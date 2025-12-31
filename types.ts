export interface TradeAnalysis {
  strategy: string;
  ticker: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  delta: number;
  ivRank: number;
  riskRewardRatio: string;
  verdict: 'Good' | 'Fair' | 'Avoid';
  reasoning: string;
  riskFactors: string[];
  suggestedAdjustments: string[];
  earningsDate?: string;
  dte?: number; 
  alternativeTickers?: string[];
  pivotSuggestion?: {
    suggestedStrategy: string;
    reason: string;
    efficiencyGain: string;
  };
}

export interface ManagementAdvice {
  verdict: 'Stay' | 'Adjust' | 'Exit';
  headline: string;
  mechanicalAdvice: string;
  adjustmentTactics: string[];
  deltaNeutralizingMove?: string;
  buyingPowerImpact: string;
}

export interface TacticalOpportunity {
  ticker: string;
  ivRank: number;
  reason: string;
  strategy: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  earningsDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface AdjustmentResult {
  improvementRating: number;
  summaryVerdict: string;
  deltaShift: string;
  thetaImpact: string;
  riskImpact: string;
  changesFound: string[];
}

export interface LoggedTrade {
  id: string;
  ticker: string;
  strategy: string;
  dte: number;
  openDate: string;
  status: 'Open' | 'Closed' | 'Discarded';
  gtcOrder: boolean;
  profitTarget: number;
  sentiment: string;
  creditReceived: number;
}

export interface MarketAlert {
  id: string;
  ticker: string;
  type: 'News' | 'Technical' | 'Volatility' | 'Sentiment';
  severity: 'Low' | 'Medium' | 'High';
  headline: string;
  impactDescription: string;
  timestamp: string;
  sourceUrl?: string;
  tacticalAdvice?: string;
  entryRecommendation?: string;
}

export interface TickerTrend {
  symbol: string;
  change: string;
  vibe: 'Bullish' | 'Bearish' | 'Neutral';
  note: string;
}

export interface WatchlistItem {
  ticker: string;
  catalyst: string;
  deepDive: string;
  technicalSetup: string;
}

export interface MarketOutlook {
  reportDate: string;
  targetSession: string;
  globalMacroVibe: string;
  futuresLevels: {
    symbol: string;
    price: string;
    change: string;
    vibe: 'Bullish' | 'Bearish' | 'Flat';
  }[];
  highImpactEvents: {
    day: string;
    event: string;
    impact: 'Low' | 'Medium' | 'High';
    details: string;
  }[];
  openingBellForecast: string;
  technicalWatchlist: WatchlistItem[];
}

export type BrokerageProvider = 'Tastytrade' | 'Thinkorswim' | 'Robinhood' | 'Schwab' | 'E*Trade' | 'Interactive Brokers';

export interface BrokerSession {
  token: string;
  email: string;
  broker: BrokerageProvider;
  accountNumber?: string;
}

export interface TastySession {
  token: string;
  email: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SCANNING_OPPS = 'SCANNING_OPPS',
  COMPLETED = 'COMPLETED',
  SCANNING_INTEL = 'SCANNING_INTEL',
  GENERATING_OUTLOOK = 'GENERATING_OUTLOOK',
  ERROR = 'ERROR'
}