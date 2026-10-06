export function buildAnalyzePrompt(lectureText: string, retryErrors?: string[]): string {
  const retryFeedback = retryErrors && retryErrors.length > 0
    ? `\n\nCRITICAL FIX REQUIRED: The previous attempt failed validation with these issues:
${retryErrors.map((err) => `- ${err}`).join('\n')}
You MUST fix all of these issues while maintaining the exact required JSON structure.\n`
    : '';

  return `You are LectureAI, an expert academic synthesis and exam-readiness engine.
Your task is to analyze the provided lecture text and extract a structured study package.

${retryFeedback}
LECTURE CONTENT:
"""
${lectureText}
"""

INSTRUCTIONS & STRICT RULES:
1. ONLY use information directly stated or derived in the lecture text. Do NOT invent facts or hallucinate content.
2. Use clear, engaging, student-friendly language suitable for rigorous university revision.
3. OUTPUT FORMAT: Respond ONLY with valid, minified or indented JSON matching the schema below. Do not wrap in markdown quotes if possible, or use standard application/json.
4. DO NOT generate "id" fields or "compression" fields. The server assigns all IDs and compression metrics.

JSON OUTPUT STRUCTURE:
{
  "courseTitle": "Course name/code and lecture title extracted or inferred from text",
  "quickTake": [
    "High-yield takeaway 1 (one concise sentence)",
    "High-yield takeaway 2 (one concise sentence)",
    "High-yield takeaway 3 (one concise sentence)"
  ],
  "keyConcepts": [
    {
      "title": "Exact Title of Concept 1",
      "explanation": "Clear explanation of the concept and its technical role",
      "importance": "high" | "medium" | "low",
      "keyPoints": ["Bullet 1", "Bullet 2"],
      "table": {
        "headers": ["Col 1", "Col 2"],
        "rows": [["val 1", "val 2"]]
      }
    }
  ],
  "examRadar": [
    {
      "question": "Specific question or problem formulation likely to be tested",
      "priority": "very_likely" | "important" | "good_to_know",
      "reason": "Clear explanation of why this concept matters conceptually or computationally. NEVER cite historical statistics, percentages, probabilities, or past-exam lore.",
      "concept": "Must EXACTLY match one of the keyConcepts titles above",
      "trapAlert": "Optional common misunderstanding, student pitfall, or edge case"
    }
  ],
  "flashcards": [
    {
      "question": "Focused prompt or challenge",
      "answer": "Definitive, concise solution or invariant",
      "concept": "Must EXACTLY match one of the keyConcepts titles above",
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "quiz": [
    {
      "question": "Clear multiple-choice question testing conceptual understanding or application",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // Integer 0, 1, 2, or 3 corresponding to index of correct option in options array
      "explanation": "Brief rationale explaining why the correct option is right and others are incorrect",
      "concept": "Must EXACTLY match one of the keyConcepts titles above"
    }
  ]
}

SPECIFIC CONSTRAINTS:
- "quickTake": Exactly 3 items.
- "keyConcepts": 4 to 6 items. Include a "table" ONLY when the lecture presents a clear tabular mapping, truth table, or state transition rule; otherwise omit "table".
- "examRadar": 5 to 8 items. Rank priority ("very_likely", "important", "good_to_know") based on the degree of emphasis, repetition, and core architectural prominence in the lecture. The "reason" must never claim probabilities or percentages.
- "flashcards": Exactly 8 cards.
- "quiz": Exactly 5 questions. Each must have exactly 4 plausible options, with "correctAnswer" being a number 0 to 3.
- EVERY item in "examRadar", "flashcards", and "quiz" MUST have a "concept" field that EXACTLY matches one of the "title" strings in "keyConcepts".
`;
}

export function buildChunkSummaryPrompt(chunkText: string): string {
  return `You are an academic transcription assistant.
Summarize this section of a lecture text into dense, technically rigorous notes.
Preserve all definitions, terminology, equations, algorithms, step-by-step logic, hardware invariants, and instructor emphasis.

LECTURE SECTION:
"""
${chunkText}
"""

SUMMARY NOTES:`;
}
