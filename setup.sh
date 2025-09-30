#!/bin/bash

echo "🚀 Setting up Business System..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Copy environment files
echo "📝 Setting up environment files..."
cp server/env.example server/.env
cp client/env.example client/.env.local

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env with your database configuration"
echo "2. Edit client/.env.local if needed"
echo "3. Run: npm run db:push"
echo "4. Run: npm run db:seed"
echo "5. Run: npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
