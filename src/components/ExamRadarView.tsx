import React, { useState } from 'react';
import { StudyMaterial, ExamRadarItem } from '../types';
import { 
  Radar, 
  Flame, 
  Star, 
  Layers, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { RadarCompassGraphic } from './Illustrations';

interface ExamRadarViewProps {
  material: StudyMaterial | null;
  onTrainTopic: (conceptTitle: string) => void;
  onGoToLecture?: () => void;
}

export const ExamRadarView: React.FC<ExamRadarViewProps> = ({ 
  material, 
  onTrainTopic,
  onGoToLecture 
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'very_likely' | 'important' | 'good_to_know'>('all');

  if (!material) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-8 shadow-ink text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border-2 border-[#1C1A17] mx-auto flex items-center justify-center shadow-ink-sm">
            <Radar className="w-6 h-6 text-[#D97706]" />
          </div>
          <h2 className="font-display font-black text-xl text-[#1C1A17]">No Exam Radar Available</h2>
          <p className="text-xs sm:text-sm text-[#6B665E] max-w-md mx-auto">
            Synthesize or load a lecture first to generate predictive exam questions, priority tiers, and trap alerts.
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

  const filteredConcepts = material.examRadar.filter((item) => {
    if (filterTier === 'all') return true;
    return item.priority === filterTier;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* 1. EXAM RADAR HERO BANNER */}
      <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 md:p-7 shadow-ink relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#FEF3C7] border-2 border-[#1C1A17] flex items-center justify-center">
                <Radar className="w-5 h-5 text-[#D97706]" />
              </span>
              <span className="font-mono text-xs font-black uppercase text-[#D97706]">
                Signature Intelligence Engine
              </span>
            </div>

            <h1 className="font-display font-black text-xl md:text-2xl text-[#1C1A17] tracking-tight">
              Exam Radar: Midterm Bounty Board
            </h1>

            <p className="text-xs md:text-sm text-[#6B665E] leading-relaxed max-w-2xl">
              Most tools summarize what was said in class. <strong className="text-[#1C1A17]">LectureAI predicts what will be on your exam</strong> by cross-referencing lecture concepts against core examination patterns.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-[#FEE2E2] text-[#991B1B] border border-[#1C1A17] rounded-lg font-bold">
                Very Likely
              </span>
              <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#1C1A17] rounded-lg font-bold">
                Important
              </span>
              <span className="px-2.5 py-1 bg-[#F3EFEA] text-[#6B665E] border border-[#1C1A17] rounded-lg font-bold">
                Good to Know
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-center">
            <div className="p-2 bg-[#FAF8F5] rounded-2xl border-2 border-[#1C1A17] shadow-ink-sm">
              <RadarCompassGraphic />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t-2 border-[#1C1A17]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F3EFEA] rounded-xl border border-[#1C1A17] text-xs font-display font-bold">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTier === 'all'
                  ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] hover:text-[#1C1A17]'
              }`}
            >
              All Topics ({material.examRadar.length})
            </button>
            <button
              onClick={() => setFilterTier('very_likely')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTier === 'very_likely'
                  ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] hover:text-[#1C1A17]'
              }`}
            >
              Very Likely
            </button>
            <button
              onClick={() => setFilterTier('important')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTier === 'important'
                  ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] hover:text-[#1C1A17]'
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilterTier('good_to_know')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTier === 'good_to_know'
                  ? 'bg-white text-[#1C1A17] border border-[#1C1A17] shadow-ink-press'
                  : 'text-[#6B665E] hover:text-[#1C1A17]'
              }`}
            >
              Good to Know
            </button>
          </div>

          <span className="text-xs font-mono text-[#8C867A]">
            Sort: Priority Tier
          </span>
        </div>
      </section>

      {/* 2. BOUNTY BOARD CARDS */}
      <section className="space-y-4">
        {filteredConcepts.map((item) => {
          const isVeryLikely = item.priority === 'very_likely';
          const isImportant = item.priority === 'important';
          const isGoodToKnow = item.priority === 'good_to_know';

          return (
            <div
              key={item.id}
              className={`border-2 border-[#1C1A17] rounded-xl p-4 md:p-5 shadow-ink transition-all ${
                isVeryLikely
                  ? 'bg-[#FFFDF9]'
                  : isImportant
                  ? 'bg-[#FEF3C7]/40'
                  : 'bg-[#FAF8F5]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Metadata, Title, Why it matters */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority Tier Tag */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-black border border-[#1C1A17] flex items-center gap-1.5 ${
                        isVeryLikely
                          ? 'bg-[#DC2626] text-white'
                          : isImportant
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#FAF8F5] text-[#1C1A17]'
                      }`}
                    >
                      {isVeryLikely && <Flame className="w-3.5 h-3.5" />}
                      {isImportant && <Star className="w-3.5 h-3.5" />}
                      {isGoodToKnow && <Layers className="w-3.5 h-3.5" />}
                      <span>
                        {isVeryLikely
                          ? 'VERY LIKELY'
                          : isImportant
                          ? 'IMPORTANT'
                          : 'GOOD TO KNOW'}
                      </span>
                    </span>

                    <span className="text-xs font-mono font-bold text-[#E85D26] bg-[#FFEDE4] px-2 py-0.5 rounded border border-[#1C1A17]/30">
                      {item.concept}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-base md:text-lg text-[#1C1A17]">
                    {item.question}
                  </h3>

                  <p className="text-xs md:text-sm text-[#1C1A17]/80 leading-relaxed max-w-3xl">
                    <strong className="text-[#1C1A17]">Why it matters:</strong> {item.reason}
                  </p>

                  {/* Trap Alert if present */}
                  {item.trapAlert && (
                    <div className="p-2.5 bg-[#FEE2E2] rounded-lg border border-[#DC2626]/40 text-xs font-mono text-[#991B1B] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
                      <span>
                        <strong>Exam Trap Flagged:</strong> {item.trapAlert}
                      </span>
                    </div>
                  )}

                  {/* Mastery Progress Bar */}
                  <div className="flex items-center gap-3 pt-1 text-xs font-mono text-[#6B665E]">
                    <span>Your Mastery: <strong className="text-[#2D6A4F]">70%</strong></span>
                    <div className="w-32 h-2.5 bg-[#FAF8F5] rounded-full border border-[#1C1A17] overflow-hidden">
                      <div className="h-full rounded-full bg-[#D97706]" style={{ width: '70%' }} />
                    </div>
                    <span>Active Target</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1C1A17]/10">
                  <button
                    onClick={() => onTrainTopic(item.concept)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#E85D26] hover:bg-[#D04F18] text-white font-display font-black text-xs md:text-sm border-2 border-[#1C1A17] shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-ink-press transition-all"
                  >
                    <span>TRAIN THIS</span>
                    <span className="font-mono text-[10px] bg-[#9C350B] px-1.5 py-0.5 rounded">
                      +{isVeryLikely ? '25 XP' : '15 XP'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
