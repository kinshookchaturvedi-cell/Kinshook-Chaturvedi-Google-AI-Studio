
import { GoogleGenAI, Type } from "@google/genai";
import { StockInfo, CFAReport, InvestmentConcept, Country, BacktestResult } from "../types";

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

export const screenStocks = async (country: Country, concept: string, count: number): Promise<StockInfo[]> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Screen top ${count} ${country} stocks for strategy: "${concept}". Return ticker, name, exchange, sector, industry, price, targetPrice, marketCap, recommendation, score (1-100), lastUpdated.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }
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
    contents: `Locate stock "${query}" in "${country}". Return JSON: ticker, name, exchange, sector, industry, price, targetPrice, marketCap, recommendation, score (1-100), liquidity (qualitative), float (public shares info), lastUpdated.`,
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
    contents: `Perform a 3-year quantitative backtest simulation for [${tickers}] in ${country} using strategy "${concept}". Return JSON with strategyReturn, benchmarkReturn, sharpeRatio, maxDrawdown, analysis, topPerformers.`,
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
