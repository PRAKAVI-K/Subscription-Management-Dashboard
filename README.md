🌟 Overview
Subscription Management Dashboard is a comprehensive MERN stack application that allows users to subscribe to a plan, view their active plan, and manage their profile — with a clean and responsive UI. The platform features stunning glassmorphism design, smooth animations, and an intuitive admin panel for managing all subscriptions.
Why This Project?

🎨 Modern UI/UX: Glassmorphism effects, gradient backgrounds, and smooth animations
🔐 Secure Authentication: JWT-based authentication with protected routes
📊 Admin Dashboard: Real-time analytics and subscription management
📱 Fully Responsive: Works seamlessly across all devices
⚡ Performance Optimized: Fast loading times and smooth interactions


✨ Features
👤 User Features

✅ User registration and login with JWT authentication
✅ Browse available subscription plans
✅ Subscribe to plans with instant activation
✅ View active subscription details and remaining days
✅ Profile management dashboard
✅ Password strength indicator during registration
✅ Real-time form validation

👨‍💼 Admin Features

✅ Comprehensive admin dashboard
✅ View all user subscriptions
✅ Real-time statistics (total, active, expired subscriptions)
✅ Revenue tracking and analytics
✅ User management capabilities
✅ Export subscription data
✅ Filter and search functionality

🎨 Design Features

✅ Glassmorphism UI with backdrop blur effects
✅ Animated gradient backgrounds
✅ Smooth entrance and hover animations
✅ Interactive micro-animations
✅ Floating particles for depth
✅ Responsive design for all screen sizes
✅ Custom scrollbar styling


🛠️ Tech Stack
Frontend

React 18.x - UI library
Redux Toolkit - State management
React Router v6 - Navigation and routing
Axios - HTTP client
Tailwind CSS - Utility-first CSS framework
Custom CSS Animations - For stunning effects

Backend

Node.js - Runtime environment
Express.js - Web framework
MongoDB - NoSQL database
Mongoose - ODM for MongoDB
JWT - Authentication
bcrypt - Password hashing
CORS - Cross-origin resource sharing


📁 Project Structure
subscription-management-dashboard/
├── client/                      # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Layout.jsx       # Main layout wrapper
│   │   │   └── PrivateRoute.jsx # Protected route component
│   │   ├── pages/               # Page components
│   │   │   ├── Login.jsx        # Login page with animations
│   │   │   ├── Register.jsx     # Registration with validation
│   │   │   ├── Plans.jsx        # Subscription plans display
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   └── AdminSubscriptions.jsx # Admin panel
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── store/
│   │   │   └── store.js         # Redux store configuration
│   │   ├── index.css            # Custom animations and styles
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js           # Vite configuration
│
└── server/                      # Backend Node.js application
    ├── models/                  # Mongoose models
    │   ├── User.js
    │   ├── Plan.js
    │   └── Subscription.js
    ├── routes/                  # API routes
    │   ├── auth.js
    │   ├── plans.js
    │   └── subscriptions.js
    ├── middleware/
    │   └── auth.js              # JWT verification middleware
    ├── server.js                # Express server setup
    ├── package.json
    └── .env           
