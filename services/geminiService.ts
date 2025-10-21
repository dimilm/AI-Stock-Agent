import { GoogleGenAI, Type } from "@google/genai";
import { Stock } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stockSchema = {
  type: Type.OBJECT,
  properties: {
    ticker: {
      type: Type.STRING,
      description: 'The stock ticker symbol, e.g., AAPL.',
    },
    companyName: {
      type: Type.STRING,
      description: 'The full name of the company.',
    },
    reasoning: {
      type: Type.STRING,
      description: 'A detailed explanation why this stock is a top pick based on the user criteria.',
    },
    marketCap: {
      type: Type.STRING,
      description: 'The market capitalization of the company, e.g., "$2.5T".',
    },
    peRatio: {
      type: Type.NUMBER,
      description: 'The Price-to-Earnings (P/E) ratio of the stock.',
    },
    dividendYield: {
      type: Type.NUMBER,
      description: 'The dividend yield in percent, e.g., 1.5 for 1.5%.',
    },
    roe: {
      type: Type.NUMBER,
      description: 'The Return on Equity (ROE) in percent, e.g., 25.5 for 25.5%.',
    },
    revenueGrowth: {
        type: Type.STRING,
        description: 'The year-over-year revenue growth, e.g., "15.2%".'
    }
  },
  required: ['ticker', 'companyName', 'reasoning', 'marketCap', 'peRatio', 'dividendYield', 'roe', 'revenueGrowth'],
};

export const getTopStocks = async (criteria: string, country: string, industry: string): Promise<Stock[]> => {
  try {
    let prompt = `Act as an expert financial stock analyst. `;
    
    const filterParts: string[] = [];
    if (country !== 'Weltweit') {
      filterParts.push(`from the country '${country}'`);
    }
    if (industry !== 'Alle Branchen') {
      filterParts.push(`in the industry '${industry}'`);
    }

    if (filterParts.length > 0) {
      prompt += `First, find public stocks ${filterParts.join(' and ')}. From that filtered list, `;
    } else {
      prompt += `Find and analyze relevant public stocks. `;
    }

    prompt += `Then, analyze and rank them based on the following criteria: "${criteria}". Provide a detailed reasoning for your selection and include key financial metrics like P/E Ratio, Dividend Yield, ROE and Revenue Growth. Return the top 5 stocks that best match the criteria.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: stockSchema,
        },
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (!Array.isArray(result)) {
        console.error("Gemini API did not return an array:", result);
        throw new Error("Invalid data format received from the API.");
    }

    return result as Stock[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch stock analysis from Gemini API.");
  }
};