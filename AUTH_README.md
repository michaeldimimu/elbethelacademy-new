# ElBethel Academy - Authentication Setup

A React application with Express backend featuring username/password authentication using @auth/express.

## Features

- ✅ Username/password authentication
- ✅ Protected dashboard route
- ✅ Session management
- ✅ Modern React with TypeScript
- ✅ Tailwind CSS styling
- ✅ Express backend with Auth.js

## Demo Credentials

You can use these test accounts to sign in:

- **Admin Account:**

  - Username: `admin`
  - Password: `password123`

- **User Account:**
  - Username: `user`
  - Password: `user123`

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development servers:

```bash
npm run dev:full
```

This will start:

- Frontend (React + Vite) on http://localhost:5174 (or next available port)
- Backend (Express) on http://localhost:3001

### Alternative: Run separately

If you prefer to run the servers separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── SignIn.tsx          # Sign-in form component
│   └── Dashboard.tsx           # Protected dashboard
├── routes/
│   └── auth.route.ts          # Express auth routes
├── services/
│   └── authService.ts         # Frontend auth service
├── App.tsx                    # Main app with routing
└── main.tsx                   # App entry point
```

## How Authentication Works

1. **Backend (`auth.route.ts`):**

   - Uses @auth/express with Credentials provider
   - Validates username/password against mock user database
   - Creates secure sessions

2. **Frontend (`SignIn.tsx`):**

   - React form with username/password inputs
   - Calls auth service to authenticate
   - Redirects to dashboard on success

3. **Auth Service (`authService.ts`):**

   - Handles API calls to auth endpoints
   - Manages session state
   - Provides auth utilities

4. **Protected Routes:**
   - Dashboard checks for valid session
   - Redirects to sign-in if not authenticated

## Environment Variables

The application uses these environment variables (configured in `.env`):

- `AUTH_SECRET`: Secret key for signing tokens
- `PORT`: Backend server port (default: 3001)
- `NODE_ENV`: Environment mode

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Security Notes

⚠️ **Important for Production:**

1. **Change the AUTH_SECRET** in `.env` to a secure, random value
2. **Replace the mock user database** with a real database
3. **Hash passwords** using bcrypt or similar
4. **Use HTTPS** in production
5. **Implement proper session storage** (Redis, database)
6. **Add rate limiting** for auth endpoints
7. **Validate and sanitize** all inputs

## Customization

### Adding New Users

Edit the `users` array in `src/routes/auth.route.ts`:

```typescript
const users = [
  {
    id: "3",
    username: "newuser",
    password: "securepassword",
    name: "New User",
    email: "newuser@example.com",
  },
];
```

### Styling

The app uses Tailwind CSS. Modify the classes in the components to change the appearance.

### Database Integration

To connect to a real database:

1. Install your database driver (e.g., `pg` for PostgreSQL)
2. Replace the `users` array with database queries
3. Add password hashing with bcrypt
4. Implement proper user management

## Available Scripts

- `npm run dev` - Start Vite dev server (frontend only)
- `npm run dev:server` - Start Express server (backend only)
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, change the PORT in `.env` file.

### Authentication Not Working

1. Check that both frontend and backend servers are running
2. Verify the proxy configuration in `vite.config.ts`
3. Check browser network tab for API call errors
4. Ensure correct credentials are being used

### CORS Issues

If you encounter CORS issues, the Vite proxy should handle this. If problems persist, you may need to configure CORS in the Express server.
