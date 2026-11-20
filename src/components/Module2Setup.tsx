import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Globe, ShieldCheck } from 'lucide-react';
import { GA4PropertyConfig, ModuleId } from '../types/workshop';

interface Module2SetupProps {
  config: GA4PropertyConfig;
  onUpdateConfig: (updater: (prev: GA4PropertyConfig) => GA4PropertyConfig) => void;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

const TEN_STEPS = [
  'Sign in at analytics.google.com',
  'Click Start measuring',
  'Name the account',
  'Name the property; set India time and INR',
  'Choose industry and objectives',
  'Choose Web and enter your website URL',
  'Keep Enhanced measurement on',
  'Copy the Measurement ID (G-…)',
  'Install the Google tag on every page',
  'Set data retention to 14 months',
];

const OBJECTIVES_LIST = [
  'Generate leads',
  'Drive online sales',
  'Raise brand awareness',
  'Examine user behavior',
];

export const Module2Setup: React.FC<Module2SetupProps> = ({
  config,
  onUpdateConfig,
  onComplete,
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState<number>(config.completed ? 10 : 1);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [bloggerInput, setBloggerInput] = useState<string>('');
  const [wpConnected, setWpConnected] = useState<boolean>(config.tagInstalled);
  const [stepNotice, setStepNotice] = useState<string>('');

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(config.measurementId).catch(() => {});
    }
    setCopiedId(true);
    window.setTimeout(() => setCopiedId(false), 1800);
  };

  const toggleObjective = (obj: string) => {
    onUpdateConfig((prev) => {
      const exists = prev.objectives.includes(obj);
      return {
        ...prev,
        objectives: exists
          ? prev.objectives.filter((o) => o !== obj)
          : [...prev.objectives, obj],
      };
    });
  };

  const handleNextStep = () => {
    setStepNotice('');
    if (activeStep === 3 && !config.accountName.trim()) {
      setStepNotice('Enter an account name (for example, Elysium College) before continuing.');
      return;
    }
    if (activeStep === 4) {
      if (!config.propertyName.trim()) {
        setStepNotice('Enter a property name before continuing.');
        return;
      }
      if (config.timezone !== 'India Time (GMT+05:30)' || config.currency !== 'Indian Rupee (INR ₹)') {
        setStepNotice(
          'Workshop guideline (Step 04): Set Reporting time zone to India Time (GMT+05:30) and Currency to Indian Rupee (INR ₹).'
        );
        return;
      }
    }
    if (activeStep === 6 && !config.websiteUrl.trim()) {
      setStepNotice('Enter a website URL to create your Web data stream.');
      return;
    }
    if (activeStep === 7 && !config.enhancedMeasurement) {
      setStepNotice('Keep Enhanced measurement turned ON so scrolls, outbound clicks, and file downloads track automatically.');
      return;
    }
    if (activeStep === 9 && !config.tagInstalled) {
      setStepNotice('Complete one of the three tag installation methods below so GA4 receives data.');
      return;
    }
    if (activeStep === 10) {
      if (config.dataRetentionMonths !== 14) {
        setStepNotice('Switch Event data retention from 2 months to 14 months before saving.');
        return;
      }
      onUpdateConfig((prev) => ({ ...prev, completed: true }));
      onComplete();
      setStepNotice('Configuration saved. Your GA4 property and Google tag are now active across Modules 3–6.');
      return;
    }
    setActiveStep((s) => Math.min(10, s + 1));
  };

  const handleVerifyBlogger = () => {
    if (bloggerInput.trim().toUpperCase() === config.measurementId.toUpperCase()) {
      onUpdateConfig((prev) => ({ ...prev, tagInstalled: true, installMethod: 'blogger' }));
      setStepNotice('');
    } else {
      setStepNotice(`Paste your exact Measurement ID (${config.measurementId}) into the Analytics field.`);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 2 · 11:15 – 11:35 · Slides 9–11
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            Configure Google Analytics 4
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('module-3')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: Realtime Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide 9: GA4 Three-Level Hierarchy */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Hierarchy · Slide 9</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            GA4 is organised in three levels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Account</h3>
              <span className="text-xs font-mono text-[#64748B]">Level 01</span>
            </div>
            <p className="text-sm text-[#475569]">Top level. Usually one per business.</p>
            <div className="pt-2 border-t border-slate-100 text-xs text-[#64748B]">
              Live value: <strong className="text-[#1E2B31]">{config.accountName || 'the college'}</strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Property</h3>
              <span className="text-xs font-mono text-[#64748B]">Level 02</span>
            </div>
            <p className="text-sm text-[#475569]">One website or app. Reports live here.</p>
            <div className="pt-2 border-t border-slate-100 text-xs text-[#64748B]">
              Live value: <strong className="text-[#1E2B31]">{config.propertyName || 'the admissions site'}</strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Data stream</h3>
              <span className="text-xs font-mono text-[#64748B]">Level 03</span>
            </div>
            <p className="text-sm text-[#475569]">The flow of data from the website. Has its own Measurement ID.</p>
            <div className="pt-2 border-t border-slate-100 text-xs text-[#64748B]">
              Measurement ID:{' '}
              <code className="font-mono font-semibold text-[#1A73E8]">{config.measurementId}</code>
            </div>
          </div>
        </div>

        <div className="bg-[#ECEFF1] rounded-xl px-5 py-3.5 text-sm text-[#1E2B31]">
          Setup has two halves: <strong>create the property</strong>, then{' '}
          <strong>install the tag</strong>. Many beginners forget the second half.
        </div>
      </section>

      {/* Slide 10 & 11: Interactive 10-Step Setup Simulator */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Hands-On Simulator · Slides 10–11
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
              Set up GA4 in ten steps
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#475569]">
            Step {activeStep < 10 ? `0${activeStep}` : activeStep} of 10
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Checklist Rail */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {TEN_STEPS.map((label, idx) => {
              const stepNum = idx + 1;
              const isCurrent = activeStep === stepNum;
              const isDone = config.completed || stepNum < activeStep;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setActiveStep(stepNum);
                    setStepNotice('');
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#2D3E46] text-white font-medium'
                      : 'hover:bg-slate-50 text-[#334155]'
                  }`}
                >
                  <span
                    className={`font-mono text-xs tabular-nums w-6 shrink-0 ${
                      isCurrent
                        ? 'text-[#F5A623]'
                        : isDone
                        ? 'text-emerald-700 font-semibold'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {isDone && !isCurrent ? (
                      <Check className="w-4 h-4 inline" />
                    ) : stepNum < 10 ? (
                      `0${stepNum}`
                    ) : (
                      stepNum
                    )}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Interactive GA4 Admin Console */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-mono text-[#1A73E8]">
                  analytics.google.com · Admin Setup Simulator
                </div>
                <h3 className="font-display text-2xl font-bold text-[#1E2B31] mt-0.5">
                  {activeStep < 10 ? `0${activeStep}` : activeStep}. {TEN_STEPS[activeStep - 1]}
                </h3>
              </div>
              {config.completed && (
                <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Setup Verified
                </span>
              )}
            </div>

            {/* Step Bodies */}
            <div className="min-h-[240px]">
              {activeStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#475569]">
                    Sign in with a Google account at <code className="font-mono text-[#1E2B31]">analytics.google.com</code>.
                    For businesses or colleges, use an institutional email rather than a personal one so access stays with the organisation.
                  </p>
                  <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#64748B]">Signed-in Workshop Account</div>
                      <div className="text-sm font-semibold text-[#1E2B31]">
                        participant@elysiumacademy.org
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700">Authenticated</span>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#475569]">
                    On the Google Analytics welcome screen, select <strong>Start measuring</strong> to begin creating your first account and property.
                  </p>
                  <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-6 text-center space-y-3">
                    <div className="font-display text-2xl font-bold text-[#1E2B31]">
                      Welcome to Google Analytics
                    </div>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      Measure website and app interactions in real time with Google Analytics 4.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-5 py-2.5 rounded-lg bg-[#1A73E8] text-white text-sm font-medium hover:bg-[#1557B0] transition-colors cursor-pointer"
                    >
                      Start measuring
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-[#1E2B31]">Account name</span>
                    <input
                      type="text"
                      value={config.accountName}
                      onChange={(e) =>
                        onUpdateConfig((prev) => ({ ...prev, accountName: e.target.value }))
                      }
                      placeholder="e.g., Elysium College"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </label>
                  <p className="text-xs text-[#64748B]">
                    Usually one Account per organisation or client. Multiple websites can live inside this Account as separate Properties.
                  </p>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-[#1E2B31]">Property name</span>
                    <input
                      type="text"
                      value={config.propertyName}
                      onChange={(e) =>
                        onUpdateConfig((prev) => ({ ...prev, propertyName: e.target.value }))
                      }
                      placeholder="e.g., Admissions Website"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[#1E2B31]">Reporting time zone</span>
                      <select
                        value={config.timezone}
                        onChange={(e) =>
                          onUpdateConfig((prev) => ({ ...prev, timezone: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                      >
                        <option value="United States — Los Angeles (GMT-08:00)">
                          United States — Los Angeles (GMT-08:00)
                        </option>
                        <option value="India Time (GMT+05:30)">India Time (GMT+05:30)</option>
                        <option value="United Kingdom (GMT+00:00)">United Kingdom (GMT+00:00)</option>
                      </select>
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[#1E2B31]">Currency</span>
                      <select
                        value={config.currency}
                        onChange={(e) =>
                          onUpdateConfig((prev) => ({ ...prev, currency: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                      >
                        <option value="US Dollar (USD $)">US Dollar (USD $)</option>
                        <option value="Indian Rupee (INR ₹)">Indian Rupee (INR ₹)</option>
                        <option value="Euro (EUR €)">Euro (EUR €)</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-[#1E2B31]">Industry category</span>
                    <select
                      value={config.industry}
                      onChange={(e) =>
                        onUpdateConfig((prev) => ({ ...prev, industry: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                    >
                      <option value="Jobs and Education">Jobs and Education</option>
                      <option value="Shopping & Retail">Shopping & Retail</option>
                      <option value="Business & Industrial">Business & Industrial</option>
                      <option value="News & Media">News & Media</option>
                    </select>
                  </label>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#1E2B31]">Business objectives</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {OBJECTIVES_LIST.map((obj) => {
                        const selected = config.objectives.includes(obj);
                        return (
                          <button
                            key={obj}
                            type="button"
                            onClick={() => toggleObjective(obj)}
                            className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                              selected
                                ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#1E2B31] font-medium'
                                : 'bg-white border-slate-200 text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            {obj}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-[#334155]">
                    <Globe className="w-4 h-4 text-[#1A73E8]" />
                    <span>Platform selected: <strong>Web</strong></span>
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-[#1E2B31]">Website URL</span>
                    <input
                      type="url"
                      value={config.websiteUrl}
                      onChange={(e) =>
                        onUpdateConfig((prev) => ({ ...prev, websiteUrl: e.target.value }))
                      }
                      placeholder="https://www.elysiumcollege.edu.in"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </label>
                  <p className="text-xs text-[#64748B]">
                    Creating a Web data stream generates a unique Measurement ID for your website.
                  </p>
                </div>
              )}

              {activeStep === 7 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#F6F8F9] border border-slate-200 rounded-lg p-4">
                    <div>
                      <div className="text-sm font-semibold text-[#1E2B31]">
                        Enhanced measurement
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Automatically measures page views, scrolls, outbound clicks, site search, video engagement, and file downloads.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateConfig((prev) => ({
                          ...prev,
                          enhancedMeasurement: !prev.enhancedMeasurement,
                        }))
                      }
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                        config.enhancedMeasurement
                          ? 'bg-[#1A73E8] text-white'
                          : 'bg-slate-200 text-[#475569]'
                      }`}
                    >
                      {config.enhancedMeasurement ? 'ON (Recommended)' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 8 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#475569]">
                    Your Web data stream is ready. Copy the Measurement ID below — you will need it in Step 09 to connect your website.
                  </p>
                  <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-[#64748B]">Measurement ID</div>
                      <div className="font-mono text-xl font-semibold text-[#1A73E8]">
                        {config.measurementId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? 'Copied' : 'Copy Measurement ID'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 9 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg">
                    {(
                      [
                        { id: 'manual', label: 'Manual HTML' },
                        { id: 'wordpress', label: 'WordPress' },
                        { id: 'blogger', label: 'Blogger / Google Sites' },
                      ] as const
                    ).map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          onUpdateConfig((prev) => ({ ...prev, installMethod: method.id }))
                        }
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          config.installMethod === method.id
                            ? 'bg-white text-[#1E2B31] shadow-sm'
                            : 'text-[#475569] hover:text-[#1E2B31]'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {config.installMethod === 'manual' && (
                    <div className="space-y-3">
                      <p className="text-xs text-[#475569]">
                        Paste the Google tag code immediately after the opening{' '}
                        <code className="font-mono">&lt;head&gt;</code> tag on every page.
                      </p>
                      <div className="bg-[#1B262C] text-slate-200 rounded-lg p-3.5 font-mono text-xs overflow-x-auto leading-5">
                        <div>&lt;head&gt;</div>
                        {config.tagInstalled ? (
                          <div className="text-[#F5A623] pl-3">
                            <div>&lt;!-- Google tag (gtag.js) --&gt;</div>
                            <div>
                              &lt;script async src=&quot;https://www.googletagmanager.com/gtag/js?id=
                              {config.measurementId}&quot;&gt;&lt;/script&gt;
                            </div>
                            <div>
                              &lt;script&gt;gtag(&apos;config&apos;, &apos;{config.measurementId}&apos;);&lt;/script&gt;
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 pl-3 italic">
                            &lt;!-- Click below to insert the Google tag here --&gt;
                          </div>
                        )}
                        <div className="pl-3">&lt;title&gt;{config.propertyName}&lt;/title&gt;</div>
                        <div>&lt;/head&gt;</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateConfig((prev) => ({ ...prev, tagInstalled: true }));
                          setStepNotice('');
                        }}
                        className="px-4 py-2 rounded-lg bg-[#1A73E8] text-white text-xs font-medium hover:bg-[#1557B0] transition-colors cursor-pointer"
                      >
                        {config.tagInstalled ? 'Google Tag Installed' : 'Insert Google Tag After <head>'}
                      </button>
                    </div>
                  )}

                  {config.installMethod === 'wordpress' && (
                    <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-[#1E2B31]">
                        Site Kit by Google (WordPress Plugin)
                      </div>
                      <p className="text-xs text-[#475569]">
                        Install the official Site Kit by Google plugin inside WordPress Admin and connect your GA4 property without editing HTML.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setWpConnected(true);
                          onUpdateConfig((prev) => ({ ...prev, tagInstalled: true }));
                          setStepNotice('');
                        }}
                        className="px-4 py-2 rounded-lg bg-[#1A73E8] text-white text-xs font-medium hover:bg-[#1557B0] transition-colors cursor-pointer"
                      >
                        {wpConnected ? `Connected to ${config.measurementId}` : 'Connect Site Kit Analytics'}
                      </button>
                    </div>
                  )}

                  {config.installMethod === 'blogger' && (
                    <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-[#1E2B31]">
                        Blogger / Google Sites → Settings → Analytics
                      </div>
                      <p className="text-xs text-[#475569]">
                        Paste your Measurement ID ({config.measurementId}) in the Analytics Measurement ID field.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={bloggerInput}
                          onChange={(e) => setBloggerInput(e.target.value)}
                          placeholder={config.measurementId}
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyBlogger}
                          className="px-4 py-2 rounded-lg bg-[#1A73E8] text-white text-xs font-medium hover:bg-[#1557B0] transition-colors cursor-pointer"
                        >
                          Save ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeStep === 10 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#475569]">
                    By default, GA4 retains user-level and event-level exploration data for only{' '}
                    <strong>2 months</strong>. Change it to <strong>14 months</strong> under{' '}
                    <span className="font-mono text-xs">Admin → Data settings → Data retention</span>.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([2, 14] as const).map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => {
                          onUpdateConfig((prev) => ({ ...prev, dataRetentionMonths: months }));
                          setStepNotice('');
                        }}
                        className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                          config.dataRetentionMonths === months
                            ? 'bg-[#E8F0FE] border-[#1A73E8]'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-display text-2xl font-bold text-[#1E2B31]">
                          {months} months
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">
                          {months === 2 ? 'Default (too short for year-over-year)' : 'Recommended maximum for standard GA4'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {stepNotice && (
              <div
                className={`text-xs rounded-lg px-4 py-3 border ${
                  config.completed && activeStep === 10
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {stepNotice}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => {
                  setActiveStep((s) => Math.max(1, s - 1));
                  setStepNotice('');
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-[#334155] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-lg bg-[#2D3E46] text-white text-xs font-medium hover:bg-[#1E2B31] transition-colors cursor-pointer"
              >
                {activeStep === 10 ? 'Save 14-Month Retention & Complete' : 'Continue to Next Step'}
              </button>
            </div>
          </div>
        </div>

        {/* Slide 11 Note */}
        <div className="bg-[#ECEFF1] rounded-xl px-5 py-3.5 text-sm text-[#1E2B31]">
          <strong>No website?</strong> Watch the setup above, then use the{' '}
          <strong>GA4 demo account (Google Merchandise Store)</strong> for the rest of today — available in the dataset switcher in Modules 3–6.
        </div>
      </section>
    </div>
  );
};
