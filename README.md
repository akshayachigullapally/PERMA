# Perma - Your Identity. All in One Link.

**Tagline:** Share smarter. Connect faster.

Perma is a comprehensive link-in-bio platform that makes every user's online presence instantly accessible, secure, trackable, and fun.

## 🚀 Features

### ✅ Implemented (MVP)
- **🔐 Clerk Authentication**: Secure sign-up/sign-in with Clerk
- **🗄️ MongoDB Database**: Connected to MongoDB Atlas for data persistence
- **Dashboard Management**: Add, edit, reorder, and manage profile links with drag & drop
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Link Management**: Copy, share, hide/show, and track clicks
- **Quick Actions**: One-click copy, share profile, and link management
- **Modern Architecture**: React 19 + Vite frontend with Express.js backend

### 🛠️ Coming Soon
- **Advanced Analytics**: Real-time click tracking, geographic data, device breakdown
- **QR Code Generation**: Static and dynamic QR codes with custom branding
- **Privacy & Security**: Password protection, link expiry, zero-knowledge encryption
- **Gamification**: Badges, streaks, AI missions, seasonal events
- **Resume Builder**: ATS-friendly PDF export with QR codes
- **Directory & Discovery**: Public search, verified badges, Perma Spaces
- **Enterprise Features**: Bulk onboarding, SCIM integration, admin console
- **API & Integrations**: REST API, webhooks, third-party integrations

## 🏗️ Tech Stack

### Frontend
- **React 19** with modern hooks and concurrent features
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **@dnd-kit** for drag & drop functionality
- **React Router** for navigation
- **Heroicons** for beautiful icons
- **React Hot Toast** for notifications
- **Clerk** for authentication and user management

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** with Mongoose ODM
- **JWT** authentication (for API endpoints)
- **bcryptjs** for password hashing
- **Rate limiting** and security middleware

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd perma
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**
   
   **Client (.env in client folder):**
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   ```
   
   **Server (.env in server folder):**
   ```bash
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   ```

5. **Start development servers**
   
   **Option 1: Using VS Code Tasks**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Tasks: Run Task"
   - Select "Start Perma Development"

   **Option 2: Manual start**
   
   Terminal 1 (Client):
   ```bash
   cd client
   npm run dev
   ```
   
   Terminal 2 (Server):
   ```bash
   cd server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173 (or the port shown in terminal)
   - Backend API: http://localhost:5000

## 📂 Project Structure

```
perma/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json
│
└── README.md
```

## 🔥 Key Components

### Frontend Components
- **Dashboard**: Main dashboard with link management
- **SortableLink**: Drag & drop link component
- **AddLinkModal**: Modal for adding new links
- **Header**: Navigation header with user menu
- **Sidebar**: Navigation sidebar with quick stats
- **LandingPage**: Marketing landing page

### Backend API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `GET /api/public/:username` - Public profile view
- `POST /api/links` - Create new link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `PUT /api/links/reorder` - Reorder links
- `GET /api/analytics/overview` - Analytics overview

## 🎨 Design System

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #ec4899 (Pink)
- **Accent**: #10b981 (Emerald)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### UI Features
- **Glassmorphism**: Translucent cards with backdrop blur
- **Gradient Text**: Eye-catching gradient text effects
- **Smooth Animations**: Hover effects and transitions
- **Card Hover**: Subtle lift effects on interactive elements

## 🛣️ Roadmap

### Milestone 1: MVP ✅
- [x] Dashboard CRUD operations
- [x] Perma ID system
- [x] Basic sharing functionality
- [x] Privacy controls

### Milestone 2: QR + Quick Actions
- [ ] Static & dynamic QR generation
- [ ] One-click copy/share
- [ ] Mobile PWA features

### Milestone 3: Analytics + API
- [ ] Click metrics and funnels
- [ ] REST API + webhooks
- [ ] Geographic analytics

### Milestone 4: Gamification + AI
- [ ] Badge system
- [ ] Streak tracking
- [ ] AI-powered suggestions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Success Metrics

- **DAU/MAU**: Target ≥ 0.20
- **Avg. links/user**: Target ≥ 5
- **Monthly click growth**: Target ≥ 15%
- **Pro conversion rate**: Target ≥ 3%

## 🌟 Screenshots

### Dashboard
![Dashboard Screenshot](screenshots/dashboard.png)

### Link Management
![Link Management Screenshot](screenshots/link-management.png)

### Landing Page
![Landing Page Screenshot](screenshots/landing.png)

---

Made with ❤️ by the Perma team
