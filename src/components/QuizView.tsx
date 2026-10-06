import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  Award,
  HelpCircle
} from 'lucide-react';
import { ScoutMark } from './Illustrations';

interface QuizViewProps {
  material: StudyMaterial | null;
  onEarnXp: (amount: number) => void;
  onCompleteQuiz: () => void;
  onGoToLecture?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
  material, 
  onEarnXp, 
  onCompleteQuiz,
  onGoToLecture 
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!material) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-8 shadow-ink text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFEDE4] border-2 border-[#1C1A17] mx-auto flex items-center justify-center shadow-ink-sm">
            <HelpCircle className="w-6 h-6 text-[#E85D26]" />
          </div>
          <h2 className="font-display font-black text-xl text-[#1C1A17]">No Quiz Arena Available</h2>
          <p className="text-xs sm:text-sm text-[#6B665E] max-w-md mx-auto">
            Synthesize or load a lecture to generate combat quiz questions and test your understanding.
          </p>
          <button
            onClick={onGoToLecture}
            className="px-5 py-2.5 rounded-xl bg-[#E85D26] hover:bg-[#D04F18] text-white font-display font-black text-xs md:text-sm border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2"
          >
            <span>Go to Lecture Tab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const question = material.quiz[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (answered) return;
    setSelectedOptionIdx(optIdx);
    setAnswered(true);

    const isCorrect = optIdx === question.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      onEarnXp(20);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < material.quiz.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const scorePct = Math.round((correctCount / material.quiz.length) * 100);

    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-6 sm:p-8 shadow-ink text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF4EE] border-2 border-[#1C1A17] mx-auto flex items-center justify-center shadow-ink-sm">
            <Award className="w-8 h-8 text-[#2D6A4F]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-[#2D6A4F]">
              Assessment Complete
            </span>
            <h2 className="text-2xl font-display font-black text-[#1C1A17]">
              Combat Arena Results: {scorePct}% Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B665E]">
              You answered {correctCount} of {material.quiz.length} questions correctly.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border-2 border-[#1C1A17] max-w-sm mx-auto text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span>Total XP Awarded:</span>
              <strong className="text-[#2D6A4F]">+{correctCount * 20} XP</strong>
            </div>
            <div className="flex justify-between">
              <span>Exam Readiness Delta:</span>
              <strong className="text-[#2D6A4F]">+{correctCount * 4}%</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border-2 border-[#1C1A17] font-display font-bold text-xs text-[#1C1A17] flex items-center justify-center gap-1.5 shadow-ink-press"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Assessment</span>
            </button>
            <button
              onClick={onCompleteQuiz}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E85D26] hover:bg-[#D04F18] text-white font-display font-black text-xs md:text-sm border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-ink-press transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Knowledge Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSelectedCorrect = selectedOptionIdx === question.correctAnswer;

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      {/* 1. QUIZ HEADER */}
      <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-4 sm:p-5 shadow-ink-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#E85D26] text-white font-mono font-black text-xs border border-[#1C1A17]">
            QUESTION {currentIdx + 1} / {material.quiz.length}
          </span>
          <h1 className="font-display font-black text-base md:text-lg text-[#1C1A17]">
            Adaptive Combat Quiz
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#6B665E]">
            <Clock className="w-3.5 h-3.5" />
            <span>45s suggested</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#2D6A4F] bg-[#EAF4EE] px-2.5 py-1 rounded-lg border border-[#1C1A17]">
            <Zap className="w-3.5 h-3.5" />
            <span>+20 XP</span>
          </div>
        </div>
      </div>

      {/* 2. QUESTION STATEMENT */}
      <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 sm:p-6 shadow-ink space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#8C867A]">
          <span className="text-[#E85D26] font-bold uppercase">
            {question.concept}
          </span>
          <span>Core Invariant</span>
        </div>

        <p className="font-display font-extrabold text-base sm:text-lg text-[#1C1A17] leading-relaxed">
          {question.question}
        </p>

        {/* 3. MULTIPLE-CHOICE OPTIONS */}
        <div className="space-y-2.5 pt-2">
          {question.options.map((optText, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
            const isSelected = selectedOptionIdx === idx;
            const isCorrectOption = idx === question.correctAnswer;
            let btnStyle = 'bg-[#FAF8F5] border-[#1C1A17] text-[#1C1A17] hover:bg-[#F3EFEA]';

            if (answered) {
              if (isCorrectOption) {
                btnStyle = 'bg-[#EAF4EE] border-[#2D6A4F] text-[#1C1A17] ring-2 ring-[#2D6A4F]';
              } else if (isSelected && !isCorrectOption) {
                btnStyle = 'bg-[#FEE2E2] border-[#DC2626] text-[#1C1A17]';
              } else {
                btnStyle = 'bg-[#FAF8F5] border-[#1C1A17]/30 text-[#8C867A] opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={answered}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 shadow-ink-press ${btnStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg border border-[#1C1A17] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5 ${
                    answered && isCorrectOption
                      ? 'bg-[#2D6A4F] text-white'
                      : isSelected && answered && !isCorrectOption
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#F3EFEA] text-[#1C1A17]'
                  }`}
                >
                  {letter}
                </span>

                <span className="text-xs sm:text-sm font-sans font-medium flex-1 pt-0.5">
                  {optText}
                </span>

                {answered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] flex-shrink-0 mt-0.5" />
                )}
                {answered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. REAL-TIME FEEDBACK CALLOUT (REVEALED ON SELECTION) */}
      {answered && (
        <div
          className={`p-4 rounded-xl border-2 border-[#1C1A17] shadow-ink-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isSelectedCorrect ? 'bg-[#EAF4EE]' : 'bg-[#FEF3C7]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#1C1A17] flex items-center justify-center flex-shrink-0 shadow-ink-press">
              <ScoutMark size={28} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#1C1A17] uppercase">
                  {isSelectedCorrect ? 'Accurate Response' : 'Hardware Correction'}
                </span>
                {isSelectedCorrect && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#2D6A4F] text-white">
                    +20 XP
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#1C1A17] leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#24543E] text-white font-display font-black text-xs md:text-sm rounded-xl border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-ink-press transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <span>{currentIdx + 1 < material.quiz.length ? 'Next Question' : 'Complete Quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
