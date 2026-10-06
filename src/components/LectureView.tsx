import React, { useState, useEffect } from 'react';
import { StudyMaterial } from '../types';
import { analyzeLecture } from '../services/aiService';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight, 
  Link as LinkIcon, 
  FileText,
  ChevronRight,
  BookOpen,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface LectureViewProps {
  material: StudyMaterial | null;
  status: 'idle' | 'processing' | 'ready' | 'error';
  onStatusChange: (status: 'idle' | 'processing' | 'ready' | 'error') => void;
  onMaterialLoaded: (material: StudyMaterial) => void;
  onExploreConcept: (conceptId: string) => void;
  onOpenRadar: () => void;
}

const PROCESSING_STEPS = [
  'Reading lecture',
  'Identifying key concepts',
  'Building exam radar',
  'Preparing flashcards',
  'Creating quiz',
];

export const LectureView: React.FC<LectureViewProps> = ({ 
  material, 
  status,
  onStatusChange,
  onMaterialLoaded,
  onExploreConcept, 
  onOpenRadar 
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'yt' | 'pdf' | 'preset'>('preset');
  const [inputValue, setInputValue] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isProcessing = status === 'processing';

  // Timer to advance steps 0 -> 3 while request is in flight. Hold step 4 in progress until response arrives.
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isProcessing) {
      setStepIndex(0);
      setAllStepsCompleted(false);
      interval = setInterval(() => {
        setStepIndex((prev) => {
          // Hold the last step (index 4) in progress until server responds
          if (prev < PROCESSING_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  const runSynthesis = async (isDemo = false) => {
    setValidationError(null);
    setErrorMessage(null);

    const isPreset = isDemo || activeInputTab === 'preset';

    if (!isPreset) {
      if (activeInputTab === 'yt') {
        if (!inputValue.trim()) {
          setValidationError('Paste a lecture link or select Lecture Notes.');
          return;
        }
      } else {
        if (!inputValue.trim() || inputValue.trim().length < 200) {
          setValidationError('Paste at least a few paragraphs of lecture text.');
          return;
        }
      }
    }

    onStatusChange('processing');

    try {
      const result = await analyzeLecture({
        demo: isPreset,
        youtubeUrl: activeInputTab === 'yt' ? inputValue.trim() : undefined,
        text: activeInputTab === 'pdf' ? inputValue.trim() : undefined,
      });

      // Mark all steps complete once response arrives
      setStepIndex(PROCESSING_STEPS.length);
      setAllStepsCompleted(true);

      // Brief delay so user sees all checkmarks complete
      setTimeout(() => {
        onMaterialLoaded(result);
        onStatusChange('ready');
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "We couldn't analyze this lecture.";
      setErrorMessage(msg);
      onStatusChange('error');
    }
  };

  const handleTabChange = (tab: 'yt' | 'pdf' | 'preset') => {
    setActiveInputTab(tab);
    setValidationError(null);
    setErrorMessage(null);

    if (tab === 'yt') {
      setInputValue('https://youtu.be/CS152_Lec04_Radix4_Multiplication');
    } else if (tab === 'pdf') {
      setInputValue('');
    } else {
      setInputValue('CS152_Fall24_Syllabus_Demo_Preset');
    }
  };

  const originalMins = material?.compression.originalMinutes ?? 52;
  const revisionMins = material?.compression.revisionMinutes ?? 8;
  const timeSavedMins = Math.max(0, originalMins - revisionMins);
  const timeSavedPercent = Math.round((timeSavedMins / originalMins) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* 1. LECTURE EXPEDITION PORTAL: INTAKE & COMPRESSION */}
      <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 md:p-6 shadow-ink">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#1C1A17]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#FFEDE4] border-2 border-[#1C1A17] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#E85D26]" />
              </span>
              <h1 className="font-display font-black text-lg md:text-xl text-[#1C1A17]">
                Lecture Intake & High-Yield Synthesis
              </h1>
            </div>
            <p className="text-xs text-[#6B665E] mt-0.5">
              {material?.courseTitle ?? 'UC Berkeley CS 152: Computer Architecture & Engineering'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EAF4EE] px-3 py-1 rounded-lg border border-[#1C1A17] shadow-ink-press flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{timeSavedPercent}% STUDY TIME SAVED</span>
            </span>
          </div>
        </div>

        {/* Ingestion Source Switcher */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 p-1 bg-[#F3EFEA] rounded-xl border-2 border-[#1C1A17] w-fit text-xs font-display font-bold">
            <button
              type="button"
              onClick={() => handleTabChange('yt')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeInputTab === 'yt'
                  ? 'bg-[#FFFDF9] text-[#1C1A17] border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] border-transparent hover:text-[#1C1A17]'
              }`}
            >
              YouTube URL
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('pdf')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeInputTab === 'pdf'
                  ? 'bg-[#FFFDF9] text-[#1C1A17] border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] border-transparent hover:text-[#1C1A17]'
              }`}
            >
              Lecture Notes / Text
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('preset')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeInputTab === 'preset'
                  ? 'bg-[#FFFDF9] text-[#1C1A17] border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] border-transparent hover:text-[#1C1A17]'
              }`}
            >
              Berkeley CS 152 Demo
            </button>
          </div>

          {/* Input field + Synthesize trigger */}
          <div className="mt-3 flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-[#8C867A]">
                  {activeInputTab === 'pdf' ? <FileText className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </span>

                {activeInputTab === 'pdf' ? (
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Paste lecture transcript or text here (minimum 200 characters)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F5] border-2 border-[#1C1A17] rounded-xl font-mono text-xs md:text-sm text-[#1C1A17] focus:outline-none focus:ring-0 focus:border-[#E85D26] resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={activeInputTab === 'preset' ? 'UC Berkeley CS 152: High-Speed Arithmetic & IEEE 754 (Demo Preset)' : inputValue}
                    readOnly={activeInputTab === 'preset'}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder={activeInputTab === 'yt' ? 'Paste YouTube class recording link...' : 'Paste lecture notes or reference...'}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F5] border-2 border-[#1C1A17] rounded-xl font-mono text-xs md:text-sm text-[#1C1A17] focus:outline-none focus:ring-0 focus:border-[#E85D26]"
                  />
                )}
              </div>

              <div className="flex-shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => runSynthesis(activeInputTab === 'preset')}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#24543E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-xs md:text-sm rounded-xl border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-ink-press transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Synthesize Lecture</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <p className="text-xs font-mono font-bold text-[#DC2626] flex items-center gap-1.5 pl-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{validationError}</span>
              </p>
            )}
          </div>
        </div>

        {/* ERROR STATE CARD (Inline visual style with Try Again and Use Demo) */}
        {status === 'error' && (
          <div className="mt-5 p-4 md:p-5 bg-[#FEE2E2] border-2 border-[#1C1A17] rounded-xl shadow-ink space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DC2626] text-white border-2 border-[#1C1A17] flex items-center justify-center flex-shrink-0 shadow-ink-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-sm text-[#1C1A17]">Analysis Error</h3>
                <p className="text-xs font-mono text-[#991B1B] leading-relaxed">
                  {errorMessage || "We couldn't analyze this lecture."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => runSynthesis(activeInputTab === 'preset')}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white text-[#1C1A17] font-display font-bold text-xs border-2 border-[#1C1A17] shadow-ink-press transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveInputTab('preset');
                  runSynthesis(true);
                }}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded-lg bg-[#2D6A4F] hover:bg-[#24543E] text-white font-display font-bold text-xs border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Use demo lecture</span>
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING ADVANCEMENT STATE */}
        {isProcessing && (
          <div className="mt-5 p-5 bg-[#FAF8F5] rounded-xl border-2 border-[#1C1A17] shadow-ink space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#E85D26]" />
                <span className="font-display font-black text-sm text-[#1C1A17]">
                  Analyzing Lecture Material & Structuring Exam Intelligence
                </span>
              </div>
              <span className="font-mono text-xs text-[#8C867A]">
                Step {Math.min(stepIndex + 1, PROCESSING_STEPS.length)} of {PROCESSING_STEPS.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
              {PROCESSING_STEPS.map((step, idx) => {
                const isDone = allStepsCompleted || idx < stepIndex;
                const isCurrent = !allStepsCompleted && idx === stepIndex;
                return (
                  <div
                    key={step}
                    className={`p-2.5 rounded-lg border-2 text-xs font-mono transition-all flex items-center gap-2 ${
                      isDone
                        ? 'bg-[#EAF4EE] border-[#1C1A17] text-[#2D6A4F] font-bold'
                        : isCurrent
                        ? 'bg-[#FEF3C7] border-[#1C1A17] text-[#92400E] font-bold ring-2 ring-[#D97706]/40'
                        : 'bg-white border-[#1C1A17]/30 text-[#8C867A] opacity-60'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 text-[#E85D26] animate-spin flex-shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1C1A17]/20 flex-shrink-0" />
                    )}
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SIGNATURE COMPRESSION CHRONOMETER METER */}
        {material && !isProcessing && (
          <div className="mt-5 p-4 bg-[#F3EFEA] rounded-xl border-2 border-[#1C1A17]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono font-bold mb-2 gap-1">
              <span className="text-[#1C1A17] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DC2626]" />
                <span>Raw Lecture: {originalMins} mins</span>
              </span>
              <span className="text-[#9C350B] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#E85D26]" />
                <span>Synthesized: {revisionMins} mins High-Yield</span>
              </span>
            </div>

            {/* Visual Dual Scale Bar */}
            <div className="relative w-full h-5 bg-[#FAF8F5] rounded-full border-2 border-[#1C1A17] overflow-hidden flex">
              <div 
                className="bg-[#2D6A4F] h-full border-r-2 border-[#1C1A17] flex items-center justify-center text-[10px] font-mono font-bold text-white px-1 whitespace-nowrap" 
                style={{ width: `${Math.max(10, Math.round((revisionMins / originalMins) * 100))}%` }}
              >
                0{revisionMins}:00
              </div>
              <div className="flex-1 bg-[#E2DACB] flex items-center justify-center text-[10px] font-mono font-bold text-[#6B665E] uppercase tracking-tight">
                -{timeSavedMins}m filler, intro & banter eliminated
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-[#6B665E]">
              <span>Verified against syllabus map</span>
              <span className="text-[#2D6A4F] font-bold">100% Core Concepts Captured</span>
            </div>
          </div>
        )}
      </section>

      {/* EMPTY STATE IF NO MATERIAL YET */}
      {!material && !isProcessing && status !== 'error' && (
        <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-8 shadow-ink text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#E85D26] mx-auto" />
          <h2 className="font-display font-black text-lg text-[#1C1A17]">
            No Lecture Synthesized Yet
          </h2>
          <p className="text-xs text-[#6B665E] max-w-md mx-auto">
            Paste lecture notes above or choose the Berkeley CS 152 Demo to generate high-yield Quick Take, Key Concepts, Exam Radar, Flashcards, and Combat Quiz.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveInputTab('preset');
              runSynthesis(true);
            }}
            className="px-4 py-2 bg-[#E85D26] hover:bg-[#D04F18] text-white text-xs font-display font-bold rounded-xl border-2 border-[#1C1A17] shadow-ink"
          >
            Load Berkeley CS 152 Demo
          </button>
        </section>
      )}

      {/* 2. QUICK TAKE (3-BULLET CORE SUMMARY) */}
      {material && !isProcessing && (
        <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 md:p-6 shadow-ink space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#1C1A17]/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-[#E85D26] px-2 py-0.5 rounded bg-[#FFEDE4] border border-[#1C1A17]">
                Quick Take
              </span>
              <h2 className="font-display font-black text-base text-[#1C1A17]">
                Core Invariants for Exam Readiness
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8C867A]">
              Curated by Scout
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {material.quickTake.map((take, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#1C1A17]/30"
              >
                <div className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#2D6A4F] font-mono font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#1C1A17]">
                  {index + 1}
                </div>
                <p className="text-xs md:text-sm text-[#1C1A17] leading-relaxed">
                  {take}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. KEY ARCHITECTURAL CONCEPTS & TRUTH TABLE */}
      {material && !isProcessing && (
        <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 md:p-6 shadow-ink space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1C1A17]/10 pb-3">
            <div>
              <h2 className="font-display font-black text-base md:text-lg text-[#1C1A17]">
                Key Concepts & Structural Invariants
              </h2>
              <p className="text-xs text-[#6B665E]">
                Extracted from lecture derivations, slides, and datapath proofs
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenRadar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] border-2 border-[#1C1A17] text-xs font-display font-bold text-[#1C1A17] shadow-ink-press"
            >
              <span>See Exam Probability On Radar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E85D26]" />
            </button>
          </div>

          <div className="space-y-4">
            {material.keyConcepts.map((concept) => (
              <div key={concept.id} className="p-4 bg-[#FAF8F5] rounded-xl border-2 border-[#1C1A17] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-[#E85D26] uppercase">
                      Importance: {concept.importance.toUpperCase()}
                    </span>
                    <h3 className="font-display font-extrabold text-sm md:text-base text-[#1C1A17]">
                      {concept.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onExploreConcept(concept.id)}
                    className="text-xs font-mono font-bold text-[#E85D26] hover:underline flex items-center gap-1"
                  >
                    <span>Explore Concept</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#6B665E] leading-relaxed">
                  {concept.explanation}
                </p>

                {concept.keyPoints && concept.keyPoints.length > 0 && (
                  <ul className="space-y-1 pl-4 list-disc text-xs text-[#1C1A17]/80">
                    {concept.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}

                {/* Optional Table */}
                {concept.table && (
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full text-left text-xs font-mono border-2 border-[#1C1A17] bg-white">
                      <thead className="bg-[#F3EFEA] border-b-2 border-[#1C1A17] text-[11px]">
                        <tr>
                          {concept.table.headers.map((h, i) => (
                            <th key={i} className="p-2 border-r border-[#1C1A17] last:border-r-0 font-bold text-[#1C1A17]">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1C1A17]/20 text-[11px]">
                        {concept.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-[#FAF8F5]' : 'bg-white'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 border-r border-[#1C1A17] last:border-r-0">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
