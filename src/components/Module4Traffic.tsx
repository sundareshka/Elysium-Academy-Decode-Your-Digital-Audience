import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpDown, Check, Copy, Link2, Search } from 'lucide-react';
import { ANALYTICS_DATASETS, formatDelta, formatDuration } from '../data/workshopData';
import { ModuleId } from '../types/workshop';

interface Module4TrafficProps {
  dataset: 'demo' | 'custom';
  onChangeDataset: (d: 'demo' | 'custom') => void;
  onComplete: () => void;
  onNavigate: (id: ModuleId) => void;
}

const CHANNEL_CARDS = [
  {
    name: 'Organic Search',
    desc: 'Clicked an unpaid result on Google or Bing',
    example: 'Example: google / organic',
  },
  {
    name: 'Direct',
    desc: 'Typed the address, used a bookmark, or source unknown',
    example: 'Shown as (direct) / (none)',
  },
  {
    name: 'Referral',
    desc: 'Clicked a link on another website',
    example: 'Example: a news article',
  },
  {
    name: 'Organic Social',
    desc: 'Clicked a non-ad link on a social platform',
    example: 'Example: an Instagram bio link',
  },
];

export const Module4Traffic: React.FC<Module4TrafficProps> = ({
  dataset,
  onChangeDataset,
  onComplete,
  onNavigate,
}) => {
  const [dateRange, setDateRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [comparePrev, setComparePrev] = useState<boolean>(true);
  const [dimension, setDimension] = useState<'channel' | 'sourceMedium'>('channel');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sessions' | 'engagedSessions' | 'avgEngagementSeconds'>(
    'sessions'
  );
  const [pollChoice, setPollChoice] = useState<string>('');

  // UTM Builder (Slide 16 Tip)
  const [utmBase, setUtmBase] = useState<string>('https://www.elysiumacademy.org/workshop');
  const [utmSource, setUtmSource] = useState<string>('whatsapp');
  const [utmMedium, setUtmMedium] = useState<string>('social');
  const [utmCampaign, setUtmCampaign] = useState<string>('nov_2026_workshop');
  const [copiedUtm, setCopiedUtm] = useState<boolean>(false);

  const activePack = ANALYTICS_DATASETS[dataset];
  const rawRows = activePack.channelsByRange[dateRange];

  const totalSessions = useMemo(
    () => rawRows.reduce((sum, r) => sum + r.sessions, 0),
    [rawRows]
  );

  const filteredRows = useMemo(() => {
    return rawRows
      .filter((r) => {
        const text = `${r.channel} ${r.sourceMedium}`.toLowerCase();
        return text.includes(searchTerm.trim().toLowerCase());
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [rawRows, searchTerm, sortBy]);

  const topChannel = useMemo(
    () => [...rawRows].sort((a, b) => b.sessions - a.sessions)[0]?.channel || 'Organic Search',
    [rawRows]
  );

  const generatedUtmUrl = useMemo(() => {
    const cleanBase = utmBase.trim() || 'https://www.elysiumacademy.org';
    const sep = cleanBase.includes('?') ? '&' : '?';
    const params = new URLSearchParams();
    if (utmSource.trim()) params.set('utm_source', utmSource.trim().toLowerCase());
    if (utmMedium.trim()) params.set('utm_medium', utmMedium.trim().toLowerCase());
    if (utmCampaign.trim()) params.set('utm_campaign', utmCampaign.trim().toLowerCase());
    return `${cleanBase}${sep}${params.toString()}`;
  }, [utmBase, utmSource, utmMedium, utmCampaign]);

  const handleCopyUtm = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedUtmUrl).catch(() => {});
    }
    setCopiedUtm(true);
    window.setTimeout(() => setCopiedUtm(false), 1800);
  };

  const handlePollVote = (channelName: string) => {
    setPollChoice(channelName);
    if (channelName === topChannel) {
      onComplete();
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">
            Module 4 · 11:50 – 12:05 · Slides 15–16
          </div>
          <h1 className="font-display text-4xl font-bold text-[#1E2B31] mt-1">
            Organic, direct, referral and social traffic
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('module-5')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D3E46] text-white text-sm font-medium hover:bg-[#1E2B31] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Next: User Engagement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide 15: Four Channels Every Beginner Must Know */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Channel Definitions · Slide 15</div>
          <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-1">
            Four channels every beginner must know
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNEL_CARDS.map((card) => (
            <div
              key={card.name}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-[#1E2B31]">{card.name}</h3>
                <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-mono text-[#64748B]">
                {card.example}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#ECEFF1] rounded-xl px-5 py-3.5 text-sm text-[#1E2B31]">
          GA4 sorts each session using its <strong>source</strong> (where from) and{' '}
          <strong>medium</strong> (what type of route).
        </div>
      </section>

      {/* Slide 16: Simulated GA4 Traffic Acquisition Report */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Hands-On Lab · Slide 16 · Reports / Acquisition / Traffic acquisition
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1E2B31] mt-0.5">
              Read the Traffic acquisition report
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dataset Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeDataset('demo')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  dataset === 'demo'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                GA4 Demo Store
              </button>
              <button
                type="button"
                onClick={() => onChangeDataset('custom')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  dataset === 'custom'
                    ? 'bg-white text-[#1E2B31] shadow-sm'
                    : 'text-[#475569] hover:text-[#1E2B31]'
                }`}
              >
                College Case Study
              </button>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '28d' | '90d')}
              aria-label="Select GA4 date range"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
            >
              <option value="7d">Last 7 days</option>
              <option value="28d">Last 28 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <button
              type="button"
              onClick={() => setComparePrev((c) => !c)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                comparePrev
                  ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]'
                  : 'bg-white border-slate-300 text-[#475569]'
              }`}
            >
              {comparePrev ? 'Comparing previous period' : 'Compare previous period'}
            </button>
          </div>
        </div>

        {/* Simulated GA4 Workspace Table & Channel Share Visual */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-3.5 bg-[#F6F8F9] border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search channel or source…"
                  aria-label="Filter traffic channels"
                  className="bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#1E2B31] focus:outline-none focus:border-[#1A73E8] w-52"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64748B]">First column:</span>
                <select
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value as 'channel' | 'sourceMedium')}
                  aria-label="Switch primary dimension"
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#1E2B31] focus:outline-none focus:border-[#1A73E8]"
                >
                  <option value="channel">Session default channel group</option>
                  <option value="sourceMedium">Session source / medium</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-mono text-[#475569] tabular-nums">
              Total sessions: <strong className="text-[#1E2B31]">{totalSessions.toLocaleString()}</strong>
            </div>
          </div>

          {/* Horizontal Share Breakdown Bar */}
          <div className="px-5 py-4 border-b border-slate-200 space-y-2.5">
            <div className="text-xs font-medium text-[#64748B]">
              Share of total sessions ({dateRange === '28d' ? 'Last 28 days' : dateRange === '7d' ? 'Last 7 days' : 'Last 90 days'})
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              {rawRows.map((row, idx) => {
                const share = (row.sessions / totalSessions) * 100;
                const colors = ['bg-[#1A73E8]', 'bg-[#2D3E46]', 'bg-[#F5A623]', 'bg-[#0F9D58]'];
                return (
                  <div
                    key={row.channel}
                    style={{ width: `${share}%` }}
                    className={`${colors[idx % colors.length]} h-full transition-all duration-300`}
                    title={`${row.channel}: ${share.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#334155]">
              {rawRows.map((row) => {
                const share = ((row.sessions / totalSessions) * 100).toFixed(1);
                return (
                  <span key={row.channel} className="tabular-nums">
                    {dimension === 'channel' ? row.channel : row.sourceMedium}:{' '}
                    <strong className="font-mono text-[#1E2B31]">{share}%</strong>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-[#475569]">
                  <th className="py-3 px-5 font-semibold">
                    {dimension === 'channel'
                      ? 'Session default channel group'
                      : 'Session source / medium'}
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">
                    <button
                      type="button"
                      onClick={() => setSortBy('sessions')}
                      className="inline-flex items-center gap-1 hover:text-[#1E2B31] cursor-pointer"
                    >
                      <span>Sessions</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Share</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    <button
                      type="button"
                      onClick={() => setSortBy('engagedSessions')}
                      className="inline-flex items-center gap-1 hover:text-[#1E2B31] cursor-pointer"
                    >
                      <span>Engaged sessions</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Engagement rate</th>
                  <th className="py-3 px-5 font-semibold text-right">
                    <button
                      type="button"
                      onClick={() => setSortBy('avgEngagementSeconds')}
                      className="inline-flex items-center gap-1 hover:text-[#1E2B31] cursor-pointer"
                    >
                      <span>Avg engagement time</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#64748B]">
                      No matching traffic channels found for &ldquo;{searchTerm}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const sharePct = ((row.sessions / totalSessions) * 100).toFixed(1);
                    const engRate = ((row.engagedSessions / row.sessions) * 100).toFixed(1);
                    const delta = formatDelta(row.sessions, row.prevSessions);
                    return (
                      <tr key={row.channel} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-5 font-medium text-[#1E2B31]">
                          {dimension === 'channel' ? (
                            <span>{row.channel}</span>
                          ) : (
                            <span className="font-mono text-xs text-[#1A73E8]">
                              {row.sourceMedium}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <div className="font-semibold text-[#1E2B31]">
                            {row.sessions.toLocaleString()}
                          </div>
                          {comparePrev && (
                            <div
                              className={`text-[11px] ${
                                delta.positive ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {delta.text} vs prev
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-[#475569] tabular-nums">
                          {sharePct}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-[#334155] tabular-nums">
                          {row.engagedSessions.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-medium text-[#1E2B31] tabular-nums">
                          {engRate}%
                        </td>
                        <td className="py-3 px-5 text-right font-mono text-xs text-[#334155] tabular-nums">
                          {formatDuration(row.avgEngagementSeconds)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slide 16 Poll + UTM Campaign Builder Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Poll Check */}
          <div className="lg:col-span-5 bg-[#2D3E46] text-white rounded-xl p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="text-xs font-medium text-[#F5A623]">Module 4 Poll · 8 MIN</div>
              <h3 className="font-display text-2xl font-bold text-white">
                Which channel brings the most sessions?
              </h3>
              <p className="text-xs text-slate-300">
                Inspect the table above for <strong>{activePack.label}</strong> and select the leading channel.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {rawRows.map((r) => {
                  const chosen = pollChoice === r.channel;
                  return (
                    <button
                      key={r.channel}
                      type="button"
                      onClick={() => handlePollVote(r.channel)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                        chosen
                          ? 'bg-[#F5A623] border-[#F5A623] text-[#1E2B31] font-semibold'
                          : 'bg-[#374B54] border-white/10 text-slate-200 hover:border-white/30'
                      }`}
                    >
                      {r.channel}
                    </button>
                  );
                })}
              </div>
            </div>

            {pollChoice && (
              <div className="text-xs rounded-lg px-3.5 py-2.5 bg-[#374B54] text-slate-200">
                {pollChoice === topChannel ? (
                  <span>
                    <strong className="text-[#F5A623]">Correct:</strong> {topChannel} brings the
                    highest share of sessions (
                    {((rawRows.find((x) => x.channel === topChannel)!.sessions / totalSessions) * 100).toFixed(1)}
                    %). Switch the first column to <em>Session source / medium</em> to see exact
                    referrers.
                  </span>
                ) : (
                  <span>
                    Check the Sessions column above — <strong>{topChannel}</strong> currently drives
                    the most sessions.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Slide 16 Tip: Interactive Campaign UTM URL Builder */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-[#B97300]">
                  Slide 16 Tip · Stop losing WhatsApp & QR traffic into &ldquo;Direct&rdquo;
                </div>
                <h3 className="font-display text-2xl font-bold text-[#1E2B31] mt-0.5">
                  Interactive Campaign UTM URL Builder
                </h3>
              </div>
              <Link2 className="w-5 h-5 text-[#64748B] shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-[#475569]">utm_source</span>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="whatsapp"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono text-[#1E2B31]"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-[#475569]">utm_medium</span>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="social / email / qr"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono text-[#1E2B31]"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-[#475569]">utm_campaign</span>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="admissions_2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono text-[#1E2B31]"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-[#475569]">Destination Page URL</span>
              <input
                type="url"
                value={utmBase}
                onChange={(e) => setUtmBase(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono text-[#1E2B31]"
              />
            </label>

            <div className="bg-[#F6F8F9] border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <code className="font-mono text-xs text-[#1A73E8] break-all">{generatedUtmUrl}</code>
              <button
                type="button"
                onClick={handleCopyUtm}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E2B31] hover:bg-slate-50 shrink-0 cursor-pointer"
              >
                {copiedUtm ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUtm ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="text-xs text-[#5A6B73]">
              In GA4 Traffic acquisition, clicks on this link will report cleanly as{' '}
              <code className="font-mono text-[#1E2B31] font-medium">
                {utmSource || 'source'} / {utmMedium || 'medium'}
              </code>{' '}
              instead of unknown <code className="font-mono">(direct) / (none)</code>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
