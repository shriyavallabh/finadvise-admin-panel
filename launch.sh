#!/bin/bash

# FinAdvise Admin Panel Launch Script
echo "🚀 Starting FinAdvise Admin Panel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the admin panel directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Using defaults."
    echo "   Copy .env.example to .env.local and configure your settings."
fi

# Build the application
echo "🏗️  Building application..."
npm run build

# Start the development server
echo "✅ Starting development server..."
echo "   Admin Panel will be available at: http://localhost:3000"
echo "   Make sure your FinAdvise API is running on: http://localhost:3001"
echo ""

npm run dev
