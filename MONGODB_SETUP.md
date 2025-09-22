# MongoDB Setup Guide

This guide will help you set up MongoDB for the ElBethel Academy application.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows

1. **Download MongoDB Community Server:**

   - Go to https://www.mongodb.com/try/download/community
   - Select "Windows" and download the MSI installer
   - Run the installer and follow the setup wizard
   - Choose "Complete" installation
   - Install MongoDB as a service (recommended)

2. **Verify Installation:**

   ```bash
   mongod --version
   mongo --version
   ```

3. **Start MongoDB Service:**
   - MongoDB should start automatically as a service
   - If not, you can start it manually:
   ```bash
   net start MongoDB
   ```

### macOS

1. **Using Homebrew (Recommended):**

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

### Linux (Ubuntu/Debian)

1. **Import MongoDB public GPG key:**

   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB repository:**

   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB:**

   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Option 2: MongoDB Atlas (Cloud Database)

1. **Create a free account:**

   - Go to https://cloud.mongodb.com/
   - Sign up for a free account
   - Create a new project

2. **Create a cluster:**

   - Click "Build a Database"
   - Choose "M0 Sandbox" (free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set up database access:**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"

4. **Set up network access:**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can add "0.0.0.0/0" (allow from anywhere)
   - For production, add only your specific IP addresses

5. **Get connection string:**
   - Go to "Databases" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Update your `.env` file with the connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/elbethel-academy?retryWrites=true&w=majority
   ```

## Option 3: Docker (Alternative)

1. **Run MongoDB in Docker:**

   ```bash
   docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
   ```

2. **Update your `.env` file:**
   ```
   MONGODB_URI=mongodb://admin:password@localhost:27017/elbethel-academy?authSource=admin
   ```

## Setting Up the Application Database

Once MongoDB is running, you need to seed the database with initial users:

1. **Make sure MongoDB is running** (check connection)

2. **Seed the database:**

   ```bash
   npm run seed
   ```

3. **Start the application:**
   ```bash
   npm run dev:full
   ```

## Verification

1. **Check if MongoDB is running:**

   - Local: Try connecting with `mongosh` or `mongo`
   - Atlas: Check the Atlas dashboard

2. **Test the application:**
   - Go to http://localhost:5174
   - Try logging in with the demo credentials:
     - Username: `admin`, Password: `password123`
     - Username: `user`, Password: `user123`

## Troubleshooting

### Common Issues

1. **Connection refused:**

   - Make sure MongoDB is running
   - Check if the port 27017 is available
   - Verify the connection string in `.env`

2. **Authentication failed:**

   - Check username/password in connection string
   - For Atlas, verify database user credentials

3. **Database seeding fails:**
   - Make sure MongoDB is running and accessible
   - Check the MongoDB logs for errors
   - Verify the connection string is correct

### MongoDB Tools

1. **MongoDB Compass (GUI):**

   - Download from https://www.mongodb.com/products/compass
   - Great for visualizing and managing your data

2. **Command Line:**

   ```bash
   # Connect to local MongoDB
   mongosh

   # Show databases
   show dbs

   # Use specific database
   use elbethel-academy

   # Show collections
   show collections

   # Find all users
   db.users.find()
   ```

## Environment Variables

Make sure your `.env` file contains:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/elbethel-academy

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/elbethel-academy?retryWrites=true&w=majority

# For Docker MongoDB with auth
MONGODB_URI=mongodb://admin:password@localhost:27017/elbethel-academy?authSource=admin
```

Choose the appropriate connection string based on your MongoDB setup.
