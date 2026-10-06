import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

if (!fs.existsSync(envPath)) {
  console.error('server/.env file does not exist');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split(/\r?\n/);

let rawKeyLine = '';
let modelLine = '';

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('GEMINI_API_KEY=')) {
    rawKeyLine = line;
  }
  if (trimmed.startsWith('GEMINI_MODEL=')) {
    modelLine = line;
  }
}

// Check parsing of key
let key = '';
let keyProblems: string[] = [];

if (!rawKeyLine) {
  keyProblems.push('GEMINI_API_KEY line missing');
} else {
  const parts = rawKeyLine.split('=');
  if (parts.length > 2) {
    keyProblems.push('Duplicated = in key line');
  }
  const val = rawKeyLine.slice(rawKeyLine.indexOf('=') + 1);
  if (val.startsWith('"') || val.endsWith('"') || val.startsWith("'") || val.endsWith("'")) {
    keyProblems.push('Contains quotes');
  }
  if (val !== val.trim()) {
    keyProblems.push('Contains leading or trailing whitespace');
  }
  key = val.trim().replace(/^['"]|['"]$/g, '');
}

const prefix = key.length >= 4 ? key.slice(0, 4) : 'TOO_SHORT';
const length = key.length;
const parsingStatus = keyProblems.length === 0 ? 'Parsing OK' : `Problem: ${keyProblems.join(', ')}`;

console.log(`[Key Check] Prefix: ${prefix}, Length: ${length}, Status: ${parsingStatus}`);

async function runChecks() {
  // 2. Call GET https://generativelanguage.googleapis.com/v1beta/models
  console.log('\nCalling GET https://generativelanguage.googleapis.com/v1beta/models ...');
  try {
    const listRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': key,
      },
    });

    console.log(`Model list HTTP status: ${listRes.status}`);

    if (listRes.ok) {
      const data = await listRes.json();
      const models = data.models || [];
      const generateModels = models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''));

      console.log(`Models supporting generateContent (${generateModels.length}):`);
      console.log(generateModels.join(', '));
      const hasGemma = generateModels.some((name: string) => name.includes('gemma'));
      console.log(`gemma-4-26b-a4b-it present?: ${hasGemma ? 'YES' : 'NO'}`);
    } else {
      const err = await listRes.json().catch(() => null);
      const reason = err?.error?.details?.[0]?.reason || err?.error?.status || err?.error?.message || 'UNKNOWN_ERROR';
      console.log(`Model list error reason: ${reason}`);
    }
  } catch (e: any) {
    console.error('Fetch error:', e.message);
  }

  // 3. Test gemma-4-26b-a4b-it with "Reply with the word OK"
  console.log('\nCalling gemma-4-26b-a4b-it with "Reply with the word OK" ...');
  const gemmaUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent';

  // Test without JSON mode
  try {
    const gemmaRes = await fetch(gemmaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the word OK' }] }],
      }),
    });

    console.log(`Gemma test HTTP status (plain): ${gemmaRes.status}`);
    if (gemmaRes.ok) {
      const body = await gemmaRes.json();
      console.log('Gemma response text:', body?.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    } else {
      const err = await gemmaRes.json().catch(() => null);
      console.log('Gemma error:', err?.error?.message || err?.error?.status || err?.error?.details?.[0]?.reason);
    }
  } catch (e: any) {
    console.error('Gemma plain fetch error:', e.message);
  }

  // Test with responseMimeType: application/json
  try {
    const gemmaJsonRes = await fetch(gemmaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the word OK' }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    console.log(`Gemma test HTTP status (JSON mode): ${gemmaJsonRes.status}`);
    if (gemmaJsonRes.ok) {
      const body = await gemmaJsonRes.json();
      console.log('Gemma JSON response text:', body?.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    } else {
      const err = await gemmaJsonRes.json().catch(() => null);
      console.log('Gemma JSON mode error:', err?.error?.message || err?.error?.status);
    }
  } catch (e: any) {
    console.error('Gemma JSON fetch error:', e.message);
  }
}

runChecks();
