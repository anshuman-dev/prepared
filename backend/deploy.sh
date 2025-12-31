#!/bin/bash

# Deployment script for Google Cloud Run
# This script builds and deploys the backend to Cloud Run

set -e  # Exit on error

echo "🚀 Starting deployment to Google Cloud Run..."

# Configuration
PROJECT_ID="prepared-99099"
SERVICE_NAME="prepared-backend"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check for required environment variables
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ ERROR: GEMINI_API_KEY environment variable is not set"
  echo "Please set it before running this script:"
  echo "  export GEMINI_API_KEY='your-api-key-here'"
  exit 1
fi

if [ -z "$ELEVENLABS_API_KEY" ]; then
  echo "❌ ERROR: ELEVENLABS_API_KEY environment variable is not set"
  echo "Please set it before running this script:"
  echo "  export ELEVENLABS_API_KEY='your-api-key-here'"
  exit 1
fi

echo "📦 Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} --project ${PROJECT_ID}

echo "🌐 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "GOOGLE_PROJECT_ID=prepared-99099" \
  --set-env-vars "GOOGLE_CLOUD_LOCATION=us-central1" \
  --set-env-vars "FIRESTORE_DATABASE_ID=(default)" \
  --set-env-vars "GEMINI_API_KEY=${GEMINI_API_KEY}" \
  --set-env-vars "GEMINI_MODEL=gemini-flash-latest" \
  --set-env-vars "ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}" \
  --set-env-vars "ELEVENLABS_AGENT_ID=agent_1501kda2xvyef53rt3mad4xx66hh" \
  --set-env-vars "JWT_SECRET=production-secret-key-change-this" \
  --set-env-vars "JWT_EXPIRATION=7d" \
  --set-env-vars "FRONTEND_URL=https://prepared-99099.web.app" \
  --set-env-vars "BACKEND_URL=https://prepared-backend-2obppo24sa-uc.a.run.app" \
  --project ${PROJECT_ID}

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your backend is now live at:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)'
echo ""
echo "📝 Next steps:"
echo "1. Copy the URL above"
echo "2. Update FRONTEND_URL and BACKEND_URL in this script"
echo "3. Update ElevenLabs agent Custom LLM endpoint"
echo "4. Redeploy with updated URLs"
