#!/bin/bash

echo "🚀 Starting FOODIE Setup..."

# Run backend setup
echo "🔧 Installing backend dependencies..."
cd backend
npm install

echo "🌐 Starting backend server..."
npm start &

cd ..

# Run frontend setup
echo "🔧 Installing frontend dependencies..."
cd frontend
npm install

echo "🌐 Starting frontend server..."
npm run dev &

cd ..

echo "✅ Frontend and Backend are running. Selenium will be triggered from UI when needed."
open -a "Google Chrome" http://localhost:5173