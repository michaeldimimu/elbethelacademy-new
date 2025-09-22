# ElBethel Academy - Role-Based Learning Management System

A modern, full-stack educational platform built with React, TypeScript, Express, and MongoDB, featuring comprehensive role-based access control (RBAC) for educational institutions.

## 🚀 Features

### 🔐 **Authentication & Security**

- **Secure Authentication**: Username/password with bcrypt hashing
- **Session Management**: Express sessions with MongoDB persistence
- **Role-Based Access Control**: 6-tier permission system

### 👥 **User Roles & Permissions**

- **Super Admin**: Full system control and user management
- **Admin**: User management, course oversight, analytics
- **Moderator**: Content moderation and limited user management
- **Teacher**: Course creation, grading, student progress tracking
- **Student**: Course enrollment, assignment submission, grade viewing
- **Guest**: Limited read-only access

### 🎯 **Core Functionality**

- **Dynamic Dashboard**: Role-specific UI and navigation
- **Protected Routes**: API and frontend route protection
- **Permission System**: Granular permission checking
- **User Management**: Admin tools for user activation/deactivation
- **Course Management**: Teaching and learning tools

## 🛠️ Tech Stack

### **Frontend**

- **React 19.1.1** - Modern UI framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Vite** - Fast development and build tool

### **Backend**

- **Express 5.1.0** - Node.js web framework
- **TypeScript** - Server-side type safety
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.18.2** - ODM for MongoDB
- **bcrypt** - Password hashing
- **express-session** - Session management

## 📦 Installation & Setup

### **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### **1. Clone the Repository**

```bash
git clone https://github.com/JUWON250604/elbethelacademy-new.git
cd elbethelacademy-new
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Server Configuration
PORT=3001
NODE_ENV=development
```

### **4. Database Setup**

#### **Option A: MongoDB Atlas (Recommended)**

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file

#### **Option B: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/elbethelacademy`

### **5. Seed Demo Data**

```bash
npm run seed
```

This creates demo users with different roles for testing.

### **6. Start Development Servers**

```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
npm run dev          # Frontend only (port 5173)
npm run dev:server:watch  # Backend only (port 3001)
```

## 🎮 Usage & Testing

### **Demo Credentials**

After seeding, you can log in with these accounts:

| Role        | Username  | Password     | Capabilities                                  |
| ----------- | --------- | ------------ | --------------------------------------------- |
| **Admin**   | `admin`   | `admin123`   | Full administrative access, user management   |
| **Teacher** | `teacher` | `teacher123` | Course management, grading, student progress  |
| **Student** | `student` | `student123` | Course enrollment, assignments, grade viewing |

### **Application URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Sign In**: http://localhost:5173/signin
- **Dashboard**: http://localhost:5173/dashboard

### **API Endpoints**

#### **Authentication**

- `POST /auth/signin/credentials` - User login
- `POST /auth/signout` - User logout
- `GET /auth/session` - Get current session

#### **Protected Routes**

- `GET /api/profile` - User profile (authenticated users)
- `GET /api/admin/users` - User list (admin only)
- `GET /api/admin/dashboard` - Admin dashboard (admin only)
- `POST /api/admin/users/:id/activate` - Activate user (super admin only)
- `POST /api/admin/users/:id/deactivate` - Deactivate user (super admin only)
- `GET /api/teacher/courses` - Teacher courses (teacher role)
- `GET /api/student/courses` - Student courses (student role)

## 🏗️ Project Structure

```
elbethelacademy-new/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   └── Dashboard.tsx   # Main dashboard
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # RBAC middleware
│   ├── models/           # MongoDB models
│   │   └── User.ts       # User schema
│   ├── services/         # API services
│   │   └── authService.ts # Frontend auth service
│   ├── types/            # TypeScript types
│   │   └── roles.ts      # Role and permission types
│   ├── config/           # Configuration
│   │   └── database.ts   # Database connection
│   └── routes/           # API routes
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeding
├── server.ts            # Express server
└── package.json         # Dependencies and scripts
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start frontend (Vite)
npm run dev:server       # Start backend once
npm run dev:server:watch # Start backend with file watching
npm run dev:full         # Start both frontend and backend

# Database
npm run seed             # Seed database with demo users

# Building
npm run build            # Build for production
npm run build:server     # Build server for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

## 🔒 Security Features

### **Password Security**

- bcrypt hashing with salt rounds (cost: 12)
- Password validation and requirements
- Secure password comparison

### **Session Security**

- HTTP-only session cookies
- Session expiration handling
- CSRF protection ready

### **Role-Based Security**

- Middleware-based route protection
- Granular permission checking
- Frontend permission gates
- API endpoint protection

## 🧪 Testing Different Roles

### **1. Admin Testing**

1. Sign in with `admin/admin123`
2. Access admin panel features
3. View user management options
4. Test user activation/deactivation (super admin features)

### **2. Teacher Testing**

1. Sign in with `teacher/teacher123`
2. Access teaching tools
3. View course management panel
4. Test grading capabilities

### **3. Student Testing**

1. Sign in with `student/student123`
2. Access learning dashboard
3. View enrolled courses
4. Test assignment submission interface

## 🚨 Troubleshooting

### **Common Issues**

#### **Database Connection Failed**

```bash
# Check your MongoDB URI in .env
# Ensure MongoDB Atlas cluster is running
# Verify network access settings in Atlas
```

#### **Demo Credentials Don't Work**

```bash
# Re-run the seed script
npm run seed

# Check database connection
# Verify users were created in MongoDB
```

#### **Port Already in Use**

```bash
# Kill processes on ports 3001 or 5173
npx kill-port 3001
npx kill-port 5173

# Or change ports in configuration
```

#### **TypeScript Errors**

```bash
# Clear TypeScript cache
npx tsc --build --clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### **Environment Variables for Production**

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
SESSION_SECRET=strong_random_session_secret
PORT=3001
```

### **Build Commands**

```bash
# Build frontend
npm run build

# Build backend
npm run build:server

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**JUWON250604**

- GitHub: [@JUWON250604](https://github.com/JUWON250604)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the robust database solution
- Express.js community for the excellent web framework
- Tailwind CSS for the utility-first styling approach
