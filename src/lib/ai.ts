import OpenAI from 'openai';
import { CustomerService, IntegrationService, AnalyticsService, Customer, Integration, Analytics } from './firestore';
import { integrationManager } from './integrations';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side usage
});

export interface AIResponse {
  content: string;
  actions?: Array<{
    type: 'navigate' | 'demo' | 'info';
    label: string;
    data?: any;
  }>;
}

export class AIService {
  private static instance: AIService;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private currentUserId: string | null = null;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
    integrationManager.setUserId(userId);
  }

  async generateResponse(userInput: string): Promise<AIResponse> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({ role: 'user', content: userInput });

      // Fetch live data based on user query
      const liveData = await this.fetchRelevantData(userInput);

      // Create system prompt for the AI copilot with live data
      const systemPrompt = `You are MiniTandem's AI Onboarding Copilot, an intelligent assistant that helps users navigate and understand the platform. You should:

1. Be helpful, friendly, and professional
2. Provide clear, actionable guidance with real data
3. Suggest relevant features and actions
4. Help users understand onboarding concepts
5. Guide them through common tasks

IMPORTANT: Always use the LIVE DATA CONTEXT below to provide accurate, up-to-date information. Do not make up or guess information - only use what's provided in the live data.

LIVE DATA CONTEXT:
${liveData}

Available actions you can suggest:
- navigate: Direct users to specific pages/sections
- demo: Show how to perform actions
- info: Provide information about features
- connect: Connect real integrations
- data: Show live data insights

Keep responses concise but informative. When users ask about specific customers, companies, or data, always reference the exact information from the live data context above. If the live data doesn't contain the requested information, say so clearly.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const aiContent = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";
      
      // Add AI response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: aiContent });

      // Generate actions based on the response and live data
      const actions = this.generateActions(userInput, aiContent, liveData);

      return {
        content: aiContent,
        actions: actions.length > 0 ? actions : undefined,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback response
      return {
        content: "I'm having trouble connecting to the AI service right now. Please try again in a moment, or feel free to explore the platform manually.",
        actions: [
          {
            type: 'navigate',
            label: 'Go to Dashboard',
            data: { path: '/dashboard' }
          }
        ]
      };
    }
  }

  private async fetchRelevantData(userInput: string): Promise<string> {
    if (!this.currentUserId) {
      console.log('AI Service: No user ID available');
      return "No user context available.";
    }

    const input = userInput.toLowerCase();
    let dataContext = "";

    try {
      console.log('AI Service: Fetching data for input:', input);
      // Fetch customers data if relevant
      if (input.includes('customer') || input.includes('client') || input.includes('user') || 
          input.includes('shaurya') || input.includes('singh') || input.includes('company') || 
          input.includes('associated') || input.includes('name')) {
        const customers = await CustomerService.getCustomers();
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const trialCustomers = customers.filter(c => c.status === 'trial').length;
        
        // Include detailed customer information for specific queries
        const customerDetails = customers.map(customer => 
          `Name: ${customer.name}, Email: ${customer.email}, Company: ${customer.company}, Status: ${customer.status}`
        ).join('; ');
        
        dataContext += `CUSTOMERS: Total ${customers.length} customers (${activeCustomers} active, ${trialCustomers} trial). Customer details: ${customerDetails}. `;
      }

      // Fetch integrations data if relevant
      if (input.includes('integration') || input.includes('connect') || input.includes('slack') || input.includes('google')) {
        const integrations = await IntegrationService.getIntegrations(this.currentUserId);
        const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
        dataContext += `INTEGRATIONS: ${connectedIntegrations} connected out of ${integrations.length} total. `;
      }

      // Fetch analytics data if relevant
      if (input.includes('analytics') || input.includes('data') || input.includes('metrics') || input.includes('dashboard') || 
          input.includes('recent') || input.includes('activity') || input.includes('activities')) {
        const analytics = await AnalyticsService.getTodayAnalytics();
        if (analytics) {
          dataContext += `ANALYTICS: ${analytics.metrics.totalUsers} total users, ${analytics.metrics.activeUsers} active, ${analytics.metrics.newSignups} new signups today. `;
        } else {
          // If no today's analytics, get recent customer activities
          console.log('AI Service: No analytics data, fetching customers');
          const customers = await CustomerService.getCustomers();
          console.log('AI Service: Found customers:', customers.length);
          const recentCustomers = customers.slice(0, 5); // Get 5 most recent
          dataContext += `RECENT ACTIVITIES: Latest customers - ${recentCustomers.map(c => `${c.name} (${c.company})`).join(', ')}. `;
        }
      }

      return dataContext || "No specific data context available.";
    } catch (error) {
      console.error('Error fetching live data:', error);
      return "Unable to fetch live data at the moment.";
    }
  }

  private generateActions(userInput: string, aiResponse: string, liveData: string): Array<{
    type: 'navigate' | 'demo' | 'info' | 'connect' | 'data';
    label: string;
    data?: any;
  }> {
    const actions: Array<{
      type: 'navigate' | 'demo' | 'info' | 'connect' | 'data';
      label: string;
      data?: any;
    }> = [];

    const input = userInput.toLowerCase();
    const response = aiResponse.toLowerCase();

    // Navigation actions
    if (input.includes('dashboard') || input.includes('main page')) {
      actions.push({
        type: 'navigate',
        label: 'Go to Dashboard',
        data: { path: '/dashboard' }
      });
    }

    if (input.includes('customer') || input.includes('client')) {
      actions.push({
        type: 'navigate',
        label: 'View Customers',
        data: { path: '/customers' }
      });
    }

    if (input.includes('integration') || input.includes('connect')) {
      actions.push({
        type: 'navigate',
        label: 'Manage Integrations',
        data: { path: '/integrations' }
      });
    }

    if (input.includes('analytics') || input.includes('report') || input.includes('data')) {
      actions.push({
        type: 'navigate',
        label: 'View Analytics',
        data: { path: '/analytics' }
      });
    }

    if (input.includes('setting') || input.includes('profile')) {
      actions.push({
        type: 'navigate',
        label: 'Go to Settings',
        data: { path: '/settings' }
      });
    }

    // Integration connection actions
    if (input.includes('connect') || input.includes('integration') || input.includes('slack') || input.includes('google')) {
      if (input.includes('slack')) {
        actions.push({
          type: 'connect',
          label: 'Connect Slack',
          data: { integration: 'slack', action: 'connect_integration' }
        });
      } else if (input.includes('google')) {
        actions.push({
          type: 'connect',
          label: 'Connect Google Drive',
          data: { integration: 'google-drive', action: 'connect_integration' }
        });
      } else if (input.includes('notion')) {
        actions.push({
          type: 'connect',
          label: 'Connect Notion',
          data: { integration: 'notion', action: 'connect_integration' }
        });
      } else {
        actions.push({
          type: 'connect',
          label: 'View Integrations',
          data: { action: 'view_integrations' }
        });
      }
    }

    // Data insights actions
    if (input.includes('data') || input.includes('analytics') || input.includes('metrics') || input.includes('insights')) {
      actions.push({
        type: 'data',
        label: 'View Live Data',
        data: { action: 'show_data_insights' }
      });
    }

    // Demo actions
    if (input.includes('how to') || input.includes('show me') || input.includes('demonstrate')) {
      if (input.includes('add') && input.includes('customer')) {
        actions.push({
          type: 'demo',
          label: 'Demo: Add Customer',
          data: { action: 'demo_add_customer' }
        });
      } else if (input.includes('integration')) {
        actions.push({
          type: 'demo',
          label: 'Demo: Connect Integration',
          data: { action: 'demo_integration' }
        });
      } else if (input.includes('analytics')) {
        actions.push({
          type: 'demo',
          label: 'Demo: Analytics Dashboard',
          data: { action: 'demo_analytics' }
        });
      }
    }

    // Info actions
    if (input.includes('what is') || input.includes('explain') || input.includes('tell me about')) {
      actions.push({
        type: 'info',
        label: 'Learn More',
        data: { topic: input }
      });
    }

    return actions;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}

export const aiService = AIService.getInstance();
