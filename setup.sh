#!/bin/bash

echo "🚀 Setting up DocuFlota..."

echo ""
echo "📦 Installing root dependencies..."
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d postgres

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

echo ""
echo "🌱 Seeding database..."
cd backend
npm run seed
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "🔑 Default credentials:"
echo "  Email: admin@docuflota.com"
echo "  Password: admin123"
echo ""
echo "🚀 To start development:"
echo "  npm run dev"
echo ""
