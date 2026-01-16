
import { GoogleGenAI, Type } from "@google/genai";
import { StockInfo, CFAReport, InvestmentConcept, Country, BacktestResult, MarketPulse, DeepFinancials } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FAST_MODEL = "gemini-3-flash-preview";

const safeParseJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    const cleanJson = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON parsing error:", e);
    try {
      let recovered = text.trim().replace(/```json\n?|```/g, '');
      if (!recovered.endsWith('}')) recovered += '}';
      return JSON.parse(recovered);
    } catch (innerE) {
      return null;
    }
  }
};

const extractSources = (response: any) => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));
};

export const getDeepFinancials = async (stock: StockInfo): Promise<DeepFinancials> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Extract detailed financial data for ${stock.name} (${stock.ticker}) from official sources or filings.
    Required Data:
    1. Executive summary of latest annual report + 5 key highlights.
    2. 9-year historical data (Revenue, EBITDA, PAT, EPS) with YoY growth %.
    3. Latest 6 quarters data: 
       - Income Statement (Revenue, EBIT, PAT) AND their respective QoQ % growth for each.
       - Balance Sheet (Total Assets, Total Equity, Net Debt) AND their respective QoQ % growth for each.
       - Cash Flow (Operating, Investing, Financing) AND their respective QoQ % growth for each.
    Ensure currency is consistent and reflects the reporting currency of the entity. Return JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "highlights"]
          },
          historical9Y: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                ebitda: { type: Type.NUMBER },
                pat: { type: Type.NUMBER },
                eps: { type: Type.NUMBER },
                revenueYoY: { type: Type.NUMBER },
                patYoY: { type: Type.NUMBER }
              },
              required: ["year", "revenue", "ebitda", "pat", "eps", "revenueYoY", "patYoY"]
            }
          },
          quarterly6Q: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                quarter: { type: Type.STRING },
                incomeStatement: {
                  type: Type.OBJECT,
                  properties: {
                    revenue: { type: Type.NUMBER },
                    revenueQoQ: { type: Type.NUMBER },
                    ebit: { type: Type.NUMBER },
                    ebitQoQ: { type: Type.NUMBER },
                    pat: { type: Type.NUMBER },
                    patQoQ: { type: Type.NUMBER }
                  },
                  required: ["revenue", "revenueQoQ", "ebit", "ebitQoQ", "pat", "patQoQ"]
                },
                balanceSheet: {
                  type: Type.OBJECT,
                  properties: {
                    totalAssets: { type: Type.NUMBER },
                    assetsQoQ: { type: Type.NUMBER },
                    totalEquity: { type: Type.NUMBER },
                    equityQoQ: { type: Type.NUMBER },
                    netDebt: { type: Type.NUMBER },
                    debtQoQ: { type: Type.NUMBER }
                  },
                  required: ["totalAssets", "assetsQoQ", "totalEquity", "equityQoQ", "netDebt", "debtQoQ"]
                },
                cashFlow: {
                  type: Type.OBJECT,
                  properties: {
                    operatingCF: { type: Type.NUMBER },
                    operatingQoQ: { type: Type.NUMBER },
                    investingCF: { type: Type.NUMBER },
                    investingQoQ: { type: Type.NUMBER },
                    financingCF: { type: Type.NUMBER },
                    financingQoQ: { type: Type.NUMBER }
                  },
                  required: ["operatingCF", "operatingQoQ", "investingCF", "investingQoQ", "financingCF", "financingQoQ"]
                }
              },
              required: ["quarter", "incomeStatement", "balanceSheet", "cashFlow"]
            }
          }
        },
        required: ["executiveSummary", "historical9Y", "quarterly6Q"]
      }
    }
  });

  const data = safeParseJson(response.text);
  if (!data) throw new Error("Deep financial extraction failed.");
  return data;
};

export const getMarketPulse = async (country: Country): Promise<MarketPulse> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Get real-time Market Pulse for ${country}. 
    Include:
    - 5 Trending tickers with price (in local currency) and change.
    - 4 Macro indicators (Inflation, Rates, VIX, etc.) with trend.
    - 3 Latest major financial headlines.
    Return JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trending: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ticker: { type: Type.STRING },
                price: { type: Type.STRING },
                change: { type: Type.STRING },
                sentiment: { type: Type.STRING }
              },
              required: ["ticker", "price", "change", "sentiment"]
            }
          },
          macro: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                indicator: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: { type: Type.STRING, description: "'up', 'down', or 'stable'" }
              },
              required: ["indicator", "value", "trend"]
            }
          },
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                source: { type: Type.STRING },
                timestamp: { type: Type.STRING }
              },
              required: ["headline", "source", "timestamp"]
            }
          }
        },
        required: ["trending", "macro", "news"]
      }
    }
  });

  const data = safeParseJson(response.text);
  if (!data) throw new Error("Terminal pulse failed.");
  return data;
};

export const screenStocks = async (country: Country, concept: string, count: number): Promise<StockInfo[]> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Screen top ${count} ${country} stocks for strategy: "${concept}". Return ticker, name, exchange, sector, industry, price (IMPORTANT: include local currency symbol, e.g., ₹ for India, $ for USA, £ for UK), targetPrice (in same local currency), marketCap, recommendation, score (1-100), lastUpdated.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING },
            name: { type: Type.STRING },
            exchange: { type: Type.STRING },
            sector: { type: Type.STRING },
            industry: { type: Type.STRING },
            price: { type: Type.STRING },
            targetPrice: { type: Type.STRING },
            marketCap: { type: Type.STRING },
            recommendation: { type: Type.STRING, description: "'Buy', 'Hold', or 'Sell'" },
            score: { type: Type.NUMBER },
            lastUpdated: { type: Type.STRING }
          },
          required: ["ticker", "name", "exchange", "sector", "price", "score"]
        }
      }
    }
  });

  const data = safeParseJson(response.text);
  if (!data || !Array.isArray(data)) return [];
  
  const sources = extractSources(response);
  return data.map((stock: any) => ({ ...stock, sources }));
};

export const searchSpecificStock = async (query: string, count: number = 1, country: Country = 'Global'): Promise<StockInfo | null> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Locate stock "${query}" in "${country}". Return JSON: ticker, name, exchange, sector, industry, price (include local currency symbol), targetPrice (include local currency symbol), marketCap, recommendation, score (1-100), liquidity (qualitative), float (public shares info), lastUpdated.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  const stock = safeParseJson(response.text);
  if (!stock) return null;
  
  const sources = extractSources(response);
  return { ...stock, sources };
};

export const generateCFAReport = async (stock: StockInfo): Promise<CFAReport> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Act as a Senior Equity Research Analyst. Generate a professional CFA-grade comprehensive research report for ${stock.name} (${stock.ticker}). 

    CRITICAL INSTRUCTION FOR SECTION 5 (VALUATION):
    Provide a DETAILED INTRINSIC VALUE CALCULATION. Include:
    - Multi-stage DCF assumptions: Risk-Free Rate, Beta, Equity Risk Premium, and calculated WACC.
    - Cash Flow Projections: Estimated FCF for next 5 years.
    - Terminal Value calculation: Using Gordon Growth Method (provide terminal growth rate %).
    - Compare this Absolute Valuation against Relative Multiples (P/E, EV/EBITDA).
    - Ensure all pricing and valuation data is in the local currency of the company's primary listing.

    SCORE CALCULATION:
    - Return an overallScore (Conviction) between 1-100.
    - Ensure sub-scores (quality, growth, valuation, momentum, esg) are also 1-100.

    CORE SECTIONS:
    1. BASIC INFO: Liquidity, float, and major shareholders.
    2. BUSINESS DESCRIPTION: Economics and revenue drivers.
    3. INDUSTRY & PORTER'S 5 FORCES.
    4. INVESTMENT SUMMARY: Mispricing logic.
    5. VALUATION: Detailed DCF and Multiples.
    6. FINANCIAL ANALYSIS: Earnings quality and footnotes.
    7. RISKS & 8. ESG.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER, description: "1-100 Conviction Score" },
          scores: { 
            type: Type.OBJECT, 
            properties: { 
              quality: {type: Type.NUMBER}, growth: {type: Type.NUMBER}, valuation: {type: Type.NUMBER}, momentum: {type: Type.NUMBER}, esg: {type: Type.NUMBER} 
            }
          },
          basicInfoEnhancements: {
            type: Type.OBJECT,
            properties: {
              liquidity: { type: Type.STRING },
              float: { type: Type.STRING },
              majorShareholders: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { name: {type: Type.STRING}, percentage: {type: Type.NUMBER} }
                }
              }
            }
          },
          scorecard: {
            type: Type.OBJECT,
            properties: {
              essentialChecks: { type: Type.OBJECT, properties: { altmanZ: {type: Type.NUMBER}, modifiedC: {type: Type.NUMBER}, piotroskiF: {type: Type.NUMBER} }},
              growth3Y: { type: Type.OBJECT, properties: { sales: {type: Type.NUMBER}, ebit: {type: Type.NUMBER}, eps: {type: Type.NUMBER}, bvps: {type: Type.NUMBER} }},
              average3Y: { type: Type.OBJECT, properties: { roe: {type: Type.NUMBER}, ebitMargin: {type: Type.NUMBER}, patMargin: {type: Type.NUMBER} }},
              valuationMetrics: { type: Type.OBJECT, properties: { peDiscount: {type: Type.NUMBER}, pbDiscount: {type: Type.NUMBER}, dividendYield: {type: Type.NUMBER} }},
              priceData: { type: Type.OBJECT, properties: { mcapCr: {type: Type.STRING}, lastClose: {type: Type.STRING}, pe: {type: Type.STRING}, peg: {type: Type.STRING}, pe5yMedian: {type: Type.STRING} }},
              shareholding: { type: Type.OBJECT, properties: { promoter: {type: Type.NUMBER}, fii: {type: Type.NUMBER}, dii: {type: Type.NUMBER}, others: {type: Type.NUMBER} }},
              fundHouseInvested: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, percentage: {type: Type.NUMBER} }}}
            }
          },
          businessDescription: { type: Type.STRING },
          industryOverview: { type: Type.STRING },
          porterFiveForces: {
            type: Type.OBJECT,
            properties: {
              newEntrants: { type: Type.STRING },
              suppliers: { type: Type.STRING },
              buyers: { type: Type.STRING },
              substitutes: { type: Type.STRING },
              rivalry: { type: Type.STRING }
            }
          },
          peerGroup: { type: Type.ARRAY, items: { type: Type.STRING } },
          investmentSummary: { type: Type.STRING },
          mispricingLogic: { type: Type.STRING },
          valuation: { type: Type.STRING },
          absoluteValuationModel: { type: Type.STRING, description: "Detailed Intrinsic Value Logic (WACC, DCF, TV)" },
          relativeValuationModel: { type: Type.STRING, description: "Peer Group Multiples Analysis" },
          financialAnalysis: { type: Type.STRING },
          earningsQuality: { type: Type.STRING },
          industrySpecificRatio: { type: Type.OBJECT, properties: { label: {type: Type.STRING}, value: {type: Type.STRING} } },
          investmentRisks: { type: Type.STRING },
          esgSection: { type: Type.STRING },
          executiveSummary: { type: Type.STRING }
        },
        required: ["scorecard", "scores", "overallScore", "businessDescription", "investmentSummary", "executiveSummary", "porterFiveForces", "absoluteValuationModel"]
      }
    }
  });

  const reportData = safeParseJson(response.text);
  if (!reportData) throw new Error("Synthesis failed. Terminal failure.");

  const sources = extractSources(response);
  const { basicInfoEnhancements, ...rest } = reportData;
  
  return {
    basicInfo: { 
      ...stock, 
      liquidity: basicInfoEnhancements?.liquidity,
      float: basicInfoEnhancements?.float,
      majorShareholders: basicInfoEnhancements?.majorShareholders
    },
    ...rest,
    sources
  };
};

export const backtestStrategy = async (country: Country, concept: string, currentPortfolio: StockInfo[]): Promise<BacktestResult> => {
  const tickers = currentPortfolio.map(s => s.ticker).join(', ');
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Perform a 3-year quantitative backtest simulation for [${tickers}] in ${country} using strategy "${concept}". Return JSON with strategyReturn, benchmarkReturn, sharpeRatio, maxDrawdown, analysis, topPerformers. Ensure all returns are calculated in the local market currency of ${country}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  const data = safeParseJson(response.text);
  if (!data) throw new Error("Simulation engine failure.");
  
  const sources = extractSources(response);
  return { ...data, sources };
};
