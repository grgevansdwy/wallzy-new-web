# Wallzy - Credit Card Rewards Optimizer

A modern landing page for Wallzy, a credit card rewards optimization app designed for UW students. Wallzy helps users maximize their earnings by showing which credit card to use in real-time for every purchase.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📱 Mobile-first approach with distinct mobile/desktop layouts
- 🔥 Firebase Firestore integration for waitlist management
- ⚡ Fast and optimized with Vite
- 🎯 Interactive sections: Hero, Features, How It Works, About, FAQ
- 📧 Email waitlist signup with duplicate detection
- 🎭 Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Firebase Firestore
- **Deployment**: Firebase Hosting (optional)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/grgevansdwy/card-companion.git
cd card-companion
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Copy your Firebase configuration
   - Update `src/lib/firebase.ts` with your Firebase config

4. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Firebase Setup

The project uses Firebase Firestore for waitlist management:

1. **Firestore Collection**: `waitlist`
2. **Document Structure**:

   ```json
   {
     "email": "user@example.com",
     "createdAt": "Firebase.Timestamp"
   }
   ```

3. **Security Rules**: Public read/write access (configured in `firestore.rules`)

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── AppExplanation.tsx
│   ├── AboutSection.tsx
│   ├── FAQSection.tsx
│   ├── WaitlistSection.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/                # Utilities
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Helper functions
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── assets/             # Images and icons
└── App.tsx             # Main app component
```

## Features Breakdown

### Hero Section

- Responsive card stack animation on mobile
- Call-to-action button with smooth scroll
- Dynamic background effects

### Waitlist Section

- Email validation
- Duplicate detection
- Real-time Firestore integration
- Loading states and error handling

### Responsive Design

- Mobile-first approach
- Breakpoints: mobile (default), tablet (md: 768px), desktop (lg: 1024px)
- Full-screen mobile navigation menu
- Optimized layouts for all screen sizes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Contact

- Email: wallzywallet@gmail.com
- Instagram: [@wallzywallet](https://instagram.com/wallzywallet)
- TikTok: [@wallzywallet](https://www.tiktok.com/@wallzywallet)

---

Built with ❤️ for UW students
