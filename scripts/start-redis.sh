#!/bin/bash

echo "🚀 Starting Redis for AI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Redis container is already running
if docker ps | grep -q "redis-ai"; then
    echo "✅ Redis container is already running"
    echo "📊 Redis URL: redis://localhost:6379"
    echo "🔗 You can now start your application with: npm run dev"
    exit 0
fi

# Start Redis container
echo "📦 Pulling Redis image..."
docker pull redis:latest

echo "🔧 Starting Redis container..."
docker run -d \
    --name redis-ai \
    -p 6379:6379 \
    --restart unless-stopped \
    redis:latest

if [ $? -eq 0 ]; then
    echo "✅ Redis started successfully!"
    echo "📊 Redis URL: redis://localhost:6379"
    echo "🔗 You can now start your application with: npm run dev"
    echo ""
    echo "📋 Useful commands:"
    echo "  - View logs: docker logs redis-ai"
    echo "  - Stop Redis: docker stop redis-ai"
    echo "  - Remove container: docker rm redis-ai"
else
    echo "❌ Failed to start Redis container"
    exit 1
fi 