# MiniTandem Backend Server

This is the backend API server for MiniTandem integrations. It provides proxy endpoints to handle CORS issues when making API calls to external services.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Integration Testing
- `POST /api/integrations/test/slack` - Test Slack connection
- `POST /api/integrations/test/google-drive` - Test Google Drive connection
- `POST /api/integrations/test/notion` - Test Notion connection
- `POST /api/integrations/test/zapier` - Test Zapier connection
- `POST /api/integrations/test/discord` - Test Discord connection
- `POST /api/integrations/test/google-analytics` - Test Google Analytics connection

### Message Sending
- `POST /api/integrations/send/slack` - Send message to Slack
- `POST /api/integrations/send/discord` - Send message to Discord
- `POST /api/integrations/send/notion` - Create Notion page

### OAuth
- `POST /api/integrations/oauth/token` - Exchange OAuth code for tokens

### Health Check
- `GET /health` - Server health status

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:8080` (local development)
- `https://minitandem.vercel.app` (production)

## Deployment

This server can be deployed to any Node.js hosting service like:
- Vercel (using serverless functions)
- Railway
- Heroku
- DigitalOcean App Platform
