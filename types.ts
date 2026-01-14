
export type Country = string;

export enum InvestmentConcept {
  ESG_EXCELLENCE = 'ESG Excellence',
  VALUE_RECOVERY = 'Value Recovery',
  HIGH_GROWTH_TECH = 'High-Growth Tech',
  DIVIDEND_ARISTOCRATS = 'Dividend Aristocrats',
  DEEP_VALUE = 'Deep Value',
  GARP = 'Growth at Reasonable Price (GARP)',
  HUNDRED_BAGGER = '100 Bagger Potential',
  PETER_LYNCH = 'Peter Lynch Strategy',
  WARREN_BUFFETT = 'Warren Buffett Strategy',
  COFFEE_CAN = 'Coffee Can Portfolio'
}

export interface StockInfo {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  price: string;
  targetPrice: string;
  marketCap: string;
  recommendation: 'Buy' | 'Hold' | 'Sell';
  score: number; // Institutional scale 1-10
  lastUpdated?: string;
  sources?: { title: string; uri: string }[];
}

export interface CFAReport {
  basicInfo: StockInfo;
  businessDescription: string;
  industryOverview: string;
  investmentSummary: string;
  valuation: string;
  financialAnalysis: string;
  investmentRisks: string;
  esgSection: string;
  sources?: { title: string; uri: string }[];
}

export interface BacktestResult {
  concept: InvestmentConcept;
  country: Country;
  period: string;
  strategyReturn: number;
  benchmarkReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  topPerformers: { ticker: string; return: string }[];
  analysis: string;
  sources?: { title: string; uri: string }[];
}

export interface RankingCriterion {
  label: string;
  weight: number;
  description: string;
}
