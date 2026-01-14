
import React from 'react';
import { InvestmentConcept, RankingCriterion } from './types';

export const COUNTRIES = [
  'USA', 
  'China', 
  'Japan', 
  'UK', 
  'India', 
  'France', 
  'Germany', 
  'Canada', 
  'Switzerland', 
  'Hong Kong', 
  'South Korea', 
  'Australia', 
  'Taiwan', 
  'Netherlands', 
  'Brazil', 
  'Saudi Arabia', 
  'Singapore', 
  'South Africa', 
  'UAE', 
  'Global', 
  'Other'
];

export const CONCEPT_CONFIGS: Record<InvestmentConcept, { description: string; icon: React.ReactNode; criteria: RankingCriterion[] }> = {
  [InvestmentConcept.ESG_EXCELLENCE]: {
    description: 'Companies with top-tier environmental, social, and governance ratings.',
    icon: <i className="fas fa-leaf text-green-500"></i>,
    criteria: [
      { label: 'Carbon Intensity', weight: 0.4, description: 'Scope 1 & 2 emissions relative to revenue.' },
      { label: 'Board Diversity', weight: 0.3, description: 'Percentage of independent and diverse directors.' },
      { label: 'Labor Standards', weight: 0.3, description: 'Safety records and employee turnover rates.' }
    ]
  },
  [InvestmentConcept.VALUE_RECOVERY]: {
    description: 'Undervalued stocks with strong balance sheets poised for a turnaround.',
    icon: <i className="fas fa-chart-line text-blue-500"></i>,
    criteria: [
      { label: 'P/B Ratio', weight: 0.4, description: 'Price-to-book ratio relative to 5-year average.' },
      { label: 'Debt/Equity', weight: 0.3, description: 'Solvency and financial health indicators.' },
      { label: 'Earnings Momentum', weight: 0.3, description: 'Positive revisions in analyst earnings forecasts.' }
    ]
  },
  [InvestmentConcept.HIGH_GROWTH_TECH]: {
    description: 'Fast-growing technology firms with significant market share potential.',
    icon: <i className="fas fa-rocket text-purple-500"></i>,
    criteria: [
      { label: 'Revenue Growth', weight: 0.5, description: 'Year-over-year top-line expansion.' },
      { label: 'R&D/Sales', weight: 0.3, description: 'Investment in future innovation.' },
      { label: 'TAM Expansion', weight: 0.2, description: 'Total Addressable Market growth trajectory.' }
    ]
  },
  [InvestmentConcept.DIVIDEND_ARISTOCRATS]: {
    description: 'Companies with a proven track record of consistent dividend growth.',
    icon: <i className="fas fa-coins text-yellow-500"></i>,
    criteria: [
      { label: 'Payout Ratio', weight: 0.4, description: 'Sustainability of dividend distributions.' },
      { label: 'Div Growth History', weight: 0.4, description: 'Consecutive years of increases.' },
      { label: 'Free Cash Flow', weight: 0.2, description: 'Cash generation capability.' }
    ]
  },
  [InvestmentConcept.DEEP_VALUE]: {
    description: 'Stocks trading significantly below their intrinsic or liquidation value.',
    icon: <i className="fas fa-gem text-indigo-500"></i>,
    criteria: [
      { label: 'P/E Ratio', weight: 0.4, description: 'Low price-to-earnings relative to peers.' },
      { label: 'EV/EBITDA', weight: 0.4, description: 'Enterprise value multiples.' },
      { label: 'Asset Quality', weight: 0.2, description: 'Tangible book value stability.' }
    ]
  },
  [InvestmentConcept.GARP]: {
    description: 'Combining growth and value styles; high earnings growth with low P/E.',
    icon: <i className="fas fa-scale-balanced text-emerald-600"></i>,
    criteria: [
      { label: 'PEG Ratio', weight: 0.5, description: 'P/E relative to expected earnings growth (Target 0.5 - 1.0).' },
      { label: 'EPS Growth', weight: 0.3, description: 'Historical and forward 3-5 year growth rates.' },
      { label: 'ROE', weight: 0.2, description: 'Return on Equity indicating operational efficiency.' }
    ]
  },
  [InvestmentConcept.HUNDRED_BAGGER]: {
    description: 'Small-cap stocks with potential for 100x returns through long-term compounding.',
    icon: <i className="fas fa-arrow-trend-up text-orange-600"></i>,
    criteria: [
      { label: 'Market Cap Ceiling', weight: 0.4, description: 'Focus on small/micro-caps with huge runways.' },
      { label: 'ROIC', weight: 0.4, description: 'Ability to reinvest capital at high rates of return.' },
      { label: 'Revenue CAGR', weight: 0.2, description: 'Persistent high double-digit top-line growth.' }
    ]
  },
  [InvestmentConcept.PETER_LYNCH]: {
    description: 'Stocks with low debt, strong cash flow, and understandable business models.',
    icon: <i className="fas fa-magnifying-glass-chart text-rose-500"></i>,
    criteria: [
      { label: 'Debt/Equity', weight: 0.4, description: 'Focus on strong balance sheets with minimal leverage.' },
      { label: 'Inventory vs Sales', weight: 0.3, description: 'Monitoring if inventories are growing faster than sales.' },
      { label: 'Earnings Yield', weight: 0.3, description: 'Yield relative to historical averages and peers.' }
    ]
  },
  [InvestmentConcept.WARREN_BUFFETT]: {
    description: 'Value investing based on economic moats, high ROE, and stable margins.',
    icon: <i className="fas fa-fort-awesome text-amber-700"></i>,
    criteria: [
      { label: 'Operating Margin', weight: 0.4, description: 'Consistently high and stable margins vs industry.' },
      { label: 'Economic Moat', weight: 0.4, description: 'Qualitative assessment of brand, scale, or switching costs.' },
      { label: 'Owner Earnings', weight: 0.2, description: 'Cash flow available to shareholders after maintenance CapEx.' }
    ]
  },
  [InvestmentConcept.COFFEE_CAN]: {
    description: 'Buy-and-hold (10+ years) in high-quality companies with persistent ROCE > 15%.',
    icon: <i className="fas fa-archive text-amber-600"></i>,
    criteria: [
      { label: 'Revenue Persistence', weight: 0.3, description: 'Consistent 15%+ top-line growth over 10 years.' },
      { label: 'ROCE Barrier', weight: 0.4, description: 'Return on Capital Employed consistently above 15%.' },
      { label: 'Moat Strength', weight: 0.3, description: 'Unassailable competitive advantage and pricing power.' }
    ]
  }
};
