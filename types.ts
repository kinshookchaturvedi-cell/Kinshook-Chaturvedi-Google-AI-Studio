
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

export interface Shareholder {
  name: string;
  percentage: number;
}

export interface StockInfo {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  price: string;
  targetPrice: string;
  marketCap: string;
  recommendation: 'Buy' | 'Hold' | 'Sell';
  score: number;
  liquidity?: string;
  float?: string;
  majorShareholders?: Shareholder[];
  lastUpdated?: string;
  sources?: { title: string; uri: string }[];
}

export interface CFAScores {
  quality: number;
  growth: number;
  valuation: number;
  momentum: number;
  esg: number;
}

export interface ScorecardData {
  essentialChecks: {
    altmanZ: number;
    modifiedC: number;
    piotroskiF: number;
  };
  growth3Y: {
    sales: number;
    ebit: number;
    eps: number;
    bvps: number;
  };
  average3Y: {
    roe: number;
    ebitMargin: number;
    patMargin: number;
  };
  valuationMetrics: {
    peDiscount: number;
    pbDiscount: number;
    dividendYield: number;
  };
  priceData: {
    mcapCr: string;
    lastClose: string;
    pe: string;
    peg: string;
    pe5yMedian: string;
  };
  shareholding: {
    promoter: number;
    fii: number;
    dii: number;
    others: number;
  };
  fundHouseInvested: {
    name: string;
    percentage: number;
  }[];
}

export interface PorterFiveForces {
  newEntrants: string;
  suppliers: string;
  buyers: string;
  substitutes: string;
  rivalry: string;
}

export interface CFAReport {
  basicInfo: StockInfo;
  scores: CFAScores;
  scorecard: ScorecardData;
  businessDescription: string;
  industryOverview: string;
  porterFiveForces?: PorterFiveForces;
  peerGroup?: string[];
  investmentSummary: string;
  mispricingLogic?: string;
  valuation: string;
  absoluteValuationModel?: string;
  relativeValuationModel?: string;
  financialAnalysis: string;
  earningsQuality?: string;
  industrySpecificRatio?: { label: string; value: string };
  investmentRisks: string;
  esgSection: string;
  executiveSummary: string;
  sources?: { title: string; uri: string }[];
  overallScore: number;
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
