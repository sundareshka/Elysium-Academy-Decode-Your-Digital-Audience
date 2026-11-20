import React, { useEffect, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { ModuleId } from '../types/workshop';

interface BreakModuleProps {
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

export const BreakModule: React.FC<BreakModuleProps> = ({ onComplete, onNavigate }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const progressPct = ((300 - secondsLeft) / 300) * 100;

  return (
    <div className="space-y-8">
      <section className="bg-[#F5A623] text-[#1E2B31] rounded-xl p-10 lg:p-16 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold tracking-wider text-[#1E2B31]/80">
            11:45 – 11:50 · Slide 14
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase tracking-tight leading-none">
            5-Minute Break
          </h1>
          <p className="text-lg text-[#1E2B31]/90">
            We resume at 11:50 am with traffic sources.
          </p>
        </div>

        <div className="bg-[#1E2B31] text-white rounded-xl p-6 sm:p-8 max-w-md space-y-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-300">Session countdown</span>
            <span className="text-xs font-mono text-[#F5A623]">
              {secondsLeft === 0 ? 'Time to resume' : running ? 'Running' : 'Paused'}
            </span>
          </div>

          <div className="font-display text-6xl font-bold tabular-nums text-[#F5A623] leading-none">
            {formatted}
          </div>

          <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5A623] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5A623] text-[#1E2B31] text-sm font-semibold hover:bg-[#e59819] transition-colors cursor-pointer"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{running ? 'Pause Timer' : 'Start 5-Min Timer'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(300);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onComplete();
              onNavigate('module-4');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E2B31] text-white text-sm font-medium hover:bg-[#2D3E46] transition-colors cursor-pointer"
          >
            <span>Resume with Module 4: Traffic Sources</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
