import React, { useMemo, useState } from 'react';
import { Check, Copy, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  ANALYTICS_DATASETS,
  KEEP_LEARNING_DATA,
  WORKSHOP_META,
  formatDelta,
  formatDuration,
} from '../data/workshopData';
import { ReportDraft } from '../types/workshop';

interface MiniProjectClosingProps {
  reportDraft: ReportDraft;
  onUpdateDraft: (updater: (prev: ReportDraft) => ReportDraft) => void;
  onComplete: () => void;
}

function hasQuotedNumber(text: string): boolean {
  return /\d/.test(text);
}

export const MiniProjectClosing: React.FC<MiniProjectClosingProps> = ({
  reportDraft,
  onUpdateDraft,
  onComplete,
}) => {
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackTakeaway, setFeedbackTakeaway] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const activePack = ANALYTICS_DATASETS[reportDraft.dataset];
  const channels = activePack.channelsByRange['28d'];
  const pages = activePack.pagesByRange['28d'].slice(0, 3);

  const totals = useMemo(() => {
    const sessions = channels.reduce((s, r) => s + r.sessions, 0);
    const prevSessions = channels.reduce((s, r) => s + r.prevSessions, 0);
    const engaged = channels.reduce((s, r) => s + r.engagedSessions, 0);
    const avgEngSec = Math.round(
      channels.reduce((s, r) => s + r.avgEngagementSeconds * r.sessions, 0) / sessions
    );
    const keyEvents = channels.reduce((s, r) => s + r.keyEvents, 0);
    const users = Math.round(sessions * 0.78);
    const prevUsers = Math.round(prevSessions * 0.78);
    const engRate = ((engaged / sessions) * 100).toFixed(1);
    return {
      sessions,
      prevSessions,
      users,
      prevUsers,
      engaged,
      engRate,
      avgEngSec,
      keyEvents,
    };
  }, [channels]);

  const insightValidity = reportDraft.insights.map(
    (txt) => txt.trim().length >= 12 && hasQuotedNumber(txt)
  );
  const actionValidity = reportDraft.actions.map((txt) => txt.trim().length >= 10);
  const isReportComplete =
    insightValidity.every(Boolean) && actionValidity.every(Boolean);

  const handleLoadSampleDraft = () => {
    if (reportDraft.dataset === 'custom') {
      onUpdateDraft((prev) => ({
        ...prev,
        insights: [
          'Organic Search is the #1 channel, driving 5,840 sessions (43.3% of total traffic) and growing +18.7% over the previous 28 days.',
          'The Admission Procedure page received 3,800 views but averaged only 12 seconds of engagement (8 s on mobile) due to an unreadable scanned PDF.',
          'Organic Social grew +30.4% to 2,490 sessions, showing strong response to Instagram campaign links.',
        ],
        actions: [
          'Replace the Admission Procedure scanned PDF with a mobile-responsive HTML guide and track Apply button clicks as a key event.',
          'Add consistent UTM parameters (utm_source, utm_medium, utm_campaign) to all WhatsApp, email, and campus QR code links to cut Direct misattribution.',
        ],
      }));
    } else {
      onUpdateDraft((prev) => ({
        ...prev,
        insights: [
          'Organic Search generated 26,840 sessions (46.9% share), growing +14.6% compared to the previous 28 days.',
          'Apparel (/Google+Redesign/Apparel) led page views at 44,820 views with a strong 1 min 56 s average engagement time.',
          'Direct traffic accounts for 29.9% of sessions (17,120) with a lower 61.0% engagement rate compared to Organic Search (73.0%).',
        ],
        actions: [
          'Tag newsletter, WhatsApp, and social bio links with UTM parameters to separate campaign traffic from Direct sessions.',
          'Optimize mobile cart checkout (/basket.html) where mobile engagement drops to 27 seconds versus 65 seconds on desktop.',
        ],
      }));
    }
    onComplete();
  };

  const handleCopyMarkdown = () => {
    const md = `# Website Performance Report — ${activePack.propertyTitle}
Period: Last 28 days vs previous period | Prepared by: ${reportDraft.authorName || 'Workshop Participant'}

## 01. Headline Numbers (Reports Snapshot)
- Users: ${totals.users.toLocaleString()} (${formatDelta(totals.users, totals.prevUsers).text})
- Sessions: ${totals.sessions.toLocaleString()} (${formatDelta(totals.sessions, totals.prevSessions).text})
- Engagement Rate: ${totals.engRate}%
- Average Engagement Time: ${formatDuration(totals.avgEngSec)}

## 02. Traffic Acquisition (Last 28 Days)
${channels
  .map(
    (c) =>
      `- ${c.channel}: ${c.sessions.toLocaleString()} sessions (${((c.sessions / totals.sessions) * 100).toFixed(1)}%)`
  )
  .join('\n')}

## 03. Top Three Pages (Pages and Screens)
${pages
  .map(
    (p, idx) =>
      `${idx + 1}. ${p.title} (${p.path}) — ${p.views.toLocaleString()} views, ${formatDuration(p.avgEngagementSeconds)} avg engagement`
  )
  .join('\n')}

## 04. Three Data-Backed Insights
${reportDraft.insights.map((ins, i) => `${i + 1}. ${ins || '[Pending insight]'}`).join('\n')}

## 05. Two Recommended Actions
${reportDraft.actions.map((act, i) => `${i + 1}. ${act || '[Pending action]'}`).join('\n')}
`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).catch(() => {});
    }
    setCopiedMd(true);
    window.setTimeout(() => setCopiedMd(false), 1800);
  };

  const handlePrintPdf = () => {
    if (isReportComplete) {
      onComplete();
    }
    window.print();
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    onComplete();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            12:23 – 12:30 · Mini Project &amp; Closing · Slides 22–24
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            Website Performance Report
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleDraft}
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Load Sample Insights
          </button>
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-xs font-medium hover:bg-[#1E2B31] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Slide 22 Brief & Checklist */}
      <section className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="text-xs font-medium text-[#64748B]">Mini Project Steps · Slide 22</div>
          <ol className="list-decimal list-inside text-sm text-[#334155] space-y-1.5">
            <li>Set <strong>Last 28 days</strong> and compare with the previous period.</li>
            <li>Fill the headline numbers from <strong>Reports snapshot</strong>.</li>
            <li>Fill the <strong>channel table</strong> and the <strong>top three pages</strong>.</li>
            <li>Write <strong>three insights</strong>. Each must quote a number.</li>
            <li>Write <strong>two actions</strong> and save the report as a PDF.</li>
          </ol>
        </div>

        <div className="lg:col-span-4 bg-[#ECEFF1] rounded-xl p-6 flex flex-col justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E2B31]">Deliverable</h2>
            <p className="text-sm text-[#334155] mt-1">
              A one-page report on your website or the GA4 demo account.
            </p>
          </div>
          <p className="text-xs text-[#5A6B73]">
            Complete it within three days. It can go in your portfolio or LinkedIn profile.
          </p>
        </div>
      </section>

      {/* Interactive One-Page Report Sheet (Printable as clean 1-page PDF) */}
      <section className="print-only-report bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#64748B]">
              One-Page Website Performance Report · Last 28 Days vs Previous Period
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31]">
              {activePack.propertyTitle}
            </h2>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            <select
              value={reportDraft.dataset}
              onChange={(e) =>
                onUpdateDraft((prev) => ({
                  ...prev,
                  dataset: e.target.value as 'demo' | 'custom',
                }))
              }
              aria-label="Choose website dataset for report"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[#1E2B31]"
            >
              <option value="demo">GA4 Demo Account (Google Merchandise Store)</option>
              <option value="custom">College Admissions Case Study</option>
            </select>
            <input
              type="text"
              value={reportDraft.authorName}
              onChange={(e) =>
                onUpdateDraft((prev) => ({ ...prev, authorName: e.target.value }))
              }
              placeholder="Your name (for PDF header)"
              aria-label="Prepared by name"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-[#1E2B31] w-48"
            />
          </div>
        </div>

        {/* 01. Headline Numbers */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-[#475569]">
            01. How many came? · Reports snapshot (Last 28 days)
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F6F8F9] rounded-lg p-4">
              <div className="text-xs text-[#64748B]">Users</div>
              <div className="font-display text-3xl font-bold text-[#1E2B31] tabular-nums">
                {totals.users.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-emerald-700 tabular-nums">
                {formatDelta(totals.users, totals.prevUsers).text} vs prev
              </div>
            </div>
            <div className="bg-[#F6F8F9] rounded-lg p-4">
              <div className="text-xs text-[#64748B]">Sessions</div>
              <div className="font-display text-3xl font-bold text-[#1E2B31] tabular-nums">
                {totals.sessions.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-emerald-700 tabular-nums">
                {formatDelta(totals.sessions, totals.prevSessions).text} vs prev
              </div>
            </div>
            <div className="bg-[#F6F8F9] rounded-lg p-4">
              <div className="text-xs text-[#64748B]">Engagement rate</div>
              <div className="font-display text-3xl font-bold text-[#1E2B31] tabular-nums">
                {totals.engRate}%
              </div>
              <div className="text-xs font-mono text-[#64748B] tabular-nums">
                {totals.engaged.toLocaleString()} engaged
              </div>
            </div>
            <div className="bg-[#F6F8F9] rounded-lg p-4">
              <div className="text-xs text-[#64748B]">Avg engagement time</div>
              <div className="font-display text-3xl font-bold text-[#1E2B31] tabular-nums">
                {formatDuration(totals.avgEngSec)}
              </div>
              <div className="text-xs font-mono text-[#64748B] tabular-nums">
                {totals.keyEvents.toLocaleString()} key events
              </div>
            </div>
          </div>
        </div>

        {/* 02 & 03 Side-by-Side Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#475569]">
              02. From where? · Channel table
            </div>
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#475569]">
                  <th className="py-2 px-3 text-left font-semibold">Channel</th>
                  <th className="py-2 px-3 text-right font-semibold">Sessions</th>
                  <th className="py-2 px-3 text-right font-semibold">Share</th>
                  <th className="py-2 px-3 text-right font-semibold">vs Prev</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {channels.map((c) => {
                  const delta = formatDelta(c.sessions, c.prevSessions);
                  return (
                    <tr key={c.channel}>
                      <td className="py-2 px-3 font-medium text-[#1E2B31]">{c.channel}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {c.sessions.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-[#64748B]">
                        {((c.sessions / totals.sessions) * 100).toFixed(1)}%
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-mono tabular-nums ${
                          delta.positive ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {delta.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#475569]">
              03. What did they do? · Top three pages
            </div>
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#475569]">
                  <th className="py-2 px-3 text-left font-semibold">Page</th>
                  <th className="py-2 px-3 text-right font-semibold">Views</th>
                  <th className="py-2 px-3 text-right font-semibold">Avg time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((p) => (
                  <tr key={p.path}>
                    <td className="py-2 px-3">
                      <div className="font-medium text-[#1E2B31]">{p.title}</div>
                      <div className="font-mono text-[11px] text-[#64748B]">{p.path}</div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {p.views.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {formatDuration(p.avgEngagementSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 04. Three Insights (Live Number-Citation Validator) + Two Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475569]">
                04. Three insights (each must quote a number)
              </span>
              <span className="text-xs font-mono text-[#64748B] tabular-nums">
                {insightValidity.filter(Boolean).length}/3 valid
              </span>
            </div>
            {reportDraft.insights.map((text, idx) => {
              const valid = insightValidity[idx];
              const missingNum = text.trim().length > 0 && !hasQuotedNumber(text);
              return (
                <div key={idx} className="space-y-1">
                  <textarea
                    rows={2}
                    value={text}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateDraft((prev) => {
                        const next = [...prev.insights] as [string, string, string];
                        next[idx] = val;
                        return { ...prev, insights: next };
                      });
                    }}
                    placeholder={`Insight ${idx + 1}: Quote a concrete number or percentage from the tables above…`}
                    aria-label={`Insight ${idx + 1}`}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-[#1E2B31] focus:outline-none focus:border-[#1A73E8] resize-none"
                  />
                  <div className="no-print flex items-center gap-1.5 text-[11px]">
                    {valid ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Quotes numeric evidence
                      </span>
                    ) : missingNum ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Add a number (e.g., sessions, %, or seconds) to satisfy Rule 4
                      </span>
                    ) : (
                      <span className="text-[#64748B]">Required · include a metric</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475569]">
                05. Two recommended actions
              </span>
              <span className="text-xs font-mono text-[#64748B] tabular-nums">
                {actionValidity.filter(Boolean).length}/2 ready
              </span>
            </div>
            {reportDraft.actions.map((text, idx) => (
              <div key={idx} className="space-y-1">
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDraft((prev) => {
                      const next = [...prev.actions] as [string, string];
                      next[idx] = val;
                      return { ...prev, actions: next };
                    });
                  }}
                  placeholder={`Action ${idx + 1}: State one specific change to test based on your insights…`}
                  aria-label={`Action ${idx + 1}`}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-[#1E2B31] focus:outline-none focus:border-[#1A73E8] resize-none"
                />
              </div>
            ))}
            <div className="no-print text-xs text-[#5A6B73] bg-[#F6F8F9] rounded-lg p-3">
              {isReportComplete
                ? 'Report checklist complete. Click "Save as PDF" above to print or export a clean one-page portfolio document.'
                : 'Fill all 3 data-backed insights and 2 actions (or click "Load Sample Insights") to complete the deliverable.'}
            </div>
          </div>
        </div>

        {/* Print Footer Attribution */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
          <span>
            Prepared by {reportDraft.authorName || 'Workshop Participant'} · Decode Your Digital
            Audience ({WORKSHOP_META.organization})
          </span>
          <span>{WORKSHOP_META.website}</span>
        </div>
      </section>

      {/* Slide 23: After Today — Keep Learning */}
      <section className="no-print space-y-4">
        <div>
          <div className="text-xs font-medium text-[#64748B]">After Today · Slide 23</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">Keep learning</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Free tools</h3>
            <ul className="space-y-2.5 text-sm">
              {KEEP_LEARNING_DATA.freeTools.map((tool) => (
                <li key={tool.name}>
                  <div className="font-semibold text-[#1E2B31]">{tool.name}</div>
                  <div className="text-xs text-[#5A6B73]">{tool.detail}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="font-display text-2xl font-bold text-[#1E2B31]">Learning path</h3>
            <ol className="space-y-2.5 text-sm text-[#334155]">
              {KEEP_LEARNING_DATA.learningPath.map((step) => (
                <li
                  key={step}
                  className="py-1.5 border-b border-slate-100 last:border-b-0 font-medium"
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#1E2B31]">
                Elysium Academy courses
              </h3>
              <ul className="space-y-2.5 text-sm">
                {KEEP_LEARNING_DATA.courses.map((course) => (
                  <li key={course.name}>
                    <div className="font-semibold text-[#1E2B31]">{course.name}</div>
                    <div className="text-xs text-[#5A6B73]">{course.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-[#64748B] pt-3 border-t border-slate-100">
              See <strong className="text-[#1E2B31]">{WORKSHOP_META.website}</strong> for the
              current course list and batches.
            </div>
          </div>
        </div>
      </section>

      {/* Slide 24: Thank You, Feedback Form & Contact Footer */}
      <section className="no-print bg-white border border-slate-200 rounded-xl p-7 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <img
              src="/assets/aistudio/ElysiumAcadmemy_a81d78c3.png"
              alt="Elysium Academy"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="text-xs font-medium text-[#64748B]">
                Questions and Feedback · Slide 24
              </div>
              <h2 className="font-display text-4xl font-bold text-[#1E2B31] uppercase mt-1">
                Thank You
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                Share your takeaway or question in the workshop feedback form before you finish.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-xs">
              <div>
                <div className="text-[#64748B]">Website</div>
                <div className="font-semibold text-[#1E2B31] mt-0.5">{WORKSHOP_META.website}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Email</div>
                <div className="font-semibold text-[#1E2B31] mt-0.5">{WORKSHOP_META.email}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Phone</div>
                <div className="font-semibold text-[#1E2B31] mt-0.5 tabular-nums">
                  {WORKSHOP_META.phone}
                </div>
              </div>
            </div>
            <div className="text-xs text-[#64748B]">
              {WORKSHOP_META.address} · {WORKSHOP_META.tagline}
            </div>
          </div>

          {/* Interactive Feedback Form */}
          <div className="lg:col-span-6 bg-[#F6F8F9] border border-slate-200 rounded-xl p-5">
            {feedbackSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <div className="font-display text-2xl font-bold text-[#1E2B31]">
                  Feedback Recorded
                </div>
                <p className="text-xs text-[#475569]">
                  Thank you for participating in Decode Your Digital Audience with Elysium Academy.
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSubmitted(false)}
                  className="text-xs font-medium text-[#1A73E8] hover:underline pt-1 cursor-pointer"
                >
                  Edit response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="text-sm font-semibold text-[#1E2B31]">
                  Workshop Session Feedback
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs text-[#475569]">How useful were the hands-on GA4 labs?</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold cursor-pointer transition-colors ${
                          feedbackRating === star
                            ? 'bg-[#2D3E46] border-[#2D3E46] text-[#F5A623]'
                            : 'bg-white border-slate-300 text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        {star} / 5
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block space-y-1">
                  <span className="text-xs text-[#475569]">
                    Key takeaway or question for Mr Vijay
                  </span>
                  <textarea
                    rows={3}
                    value={feedbackTakeaway}
                    onChange={(e) => setFeedbackTakeaway(e.target.value)}
                    placeholder="e.g., I will set data retention to 14 months and add UTM tags to our WhatsApp links…"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2D3E46] text-white text-xs font-semibold hover:bg-[#1E2B31] transition-colors cursor-pointer"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
