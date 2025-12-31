# Visa Interview Backend API

Express.js backend API for the US Visa Interview Practice application.

## Architecture

```
backend/
├── config/          # Service configurations (Firebase, Vertex AI)
├── routes/          # API route definitions
├── controllers/     # Request handlers and business logic
├── services/        # External service integrations
├── middleware/      # Express middleware (auth, validation, errors)
├── prompts/         # AI prompt templates (to be added)
└── utils/           # Utility functions and constants
```

## Routes

- `/api/auth` - User authentication (signup, login, profile)
- `/api/interview` - Interview operations (start, proxy, analyze)
- `/api/user` - User data (sessions, progress)

See `/docs/API_CONTRACT.md` for complete API documentation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start server:
```bash
npm run dev    # Development (with auto-reload)
npm start      # Production
```

## Environment Variables

Required:
- `GOOGLE_PROJECT_ID` - GCP project ID
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON

Optional:
- `PORT` - Server port (default: 8080)
- `FRONTEND_URL` - CORS origin (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

## Services

### Firestore
User data, sessions, and progress tracking.

### Vertex AI (Gemini)
AI interviewer and analysis engine.

### ElevenLabs
Voice synthesis and conversation management (integrated via frontend).

## Deployment

Built for Google Cloud Run. See `Dockerfile` and deployment docs.

```bash
docker build -t visa-interview-api .
docker run -p 8080:8080 visa-interview-api
```
