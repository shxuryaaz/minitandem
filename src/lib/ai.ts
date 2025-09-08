import OpenAI from 'openai';

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

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(userInput: string): Promise<AIResponse> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({ role: 'user', content: userInput });

      // Create system prompt for the AI copilot
      const systemPrompt = `You are MiniTandem's AI Onboarding Copilot, an intelligent assistant that helps users navigate and understand the platform. You should:

1. Be helpful, friendly, and professional
2. Provide clear, actionable guidance
3. Suggest relevant features and actions
4. Help users understand onboarding concepts
5. Guide them through common tasks

Available actions you can suggest:
- navigate: Direct users to specific pages/sections
- demo: Show how to perform actions
- info: Provide information about features

Keep responses concise but informative. If the user asks about specific features, provide helpful guidance and suggest relevant actions.`;

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

      // Generate actions based on the response
      const actions = this.generateActions(userInput, aiContent);

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

  private generateActions(userInput: string, aiResponse: string): Array<{
    type: 'navigate' | 'demo' | 'info';
    label: string;
    data?: any;
  }> {
    const actions: Array<{
      type: 'navigate' | 'demo' | 'info';
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
