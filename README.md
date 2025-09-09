# MiniTandem - AI-Powered Onboarding Platform

A revolutionary AI-powered onboarding platform that combines intelligent automation, real-time data management, and seamless integrations to transform how businesses manage their customer journey.

## 🚀 Key Features

### 🤖 **AI Copilot**
- Natural language understanding and command execution
- Real-time data analysis and insights
- Intelligent action suggestions and automation
- Context-aware responses based on your business data

### 📊 **Real-Time Dashboard**
- Live customer metrics and analytics
- Interactive data visualization
- Performance tracking and insights
- Customizable KPI monitoring

### 🔗 **Seamless Integrations**
- **Slack** - Send messages and notifications directly
- **Google Drive** - Document management and sharing
- **Notion** - Project tracking and collaboration
- **Discord** - Community management
- **Zapier** - Workflow automation
- **Google Analytics** - Advanced analytics integration

### 👥 **Customer Management**
- Real-time customer data synchronization
- Advanced search and filtering
- Status tracking and lifecycle management
- Automated customer onboarding workflows

### 🔐 **Enterprise Security**
- Firebase Authentication with OAuth support
- Secure API handling and data encryption
- Role-based access control
- GDPR compliant data management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Auth with OAuth
- **Database**: Firebase Firestore (real-time)
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Backend**: Express.js with CORS proxy
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- OpenAI API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/shxuryaaz/minitandem.git
cd minitandem
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Integration OAuth Client IDs
VITE_SLACK_CLIENT_ID=your_slack_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# ... other integration IDs
```

4. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Enable Firestore Database
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`

5. **Start the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:8080](http://localhost:8080) in your browser.**

### 🎥 Demo

Watch our [video demonstration](VIDEO_SCRIPT.md) to see MiniTandem in action!

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── copilot/        # AI Copilot specific components
│   └── landing/        # Landing page components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── firebase.ts     # Firebase configuration
│   ├── firestore.ts    # Firestore services
│   ├── ai.ts          # AI service integration
│   └── integrations.ts # Integration management
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Customers.tsx   # Customer management
│   ├── Integrations.tsx # Integration management
│   └── Analytics.tsx   # Analytics and reporting
└── assets/             # Static assets
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Advanced Setup

### Backend Server Setup
The project includes a backend server for handling OAuth integrations:

```bash
cd server
npm install
npm start
```

### Firebase Deployment
```bash
firebase login
firebase use your-project-id
firebase deploy
```

### Environment Variables
See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: shauryajps@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/shxuryaaz/minitandem/issues)
- **Documentation**: Check our [video demo](VIDEO_SCRIPT.md)

## 🌟 Features in Action

### AI Copilot Examples
- "Show me recent customer activities"
- "Add a new customer named John Doe with email john@example.com"
- "Send a message to #general in Slack saying 'New feature launched!'"
- "What's our engagement rate this month?"

### Integration Capabilities
- **Slack**: Send messages, notifications, and updates
- **Google Drive**: Document sharing and collaboration
- **Notion**: Project tracking and task management
- **Analytics**: Real-time performance monitoring

---

**Built with ❤️ by the MiniTandem team**
