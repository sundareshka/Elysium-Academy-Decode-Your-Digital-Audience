import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ExternalLink,
  Megaphone,
  MousePointerClick,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { GA4PropertyConfig, ModuleId } from '../types/workshop';

interface Module3RealtimeProps {
  config: GA4PropertyConfig;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

interface RealtimePageDef {
  path: string;
  title: string;
  ctaLabel: string;
}

const DEMO_PAGES: RealtimePageDef[] = [
  { path: '/home', title: 'Home | Elysium College', ctaLabel: 'Explore Programs' },
  { path: '/placements', title: 'Placements & Recruiters 2026', ctaLabel: 'Download Placement Report' },
  { path: '/admission-procedure', title: 'Admission Procedure', ctaLabel: 'Start Application' },
  { path: '/courses/digital-marketing', title: 'Digital Marketing Course', ctaLabel: 'Request Syllabus' },
];

const BASE_MINUTE_BARS = [
  2, 3, 2, 4, 3, 5, 4, 3, 2, 4,
  5, 6, 4, 3, 5, 4, 6, 5, 4, 7,
  6, 5, 4, 6, 7, 5, 6, 8, 7, 9,
];

export const Module3Realtime: React.FC<Module3RealtimeProps> = ({
  config,
  onComplete,
  onNavigate,
}) => {
  const [accountMode, setAccountMode] = useState<'yours' | 'demo'>('yours');
  const [activePage, setActivePage] = useState<string>('/home');
  const [visitedPages, setVisitedPages] = useState<string[]>(['/home']);
  const [minuteBars, setMinuteBars] = useState<number[]>(BASE_MINUTE_BARS);
  const [activeUsers, setActiveUsers] = useState<number>(18);
  const [pendingHit, setPendingHit] = useState<boolean>(false);

  const [pageViews, setPageViews] = useState<Record<string, number>>({
    'Home | Elysium College': 11,
    'Placements & Recruiters 2026': 7,
    'Admission Procedure': 5,
    'Digital Marketing Course': 4,
  });

  const [eventCounts, setEventCounts] = useState<Record<string, number>>({
    page_view: 27,
    session_start: 18,
    scroll: 14,
    first_visit: 11,
    click: 6,
    file_download: 3,
  });

  const [cityUsers, setCityUsers] = useState<Record<string, number>>({
    Madurai: 7,
    Chennai: 5,
    Bengaluru: 3,
    Coimbatore: 2,
    Mumbai: 1,
  });

  // 6-min Activity Timer
  const [timerSec, setTimerSec] = useState<number>(360);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Activity Verification State
  const [selectedTopPage, setSelectedTopPage] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<string>('');

  useEffect(() => {
    if (!timerRunning || timerSec <= 0) return;
    const t = window.setInterval(() => {
      setTimerSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [timerRunning, timerSec]);

  const recordRealtimeHit = (
    pageTitle: string,
    eventName: string,
    userIncrement = 0,
    city = 'Madurai'
  ) => {
    setPendingHit(true);
    window.setTimeout(() => {
      setPendingHit(false);
      if (userIncrement > 0) {
        setActiveUsers((u) => u + userIncrement);
        setCityUsers((prev) => ({
          ...prev,
          [city]: (prev[city] || 0) + userIncrement,
        }));
      }
      setMinuteBars((bars) => {
        const next = [...bars];
        next[next.length - 1] = next[next.length - 1] + Math.max(1, userIncrement);
        return next;
      });
      if (eventName === 'page_view') {
        setPageViews((prev) => ({
          ...prev,
          [pageTitle]: (prev[pageTitle] || 0) + 1,
        }));
      }
      setEventCounts((prev) => ({
        ...prev,
        [eventName]: (prev[eventName] || 0) + 1,
      }));
    }, 600);
  };

  const handleVisitPage = (page: RealtimePageDef) => {
    setActivePage(page.path);
    if (!visitedPages.includes(page.path)) {
      setVisitedPages((prev) => [...prev, page.path]);
    }
    recordRealtimeHit(page.title, 'page_view', 1, 'Madurai');
  };

  const handlePageAction = (eventName: 'scroll' | 'click' | 'file_download') => {
    const pageObj = DEMO_PAGES.find((p) => p.path === activePage) || DEMO_PAGES[0];
    recordRealtimeHit(pageObj.title, eventName, 0, 'Madurai');
  };

  const handleCampaignBurst = () => {
    setPendingHit(true);
    window.setTimeout(() => {
      setPendingHit(false);
      setActiveUsers((u) => u + 9);
      setMinuteBars((bars) => {
        const next = [...bars];
        next[next.length - 1] = next[next.length - 1] + 9;
        return next;
      });
      setPageViews((prev) => ({
        ...prev,
        'Placements & Recruiters 2026': (prev['Placements & Recruiters 2026'] || 0) + 9,
      }));
      setEventCounts((prev) => ({
        ...prev,
        page_view: (prev.page_view || 0) + 9,
        session_start: (prev.session_start || 0) + 9,
        first_visit: (prev.first_visit || 0) + 6,
      }));
      setCityUsers((prev) => ({
        ...prev,
        Chennai: (prev.Chennai || 0) + 4,
        Madurai: (prev.Madurai || 0) + 3,
        Bengaluru: (prev.Bengaluru || 0) + 2,
      }));
    }, 700);
  };

  const resetRealtime = () => {
    setActivePage('/home');
    setVisitedPages(['/home']);
    setMinuteBars(BASE_MINUTE_BARS);
    setActiveUsers(18);
    setPageViews({
      'Home | Elysium College': 11,
      'Placements & Recruiters 2026': 7,
      'Admission Procedure': 5,
      'Digital Marketing Course': 4,
    });
    setEventCounts({
      page_view: 27,
      session_start: 18,
      scroll: 14,
      first_visit: 11,
      click: 6,
      file_download: 3,
    });
    setCityUsers({
      Madurai: 7,
      Chennai: 5,
      Bengaluru: 3,
      Coimbatore: 2,
      Mumbai: 1,
    });
    setSelectedTopPage('');
    setQuizFeedback('');
  };

  const sortedPages = Object.entries(pageViews).sort((a, b) => b[1] - a[1]);
  const sortedEvents = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]);
  const sortedCities = Object.entries(cityUsers).sort((a, b) => b[1] - a[1]);
  const maxBar = Math.max(...minuteBars, 12);
  const actualTopPage = sortedPages[0]?.[0] || '';

  const handleCheckActivity = () => {
    if (visitedPages.length < 3) {
      setQuizFeedback(
        `Visit at least 3 different pages in the simulated site first (currently ${visitedPages.length} of 3 visited).`
      );
      return;
    }
    if (selectedTopPage === actualTopPage) {
      setQuizFeedback(
        `Confirmed: "${actualTopPage}" is currently the top page with ${activeUsers} active users in the last 30 minutes, and top 3 events are ${sortedEvents
          .slice(0, 3)
          .map(([k]) => k)
          .join(', ')}.`
      );
      onComplete();
    } else {
      setQuizFeedback(
        `Look at "Views by Page title" in the Realtime overview — "${actualTopPage}" currently leads.`
      );
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentPageObj = DEMO_PAGES.find((p) => p.path === activePage) || DEMO_PAGES[0];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 3 · 11:35 – 11:45 · Slides 12–13
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            Monitor real-time visitors
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('module-4')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: Traffic Sources</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide 12: Three Concept Blocks */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
            <div className="font-display text-5xl font-bold text-[#1E2B31] tabular-nums leading-none">
              30
            </div>
            <div className="text-sm font-semibold text-[#1E2B31] pt-1">
              minutes of activity shown
            </div>
            <p className="text-xs text-[#5A6B73]">
              Users, location, pages, sources and events
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
            <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Use 1: Testing</h3>
            <p className="text-sm text-[#475569]">
              After installing the tag, open your site and check that you appear.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
            <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Use 2: Monitoring</h3>
            <p className="text-sm text-[#475569]">
              Share a link or start a campaign and watch visitors arrive.
            </p>
          </div>
        </div>
        <div className="bg-[#ECEFF1] rounded-xl px-5 py-3.5 text-sm text-[#1E2B31]">
          A health check, not a decision report. Standard reports take{' '}
          <strong>24 to 48 hours</strong> to process.
        </div>
      </section>

      {/* Slide 13: Split-Screen Interactive Realtime Lab */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Hands-On Activity · Slide 13 · Find yourself in Realtime
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-0.5">
              Live Split-Screen Realtime Simulator
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setAccountMode('yours')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  accountMode === 'yours'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                Your Property ({config.measurementId})
              </button>
              <button
                type="button"
                onClick={() => setAccountMode('demo')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  accountMode === 'demo'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                GA4 Demo Account
              </button>
            </div>
            <button
              type="button"
              onClick={resetRealtime}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#334155] hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Simulated Visitor Tab */}
          <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#2D3E46] text-white px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ExternalLink className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span className="text-xs font-medium truncate">
                  Tab 1: Visit Your Site ({accountMode === 'yours' ? config.propertyName : 'Google Merchandise Store'})
                </span>
              </div>
              <span className="text-xs font-mono text-slate-300 shrink-0 tabular-nums">
                {visitedPages.length}/4 pages
              </span>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-medium text-[#64748B]">
                  Step 1 — Click 2 or 3 pages below (simulated new tab)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_PAGES.map((page) => {
                    const isCurrent = activePage === page.path;
                    const visited = visitedPages.includes(page.path);
                    return (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() => handleVisitPage(page)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#1E2B31]'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-[#334155]'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{page.title}</div>
                          <div className="text-xs font-mono text-[#64748B]">{page.path}</div>
                        </div>
                        {visited && (
                          <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            Visited
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="text-xs font-medium text-[#64748B]">
                  Step 2 — Trigger events on <span className="font-mono text-[#1E2B31]">{currentPageObj.path}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageAction('scroll')}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 cursor-pointer"
                  >
                    Scroll to Bottom
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePageAction('click')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 cursor-pointer"
                  >
                    <MousePointerClick className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>{currentPageObj.ctaLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePageAction('file_download')}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-xs font-medium text-[#64748B]">
                  Use 2: Monitoring — Test a live link share
                </div>
                <button
                  type="button"
                  onClick={handleCampaignBurst}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5A623] text-[#1E2B31] text-xs font-semibold hover:bg-[#e59819] transition-colors cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Simulate Sharing Placements Link on WhatsApp (+9 Visitors)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Zone: Simulated GA4 Realtime Overview */}
          <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#F6F8F9] px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="text-xs font-medium text-[#334155]">
                Reports / <strong className="text-[#1E2B31]">Realtime overview</strong>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                {pendingHit ? 'Receiving tag hit…' : 'Updated live (last 30 minutes)'}
              </span>
            </div>

            <div className="p-5 space-y-6">
              {/* Top Metric + 30-Minute Bar Chart */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-5 space-y-1">
                  <div className="text-xs font-medium text-[#64748B]">
                    Active users in last 30 minutes
                  </div>
                  <div className="font-display text-5xl font-bold text-[#1A73E8] tabular-nums leading-none">
                    {activeUsers}
                  </div>
                  <div className="text-xs text-[#64748B] pt-1">
                    Users per minute · Real GA4 updates within ~30s
                  </div>
                </div>

                {/* 30-Minute SVG Histogram */}
                <div className="md:col-span-7">
                  <div className="h-24 flex items-end gap-[3px] pt-2 border-b border-slate-200 pb-1">
                    {minuteBars.map((val, idx) => {
                      const heightPct = Math.max(8, Math.round((val / maxBar) * 100));
                      const isLatest = idx === minuteBars.length - 1;
                      return (
                        <div
                          key={idx}
                          title={`${30 - idx} min ago: ${val} users`}
                          className={`flex-1 rounded-t-xs transition-all duration-300 ${
                            isLatest ? 'bg-[#F5A623]' : 'bg-[#1A73E8]/80'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-1">
                    <span>-30 min</span>
                    <span>-15 min</span>
                    <span>Now</span>
                  </div>
                </div>
              </div>

              {/* Three Breakdown Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-200">
                {/* Views by Page Title */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1E2B31]">
                    Views by Page title and screen name
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-[#64748B] border-b border-slate-200">
                        <th className="py-1.5 text-left font-medium">Page title</th>
                        <th className="py-1.5 text-right font-medium">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedPages.map(([title, count]) => (
                        <tr key={title}>
                          <td className="py-2 text-[#334155] pr-2">{title}</td>
                          <td className="py-2 text-right font-mono font-semibold text-[#1E2B31] tabular-nums">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Event Count by Event Name */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1E2B31]">
                    Event count by Event name
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-[#64748B] border-b border-slate-200">
                        <th className="py-1.5 text-left font-medium">Event name</th>
                        <th className="py-1.5 text-right font-medium">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedEvents.slice(0, 5).map(([name, count]) => (
                        <tr key={name}>
                          <td className="py-2 font-mono text-[#1A73E8] pr-2">{name}</td>
                          <td className="py-2 text-right font-mono font-semibold text-[#1E2B31] tabular-nums">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Cities Strip */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#475569]">
                <span className="font-semibold text-[#1E2B31]">Top Cities:</span>
                {sortedCities.map(([city, count]) => (
                  <span key={city} className="tabular-nums">
                    {city} <strong className="font-mono text-[#1E2B31]">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide 13 Activity Verification Card (Dark Slate matching Slide 13) */}
        <div className="bg-[#2D3E46] text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="text-xs font-medium text-[#F5A623]">
              Activity Verification · 6 MIN
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Report your Realtime findings
            </h3>
            <p className="text-sm text-slate-300">
              After clicking at least 3 pages above, select the current top page in your Realtime overview:
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedTopPage}
                onChange={(e) => setSelectedTopPage(e.target.value)}
                aria-label="Select top page in Realtime overview"
                className="bg-[#1B262C] border border-white/20 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F5A623]"
              >
                <option value="">Choose top page…</option>
                {sortedPages.map(([title]) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCheckActivity}
                className="px-4 py-2 rounded-lg bg-[#F5A623] text-[#1E2B31] text-sm font-semibold hover:bg-[#e59819] transition-colors cursor-pointer whitespace-nowrap"
              >
                Submit Finding
              </button>
            </div>
            {quizFeedback && (
              <div className="text-xs text-slate-200 bg-[#374B54] rounded-lg px-3.5 py-2.5">
                {quizFeedback}
              </div>
            )}
          </div>

          <div className="bg-[#374B54] border border-white/10 rounded-xl p-4 min-w-[180px] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-[#F5A623]" />
                Lab Timer
              </span>
              <span>6 MIN</span>
            </div>
            <div className="font-display text-3xl font-bold text-[#F5A623] tabular-nums">
              {formatTimer(timerSec)}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="flex-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs cursor-pointer"
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSec(360);
                }}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-xs text-slate-300 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
