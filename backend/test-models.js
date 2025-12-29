import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // Try to list models (if the API supports it)
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();

    if (data.models) {
      console.log('✅ Available models:');
      data.models.forEach(model => {
        console.log(`  - ${model.name}`);
        console.log(`    Display Name: ${model.displayName}`);
        console.log(`    Supported: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
