import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcript = fs.readFileSync(path.resolve(__dirname, '../test.txt'), 'utf-8');

async function testAnalyze() {
  console.log('Sending ~500-word transcript from server/test.txt to http://localhost:8787/api/analyze...');
  try {
    const res = await fetch('http://localhost:8787/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcript }),
    });

    console.log(`HTTP Status: ${res.status}`);
    const data = await res.json();
    if (res.ok) {
      console.log('Valid StudyMaterial received!');
      console.log('Top-level keys:', Object.keys(data));
      console.log('Number of quiz questions:', data.quiz?.length);
    } else {
      console.log('Server Error response:', data);
    }
  } catch (err: any) {
    console.error('Request failed:', err.message);
  }
}

testAnalyze();
