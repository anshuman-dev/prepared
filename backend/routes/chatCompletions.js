import express from 'express';
import cors from 'cors';
import * as firestoreService from '../services/firestoreService.js';
import * as geminiService from '../services/geminiService.js';

const router = express.Router();

// Allow all origins for this endpoint (needed for ElevenLabs)
const openCors = cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

/**
 * OpenAI-compatible Chat Completions endpoint for ElevenLabs
 * POST /chat/completions
 */
router.post('/chat/completions', openCors, async (req, res) => {
  try {
    console.log('🔵 Chat Completions called!');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Query params:', req.query);

    // Get sessionId from query params (primary) or elevenlabs_extra_body (if ElevenLabs adds it)
    let sessionId = req.query.sessionId || req.body.elevenlabs_extra_body?.sessionId;

    // Fallback: Use most recent in-progress session if no sessionId provided
    if (!sessionId) {
      console.log('⚠️ No sessionId provided, finding most recent session...');
      const sessions = await firestoreService.getAllActiveSessions();
      if (sessions && sessions.length > 0) {
        sessionId = sessions[0].sessionId;
        console.log('✅ Using most recent session:', sessionId);
      } else {
        console.log('❌ No active sessions found');
        return res.status(400).json({
          error: {
            message: 'No active interview session found',
            type: 'invalid_request_error'
          }
        });
      }
    } else {
      console.log('✅ SessionId received:', sessionId);
    }

    // Get session context
    const session = await firestoreService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: {
          message: 'Session not found',
          type: 'invalid_request_error'
        }
      });
    }

    // Extract messages from OpenAI-style request
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: {
          message: 'Messages array is required',
          type: 'invalid_request_error'
        }
      });
    }

    console.log('📝 Messages:', messages.length);

    // Convert OpenAI messages format to our format
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content
    }));

    // Get response from Gemini
    const response = await geminiService.processConversationTurn(
      session.systemPrompt,
      conversationHistory,
      session.mode
    );

    console.log('✅ Gemini response:', response.content.substring(0, 100) + '...');

    // Save to transcript
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      await firestoreService.addToTranscript(sessionId, [
        {
          speaker: 'applicant',
          text: lastUserMessage.content,
          timestamp: new Date()
        },
        {
          speaker: 'officer',
          text: response.content,
          timestamp: new Date()
        }
      ]);
    }

    // Check if streaming is requested
    const isStreaming = req.body.stream === true;

    if (isStreaming) {
      // Return in Server-Sent Events (SSE) format for ElevenLabs
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const streamId = `chatcmpl-${Date.now()}`;

      // Send the response as a stream chunk
      const chunk = {
        id: streamId,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: 'gemini-1.5-flash',
        choices: [
          {
            index: 0,
            delta: {
              role: 'assistant',
              content: response.content
            },
            finish_reason: null
          }
        ]
      };

      res.write(`data: ${JSON.stringify(chunk)}\n\n`);

      // Send final chunk with finish_reason and usage info
      const finalChunk = {
        id: streamId,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: 'gemini-1.5-flash',
        choices: [
          {
            index: 0,
            delta: {},
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: Math.ceil(JSON.stringify(messages).length / 4),
          completion_tokens: Math.ceil(response.content.length / 4),
          total_tokens: Math.ceil((JSON.stringify(messages).length + response.content.length) / 4)
        }
      };

      res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();

      console.log('✅ Streaming response sent successfully');
    } else {
      // Return regular JSON format
      res.json({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'gemini-1.5-flash',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: response.content
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      });

      console.log('✅ Response sent successfully');
    }

  } catch (error) {
    console.error('❌ Error in chat completions:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        type: 'internal_error'
      }
    });
  }
});

export default router;
