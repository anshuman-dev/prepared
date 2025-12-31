# US Visa Interview AI Practice

AI-powered practice application for US visa interviews using ElevenLabs Conversational AI and Google Gemini.

## Project Structure

```
prepared/
├── frontend/          # React PWA (Vite)
├── backend/           # Node.js Express API
├── shared/            # Shared types and constants
└── docs/              # Documentation and diagrams
```

## Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- ElevenLabs React SDK for voice
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js with Express
- Google Cloud Firestore (database)
- Google Vertex AI (Gemini for AI)
- ElevenLabs Conversational AI (voice)
- JWT authentication

**Infrastructure:**
- Google Cloud Run (backend hosting)
- Cloud Storage (frontend hosting)
- Firestore (database)

## Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud Platform account
- ElevenLabs API key
- Firestore database
- Vertex AI enabled

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

4. Start development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## Development

See PROGRESS.md for current development status and phase tracking.

## Features

- Realistic AI-powered visa interview simulations
- Two modes: Practice (with coaching) and Simulation (realistic)
- Real-time red flag detection
- Comprehensive post-interview analysis
- Progress tracking across multiple sessions
- Mobile-first Progressive Web App

## License

MIT
