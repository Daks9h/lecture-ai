import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import { getAIProvider } from './providers/index.js';
import { 
  RawStudyMaterialSchema, 
  StudyMaterialSchema, 
  StudyMaterial, 
  computeCompression, 
  normalizeConceptTags,
  RawStudyMaterial 
} from './schema.js';

const app = express();
const port = process.env.PORT || 8787;
const configuredOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const allowedOrigins = Array.from(new Set([configuredOrigin, 'http://localhost:3000', 'http://localhost:5173']));

// CORS restricted to configured CLIENT_ORIGIN and local dev origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/**
 * Helper to validate raw model output, normalize concepts, and return any error issues.
 */
function validateAndNormalize(rawOutput: unknown): {
  success: boolean;
  data?: RawStudyMaterial;
  errors: string[];
} {
  const parseResult = RawStudyMaterialSchema.safeParse(rawOutput);
  if (!parseResult.success) {
    const zodErrors = parseResult.error.issues.map(
      (iss) => `Field "${iss.path.join('.')}": ${iss.message}`
    );
    return { success: false, errors: zodErrors };
  }

  const normResult = normalizeConceptTags(parseResult.data);
  if (!normResult.success || !normResult.data) {
    return { success: false, errors: normResult.unmatched };
  }

  return { success: true, data: normResult.data, errors: [] };
}

// POST /api/analyze
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body || {};

  if (!text || typeof text !== 'string' || text.trim().length < 200) {
    res.status(400).json({
      error: 'Lecture text must be at least 200 characters long to generate high-yield study material.',
    });
    return;
  }

  try {
    const provider = getAIProvider();

    // First attempt
    let rawOutput: unknown;
    try {
      rawOutput = await provider.generateStudyMaterial(text);
    } catch (err) {
      console.error('[Analyze] Provider invocation failed (Attempt 1):', err instanceof Error ? err.message : err);
      res.status(502).json({ error: "We couldn't analyze this lecture." });
      return;
    }

    let validation = validateAndNormalize(rawOutput);

    // If validation fails, retry ONCE with validation errors included
    if (!validation.success) {
      console.warn('[Analyze] Attempt 1 failed validation. Retrying with error feedback...', validation.errors);

      try {
        const retryOutput = await provider.generateStudyMaterial(text, validation.errors);
        validation = validateAndNormalize(retryOutput);
      } catch (err) {
        console.error('[Analyze] Provider invocation failed on retry (Attempt 2):', err instanceof Error ? err.message : err);
      }
    }

    // If it still fails after retry, return 502 without exposing raw model output
    if (!validation.success || !validation.data) {
      console.error('[Analyze] Structured validation failed after retry:', validation.errors);
      res.status(502).json({ error: "We couldn't analyze this lecture." });
      return;
    }

    const validData = validation.data;

    // Server generates all ID fields itself (e.g. "kc-1", "er-1", "fc-1", "qz-1")
    const keyConceptsWithIds = validData.keyConcepts.map((kc, i) => ({
      ...kc,
      id: `kc-${i + 1}`,
    }));

    const examRadarWithIds = validData.examRadar.map((er, i) => ({
      ...er,
      id: `er-${i + 1}`,
    }));

    const flashcardsWithIds = validData.flashcards.map((fc, i) => ({
      ...fc,
      id: `fc-${i + 1}`,
    }));

    const quizWithIds = validData.quiz.map((q, i) => ({
      ...q,
      id: `qz-${i + 1}`,
    }));

    // Server computes compression metrics
    const compression = computeCompression(
      text,
      validData.quickTake,
      keyConceptsWithIds
    );

    const studyMaterial: StudyMaterial = {
      courseTitle: validData.courseTitle,
      quickTake: validData.quickTake,
      keyConcepts: keyConceptsWithIds,
      examRadar: examRadarWithIds,
      flashcards: flashcardsWithIds,
      quiz: quizWithIds,
      compression,
    };

    // Final safety parse against complete StudyMaterialSchema
    const finalVerification = StudyMaterialSchema.safeParse(studyMaterial);
    if (!finalVerification.success) {
      console.error('[Analyze] Final assembly schema mismatch:', finalVerification.error.issues);
      res.status(502).json({ error: "We couldn't analyze this lecture." });
      return;
    }

    res.json(studyMaterial);
  } catch (err) {
    console.error('[Analyze] Internal error:', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'An unexpected error occurred while analyzing the lecture.' });
  }
});

app.listen(port, () => {
  const modelName = process.env.GEMINI_MODEL;
  console.log(`[Server] LectureAI server listening on port ${port}`);
  console.log(`[Server] Loaded AI model: ${modelName || '(none configured)'}`);
  console.log(`[Server] Client origin restricted to: ${configuredOrigin}`);
});
