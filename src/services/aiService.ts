import { StudyMaterial } from '../types';
import { demoMaterial } from '../data/demoLecture';

export interface AnalyzeLectureInput {
  text?: string;
  youtubeUrl?: string;
  file?: File;
  demo?: boolean;
}

export async function analyzeLecture(input: AnalyzeLectureInput): Promise<StudyMaterial> {
  // 1. Demo mode: return local demoMaterial immediately (no network call, works with backend off)
  if (input.demo) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return demoMaterial;
  }

  // 2. Unsupported input types for now
  if (input.youtubeUrl || input.file) {
    throw new Error("This input type isn't available yet. Paste the lecture text instead.");
  }

  const rawText = input.text?.trim() || '';
  if (!rawText || rawText.length < 200) {
    throw new Error('Paste at least a few paragraphs of lecture text.');
  }

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/+$/, '');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 90000); // 90 seconds timeout

  try {
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: rawText }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = "We couldn't analyze this lecture.";
      try {
        const errorJson = await response.json();
        if (errorJson && typeof errorJson.error === 'string') {
          errorMessage = errorJson.error;
        }
      } catch {
        // Fallback to default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as StudyMaterial;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Analysis timed out after 90 seconds. Please try again.');
      }
      if (
        err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('Load failed') ||
        err.message.includes('fetch failed')
      ) {
        throw new Error("Can't reach the server. Is the backend running?");
      }
      throw err;
    }

    throw new Error("Can't reach the server. Is the backend running?");
  }
}
