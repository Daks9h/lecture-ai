import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { GeminiProvider } from '../src/providers/GeminiProvider.js';

async function testDirect() {
  const transcript = fs.readFileSync(path.resolve(__dirname, '../test.txt'), 'utf-8');
  const provider = new GeminiProvider();
  console.log('Testing GeminiProvider directly with transcript...');
  try {
    const result = await provider.generateStudyMaterial(transcript);
    console.log('Result parsed successfully!');
    console.log('Keys:', Object.keys(result as object));
  } catch (err: any) {
    console.error('Provider failed:', err);
  }
}

testDirect();
