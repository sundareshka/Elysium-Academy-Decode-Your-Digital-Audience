import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Smartphone, Monitor } from 'lucide-react';
import { ANALYTICS_DATASETS, formatDelta, formatDuration } from '../data/workshopData';
import { ModuleId } from '../types/workshop';

interface Module5EngagementProps {
  dataset: 'demo' | 'custom';
  onChangeDataset: (d: 'demo' | 'custom') => void;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

export const Module5Engagement: React.FC<Module5EngagementProps> = ({
  dataset,
  onChangeDataset,
  onComplete,
  onNavigate,
}) => {
  // Interactive Engaged Session Condition Tester (Slide 17)
  const [secondsOnSite, setSecondsOnSite] = useState<number>(8);
  const [pageViews, setPageViews] = useState<number>(1);
  const [keyEvents, setKeyEvents] = useState<number>(0);

  // Batch Engagement / Bounce Rate Explorer
  const [engagedCount, setEngagedCount] = useState<number>(68);
  const [totalCount, setTotalCount] = useState<number>(100);

  // Pages and Screens Report State (Slide 18)
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [selectedPath, setSelectedPath] = useState<string>('/admission-procedure');
  const [appliedFix, setAppliedFix] = useState<boolean>(false);

  const isEngaged = secondsOnSite >= 10 || pageViews >= 2 || keyEvents >= 1;
  const triggeredReasons = [
    secondsOnSite >= 10 ? `${secondsOnSite}s on site (10+ s)` : null,
    pageViews >= 2 ? `${pageViews} page views (2+)` : null,
    keyEvents >= 1 ? `${keyEvents} key event (1+)` : null,
  ].filter(Boolean) as string[];

  const engagementRate = totalCount > 0 ? (engagedCount / totalCount) * 100 : 0;
  const bounceRate = 100 - engagementRate;

  // Use College Case Study by default for Slide 18's exact Placements vs Admission Procedure example, while allowing switch
  const activePack = ANALYTICS_DATASETS[dataset];
  const pages = activePack.pagesByRange['28d'];

  const selectedPage =
    pages.find((p) => p.path === selectedPath) ||
    pages.find((p) => p.diagnosticNote) ||
    pages[0];

  const getDisplayedSeconds = (page: (typeof pages)[number]) => {
    const isFixedTarget = appliedFix && Boolean(page.diagnosticNote);
    if (isFixedTarget && page.diagnosticNote) {
      return page.diagnosticNote.projectedSeconds;
    }
    if (deviceFilter === 'mobile') return page.mobileEngagementSeconds;
    if (deviceFilter === 'desktop') return page.desktopEngagementSeconds;
    return page.avgEngagementSeconds;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 5 · 12:05 – 12:15 · Slides 17–18
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            User engagement and page performance
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            onComplete();
            onNavigate('module-6');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: Report &amp; Search Console</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide 17: Interactive Engaged Session Simulator */}
      <section className="space-y-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Core Metric Logic · Slide 17</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            What counts as an engaged session?
          </h2>
        </div>

        {/* 3 Conditions Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-xl p-5 border transition-colors ${
              secondsOnSite >= 10
                ? 'bg-[#E8F0FE] border-[#1A73E8]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-4xl font-bold text-[#1E2B31] tabular-nums">
                10+
              </span>
              <span className="font-mono text-xs font-semibold text-[#1A73E8] tabular-nums">
                Current: {secondsOnSite} s
              </span>
            </div>
            <div className="text-sm text-[#475569] mt-1">seconds on the site</div>
            <input
              type="range"
              min={0}
              max={60}
              value={secondsOnSite}
              onChange={(e) => setSecondsOnSite(Number(e.target.value))}
              aria-label="Seconds spent on site"
              className="w-full mt-4 accent-[#1A73E8] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
              <span>0 s</span>
              <span>10 s threshold</span>
              <span>60 s</span>
            </div>
          </div>

          <div
            className={`rounded-xl p-5 border transition-colors ${
              pageViews >= 2
                ? 'bg-[#E8F0FE] border-[#1A73E8]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-4xl font-bold text-[#1E2B31] tabular-nums">
                2+
              </span>
              <span className="font-mono text-xs font-semibold text-[#1A73E8] tabular-nums">
                Current: {pageViews} {pageViews === 1 ? 'view' : 'views'}
              </span>
            </div>
            <div className="text-sm text-[#475569] mt-1">page views</div>
            <input
              type="range"
              min={1}
              max={6}
              value={pageViews}
              onChange={(e) => setPageViews(Number(e.target.value))}
              aria-label="Number of page views in session"
              className="w-full mt-4 accent-[#1A73E8] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
              <span>1 view</span>
              <span>2+ engaged</span>
              <span>6 views</span>
            </div>
          </div>

          <div
            className={`rounded-xl p-5 border transition-colors ${
              keyEvents >= 1
                ? 'bg-[#E8F0FE] border-[#1A73E8]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-4xl font-bold text-[#1E2B31] tabular-nums">
                1+
              </span>
              <span className="font-mono text-xs font-semibold text-[#1A73E8] tabular-nums">
                Current: {keyEvents}
              </span>
            </div>
            <div className="text-sm text-[#475569] mt-1">
              key event, such as a form submission
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[0, 1, 2].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setKeyEvents(val)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium cursor-pointer transition-colors ${
                    keyEvents === val
                      ? 'bg-[#2D3E46] border-[#2D3E46] text-white'
                      : 'bg-white border-slate-300 text-[#334155] hover:bg-slate-50'
                  }`}
                >
                  {val === 0 ? 'None' : `${val} key`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Result Bar + Formula Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div
            className={`lg:col-span-6 rounded-xl p-5 border flex items-start gap-3.5 ${
              isEngaged
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            {isEngaged ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-semibold text-sm">
                Session Classification: {isEngaged ? 'Engaged Session' : 'Bounced Session (Not Engaged)'}
              </div>
              <p className="text-xs leading-relaxed">
                {isEngaged
                  ? `Any one condition is enough. Met: ${triggeredReasons.join(' · ')}.`
                  : 'None of the three conditions are met yet (under 10s, only 1 page view, and 0 key events).'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
              <span className="font-semibold text-[#1E2B31]">
                Formula Calculator: Engagement rate = engaged ÷ total
              </span>
              <span className="font-mono tabular-nums">
                {engagedCount} ÷ {totalCount}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#64748B]">Engagement rate</div>
                <div className="font-display text-3xl font-bold text-emerald-700 tabular-nums">
                  {engagementRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">Bounce rate (opposite)</div>
                <div className="font-display text-3xl font-bold text-[#1E2B31] tabular-nums">
                  {bounceRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={totalCount}
              value={engagedCount}
              onChange={(e) => setEngagedCount(Number(e.target.value))}
              aria-label="Adjust engaged sessions out of 100"
              className="w-full accent-[#2D3E46] cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Slide 18: Similar Traffic, Very Different Attention — Case Study + Pages and Screens */}
      <section className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Illustrative Example &amp; Report · Slide 18 · Reports / Engagement / Pages and screens
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-0.5">
              Similar traffic, very different attention
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  onChangeDataset('custom');
                  setSelectedPath('/admission-procedure');
                  setAppliedFix(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  dataset === 'custom'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                College Case Study (Slide 18)
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeDataset('demo');
                  setSelectedPath('/basket.html');
                  setAppliedFix(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  dataset === 'demo'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                GA4 Demo Store
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Comparison Strip matching Slide 18 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-1">
            <div className="text-sm font-semibold text-[#334155]">Placements page</div>
            <div className="font-display text-5xl font-bold text-[#1E2B31] tabular-nums">
              1 MIN 50 S
            </div>
            <div className="text-xs text-[#64748B] font-mono tabular-nums">
              average engagement time · 4,000 views
            </div>
          </div>
          <div className="bg-white border border-amber-300 rounded-xl p-6 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#334155]">Admission Procedure page</span>
              <span className="text-xs font-medium text-amber-800">Attention drop-off</span>
            </div>
            <div className="font-display text-5xl font-bold text-amber-800 tabular-nums">
              {appliedFix && dataset === 'custom' ? '1 MIN 38 S' : '12 S'}
            </div>
            <div className="text-xs text-[#64748B] font-mono tabular-nums">
              average engagement time · 3,800 views
            </div>
          </div>
        </div>

        {/* Interactive Pages and Screens Report Table + Diagnostic Drawer */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#F6F8F9] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold text-[#1E2B31]">
                Pages and screens · Last 28 days
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                {(
                  [
                    { id: 'all', label: 'All Devices' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'desktop', label: 'Desktop' },
                  ] as const
                ).map((dev) => (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => setDeviceFilter(dev.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                      deviceFilter === dev.id
                        ? 'bg-white text-[#1E2B31] shadow-sm'
                        : 'text-[#475569] hover:text-[#1E2B31]'
                    }`}
                  >
                    {dev.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-[#475569]">
                    <th className="py-3 px-5 font-semibold">Page path and screen class</th>
                    <th className="py-3 px-4 font-semibold text-right">Views</th>
                    <th className="py-3 px-4 font-semibold text-right">Users</th>
                    <th className="py-3 px-5 font-semibold text-right">Avg engagement time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pages.map((row) => {
                    const isSelected = selectedPage.path === row.path;
                    const displayedSec = getDisplayedSeconds(row);
                    const delta = formatDelta(row.views, row.prevViews);
                    const isLow = displayedSec < 30;
                    return (
                      <tr
                        key={row.path}
                        onClick={() => {
                          setSelectedPath(row.path);
                          onComplete();
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FFF8EB]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-5">
                          <div className="font-medium text-[#1E2B31]">{row.title}</div>
                          <div className="text-xs font-mono text-[#64748B]">{row.path}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <div className="font-semibold text-[#1E2B31]">
                            {row.views.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-emerald-700">{delta.text}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-[#475569] tabular-nums">
                          {row.users.toLocaleString()}
                        </td>
                        <td className="py-3 px-5 text-right font-mono text-xs tabular-nums">
                          <span
                            className={`font-semibold ${
                              isLow ? 'text-amber-800' : 'text-[#1E2B31]'
                            }`}
                          >
                            {formatDuration(displayedSec)}
                          </span>
                          {isLow && (
                            <div className="text-[11px] text-amber-800">Inspect issue</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diagnostic Inspector Panel */}
          <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-medium text-[#64748B]">Page Diagnostic Inspector</div>
              <h3 className="font-display text-2xl font-bold text-[#1E2B31] mt-0.5">
                {selectedPage.title}
              </h3>
              <div className="text-xs font-mono text-[#64748B]">{selectedPage.path}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F6F8F9] rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile avg</span>
                </div>
                <div className="font-mono text-sm font-semibold text-[#1E2B31] tabular-nums">
                  {formatDuration(selectedPage.mobileEngagementSeconds)}
                </div>
              </div>
              <div className="bg-[#F6F8F9] rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop avg</span>
                </div>
                <div className="font-mono text-sm font-semibold text-[#1E2B31] tabular-nums">
                  {formatDuration(selectedPage.desktopEngagementSeconds)}
                </div>
              </div>
            </div>

            {selectedPage.diagnosticNote ? (
              <div className="space-y-3 pt-1">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-1.5">
                  <div className="text-xs font-semibold text-amber-900">
                    {selectedPage.diagnosticNote.issueTitle}
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {selectedPage.diagnosticNote.finding}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-[#1E2B31]">Recommended action</div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {selectedPage.diagnosticNote.recommendedFix}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAppliedFix((f) => !f);
                    onComplete();
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    appliedFix
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-[#2D3E46] text-white hover:bg-[#1E2B31]'
                  }`}
                >
                  {appliedFix
                    ? `Fix Simulated (${formatDuration(selectedPage.diagnosticNote.projectedSeconds)} Avg) — Revert`
                    : 'Simulate Replacing PDF with Mobile HTML'}
                </button>
              </div>
            ) : (
              <div className="text-xs text-[#475569] bg-[#F6F8F9] rounded-lg p-3.5 leading-relaxed">
                Healthy engagement profile ({formatDuration(selectedPage.avgEngagementSeconds)} average
                across {selectedPage.views.toLocaleString()} views). Select the flagged row in the
                table to inspect a mobile UX drop-off.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
