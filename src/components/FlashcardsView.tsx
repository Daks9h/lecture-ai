import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import { 
  RotateCw, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface FlashcardsViewProps {
  material: StudyMaterial | null;
  onEarnXp: (amount: number) => void;
  onGoToLecture?: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ 
  material, 
  onEarnXp,
  onGoToLecture 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  if (!material) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-8 shadow-ink text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] border-2 border-[#1C1A17] mx-auto flex items-center justify-center shadow-ink-sm">
            <Layers className="w-6 h-6 text-[#2D6A4F]" />
          </div>
          <h2 className="font-display font-black text-xl text-[#1C1A17]">No Flashcards Available</h2>
          <p className="text-xs sm:text-sm text-[#6B665E] max-w-md mx-auto">
            Synthesize or load a lecture to generate active recall flashcards.
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

  const uniqueConcepts = Array.from(new Set(material.flashcards.map((f) => f.concept)));

  const filteredCards = material.flashcards.filter((c) => {
    if (selectedTopic === 'all') return true;
    return c.concept === selectedTopic;
  });

  const card = filteredCards[currentIndex] || material.flashcards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMasterCard = () => {
    if (card && !masteredCards.includes(card.id)) {
      setMasteredCards([...masteredCards, card.id]);
      onEarnXp(10);
    }
    handleNext();
  };

  const handleRepeatLater = () => {
    handleNext();
  };

  const difficultyLabel = card ? {
    easy: 'Foundation',
    medium: 'Midterm Target',
    hard: 'Advanced',
  }[card.difficulty] : 'Foundation';

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      {/* 1. TOP STATUS & TOPIC FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#1C1A17]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#EAF4EE] border-2 border-[#1C1A17] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#2D6A4F]" />
            </span>
            <h1 className="font-display font-black text-lg text-[#1C1A17]">
              Active Recall Deck
            </h1>
          </div>
          <p className="text-xs text-[#6B665E] mt-0.5">
            Card {currentIndex + 1} of {filteredCards.length} · Spaced retrieval intervals
          </p>
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EFEA] rounded-xl border border-[#1C1A17] text-xs font-mono font-bold">
          <button
            onClick={() => { setSelectedTopic('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedTopic === 'all'
                ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                : 'text-[#6B665E]'
            }`}
          >
            All ({material.flashcards.length})
          </button>
          {uniqueConcepts.map((concept) => (
            <button
              key={concept}
              onClick={() => { setSelectedTopic(concept); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-2.5 py-1 rounded-lg transition-all truncate max-w-[140px] ${
                selectedTopic === concept
                  ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E]'
              }`}
              title={concept}
            >
              {concept.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THE 3D FLIP FLASHCARD CONTAINER */}
      {card && (
        <div 
          className="perspective-1000 w-full min-h-[300px] cursor-pointer select-none"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`relative w-full min-h-[300px] transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-6 sm:p-8 flex flex-col justify-between backface-hidden shadow-ink">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#8C867A] uppercase">
                  <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#1C1A17]/30 text-[#1C1A17] font-bold">
                    {card.concept}
                  </span>
                  <span className="flex items-center gap-1 text-[#E85D26] font-bold">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card to reveal answer</span>
                  </span>
                </div>

                <div className="my-8 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold text-[#E85D26] uppercase tracking-wider block mb-2">
                    Concept Challenge
                  </span>
                  <p className="font-display font-extrabold text-lg sm:text-xl text-[#1C1A17] leading-snug">
                    "{card.question}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#1C1A17]/10 flex items-center justify-between text-xs font-mono text-[#6B665E]">
                <span>Target: Exam Concept</span>
                <span className="px-2 py-0.5 bg-[#FAF8F5] rounded border border-[#1C1A17]/20">
                  Level: {difficultyLabel}
                </span>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 w-full h-full bg-[#FFF9F3] border-2 border-[#E85D26] rounded-2xl p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-ink">
              <div>
                <div className="flex items-center justify-between text-xs font-mono uppercase font-bold text-[#E85D26]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                    <span className="text-[#2D6A4F]">Verified Architectural Answer</span>
                  </span>
                  <span>Click to flip back</span>
                </div>

                <div className="my-6 space-y-3">
                  <p className="font-display font-black text-base sm:text-lg text-[#1C1A17] leading-relaxed">
                    {card.answer}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#1C1A17]/10 flex items-center justify-between text-xs font-mono text-[#8C867A]">
                <span>Concept: {card.concept}</span>
                <span className="text-[#2D6A4F] font-bold">Core Invariant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTROLS: SIMPLE & DELIBERATE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border-2 border-[#1C1A17] shadow-ink-press text-[#1C1A17]"
            title="Previous Card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border-2 border-[#1C1A17] shadow-ink-press text-[#1C1A17]"
            title="Next Card"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-[#6B665E] ml-2">
            Card {currentIndex + 1} of {filteredCards.length}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRepeatLater}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#1C1A17] font-display font-bold text-xs border-2 border-[#1C1A17] shadow-ink-press transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Repeat Later</span>
          </button>

          <button
            onClick={handleMasterCard}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24543E] text-white font-display font-black text-xs md:text-sm border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-ink-press transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>I Know This (+10 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
