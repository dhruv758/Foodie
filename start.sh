#!/bin/bash

REPO_URL="https://github.com/dhruv758/Foodie.git"
BRANCH_NAME="foodie-app"
TARGET_DIR="$HOME/Desktop/Foodie"

echo "📁 Checking if 'Foodie' folder exists on Desktop..."

if [ -d "$TARGET_DIR" ]; then
    echo "✅ 'Foodie' folder already exists. Skipping clone."
else
    echo "📥 Cloning 'Foodie' from GitHub (branch: $BRANCH_NAME)..."
    git clone --branch "$BRANCH_NAME" "$REPO_URL" "$TARGET_DIR"
    echo "✅ Cloned successfully to $TARGET_DIR"
fi

cd "$TARGET_DIR" || { echo "❌ Failed to enter project folder"; exit 1; }

echo "🚀 Starting FOODIE Setup..."

# Backend Setup
echo "🔧 Installing backend dependencies..."
cd backend
npm install
echo "🌐 Starting backend server..."
npm start &

cd ..

# Frontend Setup
echo "🔧 Installing frontend dependencies..."
cd frontend
npm install
echo "🌐 Starting frontend server..."
npm run dev &

cd ..

echo "✅ Frontend and Backend are running. Selenium will be triggered from UI when needed."
open -a "Google Chrome" http://localhost:5173
