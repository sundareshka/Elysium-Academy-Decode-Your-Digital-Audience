export type ModuleId =
  | 'opening'
  | 'module-1'
  | 'module-2'
  | 'module-3'
  | 'break'
  | 'module-4'
  | 'module-5'
  | 'module-6'
  | 'mini-project';

export interface AgendaItem {
  id: ModuleId;
  time: string;
  session: string;
  topic: string;
  duration: string;
  slides: string;
}

export interface GA4PropertyConfig {
  accountName: string;
  propertyName: string;
  timezone: string;
  currency: string;
  industry: string;
  objectives: string[];
  websiteUrl: string;
  enhancedMeasurement: boolean;
  measurementId: string;
  installMethod: 'manual' | 'wordpress' | 'blogger';
  tagInstalled: boolean;
  dataRetentionMonths: 2 | 14;
  completed: boolean;
}

export interface SimulatedWebsiteSource {
  id: string;
  name: string;
  url: string;
  category: string;
  expectedTagId: string;
  tagType: 'GA4 (G-)' | 'Google Tag Manager (GTM-)';
  htmlLines: string[];
}

export interface ChannelRow {
  channel: 'Organic Search' | 'Direct' | 'Referral' | 'Organic Social' | 'Email';
  sourceMedium: string;
  sessions: number;
  prevSessions: number;
  engagedSessions: number;
  avgEngagementSeconds: number;
  keyEvents: number;
}

export interface PagePerformanceRow {
  path: string;
  title: string;
  views: number;
  prevViews: number;
  users: number;
  avgEngagementSeconds: number;
  mobileEngagementSeconds: number;
  desktopEngagementSeconds: number;
  eventCount: number;
  keyEvents: number;
  diagnosticNote?: {
    issueTitle: string;
    finding: string;
    recommendedFix: string;
    projectedSeconds: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: 'GA4' | 'GSC';
  explanation: string;
  fromSlide: boolean;
}

export interface ReportDraft {
  dataset: 'demo' | 'custom';
  authorName: string;
  periodLabel: string;
  insights: [string, string, string];
  actions: [string, string];
}
