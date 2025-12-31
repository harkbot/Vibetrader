import { GoogleGenAI, Type } from "@google/genai";
import { TradeAnalysis, MarketAlert, MarketOutlook, TickerTrend, TacticalOpportunity, LoggedTrade, ManagementAdvice } from "./types";

declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  };
};

const MODEL_COMPLEX = 'gemini-3-pro-preview';
const MODEL_FAST = 'gemini-3-flash-preview';

export async function analyzeTradeImages(images: string[], selectedStrategy: string = "General"): Promise<TradeAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();
  
  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: {
      parts: [
        ...images.map(img => ({
          inlineData: {
            mimeType: 'image/png',
            data: img.split(',')[1]
          }
        })),
        { text: `Audit these trade screenshots for a ${selectedStrategy} setup on ${today}. Evaluate Delta, IV Rank, and Risk Profile.` }
      ]
    },
    config: {
      systemInstruction: "You are a senior options architect. Use TastyTrade mechanics (45 DTE, 16-25 Delta). Evaluate Capital Efficiency. Suggest pivots if math favors defined/undefined risk transitions.",
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING },
          ticker: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
          delta: { type: Type.NUMBER },
          ivRank: { type: Type.NUMBER },
          riskRewardRatio: { type: Type.STRING },
          verdict: { type: Type.STRING, enum: ['Good', 'Fair', 'Avoid'] },
          reasoning: { type: Type.STRING },
          riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
          dte: { type: Type.INTEGER },
          earningsDate: { type: Type.STRING },
          alternativeTickers: { type: Type.ARRAY, items: { type: Type.STRING } },
          pivotSuggestion: {
            type: Type.OBJECT,
            properties: {
              suggestedStrategy: { type: Type.STRING },
              reason: { type: Type.STRING },
              efficiencyGain: { type: Type.STRING }
            }
          }
        },
        required: ['ticker', 'verdict', 'reasoning', 'dte']
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getManagementAdvice(trade: LoggedTrade): Promise<ManagementAdvice> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();

  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: `Manage ${trade.ticker} ${trade.strategy} (Credit: $${trade.creditReceived}) on ${today}. Use real-time pricing and IV data.`,
    config: {
      systemInstruction: "You are a risk manager. Suggest delta-neutralizing moves or rolling tactics based on current price versus entry sentiment. Use TastyTrade mechanical management rules.",
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, enum: ['Stay', 'Adjust', 'Exit'] },
          headline: { type: Type.STRING },
          mechanicalAdvice: { type: Type.STRING },
          adjustmentTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
          buyingPowerImpact: { type: Type.STRING }
        },
        required: ['verdict', 'headline', 'mechanicalAdvice', 'adjustmentTactics', 'buyingPowerImpact']
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function fetchTacticalOpportunities(strategy: string): Promise<TacticalOpportunity[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();
  
  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: `Top 5 high IV targets for ${strategy} today (${today}).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING },
            ivRank: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            strategy: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
            earningsDate: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
          },
          required: ['ticker', 'ivRank', 'reason']
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function fetchMarketIntelligence(watchlist: string[]): Promise<MarketAlert[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();
  
  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: `Catalysts and IV alerts for: ${watchlist.join(', ')} on ${today}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            ticker: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['News', 'Technical', 'Volatility', 'Sentiment'] },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            headline: { type: Type.STRING },
            impactDescription: { type: Type.STRING },
            timestamp: { type: Type.STRING }
          },
          required: ['id', 'ticker', 'type', 'headline']
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function fetchTickerTrends(): Promise<TickerTrend[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();
  
  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: `Highest IV expansion and volatility movers today (${today}).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            change: { type: Type.STRING },
            vibe: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
            note: { type: Type.STRING }
          },
          required: ['symbol', 'change', 'vibe']
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function generateDailyOutlook(): Promise<MarketOutlook> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();
  
  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: `Tactical Session Briefing for ${today}. Futures Levels, Macro Vibe, High-Impact Events.`,
    config: {
      systemInstruction: "You are a senior macro trader. Be precise. Focus on premium selling catalysts.",
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reportDate: { type: Type.STRING },
          targetSession: { type: Type.STRING },
          globalMacroVibe: { type: Type.STRING },
          futuresLevels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                price: { type: Type.STRING },
                change: { type: Type.STRING },
                vibe: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Flat'] }
              }
            }
          },
          highImpactEvents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                event: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                details: { type: Type.STRING }
              }
            }
          },
          openingBellForecast: { type: Type.STRING },
          technicalWatchlist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ticker: { type: Type.STRING },
                catalyst: { type: Type.STRING },
                deepDive: { type: Type.STRING },
                technicalSetup: { type: Type.STRING }
              }
            }
          }
        },
        required: ['reportDate', 'targetSession', 'globalMacroVibe', 'openingBellForecast']
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
}