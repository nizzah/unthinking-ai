#!/bin/bash
# Development script that prevents build manifest errors

echo "🧹 Cleaning Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "🚀 Starting development server..."
npm run dev
