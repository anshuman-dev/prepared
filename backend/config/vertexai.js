import { VertexAI } from '@google-cloud/vertexai';

let vertexAI = null;
let generativeModel = null;

export const initializeVertexAI = () => {
  if (vertexAI) return { vertexAI, generativeModel };

  try {
    vertexAI = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    });

    generativeModel = vertexAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
      },
    });

    console.log('Vertex AI initialized successfully');
    return { vertexAI, generativeModel };
  } catch (error) {
    console.error('Failed to initialize Vertex AI:', error);
    throw error;
  }
};

export const getGenerativeModel = () => {
  if (!generativeModel) {
    const { generativeModel: model } = initializeVertexAI();
    return model;
  }
  return generativeModel;
};

export default { initializeVertexAI, getGenerativeModel };
