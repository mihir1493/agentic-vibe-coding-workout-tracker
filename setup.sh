#!/bin/bash

echo "💪 Workout Tracker Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Add your Supabase credentials here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EOF
    echo "✅ Created .env.local file"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env.local with your Supabase credentials"
    echo "   1. Go to https://supabase.com and create a project"
    echo "   2. Get your project URL and anon key from Settings > API"
    echo "   3. Update the values in .env.local"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Create the database tables (see README.md for SQL commands)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 to see your app"
echo ""
echo "📚 For detailed instructions, see README.md and DEPLOYMENT.md" 