const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app')) return callback(null, true);
    
    // Allow specific domains
    const allowedOrigins = [
      'https://minitandem.vercel.app',
      'https://minitandem-git-main-shxuryaaz.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
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
    const targetChannel = channel || credentials.channelId || 'general';
    
    console.log('Slack API request:', {
      channel: targetChannel,
      message: message,
      tokenPreview: token.substring(0, 10) + '...'
    });

    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel: targetChannel,
      text: message,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Slack API response:', {
      ok: response.data.ok,
      error: response.data.error,
      fullResponse: response.data
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
    
    console.log('OAuth token exchange request:', { integrationId, code: code?.substring(0, 10) + '...', redirectUri });
    
    let credentials = {};
    
    switch (integrationId) {
      case 'slack':
        // Real Slack OAuth token exchange
        console.log('Exchanging Slack OAuth code...', { 
          clientId: process.env.SLACK_CLIENT_ID ? 'SET' : 'NOT_SET',
          clientSecret: process.env.SLACK_CLIENT_SECRET ? 'SET' : 'NOT_SET'
        });
        
        if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET) {
          throw new Error('Slack OAuth credentials not configured. Please set SLACK_CLIENT_ID and SLACK_CLIENT_SECRET environment variables.');
        }
        
        console.log('Making Slack OAuth request with:', {
          client_id: process.env.SLACK_CLIENT_ID?.substring(0, 10) + '...',
          code: code?.substring(0, 10) + '...',
          redirect_uri: redirectUri
        });
        
        const slackResponse = await axios.post('https://slack.com/api/oauth.v2.access', {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          code: code,
          redirect_uri: redirectUri
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        console.log('Slack OAuth response:', { 
          ok: slackResponse.data.ok, 
          error: slackResponse.data.error,
          fullResponse: slackResponse.data
        });
        
        if (!slackResponse.data.ok) {
          const errorMsg = slackResponse.data.error || 'Slack OAuth failed';
          console.error('Slack OAuth error details:', {
            error: errorMsg,
            code: code?.substring(0, 10) + '...',
            redirectUri: redirectUri,
            clientId: process.env.SLACK_CLIENT_ID?.substring(0, 10) + '...'
          });
          throw new Error(errorMsg);
        }
        
        credentials = {
          accessToken: slackResponse.data.access_token,
          botToken: slackResponse.data.bot_user_oauth_access_token,
          workspaceId: slackResponse.data.team.id,
          channelId: slackResponse.data.incoming_webhook?.channel_id
        };
        
        console.log('Slack credentials created:', { 
          hasAccessToken: !!credentials.accessToken,
          hasBotToken: !!credentials.botToken,
          workspaceId: credentials.workspaceId
        });
        break;
        
      case 'google-drive':
        // Real Google Drive OAuth token exchange
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
          throw new Error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
        }
        
        const googleResponse = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        });
        
        credentials = {
          accessToken: googleResponse.data.access_token,
          refreshToken: googleResponse.data.refresh_token,
          folderId: 'root'
        };
        break;
        
      default:
        return res.status(400).json({ success: false, error: 'Unsupported integration' });
    }
    
    console.log('OAuth token exchange successful:', { integrationId, hasCredentials: Object.keys(credentials).length > 0 });
    
    res.json({ 
      success: true, 
      credentials
    });
  } catch (error) {
    console.error('OAuth token exchange error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test OAuth endpoint
app.post('/api/integrations/oauth/test', async (req, res) => {
  try {
    const { integrationId } = req.body;
    
    if (integrationId === 'slack') {
      if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET) {
        return res.status(400).json({ 
          success: false, 
          error: 'Slack OAuth credentials not configured',
          details: {
            SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID ? 'SET' : 'NOT_SET',
            SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET ? 'SET' : 'NOT_SET'
          }
        });
      }
      
      return res.json({ 
        success: true, 
        message: 'Slack OAuth credentials are configured',
        clientId: process.env.SLACK_CLIENT_ID.substring(0, 10) + '...'
      });
    }
    
    res.json({ success: false, error: 'Unsupported integration' });
  } catch (error) {
    console.error('OAuth test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: {
      SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID ? 'SET' : 'NOT_SET',
      SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MiniTandem Backend Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:8080, https://minitandem.vercel.app`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
