# AI Mock Interview Platform

A production-quality AI-powered mock interview platform with voice-only conversations, adaptive questioning, and detailed feedback reports.

## Features

- **User Authentication**: Sign up, login, and logout with JWT
- **Profile Management**: Create and update user profile
- **Interview Types**: Behavioral, Technical, System Design, HR/Culture Fit
- **Voice-Only Interface**: Uses browser's Web Speech API
- **Feedback Reports**: Detailed feedback after each interview
- **Session History**: View past interviews and reports

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env to add your database URL and other secrets

# Set up database
npx prisma migrate dev --name init

# Start development server
npm run dev

# Open app at http://localhost:3000
```

## Deployment to Vercel

### Step 1: Push Your Code to GitHub/GitLab
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub/GitLab and push
```

### Step 2: Set Up Database on Vercel (or use external provider like Supabase, Neon, etc.)
Option 1 (Vercel Postgres):
1. Go to your Vercel dashboard → **Storage** → **Create Database**
2. Choose **Postgres**
3. Follow the steps to create your database

Option 2 (Neon.tech - free tier available):
1. Go to [Neon.tech](https://neon.tech) and create an account
2. Create a new project and database
3. Copy the connection string

### Step 3: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click **New Project**
3. Import your GitHub/GitLab repo
4. Configure project settings:
   - **Project Name**: `ai-mock-interview` (or any name you like)
   - **Framework Preset**: `Next.js` (should be detected automatically)
5. Add Environment Variables (in Vercel dashboard → your project → **Settings** → **Environment Variables**):
   - `DATABASE_URL`: Your PostgreSQL connection string (from Vercel Postgres, Neon, or other provider)
   - `JWT_SECRET`: Generate a long random string (use `openssl rand -hex 32` to generate)
   - `JWT_EXPIRES_IN`: `7d`
6. Click **Deploy**!

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_interview_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# OpenAI (optional, for enhanced AI features)
OPENAI_API_KEY="your-openai-api-key"
```

## License

MIT
