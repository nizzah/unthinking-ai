#!/bin/bash

# Deployment Test Script
echo "🚀 Testing deployment configuration..."

# Test 1: Check if build works
echo "📦 Testing build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Test 2: Check environment variables
echo "🔧 Checking environment variables..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set (optional for basic functionality)"
else
    echo "✅ OPENAI_API_KEY is set"
fi

# Test 3: Check if all required files exist
echo "📁 Checking required files..."
required_files=(
    "next.config.mjs"
    "vercel.json"
    "package.json"
    "app/layout.tsx"
    "app/page.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Test 4: Validate JSON files
echo "🔍 Validating JSON files..."
if command -v jq &> /dev/null; then
    jq empty vercel.json
    if [ $? -eq 0 ]; then
        echo "✅ vercel.json is valid JSON"
    else
        echo "❌ vercel.json has invalid JSON"
        exit 1
    fi
else
    echo "⚠️  jq not available, skipping JSON validation"
fi

echo "🎉 All deployment tests passed!"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo "1. Push changes to your repository"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
