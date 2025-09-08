import { IntegrationService, Integration } from './firestore';

export interface IntegrationConfig {
  name: string;
  type: string;
  description: string;
  icon: string;
  setupUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
}

export const AVAILABLE_INTEGRATIONS: Record<string, IntegrationConfig> = {
  slack: {
    name: 'Slack',
    type: 'communication',
    description: 'Send notifications and updates to your team channels',
    icon: '💬',
    setupUrl: 'https://api.slack.com/apps',
  },
  'google-drive': {
    name: 'Google Drive',
    type: 'storage',
    description: 'Store and sync files with your Google Drive account',
    icon: '📁',
    setupUrl: 'https://console.developers.google.com/',
  },
  notion: {
    name: 'Notion',
    type: 'productivity',
    description: 'Create and update pages in your Notion workspace',
    icon: '📝',
    setupUrl: 'https://www.notion.so/my-integrations',
  },
  zapier: {
    name: 'Zapier',
    type: 'productivity',
    description: 'Connect with 5000+ apps through automation workflows',
    icon: '⚡',
    setupUrl: 'https://zapier.com/apps',
  },
  discord: {
    name: 'Discord',
    type: 'communication',
    description: 'Send messages to Discord servers and channels',
    icon: '🎮',
    setupUrl: 'https://discord.com/developers/applications',
  },
  'google-analytics': {
    name: 'Google Analytics',
    type: 'analytics',
    description: 'Track user behavior and onboarding funnel metrics',
    icon: '📊',
    setupUrl: 'https://analytics.google.com/',
  },
};

export class IntegrationManager {
  private static instance: IntegrationManager;
  private currentUserId: string | null = null;

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  async connectIntegration(integrationId: string, config: any): Promise<boolean> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    try {
      // Simulate API connection (in real implementation, this would make actual API calls)
      const integration: Omit<Integration, 'id'> = {
        name: AVAILABLE_INTEGRATIONS[integrationId]?.name || integrationId,
        type: AVAILABLE_INTEGRATIONS[integrationId]?.type || 'unknown',
        status: 'connected',
        userId: this.currentUserId,
        config: config,
      };

      await IntegrationService.addIntegration(integration);
      return true;
    } catch (error) {
      console.error('Error connecting integration:', error);
      return false;
    }
  }

  async disconnectIntegration(integrationId: string): Promise<boolean> {
    try {
      await IntegrationService.deleteIntegration(integrationId);
      return true;
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      return false;
    }
  }

  async getIntegrationStatus(integrationId: string): Promise<'connected' | 'disconnected' | 'error'> {
    if (!this.currentUserId) {
      return 'disconnected';
    }

    try {
      const integrations = await IntegrationService.getIntegrations(this.currentUserId);
      const integration = integrations.find(i => i.name.toLowerCase() === integrationId.toLowerCase());
      return integration?.status || 'disconnected';
    } catch (error) {
      console.error('Error getting integration status:', error);
      return 'error';
    }
  }

  async testIntegration(integrationId: string): Promise<boolean> {
    // Simulate integration test (in real implementation, this would test actual API connectivity)
    try {
      // Simulate API test delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure based on integration type
      const integration = AVAILABLE_INTEGRATIONS[integrationId];
      if (!integration) return false;

      // Mock test results
      const testResults: Record<string, boolean> = {
        slack: true,
        'google-drive': true,
        notion: false, // Simulate failure
        zapier: true,
        discord: true,
        'google-analytics': true,
      };

      return testResults[integrationId] ?? true;
    } catch (error) {
      console.error('Error testing integration:', error);
      return false;
    }
  }

  async sendTestMessage(integrationId: string, message: string): Promise<boolean> {
    try {
      // Simulate sending test message (in real implementation, this would send actual messages)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Sending test message to ${integrationId}: ${message}`);
      return true;
    } catch (error) {
      console.error('Error sending test message:', error);
      return false;
    }
  }

  getAvailableIntegrations(): IntegrationConfig[] {
    return Object.values(AVAILABLE_INTEGRATIONS);
  }

  getIntegrationConfig(integrationId: string): IntegrationConfig | null {
    return AVAILABLE_INTEGRATIONS[integrationId] || null;
  }
}

export const integrationManager = IntegrationManager.getInstance();
