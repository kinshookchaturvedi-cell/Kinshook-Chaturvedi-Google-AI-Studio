
import { GoogleGenAI, Type } from "@google/genai";
import { StockInfo, CFAReport, InvestmentConcept, Country, BacktestResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Optimization: Using gemini-3-flash-preview for high-speed institutional analysis
const FAST_MODEL = "gemini-3-flash-preview";

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
    contents: `ACT AS A SENIOR INSTITUTIONAL QUANT ANALYST.
    Using GOOGLE SEARCH, identify the top ${count} ${country} stocks for the "${concept}" strategy.
    
    DATA RECOVERY:
    1. Fetch REAL-TIME stock prices.
    2. Cross-verify price and market cap.
    3. Ticker and exchange must be exact.
    
    SCORING:
    - Proprietary Alpha Density Index: 1.0 to 10.0.
    
    Return JSON: ticker, name, exchange, sector, price, targetPrice, marketCap, recommendation, score, lastUpdated.`,
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
            price: { type: Type.STRING },
            targetPrice: { type: Type.STRING },
            marketCap: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            score: { type: Type.NUMBER },
            lastUpdated: { type: Type.STRING }
          },
          required: ["ticker", "name", "exchange", "sector", "price", "targetPrice", "marketCap", "recommendation", "score", "lastUpdated"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    const sources = extractSources(response);
    return data.map((stock: any) => ({ ...stock, sources }));
  } catch (e) {
    console.error("Failed to parse screening results", e);
    return [];
  }
};

export const searchSpecificStock = async (query: string, country: Country): Promise<StockInfo | null> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Identify the specific stock matching "${query}" in the context of ${country} markets. 
    Find its ticker, exchange, sector, current live price, target price, market cap, and an institutional score (1-10) based on current sentiment and fundamentals.
    Use GOOGLE SEARCH for real-time accuracy.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ticker: { type: Type.STRING },
          name: { type: Type.STRING },
          exchange: { type: Type.STRING },
          sector: { type: Type.STRING },
          price: { type: Type.STRING },
          targetPrice: { type: Type.STRING },
          marketCap: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          score: { type: Type.NUMBER },
          lastUpdated: { type: Type.STRING }
        },
        required: ["ticker", "name", "exchange", "sector", "price", "targetPrice", "marketCap", "recommendation", "score", "lastUpdated"]
      }
    }
  });

  try {
    const stock = JSON.parse(response.text);
    const sources = extractSources(response);
    return { ...stock, sources };
  } catch (e) {
    console.error("Failed to find specific stock", e);
    return null;
  }
};

export const generateCFAReport = async (stock: StockInfo): Promise<CFAReport> => {
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Generate a professional CFA Equity Research Report for ${stock.name} (${stock.ticker}).
    - Use Search for latest 2024/2025 financial filings.
    - Be concise yet thorough.
    - Adhere to CFA Institute standards.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessDescription: { type: Type.STRING },
          industryOverview: { type: Type.STRING },
          investmentSummary: { type: Type.STRING },
          valuation: { type: Type.STRING },
          financialAnalysis: { type: Type.STRING },
          investmentRisks: { type: Type.STRING },
          esgSection: { type: Type.STRING }
        }
      }
    }
  });

  const reportData = JSON.parse(response.text);
  const sources = extractSources(response);
  return {
    basicInfo: stock,
    ...reportData,
    sources
  };
};

export const backtestStrategy = async (country: Country, concept: string, currentPortfolio: StockInfo[]): Promise<BacktestResult> => {
  const tickers = currentPortfolio.map(s => s.ticker).join(', ');
  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: `Perform high-fidelity 3-year historical backtest for: [${tickers}].
    1. HISTORICAL: Find adjusted closing prices for these tickers 3y ago.
    2. PERFORMANCE: Calculate 3-year Total Return (CAGR) vs ${country} benchmark.
    3. RISK: Sharpe Ratio and Max Drawdown.
    Return JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          country: { type: Type.STRING },
          period: { type: Type.STRING },
          strategyReturn: { type: Type.NUMBER },
          benchmarkReturn: { type: Type.NUMBER },
          sharpeRatio: { type: Type.NUMBER },
          maxDrawdown: { type: Type.NUMBER },
          topPerformers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ticker: { type: Type.STRING },
                return: { type: Type.STRING }
              }
            }
          },
          analysis: { type: Type.STRING }
        }
      }
    }
  });

  const data = JSON.parse(response.text);
  const sources = extractSources(response);
  return { ...data, sources };
};
