import React, { useEffect, useState } from 'react';
import { Check, Menu, RotateCcw, X } from 'lucide-react';
import { AGENDA_ITEMS } from './data/workshopData';
import { GA4PropertyConfig, ModuleId, ReportDraft } from './types/workshop';
import { OpeningModule } from './components/OpeningModule';
import { Module1Tracking } from './components/Module1Tracking';
import { Module2Setup } from './components/Module2Setup';
import { Module3Realtime } from './components/Module3Realtime';
import { BreakModule } from './components/BreakModule';
import { Module4Traffic } from './components/Module4Traffic';
import { Module5Engagement } from './components/Module5Engagement';
import { Module6ReportGSC } from './components/Module6ReportGSC';
import { MiniProjectClosing } from './components/MiniProjectClosing';

const STORAGE_KEY = 'elysium_ga4_workshop_v1';

const DEFAULT_GA4_CONFIG: GA4PropertyConfig = {
  accountName: 'Elysium College',
  propertyName: 'Admissions & Placements Site',
  timezone: 'India Time (GMT+05:30)',
  currency: 'Indian Rupee (INR ₹)',
  industry: 'Jobs and Education',
  objectives: ['Generate leads', 'Examine user behavior'],
  websiteUrl: 'https://www.elysiumcollege.edu.in',
  enhancedMeasurement: true,
  measurementId: 'G-ELY84K29X1',
  installMethod: 'manual',
  tagInstalled: false,
  dataRetentionMonths: 2,
  completed: false,
};

const DEFAULT_REPORT_DRAFT: ReportDraft = {
  dataset: 'custom',
  authorName: '',
  periodLabel: 'Last 28 days vs previous period',
  insights: ['', '', ''],
  actions: ['', ''],
};

interface PersistedState {
  activeModule: ModuleId;
  completedModules: ModuleId[];
  pollAnswer: string | null;
  ga4Config: GA4PropertyConfig;
  dataset: 'demo' | 'custom';
  quizAnswers: Record<number, 'GA4' | 'GSC'>;
  reportDraft: ReportDraft;
}

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        activeModule: parsed.activeModule || 'opening',
        completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
        pollAnswer: parsed.pollAnswer ?? null,
        ga4Config: { ...DEFAULT_GA4_CONFIG, ...(parsed.ga4Config || {}) },
        dataset: parsed.dataset === 'demo' ? 'demo' : 'custom',
        quizAnswers: parsed.quizAnswers || {},
        reportDraft: {
          ...DEFAULT_REPORT_DRAFT,
          ...(parsed.reportDraft || {}),
        },
      };
    }
  } catch {
    // Fall back to clean defaults if localStorage is unavailable
  }
  return {
    activeModule: 'opening',
    completedModules: [],
    pollAnswer: null,
    ga4Config: DEFAULT_GA4_CONFIG,
    dataset: 'custom',
    quizAnswers: {},
    reportDraft: DEFAULT_REPORT_DRAFT,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const navigateTo = (id: ModuleId) => {
    setState((prev) => ({ ...prev, activeModule: id }));
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markComplete = (id: ModuleId) => {
    setState((prev) => {
      if (prev.completedModules.includes(id)) return prev;
      return { ...prev, completedModules: [...prev.completedModules, id] };
    });
  };

  const handleResetProgress = () => {
    const fresh: PersistedState = {
      activeModule: 'opening',
      completedModules: [],
      pollAnswer: null,
      ga4Config: DEFAULT_GA4_CONFIG,
      dataset: 'custom',
      quizAnswers: {},
      reportDraft: DEFAULT_REPORT_DRAFT,
    };
    setState(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const currentIdx = AGENDA_ITEMS.findIndex((i) => i.id === state.activeModule);
  const nextModule =
    currentIdx >= 0 && currentIdx < AGENDA_ITEMS.length - 1
      ? AGENDA_ITEMS[currentIdx + 1]
      : null;

  const coreModulesCount = AGENDA_ITEMS.filter((i) => i.id !== 'break').length;
  const completedCoreCount = state.completedModules.filter((id) => id !== 'break').length;
  const progressPct = Math.round((completedCoreCount / coreModulesCount) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F9] text-[#1E2B31]">
      {/* Strict 3-Zone Top Bar */}
      <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-5 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => navigateTo('opening')}
          className="font-display text-2xl font-bold tracking-tight text-[#1E2B31] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Elysium Academy
        </button>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Workshop sections"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
        >
          <button
            type="button"
            onClick={() => navigateTo('opening')}
            className={`hover:text-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              state.activeModule === 'opening' ? 'text-[#1E2B31] font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => navigateTo('module-2')}
            className={`hover:text-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              state.activeModule === 'module-1' || state.activeModule === 'module-2'
                ? 'text-[#1E2B31] font-semibold'
                : ''
            }`}
          >
            Tag &amp; Setup
          </button>
          <button
            type="button"
            onClick={() => navigateTo('module-4')}
            className={`hover:text-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              ['module-3', 'module-4', 'module-5', 'module-6'].includes(state.activeModule)
                ? 'text-[#1E2B31] font-semibold'
                : ''
            }`}
          >
            GA4 Reports
          </button>
          <button
            type="button"
            onClick={() => navigateTo('mini-project')}
            className={`hover:text-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              state.activeModule === 'mini-project' ? 'text-[#1E2B31] font-semibold' : ''
            }`}
          >
            Report Project
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-label="Toggle workshop curriculum menu"
            className="lg:hidden p-2 rounded-lg border border-slate-200 text-[#1E2B31] hover:bg-slate-50 cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          {nextModule ? (
            <button
              type="button"
              onClick={() => navigateTo(nextModule.id)}
              className="px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-xs font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Next: {nextModule.session}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-xs font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Save PDF Report
            </button>
          )}
        </div>
      </header>

      {/* Main Two-Column Workspace Canvas */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* Left Sidebar Curriculum Rail (Desktop fixed, Mobile overlay) */}
        <aside
          className={`no-print ${
            mobileNavOpen ? 'fixed inset-y-16 left-0 z-20 block shadow-xl' : 'hidden'
          } lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] w-64 shrink-0 bg-white border-r border-slate-200 overflow-y-auto`}
        >
          <div className="p-5 flex flex-col justify-between min-h-full gap-6">
            <div className="space-y-5">
              {/* Progress Summary */}
              <div className="space-y-2 pb-4 border-b border-slate-200">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-semibold text-[#1E2B31]">Workshop Progress</span>
                  <span className="font-mono tabular-nums text-[#64748B]">
                    {completedCoreCount}/{coreModulesCount}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5A623] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-[#64748B] truncate">
                  ID: {state.ga4Config.measurementId}
                </div>
              </div>

              {/* 90-Minute Module Navigation */}
              <nav aria-label="90-minute workshop modules" className="space-y-1">
                {AGENDA_ITEMS.map((item) => {
                  const isActive = state.activeModule === item.id;
                  const isDone = state.completedModules.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#2D3E46] text-white'
                          : 'text-[#334155] hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isActive ? 'text-[#F5A623]' : 'text-[#1E2B31]'
                          }`}
                        >
                          {item.session}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono tabular-nums">
                          {isDone && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                isActive ? 'text-[#F5A623]' : 'text-emerald-700'
                              }`}
                            />
                          )}
                          <span className={isActive ? 'text-slate-300' : 'text-[#64748B]'}>
                            {item.duration}
                          </span>
                        </span>
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isActive ? 'text-slate-100' : 'text-[#5A6B73]'
                        }`}
                      >
                        {item.topic}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quiet Reset Control */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={handleResetProgress}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-[#475569] hover:text-[#1E2B31] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Workshop Progress</span>
              </button>
              <div className="text-[11px] text-[#64748B] text-center">
                www.elysiumacademy.org
              </div>
            </div>
          </div>
        </aside>

        {/* Primary Interactive Stage */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="max-w-5xl mx-auto">
            {state.activeModule === 'opening' && (
              <OpeningModule
                completedModules={state.completedModules}
                pollAnswer={state.pollAnswer}
                onSelectPoll={(ans) =>
                  setState((prev) => ({ ...prev, pollAnswer: ans }))
                }
                onNavigate={navigateTo}
                onMarkComplete={markComplete}
              />
            )}

            {state.activeModule === 'module-1' && (
              <Module1Tracking
                measurementId={state.ga4Config.measurementId}
                onComplete={() => markComplete('module-1')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'module-2' && (
              <Module2Setup
                config={state.ga4Config}
                onUpdateConfig={(updater) =>
                  setState((prev) => ({
                    ...prev,
                    ga4Config: updater(prev.ga4Config),
                  }))
                }
                onComplete={() => markComplete('module-2')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'module-3' && (
              <Module3Realtime
                config={state.ga4Config}
                onComplete={() => markComplete('module-3')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'break' && (
              <BreakModule
                onComplete={() => markComplete('break')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'module-4' && (
              <Module4Traffic
                dataset={state.dataset}
                onChangeDataset={(d) =>
                  setState((prev) => ({ ...prev, dataset: d }))
                }
                onComplete={() => markComplete('module-4')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'module-5' && (
              <Module5Engagement
                dataset={state.dataset}
                onChangeDataset={(d) =>
                  setState((prev) => ({ ...prev, dataset: d }))
                }
                onComplete={() => markComplete('module-5')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'module-6' && (
              <Module6ReportGSC
                dataset={state.dataset}
                quizAnswers={state.quizAnswers}
                onAnswerQuiz={(qId, choice) =>
                  setState((prev) => ({
                    ...prev,
                    quizAnswers: { ...prev.quizAnswers, [qId]: choice },
                  }))
                }
                onResetQuiz={() =>
                  setState((prev) => ({ ...prev, quizAnswers: {} }))
                }
                onComplete={() => markComplete('module-6')}
                onNavigate={navigateTo}
              />
            )}

            {state.activeModule === 'mini-project' && (
              <MiniProjectClosing
                reportDraft={state.reportDraft}
                onUpdateDraft={(updater) =>
                  setState((prev) => ({
                    ...prev,
                    reportDraft: updater(prev.reportDraft),
                  }))
                }
                onComplete={() => markComplete('mini-project')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
