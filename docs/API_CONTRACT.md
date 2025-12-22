# API Contract Documentation

Base URL: `http://localhost:8080/api` (development)

All endpoints return JSON. Authentication uses JWT tokens in the `Authorization` header as `Bearer <token>`.

---

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "profile": {
    "visaType": "F-1",
    "country": "India",
    "age": 22,
    "field": "Computer Science",
    "university": "MIT",
    "hasRelativesInUS": true,
    "relativesVisaStatus": "H-1B",
    "interviewDate": "2026-02-15",
    "previousVisa": false
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "userId": "user_abc123",
  "token": "jwt_token_here",
  "profile": { ... }
}
```

---

### POST /api/auth/login
Authenticate user and get token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "userId": "user_abc123",
  "token": "jwt_token_here",
  "profile": { ... }
}
```

---

### GET /api/auth/profile
Get current user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "profile": { ... }
}
```

---

### PUT /api/auth/profile
Update user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "profile": {
    "visaType": "F-1",
    "country": "India",
    ...
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "profile": { ... }
}
```

---

## Interview Endpoints

All interview endpoints require authentication.

### POST /api/interview/start
Start a new interview session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "mode": "simulation"
}
```

**Response:** `201 Created`
```json
{
  "sessionId": "session_xyz789",
  "agentConfig": {
    "agentId": "elevenlabs_agent_id",
    "customLLMEndpoint": "https://api.example.com/api/interview/gemini-proxy"
  }
}
```

---

### POST /api/interview/gemini-proxy
Process conversation turn. Called by ElevenLabs during interview.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "sessionId": "session_xyz789",
  "conversationHistory": [
    { "role": "user", "content": "I want to study Computer Science" }
  ]
}
```

**Response:** `200 OK`
```json
{
  "content": "Why Computer Science specifically? What area interests you?",
  "redFlag": null
}
```

**With Red Flag (Practice Mode):**
```json
{
  "content": "Let me stop you there...",
  "redFlag": {
    "type": "immigrant_intent",
    "severity": "high",
    "explanation": "Mentioning US jobs signals intent to stay",
    "suggestion": "Focus on your career plans back home"
  }
}
```

---

### POST /api/interview/analyze
Analyze completed interview.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "sessionId": "session_xyz789"
}
```

**Response:** `200 OK`
```json
{
  "analysis": {
    "overallScore": 7.5,
    "approvalLikelihood": 75,
    "likelyOutcome": "approved",
    "redFlags": [...],
    "strengths": [...],
    "scores": {
      "clarity": 8,
      "confidence": 7,
      "specificity": 7,
      "returnIntent": 8
    },
    "recommendations": [...],
    "nextFocus": "..."
  }
}
```

---

### POST /api/interview/end/:sessionId
Mark interview as ended.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

### GET /api/interview/session/:sessionId
Get interview session details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "sessionId": "session_xyz789",
  "userId": "user_abc123",
  "mode": "simulation",
  "status": "completed",
  "startedAt": "2025-12-22T10:00:00Z",
  "completedAt": "2025-12-22T10:03:00Z",
  "transcript": [...],
  "analysis": { ... }
}
```

---

## User Progress Endpoints

All user endpoints require authentication.

### GET /api/user/sessions
Get all user interview sessions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "sessions": [
    {
      "sessionId": "session_1",
      "mode": "practice",
      "status": "completed",
      "startedAt": "...",
      "completedAt": "...",
      "score": 7.5
    }
  ]
}
```

---

### GET /api/user/progress
Get user progress and statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "totalSessions": 5,
  "completedSessions": 5,
  "averageScore": 7.2,
  "trend": "improving",
  "sessionHistory": [...],
  "weaknesses": {
    "vague_answers": { "count": 3, "lastSeen": "..." }
  },
  "readinessScore": 72
}
```

---

### DELETE /api/user/sessions/:sessionId
Delete an interview session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no access to resource)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API is rate-limited to 100 requests per 15 minutes per IP address.

Exceeded rate limit returns `429 Too Many Requests`.
