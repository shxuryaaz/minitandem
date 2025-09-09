const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://minitandem.vercel.app', 'https://minitandem-git-main-shxuryaaz.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Integration test endpoints
app.post('/api/integrations/test/slack', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.botToken && !credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    const token = credentials.botToken || credentials.accessToken;
    const response = await axios.get('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    res.json({ success: response.data.ok === true, data: response.data });
  } catch (error) {
    console.error('Slack test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/test/google-drive', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No access token provided' });
    }

    const response = await axios.get('https://www.googleapis.com/drive/v3/about?fields=user', {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Google Drive test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/test/notion', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.apiKey) {
      return res.status(400).json({ success: false, error: 'No API key provided' });
    }

    const response = await axios.get('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Notion test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/test/zapier', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No access token provided' });
    }

    const response = await axios.get('https://api.zapier.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Zapier test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/test/discord', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No access token provided' });
    }

    const response = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Discord test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/test/google-analytics', async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No access token provided' });
    }

    const response = await axios.get('https://www.googleapis.com/analytics/v3/management/accounts', {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Google Analytics test error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Message sending endpoints
app.post('/api/integrations/send/slack', async (req, res) => {
  try {
    const { credentials, message, channel } = req.body;
    
    if (!credentials.botToken && !credentials.accessToken) {
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    const token = credentials.botToken || credentials.accessToken;
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel: channel || credentials.channelId || '#general',
      text: message,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ success: response.data.ok === true, data: response.data });
  } catch (error) {
    console.error('Slack message error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/send/discord', async (req, res) => {
  try {
    const { credentials, message, channelId } = req.body;
    
    if (!credentials.botToken) {
      return res.status(400).json({ success: false, error: 'No bot token provided' });
    }

    if (!channelId && !credentials.channelId) {
      return res.status(400).json({ success: false, error: 'No channel ID provided' });
    }

    const response = await axios.post(`https://discord.com/api/v10/channels/${channelId || credentials.channelId}/messages`, {
      content: message,
    }, {
      headers: {
        'Authorization': `Bot ${credentials.botToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Discord message error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/integrations/send/notion', async (req, res) => {
  try {
    const { credentials, message, databaseId } = req.body;
    
    if (!credentials.apiKey) {
      return res.status(400).json({ success: false, error: 'No API key provided' });
    }

    if (!databaseId && !credentials.databaseId) {
      return res.status(400).json({ success: false, error: 'No database ID provided' });
    }

    const response = await axios.post('https://api.notion.com/v1/pages', {
      parent: { database_id: databaseId || credentials.databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
      },
    }, {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    res.json({ success: response.status === 200, data: response.data });
  } catch (error) {
    console.error('Notion page creation error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// OAuth token exchange endpoint
app.post('/api/integrations/oauth/token', async (req, res) => {
  try {
    const { integrationId, code, redirectUri } = req.body;
    
    // This is a placeholder - in a real implementation, you'd exchange the code for tokens
    // For now, we'll return mock credentials to demonstrate the flow
    const mockCredentials = {
      slack: {
        accessToken: `mock-slack-token-${Date.now()}`,
        botToken: `mock-bot-token-${Date.now()}`,
        workspaceId: 'T1234567890',
        channelId: 'C1234567890',
      },
      'google-drive': {
        accessToken: `mock-google-access-token-${Date.now()}`,
        refreshToken: `mock-google-refresh-token-${Date.now()}`,
      },
      notion: {
        apiKey: `secret_mock-notion-api-key-${Date.now()}`,
        databaseId: 'mock-database-id',
      },
      zapier: {
        accessToken: `mock-zapier-access-token-${Date.now()}`,
        webhookUrl: 'https://hooks.zapier.com/mock-webhook',
      },
      discord: {
        accessToken: `mock-discord-access-token-${Date.now()}`,
        botToken: `mock-discord-bot-token-${Date.now()}`,
      },
      'google-analytics': {
        accessToken: `mock-ga-access-token-${Date.now()}`,
        refreshToken: `mock-ga-refresh-token-${Date.now()}`,
      },
    };

    const credentials = mockCredentials[integrationId] || {};
    
    res.json({ 
      success: true, 
      credentials,
      message: `Mock credentials generated for ${integrationId}. In production, this would exchange the OAuth code for real tokens.`
    });
  } catch (error) {
    console.error('OAuth token exchange error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 MiniTandem Backend Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:8080, https://minitandem.vercel.app`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
