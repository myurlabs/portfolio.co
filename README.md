# Professional Developer Portfolio

A modern, scalable portfolio platform built with React, Vite, and Tailwind CSS with Firebase backend.

## 🚀 Features

- **Admin Setup Wizard** - Easy step-by-step setup for your portfolio
- **Public Portfolio** - Beautiful responsive design for visitors
- **Admin Dashboard** - Full control over your content
- **Firebase Backend** - Real-time database for persistent data
- **Email Notifications** - Get notified when someone contacts you
- **Dark/Light Mode** - Theme switching
- **Responsive Design** - Works on all devices

## 📋 Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Set Up Firebase (Required for Public Deployment)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "my-portfolio")
4. Disable Google Analytics (optional)
5. Click "Create Project"
6. Once created, click the Web icon (`</>`) to add a web app
7. Register your app with a nickname
8. Copy the config values

#### Enable Firestore Database:
1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create Database"
3. Select "Start in test mode"
4. Choose your region
5. Click "Enable"

#### Enable Storage (for file uploads):
1. Go to "Build" > "Storage"
2. Click "Get started"
3. Select "Start in test mode"
4. Click "Next" and "Done"

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Set Up EmailJS (for Contact Form)

1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Add an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your keys and add to `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Connect your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx    # Main layout wrapper
│   └── FirebaseSync.tsx # Firebase data sync
├── lib/
│   └── firebase.ts   # Firebase configuration
├── pages/
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── PortfolioPage.tsx
│   ├── SkillsPage.tsx
│   ├── CertificationsPage.tsx
│   ├── CollaboratePage.tsx
│   ├── LoginPage.tsx
│   ├── AdminPage.tsx
│   └── SetupPage.tsx
├── store/
│   └── useStore.ts   # Zustand state management
├── types/
│   └── index.ts      # TypeScript types
└── App.tsx           # Main app component
```

## 🔐 Admin Access

- Navigate to `/login` manually
- Enter the password you set during setup
- Access the admin dashboard to manage:
  - Portfolio projects
  - Skills
  - Certifications
  - Collaboration requests
  - Profile information

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero section, featured work |
| About | `/about` | Biography, timeline, gallery |
| Portfolio | `/portfolio` | All projects with filtering |
| Skills | `/skills` | Skills grid with categories |
| Certifications | `/certifications` | Certificate gallery |
| Collaborate | `/collaborate` | Contact form |
| Login | `/login` | Admin login (hidden) |
| Admin | `/admin` | Admin dashboard (protected) |
| Setup | `/setup` | Initial setup wizard |

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to change the color scheme.

### Fonts
Add custom fonts in `index.html` and update Tailwind config.

## 📧 Support

If you have any questions, feel free to reach out!

## 📄 License

MIT License - feel free to use this for your personal portfolio!
