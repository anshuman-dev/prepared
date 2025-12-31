# Secure Deployment Instructions

## Prerequisites

Before deploying, you need to set the following environment variables with your API keys:

```bash
export GEMINI_API_KEY='your-gemini-api-key'
export ELEVENLABS_API_KEY='your-elevenlabs-api-key'
```

## Deployment Steps

1. **Set Environment Variables** (these are NOT stored in git for security):
   ```bash
   export GEMINI_API_KEY='AIzaSyBwzPfIfaqr-Z4E8Gea9B-o4NTjFv_zQNE'
   export ELEVENLABS_API_KEY='sk_77f52cef811eb5d1251be26b09c62f3aa2ed4aedace71aa4'
   ```

2. **Run the deployment script**:
   ```bash
   cd backend
   ./deploy.sh
   ```

## Security Notes

- ⚠️ **NEVER** commit API keys to git
- ⚠️ **NEVER** hardcode secrets in `deploy.sh`
- ✅ Always use environment variables for sensitive data
- ✅ Keep `.env` files in `.gitignore`
- ✅ Regenerate keys immediately if accidentally exposed

## Local Development

For local development, create a `.env` file in the `backend/` directory (already in .gitignore):

```bash
GEMINI_API_KEY=your-key-here
ELEVENLABS_API_KEY=your-key-here
# ... other variables
```
