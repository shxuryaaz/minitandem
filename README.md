# AI Onboarding Copilot

A modern, enterprise-grade AI-powered onboarding platform built with React, TypeScript, and Firebase.

## Features

- 🔐 **Firebase Authentication** - Secure login with email/password and Google OAuth
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development
- 🛡️ **Type Safety** - Full TypeScript support
- 🎯 **Smart Onboarding** - AI-powered user guidance and personalized experiences

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shxuryaaz/minitandem.git
cd minitandem
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/lib/firebase.ts`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   └── copilot/        # AI Copilot specific components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
└── assets/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Enable Firestore Database
4. Update the Firebase configuration in `src/lib/firebase.ts`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aicopilot.com or join our Discord community.