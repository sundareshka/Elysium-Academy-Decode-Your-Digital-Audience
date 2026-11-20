import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Cookie,
  MousePointerClick,
  Play,
  RotateCcw,
  Search,
  Timer,
} from 'lucide-react';
import { SIMULATED_WEBSITE_SOURCES, SIX_KEY_TERMS } from '../data/workshopData';
import { ModuleId } from '../types/workshop';

interface Module1TrackingProps {
  measurementId: string;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

interface TrackedEvent {
  id: number;
  eventName: 'page_view' | 'scroll' | 'click' | 'form_submit';
  pagePath: string;
  cookieId: string;
  timestamp: string;
}

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Visitor',
    desc: 'Opens a page on your website',
  },
  {
    step: 2,
    title: 'Tag fires',
    desc: 'Code on the page runs in the browser',
  },
  {
    step: 3,
    title: 'Event sent',
    desc: 'page_view, scroll or click goes to Google',
  },
  {
    step: 4,
    title: 'Cookie links',
    desc: 'Connects events from the same visitor',
  },
  {
    step: 5,
    title: 'Report',
    desc: 'Sessions and users appear in GA4',
  },
];

export const Module1Tracking: React.FC<Module1TrackingProps> = ({
  measurementId,
  onComplete,
  onNavigate,
}) => {
  // Interactive Tracking Pipeline State
  const [activeStage, setActiveStage] = useState<number>(0);
  const [cookieId, setCookieId] = useState<string>('GA1.1.4829103.173210');
  const [userCount, setUserCount] = useState<number>(1);
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<string>('/home');
  const [events, setEvents] = useState<TrackedEvent[]>([
    {
      id: 1,
      eventName: 'page_view',
      pagePath: '/home',
      cookieId: 'GA1.1.4829103.173210',
      timestamp: '11:06:12',
    },
  ]);
  const [highlightedStep, setHighlightedStep] = useState<number | null>(null);

  // Slide 8 Activity: "See the tag at work"
  const [selectedSiteId, setSelectedSiteId] = useState<string>(SIMULATED_WEBSITE_SOURCES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedTag, setSubmittedTag] = useState<string>('');
  const [activityFeedback, setActivityFeedback] = useState<{
    status: 'idle' | 'correct' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [foundSites, setFoundSites] = useState<string[]>([]);

  // Optional 4-minute Activity Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(240);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const activeSite =
    SIMULATED_WEBSITE_SOURCES.find((s) => s.id === selectedSiteId) ||
    SIMULATED_WEBSITE_SOURCES[0];

  const triggerEvent = (
    eventName: TrackedEvent['eventName'],
    pagePath: string = currentPage
  ) => {
    setCurrentPage(pagePath);
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);

    // Animate stages 1 -> 5 smoothly
    setActiveStage(1);
    window.setTimeout(() => setActiveStage(2), 180);
    window.setTimeout(() => setActiveStage(3), 360);
    window.setTimeout(() => setActiveStage(4), 540);
    window.setTimeout(() => {
      setActiveStage(5);
      setEvents((prev) => [
        {
          id: Date.now(),
          eventName,
          pagePath,
          cookieId,
          timestamp: timeStr,
        },
        ...prev.slice(0, 5),
      ]);
    }, 720);
  };

  const simulateNewVisitor = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 8999999);
    const nextCookie = `GA1.1.${randomNum}.173211`;
    setCookieId(nextCookie);
    setUserCount((u) => u + 1);
    setSessionCount((s) => s + 1);
    const now = new Date().toTimeString().slice(0, 8);
    setActiveStage(1);
    window.setTimeout(() => setActiveStage(4), 250);
    window.setTimeout(() => {
      setActiveStage(5);
      setEvents((prev) => [
        {
          id: Date.now(),
          eventName: 'page_view',
          pagePath: '/home',
          cookieId: nextCookie,
          timestamp: now,
        },
        ...prev.slice(0, 5),
      ]);
      setCurrentPage('/home');
    }, 550);
  };

  const resetPipeline = () => {
    setActiveStage(0);
    setCookieId('GA1.1.4829103.173210');
    setUserCount(1);
    setSessionCount(1);
    setCurrentPage('/home');
    setEvents([
      {
        id: 1,
        eventName: 'page_view',
        pagePath: '/home',
        cookieId: 'GA1.1.4829103.173210',
        timestamp: '11:06:12',
      },
    ]);
  };

  const matchingLineIndices = searchQuery.trim()
    ? activeSite.htmlLines
        .map((line, idx) =>
          line.toLowerCase().includes(searchQuery.trim().toLowerCase()) ? idx : -1
        )
        .filter((idx) => idx !== -1)
    : [];

  const handleVerifyTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = submittedTag.trim().toUpperCase();
    if (!cleaned) {
      setActivityFeedback({
        status: 'error',
        message: 'Enter the G- or GTM- ID found in the page source above.',
      });
      return;
    }

    if (cleaned === activeSite.expectedTagId.toUpperCase()) {
      const nextFound = foundSites.includes(activeSite.id)
        ? foundSites
        : [...foundSites, activeSite.id];
      setFoundSites(nextFound);
      setActivityFeedback({
        status: 'correct',
        message: `Verified: ${activeSite.name} uses ${activeSite.tagType} (${activeSite.expectedTagId}).`,
      });
      onComplete();
    } else {
      setActivityFeedback({
        status: 'error',
        message: `Not quite. Try searching for "gtag" or "GTM-" inside ${activeSite.name}'s source code.`,
      });
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-10">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 1 · 11:05 – 11:15 · Slides 6–8
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            How website tracking works
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            onComplete();
            onNavigate('module-2');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: Configure GA4</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive 5-Stage Pipeline Simulator (Slide 6) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E2B31]">
              Interactive Tracking Pipeline
            </h2>
            <p className="text-sm text-[#475569]">
              Interact with the simulated website below and watch how each action travels from browser to GA4.
            </p>
          </div>
          <button
            type="button"
            onClick={resetPipeline}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#334155] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        </div>

        {/* 5-Stage Visual Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((item) => {
            const isActive = activeStage === item.step || highlightedStep === item.step;
            const isPassed = activeStage > item.step;
            return (
              <div
                key={item.step}
                className={`rounded-xl p-4 border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2D3E46] text-white border-[#2D3E46]'
                    : isPassed
                    ? 'bg-white border-[#F5A623] text-[#1E2B31]'
                    : 'bg-white border-slate-200 text-[#1E2B31]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className={isActive ? 'text-[#F5A623]' : 'text-[#64748B]'}>
                    0{item.step}
                  </span>
                  {item.step < 5 && (
                    <ArrowRight
                      className={`w-3.5 h-3.5 hidden sm:block ${
                        isActive ? 'text-[#F5A623]' : 'text-slate-300'
                      }`}
                    />
                  )}
                </div>
                <div className="font-display text-xl font-bold">{item.title}</div>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isActive ? 'text-slate-200' : 'text-[#5A6B73]'
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two-Zone Sandbox: Simulated Browser (Left) + Live GA4 Receiver (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Simulated Website Browser */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
            <div className="bg-[#ECEFF1] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="font-mono text-xs text-[#334155] truncate">
                https://www.elysiumcollege.edu.in{currentPage}
              </div>
              <span className="text-xs font-mono text-[#64748B] whitespace-nowrap">
                Tag: {measurementId}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="text-xs font-medium text-[#64748B] mr-1">Visit page:</span>
                  {['/home', '/placements', '/admissions', '/courses'].map((path) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => triggerEvent('page_view', path)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        currentPage === path
                          ? 'bg-[#2D3E46] text-white'
                          : 'bg-slate-100 text-[#334155] hover:bg-slate-200'
                      }`}
                    >
                      {path}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-[#1E2B31]">
                    Trigger Visitor Actions on <span className="font-mono">{currentPage}</span>
                  </div>
                  <p className="text-xs text-[#5A6B73]">
                    Each click fires the Google tag snippet in the browser and dispatches an event
                    payload linked by the browser cookie.
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => triggerEvent('scroll', currentPage)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:border-[#2D3E46] transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#B97300]" />
                      <span>Simulate Scroll (90%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerEvent('click', currentPage)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:border-[#2D3E46] transition-colors cursor-pointer"
                    >
                      <MousePointerClick className="w-3.5 h-3.5 text-[#1A73E8]" />
                      <span>Click Brochure Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerEvent('form_submit', currentPage)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5A623] text-[#1E2B31] text-xs font-semibold hover:bg-[#e59819] transition-colors cursor-pointer"
                    >
                      <span>Submit Enquiry Form</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <Cookie className="w-4 h-4 text-[#B97300] shrink-0" />
                  <span>Browser cookie `_ga`:</span>
                  <code className="font-mono text-[#1E2B31] bg-slate-100 px-1.5 py-0.5 rounded">
                    {cookieId}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={simulateNewVisitor}
                  className="text-xs font-medium text-[#1A73E8] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Simulate New Browser / Clear Cookie
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live GA4 Aggregated Stream */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-sm font-semibold text-[#1E2B31]">
                  GA4 Aggregated Report Preview
                </span>
                <span className="text-xs font-mono text-[#64748B]">{measurementId}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#F6F8F9] rounded-lg py-3 px-2">
                  <div className="text-xs text-[#64748B]">Users</div>
                  <div className="font-display text-2xl font-bold text-[#1E2B31] tabular-nums">
                    {userCount}
                  </div>
                </div>
                <div className="bg-[#F6F8F9] rounded-lg py-3 px-2">
                  <div className="text-xs text-[#64748B]">Sessions</div>
                  <div className="font-display text-2xl font-bold text-[#1E2B31] tabular-nums">
                    {sessionCount}
                  </div>
                </div>
                <div className="bg-[#F6F8F9] rounded-lg py-3 px-2">
                  <div className="text-xs text-[#64748B]">Events</div>
                  <div className="font-display text-2xl font-bold text-[#1A73E8] tabular-nums">
                    {events.length}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-[#64748B]">Recent events received</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {events.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className="px-3 py-2 flex items-center justify-between text-xs bg-white"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-semibold text-[#1A73E8]">
                          {ev.eventName}
                        </span>
                        <span className="text-[#64748B] truncate">{ev.pagePath}</span>
                      </div>
                      <span className="font-mono text-[#64748B] tabular-nums shrink-0">
                        {ev.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#475569] bg-[#ECEFF1] rounded-lg px-3.5 py-2.5 leading-relaxed">
              Reports show patterns in groups of people, not the identity of any one visitor.
            </p>
          </div>
        </div>
      </section>

      {/* Slide 7: Six Words You Will Hear Today */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Module 1 · Key Terms · Slide 7</div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
              Six words you will hear today
            </h2>
          </div>
          <span className="text-xs text-[#64748B]">
            Click any term to highlight where it acts in the pipeline above
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#2D3E46] text-white text-xs">
                <th className="py-3 px-4 font-semibold w-44">Term</th>
                <th className="py-3 px-4 font-semibold">Meaning</th>
                <th className="py-3 px-4 font-semibold text-right w-32">Pipeline stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SIX_KEY_TERMS.map((row) => {
                const isSelected = highlightedStep === row.pipelineStep;
                return (
                  <tr
                    key={row.term}
                    onClick={() =>
                      setHighlightedStep(isSelected ? null : row.pipelineStep)
                    }
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FFF8EB]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#1E2B31]">{row.term}</td>
                    <td className="py-3 px-4 text-[#334155]">{row.meaning}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#64748B] tabular-nums">
                      Stage 0{row.pipelineStep}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide 8: Activity — See the Tag at Work (Simulated View Page Source) */}
      <section className="bg-[#2D3E46] text-white rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-medium text-[#F5A623]">
              Module 1 · Hands-On Activity · Slide 8
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              See the tag at work
            </h2>
            <ol className="list-decimal list-inside text-sm text-slate-200 space-y-1 pt-1">
              <li>Select one of the simulated Indian websites below to open its View page source.</li>
              <li>Use the Find box (simulating Ctrl + F) and search for <code className="font-mono text-[#F5A623]">gtag</code> or <code className="font-mono text-[#F5A623]">GTM-</code>.</li>
              <li>Locate the ID starting with <strong className="text-white">G-</strong> or <strong className="text-white">GTM-</strong> and verify it below.</li>
            </ol>
          </div>

          {/* 4-Min Activity Timer */}
          <div className="bg-[#374B54] border border-white/10 rounded-xl p-4 min-w-[200px] flex flex-col justify-between gap-3 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#F5A623]" />
                Activity Timer
              </span>
              <span>4 MIN</span>
            </div>
            <div className="font-display text-4xl font-bold text-[#F5A623] tabular-nums leading-none">
              {formatTimer(timerSeconds)}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="flex-1 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(240);
                }}
                className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/15 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Website Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {SIMULATED_WEBSITE_SOURCES.map((site) => {
            const isSelected = site.id === selectedSiteId;
            const isFound = foundSites.includes(site.id);
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => {
                  setSelectedSiteId(site.id);
                  setSubmittedTag('');
                  setActivityFeedback({ status: 'idle', message: '' });
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#F5A623] text-[#1E2B31] font-semibold'
                    : 'bg-[#374B54] text-slate-200 hover:bg-[#415761]'
                }`}
              >
                <span>{site.name}</span>
                {isFound && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Simulated View Page Source Window */}
        <div className="bg-[#1B262C] border border-white/15 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#233138] border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="font-mono text-xs text-slate-300 truncate">
              view-source:{activeSite.url}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ctrl + F: search gtag, G-, GTM-"
                  aria-label="Search HTML source code"
                  className="bg-[#151E23] border border-white/15 rounded-md pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F5A623] w-60"
                />
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-300 whitespace-nowrap">
                {searchQuery.trim()
                  ? `${matchingLineIndices.length} match${matchingLineIndices.length === 1 ? '' : 'es'}`
                  : 'Quick fill:'}
              </span>
              {!searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('gtag')}
                  className="text-xs font-mono text-[#F5A623] hover:underline cursor-pointer"
                >
                  gtag
                </button>
              )}
            </div>
          </div>

          <div className="p-4 overflow-x-auto max-h-72 overflow-y-auto font-mono text-xs leading-6">
            {activeSite.htmlLines.map((line, index) => {
              const isMatch = matchingLineIndices.includes(index);
              return (
                <div
                  key={index}
                  className={`flex gap-4 px-2 rounded ${
                    isMatch ? 'bg-[#F5A623]/25 text-white' : 'text-slate-300'
                  }`}
                >
                  <span className="w-6 text-right text-slate-500 select-none tabular-nums shrink-0">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulated Chat Check Form */}
        <form
          onSubmit={handleVerifyTag}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
        >
          <input
            type="text"
            value={submittedTag}
            onChange={(e) => setSubmittedTag(e.target.value)}
            placeholder={`Paste the G- or GTM- ID found in ${activeSite.name}`}
            aria-label="Submit discovered tag ID"
            className="flex-1 bg-[#1B262C] border border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F5A623]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#F5A623] text-[#1E2B31] text-sm font-semibold hover:bg-[#e59819] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Verify Tag ID
          </button>
        </form>

        {activityFeedback.status !== 'idle' && (
          <div
            className={`text-sm rounded-lg px-4 py-3 border ${
              activityFeedback.status === 'correct'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}
          >
            {activityFeedback.message}
          </div>
        )}
      </section>
    </div>
  );
};
