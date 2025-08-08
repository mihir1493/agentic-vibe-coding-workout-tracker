# 💪 Workout Tracker

A beautiful, minimalistic workout tracking app built with Next.js, TypeScript, Tailwind CSS, and Supabase. Track your fitness journey with friends and compete on the leaderboard!

## Features

- ✨ **Minimalistic Design** - Clean, modern UI with beautiful gradients
- 👥 **User Management** - Add users with name and age
- 🏋️ **Simple Tracking** - Just click "Yes" or "No" to record workouts
- 🏆 **Leaderboard** - See who's working out the most
- 📱 **Responsive** - Works perfectly on desktop and mobile
- ⚡ **Fast** - Built with Next.js for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd shinde-workout
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create the following tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Workouts Table
```sql
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## How to Use

1. **Add Users**: Click "Add New User" and enter name and age
2. **Select User**: Choose a user from the list or add a new one
3. **Track Workouts**: Click "Yes! 💪" or "No 😔" to record your workout
4. **View Leaderboard**: See who's working out the most at the bottom

## Database Schema

### Users
- `id`: UUID (Primary Key)
- `name`: Text (User's name)
- `age`: Integer (User's age)
- `created_at`: Timestamp

### Workouts
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users.id)
- `completed`: Boolean (Whether workout was completed)
- `created_at`: Timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own workout tracking needs!

---

Built with ❤️ using Next.js, TypeScript, and Supabase
