# Mamak Teh Ais Price Tracker 🍵

A comprehensive web application for tracking Teh Ais Bungkus Ikat Tepi prices across mamak restaurants in Malaysia. Built with React, TypeScript, Firebase, and deployed on Netlify.

## 🌟 Features

- **Interactive Map** - View mamak restaurants on an interactive map with price indicators
- **Price Tracking** - Track Teh Ais prices and other popular mamak food prices
- **Google Places Integration** - Search and add restaurants using Google Places API
- **Real-time Updates** - Live price updates with contributor tracking
- **Price History** - Track price changes over time
- **Admin Panel** - Manage restaurants and update prices
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Live Demo

**Production URL**: https://tehais.nakmasuk.com

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Maps**: Mapbox GL JS
- **Backend**: Firebase (Firestore, Authentication)
- **APIs**: Google Places API
- **Deployment**: Netlify
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Firebase CLI** - [Install guide](https://firebase.google.com/docs/cli#install-cli)
- **Netlify CLI** - [Install guide](https://docs.netlify.com/cli/get-started/)

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mamak-teh-ais-price.git
cd mamak-teh-ais-price
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Firebase Configuration (Client-side)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Mapbox Configuration
VITE_MAPBOX_TOKEN=your-mapbox-token

# Google Places API
VITE_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### 4. Firebase Setup

#### 4.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "mamak-teh-ais")
4. Enable Google Analytics (optional)
5. Click "Create project"

#### 4.2 Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Add your domain to **Authorized domains**

#### 4.3 Setup Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location (preferably closest to your users)
4. Click **Done**

#### 4.4 Configure Firestore Rules

Update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Restaurants collection - readable by all, writable by authenticated users
    match /restaurants/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Prices collection - readable by all, writable by authenticated users
    match /prices/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User profiles - users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 4.5 Get Firebase Configuration

1. Go to **Project Settings** > **General** tab
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object
6. Update your `.env.local` file with these values

### 5. Google Places API Setup

#### 5.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API**

#### 5.2 Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the API key
4. (Optional) Restrict the API key to your domain for security

#### 5.3 Enable Required APIs

Enable these APIs in your Google Cloud project:
- **Places API**
- **Maps JavaScript API** (if using maps)

### 6. Mapbox Setup

#### 6.1 Create Mapbox Account

1. Go to [Mapbox](https://www.mapbox.com/)
2. Sign up for a free account
3. Go to **Account** > **Access tokens**
4. Copy your **Default public token**
5. Add it to your `.env.local` file

### 7. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🚀 Deployment to Netlify

### 1. Build the Project

```bash
npm run build
# or
yarn build
```

### 2. Deploy to Netlify

#### Option A: Using Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```

#### Option B: Using Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com/)
2. Click **New site from Git**
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Click **Deploy site**

### 3. Configure Environment Variables in Netlify

1. Go to **Site settings** > **Environment variables**
2. Add all your environment variables (both `VITE_` prefixed and non-prefixed):

**Client-side variables (VITE_ prefix):**
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

**Server-side variables (for Netlify Functions):**
```
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
MAPBOX_TOKEN=your-mapbox-token
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### 4. Configure Netlify Functions

The project includes Netlify Functions in the `netlify/functions/` directory:
- `firebase-config.js` - Firebase configuration endpoint
- `google-places.js` - Google Places API proxy
- `mapbox.js` - Mapbox API proxy

These functions are automatically deployed with your site.

## 📁 Project Structure

```
mamak-teh-ais-price/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AddRestaurantForm.tsx
│   │   ├── UpdateRestaurantForm.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── MamakMap.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── lib/                # Utility functions
├── netlify/
│   └── functions/          # Netlify serverless functions
├── public/                 # Static assets
├── dist/                   # Build output
└── env.example            # Environment variables template
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase connection issues**
   - Check your Firebase configuration in `.env.local`
   - Ensure Firestore rules allow read/write access
   - Verify your Firebase project is active

2. **Google Places API not working**
   - Verify your API key is correct
   - Check if Places API is enabled in Google Cloud Console
   - Ensure billing is enabled for your Google Cloud project

3. **Mapbox not loading**
   - Verify your Mapbox token is correct
   - Check if the token has the required scopes

4. **Build failures**
   - Ensure all environment variables are set
   - Check for TypeScript errors: `npm run type-check`
   - Verify all dependencies are installed: `npm install`

### Getting Help

- Check the [Issues](https://github.com/your-username/mamak-teh-ais-price/issues) page
- Review the [Firebase Documentation](https://firebase.google.com/docs)
- Check [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- Review [Mapbox Documentation](https://docs.mapbox.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Mapbox](https://www.mapbox.com/) - Maps
- [Google Places API](https://developers.google.com/maps/documentation/places) - Location services
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Made with ❤️ for the Malaysian mamak community**