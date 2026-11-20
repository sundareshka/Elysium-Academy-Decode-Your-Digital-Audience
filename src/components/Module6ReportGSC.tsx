import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { ANALYTICS_DATASETS, GA_VS_GSC_QUIZ } from '../data/workshopData';
import { ModuleId } from '../types/workshop';

interface Module6ReportGSCProps {
  dataset: 'demo' | 'custom';
  quizAnswers: Record<number, 'GA4' | 'GSC'>;
  onAnswerQuiz: (questionId: number, choice: 'GA4' | 'GSC') => void;
  onResetQuiz: () => void;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

const FOUR_QUESTIONS = [
  { num: '01', question: 'How many came?', report: 'Reports snapshot' },
  { num: '02', question: 'From where?', report: 'Traffic acquisition' },
  { num: '03', question: 'What did they do?', report: 'Pages and screens' },
  { num: '04', question: 'What next?', report: 'Your insights and actions' },
];

const COMPARISON_ROWS = [
  {
    point: 'Main question',
    ga4: 'What do visitors do on my website?',
    gsc: 'How does my site perform on Google Search?',
  },
  {
    point: 'Stage',
    ga4: 'After the click',
    gsc: 'Before the click',
  },
  {
    point: 'Traffic covered',
    ga4: 'All channels',
    gsc: 'Google organic search only',
  },
  {
    point: 'Key metrics',
    ga4: 'Users, sessions, engagement rate, views',
    gsc: 'Impressions, clicks, CTR, average position',
  },
  {
    point: 'Setup',
    ga4: 'Install the Google tag on every page',
    gsc: 'Verify ownership of the website',
  },
];

export const Module6ReportGSC: React.FC<Module6ReportGSCProps> = ({
  dataset,
  quizAnswers,
  onAnswerQuiz,
  onResetQuiz,
  onComplete,
  onNavigate,
}) => {
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const trendData = ANALYTICS_DATASETS[dataset].dailyTrend28d;
  const totalCurrent = trendData.reduce((s, d) => s + d.current, 0);
  const totalPrev = trendData.reduce((s, d) => s + d.previous, 0);
  const growthPct = (((totalCurrent - totalPrev) / totalPrev) * 100).toFixed(1);

  const maxVal = Math.max(...trendData.map((d) => Math.max(d.current, d.previous))) * 1.1;
  const chartW = 560;
  const chartH = 160;
  const padX = 14;
  const padY = 14;

  const toPoints = (key: 'current' | 'previous') =>
    trendData
      .map((d, i) => {
        const x = padX + (i / (trendData.length - 1)) * (chartW - padX * 2);
        const y = chartH - padY - (d[key] / maxVal) * (chartH - padY * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  const answeredCount = Object.keys(quizAnswers).length;
  const correctCount = GA_VS_GSC_QUIZ.filter(
    (q) => quizAnswers[q.id] === q.answer
  ).length;

  const handleSelectQuiz = (qId: number, choice: 'GA4' | 'GSC') => {
    onAnswerQuiz(qId, choice);
    const nextCount = Object.keys({ ...quizAnswers, [qId]: choice }).length;
    if (nextCount === GA_VS_GSC_QUIZ.length) {
      onComplete();
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 6 · 12:15 – 12:23 · Slides 19–21
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            Preparing a report; Analytics vs Search Console
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('mini-project')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: Mini Project Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide 19: Four Questions + Period Comparison Demonstrator */}
      <section className="space-y-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Reporting Framework · Slide 19</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            A one-page report answers four questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUR_QUESTIONS.map((item) => (
            <div key={item.num} className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
              <div className="font-display text-2xl font-bold text-[#64748B] tabular-nums">
                {item.num}
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1E2B31]">
                {item.question}
              </h3>
              <p className="text-xs text-[#5A6B73]">{item.report}</p>
            </div>
          ))}
        </div>

        {/* Interactive "Why Compare Periods?" SVG Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[#1E2B31]">
                Always compare with the previous period. A number alone has no meaning.
              </div>
              <p className="text-xs text-[#5A6B73] mt-0.5">
                Toggle the previous 28-day baseline below to see why context transforms raw session numbers into insight.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowComparison((v) => !v)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showComparison
                  ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]'
                  : 'bg-white border-slate-300 text-[#334155]'
              }`}
            >
              {showComparison ? 'Comparison: ON (vs previous 28 days)' : 'Comparison: OFF (raw number only)'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs text-[#64748B]">Sampled 14-point Sessions (Last 28 days)</div>
              <div className="font-display text-5xl font-bold text-[#1E2B31] tabular-nums leading-none">
                {totalCurrent.toLocaleString()}
              </div>
              {showComparison ? (
                <div className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
                  +{growthPct}% vs {totalPrev.toLocaleString()} in previous 28 days
                </div>
              ) : (
                <div className="text-xs text-amber-800">
                  Without comparison: is {totalCurrent.toLocaleString()} growing, flat, or declining?
                </div>
              )}
              {hoveredIdx !== null && (
                <div className="text-xs font-mono text-[#475569] bg-[#F6F8F9] rounded px-2.5 py-1.5 tabular-nums">
                  {trendData[hoveredIdx].day}: {trendData[hoveredIdx].current.toLocaleString()}
                  {showComparison &&
                    ` (prev: ${trendData[hoveredIdx].previous.toLocaleString()})`}
                </div>
              )}
            </div>

            <div className="lg:col-span-8">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-40 overflow-visible"
                role="img"
                aria-label="Sessions trend line comparing current and previous 28-day period"
              >
                {[0.25, 0.5, 0.75].map((ratio) => {
                  const y = padY + ratio * (chartH - padY * 2);
                  return (
                    <line
                      key={ratio}
                      x1={padX}
                      x2={chartW - padX}
                      y1={y}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                  );
                })}
                {showComparison && (
                  <polyline
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    points={toPoints('previous')}
                  />
                )}
                <polyline
                  fill="none"
                  stroke="#1A73E8"
                  strokeWidth="2.5"
                  points={toPoints('current')}
                />
                {trendData.map((d, i) => {
                  const x = padX + (i / (trendData.length - 1)) * (chartW - padX * 2);
                  const y = chartH - padY - (d.current / maxVal) * (chartH - padY * 2);
                  return (
                    <circle
                      key={d.day}
                      cx={x}
                      cy={y}
                      r={hoveredIdx === i ? 5 : 3}
                      fill={hoveredIdx === i ? '#F5A623' : '#1A73E8'}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  );
                })}
              </svg>
              <div className="flex justify-between text-[11px] font-mono text-[#64748B] px-3">
                <span>Day 1</span>
                <span>Solid blue: Last 28 days {showComparison ? '· Dashed grey: Previous 28 days' : ''}</span>
                <span>Day 28</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 20: Google Analytics vs Search Console */}
      <section className="space-y-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Two Different Tools · Slide 20</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            Google Analytics vs Search Console
          </h2>
        </div>

        {/* Visual Journey Across the Click Boundary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#B97300]">
              <span>STAGE 01 · BEFORE THE CLICK</span>
              <span>Google Search Console</span>
            </div>
            <div className="font-display text-2xl font-bold text-[#1E2B31]">
              On Google Search Results
            </div>
            <p className="text-sm text-[#475569]">
              Tracks search queries, <strong>Impressions</strong>, <strong>Clicks</strong>,{' '}
              <strong>CTR</strong>, and <strong>Average position</strong> for Google organic search only.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#1A73E8]">
              <span>STAGE 02 · AFTER THE CLICK</span>
              <span>Google Analytics 4</span>
            </div>
            <div className="font-display text-2xl font-bold text-[#1E2B31]">
              Inside Your Website
            </div>
            <p className="text-sm text-[#475569]">
              Tracks <strong>Users</strong>, <strong>Sessions</strong>,{' '}
              <strong>Engagement rate</strong>, and <strong>Views</strong> across all channels (Search, Direct, Referral, Social).
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#2D3E46] text-white text-xs">
                  <th className="py-3 px-4 font-semibold w-36">Point</th>
                  <th className="py-3 px-4 font-semibold">Google Analytics 4</th>
                  <th className="py-3 px-4 font-semibold">Google Search Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.point} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-[#1E2B31]">{row.point}</td>
                    <td className="py-3 px-4 text-[#334155]">{row.ga4}</td>
                    <td className="py-3 px-4 text-[#334155]">{row.gsc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#ECEFF1] rounded-xl px-5 py-3.5 text-sm text-[#1E2B31]">
          Their numbers will not match exactly: <strong>Search Console counts clicks</strong>,{' '}
          <strong>Analytics counts sessions</strong>.
        </div>
      </section>

      {/* Slide 21: Interactive Chat Quiz — GA or GSC? */}
      <section className="bg-[#2D3E46] text-white rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[#F5A623]">Chat Quiz · Slide 21</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">
              GA or GSC? Test your knowledge
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-slate-200">
              Score: <strong className="text-[#F5A623]">{correctCount}</strong> / {GA_VS_GSC_QUIZ.length}
            </span>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={onResetQuiz}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GA_VS_GSC_QUIZ.map((q) => {
            const userChoice = quizAnswers[q.id];
            const isCorrect = userChoice === q.answer;
            return (
              <div
                key={q.id}
                className="bg-[#374B54] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="font-display text-xl font-bold text-[#F5A623] tabular-nums">
                    0{q.id}
                  </div>
                  <div className="text-base font-semibold text-white leading-snug">
                    {q.question}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['GA4', 'GSC'] as const).map((option) => {
                      const selected = userChoice === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectQuiz(q.id, option)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            selected
                              ? option === q.answer
                                ? 'bg-emerald-600 border-emerald-400 text-white'
                                : 'bg-rose-600 border-rose-400 text-white'
                              : 'bg-[#25343B] border-white/15 text-slate-200 hover:border-[#F5A623]'
                          }`}
                        >
                          {option === 'GA4' ? 'Google Analytics (GA4)' : 'Search Console (GSC)'}
                        </button>
                      );
                    })}
                  </div>

                  {userChoice && (
                    <div
                      className={`text-xs rounded-lg p-3 flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-950/60 text-emerald-200'
                          : 'bg-rose-950/60 text-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      )}
                      <span>
                        <strong>{isCorrect ? 'Correct:' : `Answer is ${q.answer}:`}</strong>{' '}
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
