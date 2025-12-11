#!/bin/bash

# Personal Finance Tracker - PostgreSQL Setup Script
# This script helps set up your PostgreSQL database for the first time

set -e  # Exit on error

echo "🚀 Personal Finance Tracker - Database Setup"
echo "============================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please update your .env file with your actual database credentials!"
    echo "   Edit the DATABASE_URL line with your PostgreSQL connection string"
    echo ""
    read -p "Press Enter once you've updated the .env file..."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Setting up database..."
echo ""
echo "Choose your setup option:"
echo "  1) Push schema to database (Quick, for development)"
echo "  2) Create migration (Better for production)"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "📤 Pushing schema to database..."
        npx prisma db push
        ;;
    2)
        echo ""
        echo "📋 Creating migration..."
        npx prisma migrate dev --name init
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🌱 Would you like to seed the database with initial categories?"
read -p "Seed database? (y/n): " seed_choice

if [ "$seed_choice" = "y" ] || [ "$seed_choice" = "Y" ]; then
    if [ -f "prisma/seed.ts" ]; then
        echo "🌱 Seeding database..."
        npx prisma db seed
    else
        echo "⚠️  No seed file found. Skipping..."
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:5000/api-docs to view the API documentation"
echo "  3. Run 'npx prisma studio' to open the database GUI"
echo ""
echo "🔧 Useful commands:"
echo "  - npm run dev          : Start development server"
echo "  - npx prisma studio    : Open database GUI"
echo "  - npx prisma generate  : Regenerate Prisma Client after schema changes"
echo "  - npx prisma db push   : Push schema changes to database"
echo ""
