# 🚀 Deployment Guide

This guide will walk you through deploying your Workout Tracker app to Vercel with Supabase as the backend.

## Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Supabase account (free at [supabase.com](https://supabase.com))

## Step 1: Set up Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `workout-tracker` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can be inserted by everyone" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Workouts are viewable by everyone" ON workouts
  FOR SELECT USING (true);

CREATE POLICY "Workouts can be inserted by everyone" ON workouts
  FOR INSERT WITH CHECK (true);
```

## Step 2: Deploy to Vercel

### 1. Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/workout-tracker.git
git push -u origin main
```

### 2. Deploy with Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (leave as default)
   - **Output Directory**: `.next` (leave as default)
   - **Install Command**: `npm install` (leave as default)

### 3. Add Environment Variables

1. In the Vercel project settings, go to **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Click "Deploy"

## Step 3: Test Your Deployment

1. Once deployed, Vercel will give you a URL (like `https://your-app.vercel.app`)
2. Visit the URL and test the app:
   - Add a new user
   - Record some workouts
   - Check the leaderboard

## Step 4: Custom Domain (Optional)

1. In your Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Make sure you added them in Vercel dashboard
   - Redeploy after adding environment variables

2. **Database Connection Issues**
   - Check your Supabase URL and key are correct
   - Ensure your Supabase project is active

3. **Build Errors**
   - Check the build logs in Vercel
   - Make sure all dependencies are in `package.json`

### Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in your project settings
2. Monitor performance and user behavior

### Supabase Monitoring

1. Check your Supabase dashboard for:
   - Database performance
   - API usage
   - Error logs

## Cost Optimization

### Vercel (Free Tier)
- 100GB bandwidth/month
- 100GB storage
- 100GB function execution time

### Supabase (Free Tier)
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users

Both free tiers are sufficient for most personal projects!

---

🎉 **Congratulations!** Your workout tracker is now live and ready to use! 