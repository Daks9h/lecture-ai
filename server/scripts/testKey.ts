import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let rawKey = process.env.GEMINI_API_KEY || '';
let key = rawKey.trim();
if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
  key = key.slice(1, -1).trim();
}

const models = ['gemini-3.8-flash', 'gemma-4-26b-a4b-it'];

interface TestResult {
  model: string;
  method: string;
  httpStatus: number | string;
  result: string;
}

const results: TestResult[] = [];

async function testHeader(model: string): Promise<TestResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the word OK' }] }],
      }),
    });
    const status = res.status;
    if (res.ok) {
      return { model, method: 'REST (header: x-goog-api-key)', httpStatus: status, result: 'OK' };
    } else {
      const errBody = await res.json().catch(() => null);
      const reason = errBody?.error?.message || errBody?.error?.status || `Error ${status}`;
      return { model, method: 'REST (header: x-goog-api-key)', httpStatus: status, result: reason };
    }
  } catch (e: any) {
    return { model, method: 'REST (header: x-goog-api-key)', httpStatus: 'NET_ERR', result: e.message || 'Fetch failed' };
  }
}

async function testQueryParam(model: string): Promise<TestResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the word OK' }] }],
      }),
    });
    const status = res.status;
    if (res.ok) {
      return { model, method: 'REST (query: ?key=)', httpStatus: status, result: 'OK' };
    } else {
      const errBody = await res.json().catch(() => null);
      const reason = errBody?.error?.message || errBody?.error?.status || `Error ${status}`;
      return { model, method: 'REST (query: ?key=)', httpStatus: status, result: reason };
    }
  } catch (e: any) {
    return { model, method: 'REST (query: ?key=)', httpStatus: 'NET_ERR', result: e.message || 'Fetch failed' };
  }
}

async function testSDK(model: string): Promise<TestResult> {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const res = await ai.models.generateContent({
      model,
      contents: 'Reply with the word OK',
    });
    const text = res.text?.trim() || '';
    return { model, method: '@google/genai SDK', httpStatus: 200, result: text ? 'OK' : 'Empty text response' };
  } catch (e: any) {
    const status = e.status || e.statusCode || 'SDK_ERR';
    const reason = e.message || 'Unknown error';
    return { model, method: '@google/genai SDK', httpStatus: status, result: reason };
  }
}

async function testBearer(model: string): Promise<TestResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the word OK' }] }],
      }),
    });
    const status = res.status;
    if (res.ok) {
      return { model, method: 'REST (header: Authorization Bearer)', httpStatus: status, result: 'OK' };
    } else {
      const errBody = await res.json().catch(() => null);
      const reason = errBody?.error?.message || errBody?.error?.status || `Error ${status}`;
      return { model, method: 'REST (header: Authorization Bearer)', httpStatus: status, result: reason };
    }
  } catch (e: any) {
    return { model, method: 'REST (header: Authorization Bearer)', httpStatus: 'NET_ERR', result: e.message || 'Fetch failed' };
  }
}

async function main() {
  console.log('Testing configured API key against requested models...');
  console.log(`Key length: ${key.length}`);
  console.log(`Key starts with 'AIza': ${key.startsWith('AIza')}`);
  console.log(`Key starts with 'ya29': ${key.startsWith('ya29')}\n`);

  for (const model of models) {
    const r1 = await testHeader(model);
    results.push(r1);

    const r2 = await testQueryParam(model);
    results.push(r2);

    const r3 = await testBearer(model);
    results.push(r3);

    const r4 = await testSDK(model);
    results.push(r4);
  }

  // Format table output
  console.log('| Model | Method | HTTP Status | OK or Error Reason |');
  console.log('|---|---|---|---|');
  for (const r of results) {
    // Sanitize reason to ensure no key is printed
    const safeReason = r.result.replace(/[A-Za-z0-9_-]{20,}/g, '[REDACTED]');
    console.log(`| ${r.model} | ${r.method} | ${r.httpStatus} | ${safeReason} |`);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err.message);
});
