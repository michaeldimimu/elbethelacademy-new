import { ExpressAuth } from "@auth/express";
import Credentials from "@auth/express/providers/credentials";
import express from "express";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    username: "admin",
    password: "password123",
    name: "Administrator",
    email: "admin@example.com",
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    name: "Regular User",
    email: "user@example.com",
  },
];

app.use(
  "/auth/*",
  ExpressAuth({
    providers: [
      Credentials({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "credentials",
        // The credentials are used to generate a suitable form on the sign in page.
        credentials: {
          username: {
            label: "Username",
            type: "text",
            placeholder: "Enter your username",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // Add logic here to look up the user from the credentials supplied
          const user = users.find(
            (u) =>
              u.username === credentials?.username &&
              u.password === credentials?.password
          );

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
            };
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
          }
        },
      }),
    ],
    secret: process.env.AUTH_SECRET || "your-secret-key-here",
    trustHost: true,
  })
);

export default app;
