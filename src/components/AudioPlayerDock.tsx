import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipForward, 
  Volume2, 
  ChevronUp, 
  ChevronDown,
  Radio,
  Sliders
} from 'lucide-react';
import { CassetteDeckIllustration } from './Illustrations';

const AUDIO_CHAPTERS = [
  { id: 1, title: "Foundations: Two's Complement & Sign Extension", startTime: '00:00', startSec: 0 },
  { id: 2, title: "Core Shortcut: Booth's Hardware Skipping", startTime: '01:05', startSec: 65 },
  { id: 3, title: 'Radix-4 Multipliers: Bit-Pair Tables', startTime: '01:58', startSec: 118 },
  { id: 4, title: 'IEEE 754 Floating Point: Rounding Traps', startTime: '02:35', startSec: 155 },
];


export const AudioPlayerDock: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(74); // 01:14
  const totalDurationSec = 190; // 03:10
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.5);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  // Playback timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeSec(Number(e.target.value));
  };

  const handleSkip10 = (forward: boolean) => {
    setCurrentTimeSec((prev) => {
      const next = forward ? prev + 10 : prev - 10;
      return Math.max(0, Math.min(totalDurationSec, next));
    });
  };

  const handleNextChapter = () => {
    const nextIdx = (currentChapterIdx + 1) % AUDIO_CHAPTERS.length;
    setCurrentChapterIdx(nextIdx);
    setCurrentTimeSec(AUDIO_CHAPTERS[nextIdx].startSec);
  };

  const currentChapter = AUDIO_CHAPTERS[currentChapterIdx];

  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#1C1A17] shadow-ink hover:translate-y-[-2px] transition-all font-mono text-xs font-bold"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#E85D26] animate-pulse" />
          <span>Field Cassette (03:10)</span>
          <ChevronUp className="w-4 h-4 text-[#8C867A]" />
        </button>
      </div>
    );
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t-2 border-[#1C1A17] px-4 md:px-8 py-2.5 shadow-ink-lg transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Cassette Identity & Topic */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border-2 border-[#1C1A17] flex items-center justify-center flex-shrink-0 shadow-ink-sm">
              <CassetteDeckIllustration />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-[#E85D26] text-white border border-[#1C1A17]">
                  TAPE 04
                </span>
                <span className="text-xs font-display font-black text-[#1C1A17] truncate max-w-[200px] sm:max-w-xs">
                  {currentChapter.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6B665E]">
                Prof. Krste Asanović · Commute High-Yield (03:10 min)
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="md:hidden p-1 rounded-lg border border-[#1C1A17]"
            title="Minimize Player"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Waveform Scrubber & Time */}
        <div className="flex items-center gap-3 w-full md:w-2/5">
          <span className="text-xs font-mono text-[#6B665E] w-10 text-right">
            {formatTime(currentTimeSec)}
          </span>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-1 h-4 px-1.5 bg-[#FAF8F5] rounded border border-[#1C1A17]/40">
              {/* Equalizer Waveform bars */}
              {[4, 8, 12, 6, 14, 10, 8, 14, 6, 12, 10, 6, 14, 8, 4].map((h, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    i <= Math.floor((currentTimeSec / totalDurationSec) * 15)
                      ? 'bg-[#2D6A4F]'
                      : 'bg-[#1C1A17]/20'
                  } ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ height: isPlaying ? `${Math.max(4, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : `${h}px` }}
                />
              ))}
            </div>

            <input
              type="range"
              min="0"
              max={totalDurationSec}
              value={currentTimeSec}
              onChange={handleSeek}
              className="w-full accent-[#E85D26] h-1.5 bg-[#E2DACB] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <span className="text-xs font-mono text-[#6B665E] w-10">
            {formatTime(totalDurationSec)}
          </span>
        </div>

        {/* Right: Playback Controls & Speed */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Speed Selector */}
          <div className="flex items-center bg-[#FAF8F5] rounded-lg border border-[#1C1A17] p-0.5 font-mono text-xs font-bold">
            {[1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-all ${
                  playbackSpeed === spd
                    ? 'bg-[#E85D26] text-white'
                    : 'text-[#6B665E] hover:text-[#1C1A17]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Skip & Play Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSkip10(false)}
              className="p-1.5 rounded-lg border border-[#1C1A17] hover:bg-[#F3EFEA] text-[#1C1A17]"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-xl bg-[#E85D26] hover:bg-[#D04F18] text-white border-2 border-[#1C1A17] shadow-ink-sm flex items-center justify-center transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => handleSkip10(true)}
              className="p-1.5 rounded-lg border border-[#1C1A17] hover:bg-[#F3EFEA] text-[#1C1A17]"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextChapter}
              className="p-1.5 rounded-lg border border-[#1C1A17] hover:bg-[#F3EFEA] text-[#1C1A17]"
              title="Next Topic Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="hidden md:inline-flex p-1.5 rounded-lg border border-[#1C1A17] hover:bg-[#F3EFEA] text-[#1C1A17]"
              title="Minimize Player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
