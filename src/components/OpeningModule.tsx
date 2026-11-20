import React, { useState } from 'react';
import { ArrowRight, Check, Square, CheckSquare } from 'lucide-react';
import { AGENDA_ITEMS, LEARNING_OUTCOMES, WORKSHOP_META } from '../data/workshopData';
import { ModuleId } from '../types/workshop';

interface OpeningModuleProps {
  completedModules: ModuleId[];
  pollAnswer: string | null;
  onSelectPoll: (answer: string) => void;
  onNavigate: (id: ModuleId) => void;
  onMarkComplete: (id: ModuleId) => void;
}

const CALL_ETIQUETTE = [
  'Keep your microphone muted',
  'Type questions in the chat at any time',
  'Use Raise hand if you are stuck',
  'Camera is optional',
];

const WORKSPACE_CHECKLIST = [
  'Chrome or Edge on a laptop',
  'Your Google account, signed in',
  'analytics.google.com',
  'The GA4 demo account',
];

const POLL_OPTIONS = [
  {
    id: 'never',
    label: 'Never',
    detail: 'This is my first time',
    baseVotes: 28,
    guidance:
      'Start with Module 1 to see how a tracking tag fires, then follow the 10-step GA4 setup wizard and practice with the Google Merchandise Store demo data.',
  },
  {
    id: 'once',
    label: 'Once or twice',
    detail: 'I have opened it but not used it',
    baseVotes: 17,
    guidance:
      'Pay special attention to Module 2 (data retention & tag installation) and Modules 4–5 to turn raw GA4 tables into clear channel and page insights.',
  },
  {
    id: 'regularly',
    label: 'Regularly',
    detail: 'I use it for a website or client',
    baseVotes: 9,
    guidance:
      'Use the UTM Campaign Builder in Module 4, inspect the Mobile vs Desktop page diagnostics in Module 5, and craft an executive One-Page PDF Report in the Mini Project.',
  },
];

export const OpeningModule: React.FC<OpeningModuleProps> = ({
  completedModules,
  pollAnswer,
  onSelectPoll,
  onNavigate,
  onMarkComplete,
}) => {
  const [checkedPrep, setCheckedPrep] = useState<string[]>([
    'Chrome or Edge on a laptop',
  ]);

  const togglePrep = (item: string) => {
    setCheckedPrep((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const totalVotes =
    POLL_OPTIONS.reduce((sum, opt) => sum + opt.baseVotes, 0) + (pollAnswer ? 1 : 0);

  const selectedPollOption = POLL_OPTIONS.find((o) => o.id === pollAnswer);

  const handleVote = (id: string) => {
    onSelectPoll(id);
    if (!completedModules.includes('opening')) {
      onMarkComplete('opening');
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner — Aligned with Slide 1 */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-medium text-[#5A6B73] tracking-wide">
              Online Workshop · Microsoft Teams · Interactive Simulation
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#1E2B31] uppercase leading-[1.05]">
              {WORKSHOP_META.title}
            </h1>
            <p className="text-base sm:text-lg text-[#4A5A63] leading-relaxed">
              {WORKSHOP_META.subtitle}. Practice every step of the 90-minute session inside a guided,
              interactive GA4 environment.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm border-t border-slate-200">
              <div>
                <div className="text-xs text-[#64748B]">Date</div>
                <div className="font-semibold text-[#1E2B31]">{WORKSHOP_META.date}</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">Time</div>
                <div className="font-semibold text-[#1E2B31] tabular-nums">{WORKSHOP_META.time}</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">Speaker</div>
                <div className="font-semibold text-[#1E2B31]">{WORKSHOP_META.speaker}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-between gap-6 shrink-0">
            <img
              src="/assets/aistudio/ElysiumAcadmemy_a81d78c3.png"
              alt="Elysium Academy — Milestone of Cognizance"
              referrerPolicy="no-referrer"
              className="h-14 w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => {
                onMarkComplete('opening');
                onNavigate('module-1');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Begin Module 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Slide 2: Before We Start — Interactive Readiness Checklist */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium text-[#64748B]">11:00 – 11:05 · Opening · Slide 2</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            Before we start
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-display text-xl font-bold text-[#1E2B31] mb-4">On the call</h3>
            <ul className="space-y-3 text-sm text-[#334155]">
              {CALL_ETIQUETTE.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-[#B97300] font-semibold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-[#1E2B31]">Keep these open</h3>
              <span className="text-xs font-mono tabular-nums text-[#64748B]">
                {checkedPrep.length} / {WORKSPACE_CHECKLIST.length} ready
              </span>
            </div>
            <div className="space-y-2.5">
              {WORKSPACE_CHECKLIST.map((item) => {
                const isChecked = checkedPrep.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => togglePrep(item)}
                    className="w-full flex items-center gap-3 text-left text-sm py-1.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#2D3E46] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={isChecked ? 'text-[#1E2B31] font-medium' : 'text-[#475569]'}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Slide 3: Interactive Opening Poll (Dark Slate Surface matching Slide 3) */}
      <section className="bg-[#2D3E46] text-white rounded-xl p-7 lg:p-8 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#F5A623] tracking-wide">
            Opening Poll · Slide 3
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Have you used Google Analytics before?
          </h2>
          <p className="text-sm text-slate-300">
            Select your experience level below to record your response and see the workshop cohort mix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POLL_OPTIONS.map((option) => {
            const isSelected = pollAnswer === option.id;
            const votes = option.baseVotes + (isSelected ? 1 : 0);
            const pct = Math.round((votes / totalVotes) * 100);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVote(option.id)}
                className={`text-left rounded-lg p-5 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#3C515B] border-[#F5A623]'
                    : 'bg-[#374B54] border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-2xl font-bold text-white">
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-medium text-[#F5A623]">Your vote</span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-1">{option.detail}</p>

                {pollAnswer && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-200">
                      <span>{pct}% of participants</span>
                      <span>{votes} votes</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#223037] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-[#F5A623]' : 'bg-slate-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-[#374B54] border border-white/10 rounded-lg px-5 py-3.5 text-sm text-slate-200">
          {selectedPollOption ? (
            <span>
              <strong className="text-[#F5A623] font-semibold">Recommended focus:</strong>{' '}
              {selectedPollOption.guidance}
            </span>
          ) : (
            <span>Answer in the simulated workshop poll above to unlock tailored guidance.</span>
          )}
        </div>
      </section>

      {/* Slide 4: What You Will Be Able To Do */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium text-[#64748B]">By 12:30 pm · Slide 4</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            What you will be able to do
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <button
              key={outcome.verb}
              type="button"
              onClick={() => onNavigate(outcome.moduleId)}
              className="text-left bg-white border border-slate-200 hover:border-[#2D3E46] rounded-xl p-5 transition-colors cursor-pointer group"
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-display text-2xl font-bold text-[#1E2B31] group-hover:text-[#B97300] transition-colors">
                  {outcome.verb}
                </span>
                <span className="text-xs font-mono text-[#64748B]">0{idx + 1}</span>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">{outcome.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Slide 5: Interactive 90-Minute Agenda */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-[#64748B]">90 Minutes · Slide 5</div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">Agenda</h2>
          </div>
          <span className="text-xs text-[#64748B]">
            Click any session row to launch its interactive module
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#2D3E46] text-white text-xs font-medium">
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Session</th>
                  <th className="py-3 px-4 font-semibold">Topic</th>
                  <th className="py-3 px-4 font-semibold text-right">Duration</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {AGENDA_ITEMS.map((item) => {
                  const isDone = completedModules.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                        {item.time}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1E2B31] whitespace-nowrap">
                        {item.session}
                      </td>
                      <td className="py-3 px-4 text-[#334155]">
                        <span>{item.topic}</span>
                        <span className="text-xs text-[#64748B] ml-2">· {item.slides}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                        {item.duration}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-xs text-[#64748B]">Open</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
