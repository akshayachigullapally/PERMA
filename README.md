# 🔗 Perma - Your Identity. All in One Link.

<div align="center">

![Perma Logo](https://via.placeholder.com/120x120/6366f1/ffffff?text=P)

**Share smarter. Connect faster. Make every user's online presence instantly accessible.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)

[🚀 Live Demo](https://perma.in) • [📖 Documentation](https://docs.perma.in) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Request Feature](https://github.com/your-repo/issues)

</div>

---

## 🌟 What is Perma?

Perma is a next-generation link-in-bio platform that transforms how professionals share their digital identity. From developers to designers, creators to executives - Perma makes your online presence **instantly accessible, secure, trackable, and engaging**.

### ✨ Why Choose Perma?

- 🎯 **One Link, Infinite Possibilities** - Share your entire digital ecosystem through a single, memorable URL
- 🔒 **Enterprise-Grade Security** - Firebase authentication, JWT tokens, and privacy-first design
- 📊 **Advanced Analytics** - Real-time tracking, engagement metrics, and performance insights
- 🎮 **Gamification** - Achievement system, streaks, and community features that make networking fun
- 🎨 **Beautiful Design** - Modern glassmorphism UI with smooth animations and responsive layouts

---

## 🚀 Features Overview

### ✅ **Current Features (v1.0)**

<details>
<summary><strong>🔐 Authentication & Security</strong></summary>

- **Firebase Authentication** with Google OAuth integration
- **JWT Token Management** for secure API access
- **Multi-provider Support** (Email/Password, Google, more coming)
- **Session Management** with automatic token refresh
</details>

<details>
<summary><strong>📱 Profile Management</strong></summary>

- **Custom Username System** (`perma.in/yourname`)
- **Rich Profile Editing** (bio, display name, profile pictures)
- **Privacy Controls** (public/private profiles)
- **Theme Customization** (dark, light, auto modes)
</details>

<details>
<summary><strong>🔗 Link Management</strong></summary>

- **Drag & Drop Reordering** with smooth animations
- **Custom Link Styling** (colors, backgrounds, icons)
- **Bulk Operations** (hide/show, delete multiple)
- **Link Categories** and organization
- **Click Tracking** with detailed analytics
</details>

<details>
<summary><strong>📊 Analytics Dashboard</strong></summary>

- **Real-time Metrics** (views, clicks, CTR)
- **Geographic Insights** (coming soon)
- **Device Breakdown** (mobile, desktop, tablet)
- **Traffic Sources** (direct, social, QR codes)
- **Performance Recommendations**
</details>

<details>
<summary><strong>🏆 Gamification System</strong></summary>

- **Achievement System** (12+ unique badges)
- **Streak Tracking** (daily activity rewards)
- **Community Directory** (discover other users)
- **Leaderboards** and social features
</details>

### 🛠️ **Coming Soon (Roadmap)**

| Feature | Status | ETA |
|---------|--------|-----|
| 📱 **QR Code Generator** | In Development | Q1 2025 |
| 🎨 **Custom Themes** | Planning | Q1 2025 |
| 📄 **Resume Builder** | Planning | Q2 2025 |
| 🔗 **Custom Domains** | Planning | Q2 2025 |
| 🌐 **API & Webhooks** | Planning | Q2 2025 |
| 🏢 **Enterprise Features** | Planning | Q3 2025 |

---

## 🏗️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>

### **Architecture Highlights**
- **Hybrid Authentication**: Firebase for auth + JWT for API security
- **Real-time Updates**: WebSocket integration for live analytics
- **Responsive Design**: Mobile-first approach with PWA capabilities
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies

---

## 🚀 Quick Start

### **Prerequisites**
```bash
# Required
Node.js 20+ 
npm or yarn
MongoDB Atlas account (free tier available)
Firebase project (free tier available)

# Optional
Git
VS Code with recommended extensions
```

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/your-username/perma.git
cd perma

# Install all dependencies (both client and server)
npm run install:all

# Or install separately
cd client && npm install
cd ../server && npm install
```

### **2. Environment Setup**

<details>
<summary><strong>🔧 Client Configuration (.env)</strong></summary>

```bash
# Client environment (client/.env)
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
</details>

<details>
<summary><strong>⚙️ Server Configuration (.env)</strong></summary>

```bash
# Server environment (server/.env)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/perma
JWT_SECRET=your-super-secret-jwt-key-256-bits-long

# Firebase Admin SDK (get from Firebase Console > Service Accounts)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-***@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
</details>

### **3. Database Setup**
```bash
# The app will automatically create collections on first run
# No manual database setup required!

# Optional: Seed with sample data
npm run seed
```

### **4. Start Development**

**Option A: One Command (Recommended)**
```bash
npm run dev
```

**Option B: Separate Terminals**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### **5. Access Your App**
- 🌐 **Frontend**: http://localhost:5173
- 🚀 **Backend API**: http://localhost:5000
- 📊 **API Docs**: http://localhost:5000/api-docs (coming soon)

---

## 📂 Project Structure

```
perma/
├── 📁 client/                   # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Dashboard/      # Dashboard-specific components
│   │   │   ├── Profile/        # Profile management
│   │   │   └── Common/         # Shared components
│   │   ├── 📁 pages/           # Page-level components
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📁 contexts/        # React context providers
│   │   ├── 📁 utils/           # Helper functions and API calls
│   │   ├── 📁 assets/          # Static assets (images, icons)
│   │   └── 📁 styles/          # Global styles and Tailwind config
│   └── 📄 package.json
│
├── 📁 server/                   # Express.js backend
│   ├── 📁 models/              # MongoDB schemas and models
│   ├── 📁 routes/              # API route handlers
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── users.js           # User management
│   │   ├── links.js           # Link CRUD operations
│   │   ├── analytics.js       # Analytics and metrics
│   │   └── achievements.js    # Gamification features
│   ├── 📁 middleware/          # Custom middleware functions
│   ├── 📁 utils/              # Backend utilities
│   ├── 📁 config/             # Configuration files
│   └── 📄 server.js           # Main application entry point
│
├── 📁 docs/                    # Documentation and guides
├── 📁 scripts/                 # Build and deployment scripts
└── 📄 README.md
```

---

## 🎯 API Documentation

### **Authentication Endpoints**
```typescript
POST   /api/auth/signup          # Create new account
POST   /api/auth/signin          # Email/password login  
POST   /api/auth/google          # Google OAuth
POST   /api/auth/firebase-login  # Firebase token exchange
GET    /api/auth/verify          # Verify JWT token
```

### **User Management**
```typescript
GET    /api/users/profile        # Get current user profile
PUT    /api/users/profile        # Update profile information
POST   /api/users/profile/picture # Upload profile picture
PUT    /api/users/profile/password # Change password
GET    /api/users/check-username # Check username availability
GET    /api/users/public/:username # Get public profile
```

### **Link Operations**
```typescript
GET    /api/links               # Get user's links
POST   /api/links               # Create new link
PUT    /api/links/:id           # Update existing link
DELETE /api/links/:id           # Delete link
PUT    /api/links/reorder       # Reorder links
```

### **Analytics & Achievements**
```typescript
GET    /api/analytics/platform-stats  # Platform-wide statistics
GET    /api/analytics/user-stats      # User-specific analytics
GET    /api/achievements              # Get user achievements
POST   /api/achievements/check        # Check for new achievements
```

---

## 🎨 Design System

### **Color Palette**
```css
/* Primary Colors */
--primary-600: #6366f1;    /* Main brand color */
--primary-500: #8b5cf6;    /* Secondary brand */
--accent: #ec4899;         /* Pink accent */

/* Semantic Colors */
--success: #10b981;        /* Green for success states */
--warning: #f59e0b;        /* Amber for warnings */
--error: #ef4444;          /* Red for errors */
--info: #3b82f6;          /* Blue for information */

/* Neutral Grays */
--gray-900: #111827;       /* Primary background */
--gray-800: #1f2937;       /* Card backgrounds */
--gray-700: #374151;       /* Borders and dividers */
```

### **Typography Scale**
```css
/* Headings */
.text-display: 3.75rem;    /* 60px - Hero headings */
.text-h1: 2.25rem;         /* 36px - Page titles */
.text-h2: 1.875rem;        /* 30px - Section headers */
.text-h3: 1.5rem;          /* 24px - Subsections */

/* Body Text */
.text-lg: 1.125rem;        /* 18px - Large body text */
.text-base: 1rem;          /* 16px - Regular body text */
.text-sm: 0.875rem;        /* 14px - Small text */
.text-xs: 0.75rem;         /* 12px - Captions */
```

### **UI Components**
- **Glassmorphism Cards**: `backdrop-blur-md bg-white/10`
- **Gradient Buttons**: `bg-gradient-to-r from-purple-500 to-pink-500`
- **Hover Animations**: `transition-all duration-300 hover:scale-105`
- **Focus States**: `focus:ring-2 focus:ring-blue-500`

---

## 🧪 Testing & Quality

### **Testing Strategy**
```bash
# Run all tests
npm run test

# Frontend tests (Jest + React Testing Library)
cd client && npm run test

# Backend tests (Jest + Supertest)
cd server && npm run test

# E2E tests (Playwright)
npm run test:e2e

# Coverage reports
npm run test:coverage
```

### **Code Quality Tools**
- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality checks
- **TypeScript**: Static type checking (planned)

---

## 🚀 Deployment

### **Production Deployment**

<details>
<summary><strong>🌐 Frontend (Vercel/Netlify)</strong></summary>

```bash
# Build for production
cd client && npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

**Environment Variables:**
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_FIREBASE_API_KEY=your_production_firebase_key
# ... other Firebase config
```
</details>

<details>
<summary><strong>⚙️ Backend (Railway/Heroku/DigitalOcean)</strong></summary>

```bash
# Build and start
npm run build
npm start

# Or using Docker
docker build -t perma-server .
docker run -p 5000:5000 perma-server
```

**Environment Variables:**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-frontend-domain.com
```
</details>

### **Docker Support**
```bash
# Run entire stack with Docker Compose
docker-compose up -d

# Development mode
docker-compose -f docker-compose.dev.yml up
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### **Issue Templates**
- 🐛 **Bug Report**: Report a problem or unexpected behavior
- 💡 **Feature Request**: Suggest a new feature or enhancement
- 📖 **Documentation**: Improve or add documentation
- ❓ **Question**: Ask questions about usage or implementation

---

## 📊 Success Metrics & KPIs

| Metric | Current | Target | Status |
|--------|---------|---------|---------|
| **Daily Active Users** | - | 1,000+ | 🎯 |
| **User Retention (30d)** | - | 70%+ | 🎯 |
| **Average Links per User** | - | 5+ | 🎯 |
| **Click-through Rate** | - | 8%+ | 🎯 |
| **Page Load Time** | <2s | <1s | ✅ |
| **API Response Time** | <200ms | <100ms | 🔄 |

---

## 🆘 Support & Community

<div align="center">

### Need Help?

[![Discord](https://img.shields.io/badge/Discord-Join_Community-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/perma)
[![Twitter](https://img.shields.io/badge/Twitter-Follow_Updates-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/permaapp)
[![Email](https://img.shields.io/badge/Email-Contact_Support-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@perma.in)

### Resources
📖 [Documentation](https://docs.perma.in) • 🎥 [Video Tutorials](https://youtube.com/perma) • 📝 [Blog](https://blog.perma.in) • 🛟 [Support Center](https://support.perma.in)

</div>

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase Team** for excellent authentication services
- **Vercel** for seamless deployment experience  
- **MongoDB Atlas** for reliable database hosting
- **Open Source Community** for amazing tools and libraries

---

<div align="center">

**Made with ❤️ by the Perma team**

⭐ **Star this repo if you find it helpful!** ⭐

[🚀 Try Perma Now](https://perma.in) • [📚 Read the Docs](https://docs.perma.in) • [💬 Join Discord](https://discord.gg/perma)

</div>
