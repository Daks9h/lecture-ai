import React from 'react';
import { LEGACY_CONCEPTS as CONCEPTS } from '../data/courseStats';
import { UserStats, ScreenTab } from '../types';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  Target, 
  TrendingUp,
  BookOpen,
  HelpCircle,
  Layers,
  Award
} from 'lucide-react';

interface KnowledgeScoreViewProps {
  stats: UserStats;
  onLaunchRevision: (conceptId: string) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const KnowledgeScoreView: React.FC<KnowledgeScoreViewProps> = ({
  stats,
  onLaunchRevision,
  onNavigate,
}) => {
  const masteredConcepts = CONCEPTS.filter((c) => c.status === 'mastered');
  const weakConcepts = CONCEPTS.filter((c) => c.status === 'weak' || c.status === 'learning');

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* 1. SCORE OVERVIEW HEADER */}
      <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 md:p-7 shadow-ink flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#EAF4EE] border-2 border-[#1C1A17] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#2D6A4F]" />
            </span>
            <span className="font-mono text-xs font-bold uppercase text-[#2D6A4F]">
              Academic Telemetry & Readiness
            </span>
          </div>

          <h1 className="font-display font-black text-xl md:text-2xl text-[#1C1A17] tracking-tight">
            CS 152 Knowledge Map & Score
          </h1>

          <p className="text-xs md:text-sm text-[#6B665E] max-w-xl leading-relaxed">
            Overall midterm coverage stands at <strong className="text-[#1C1A17]">{stats.masteryOverall}%</strong>. You have 2 mastered branches, 1 learning node, and 1 flagged weak area requiring immediate revision.
          </p>
        </div>

        {/* Large Score Dial Card */}
        <div className="bg-[#FAF8F5] border-2 border-[#1C1A17] rounded-xl p-5 text-center min-w-[200px] shadow-ink-sm flex-shrink-0">
          <div className="text-[11px] font-mono text-[#8C867A] uppercase font-bold">
            Predicted Midterm Score
          </div>
          <div className="text-4xl font-display font-black text-[#2D6A4F] my-1">
            {stats.masteryOverall}%
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#2D6A4F] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#2D6A4F]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Grade Projection: A-</span>
          </div>
        </div>
      </section>

      {/* 2. THE SIGNATURE LEARNING LOOP ARCHITECTURE */}
      <section className="bg-[#FAF8F5] border-2 border-[#1C1A17] rounded-xl p-5 shadow-ink-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1C1A17]/10 pb-2">
          <span className="text-xs font-mono font-extrabold uppercase text-[#1C1A17] flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#E85D26]" />
            THE LECTUREAI LEARNING LOOP
          </span>
          <span className="text-xs font-mono text-[#8C867A]">
            Continuous Reinforcement Cycle
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {[
            { step: '01', title: 'WATCH', subtitle: '52m raw', tab: 'lecture' as ScreenTab },
            { step: '02', title: 'UNDERSTAND', subtitle: '8m high-yield', tab: 'lecture' as ScreenTab },
            { step: '03', title: 'TEST', subtitle: 'Combat quiz', tab: 'quiz' as ScreenTab },
            { step: '04', title: 'FIX', subtitle: 'Weak concepts', tab: 'radar' as ScreenTab },
            { step: '05', title: 'REVISE', subtitle: 'Spaced recall', tab: 'flashcards' as ScreenTab },
          ].map((item, idx) => (
            <button
              key={item.step}
              onClick={() => onNavigate(item.tab)}
              className="p-3 bg-white border-2 border-[#1C1A17] rounded-xl text-left hover:bg-[#FFFDF9] transition-all shadow-ink-press"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#8C867A]">
                <span>{item.step}</span>
                {idx < 3 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D26]" />
                )}
              </div>
              <div className="font-display font-black text-xs text-[#1C1A17] mt-1">
                {item.title}
              </div>
              <div className="text-[10px] font-mono text-[#6B665E]">
                {item.subtitle}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. SYLLABUS BRANCHES: MASTERED VS WEAK NODES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Strong / Mastered Concepts */}
        <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 shadow-ink space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1C1A17]/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="font-display font-black text-base text-[#1C1A17]">
                Mastered Topics ({masteredConcepts.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#2D6A4F] font-bold">
              Retention: &gt;80%
            </span>
          </div>

          <div className="space-y-3">
            {masteredConcepts.map((concept) => (
              <div 
                key={concept.id}
                className="p-3.5 bg-[#FAF8F5] border-2 border-[#1C1A17] rounded-xl space-y-2 shadow-ink-press"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-[#1C1A17]">
                    {concept.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#2D6A4F]">
                    {concept.mastery}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E2DACB] rounded-full border border-[#1C1A17] overflow-hidden">
                  <div className="bg-[#2D6A4F] h-full rounded-full" style={{ width: `${concept.mastery}%` }} />
                </div>
                <p className="text-[11px] text-[#6B665E]">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Weak / Targeted Revision Needed */}
        <section className="bg-[#FFFDF9] border-2 border-[#1C1A17] rounded-2xl p-5 shadow-ink space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1C1A17]/10 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
              <h2 className="font-display font-black text-base text-[#1C1A17]">
                Priority Revision Topics ({weakConcepts.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#DC2626] font-bold">
              High Exam Impact
            </span>
          </div>

          <div className="space-y-3">
            {weakConcepts.map((concept) => (
              <div 
                key={concept.id}
                className="p-3.5 bg-[#FEF3C7]/40 border-2 border-[#1C1A17] rounded-xl space-y-2.5 shadow-ink-press"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#1C1A17]">
                      {concept.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#DC2626] font-bold">
                      Exam Probability: {concept.examProbability}% · ~{concept.pointsImpact} Pts
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#9C350B]">
                    {concept.mastery}%
                  </span>
                </div>

                <div className="w-full h-2 bg-[#FAF8F5] rounded-full border border-[#1C1A17] overflow-hidden">
                  <div className="bg-[#DC2626] h-full rounded-full" style={{ width: `${concept.mastery}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#6B665E]">
                    {concept.recommendedAction}
                  </span>
                  <button
                    onClick={() => onLaunchRevision(concept.id)}
                    className="px-3 py-1 bg-[#E85D26] hover:bg-[#D04F18] text-white font-display font-bold text-xs rounded-lg border border-[#1C1A17] shadow-ink-press flex items-center gap-1"
                  >
                    <span>Fix Topic</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. CLEAR PRIMARY NEXT MOVE DIRECTIVE */}
      <section className="bg-[#1C1A17] text-white rounded-2xl p-6 md:p-7 shadow-ink-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase text-[#E85D26]">
            Next Academic Action
          </div>
          <h2 className="text-lg md:text-xl font-display font-black text-white">
            Ready to close the remaining 18% gap?
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-xl">
            Retesting Floating Point rounding modes will solidify your Guard, Round, Sticky understanding and push your projected score into 90%+ territory.
          </p>
        </div>

        <button
          onClick={() => onLaunchRevision('ieee-rounding')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E85D26] hover:bg-[#D04F18] text-white font-display font-black text-xs md:text-sm border-2 border-white/40 shadow-ink hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex-shrink-0"
        >
          <span>LAUNCH 3-MIN TARGETED REVISION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
