import { AIProvider } from './AIProvider.js';
import { GeminiProvider } from './GeminiProvider.js';

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'gemini').trim().toLowerCase();

  switch (provider) {
    case 'gemini':
      return new GeminiProvider();
    default:
      throw new Error(`Unsupported AI_PROVIDER "${provider}". Expected "gemini".`);
  }
}

export * from './AIProvider.js';
export * from './GeminiProvider.js';
