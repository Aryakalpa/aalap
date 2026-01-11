# Literature Social Media Platform - Setup Script
# PowerShell script to initialize the project

Write-Host "🚀 Setting up Literature Social Media Platform..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Initialize Vite React project in current directory
Write-Host "`n📦 Creating Vite React project..." -ForegroundColor Yellow
npm create vite@latest . -- --template react

# Install dependencies
Write-Host "`n📚 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install additional dependencies
Write-Host "`n📚 Installing additional packages..." -ForegroundColor Yellow
npm install react-router-dom @supabase/supabase-js

# Create .env file from example
if (-not (Test-Path .env)) {
    Write-Host "`n📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Please update .env with your Supabase credentials" -ForegroundColor Green
}

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your Supabase URL and anon key" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
