import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment to use AI features.";
  }

  if (transactions.length === 0) {
    return "Please add some transactions to get AI insights.";
  }

  // Filter to last 50 transactions to avoid token limits and keep it relevant
  const recentTransactions = transactions
    .slice(0, 50)
    .map(t => ({
      date: t.date.split('T')[0],
      type: t.type,
      category: t.category,
      amount: t.amount,
      desc: t.description
    }));

  const prompt = `
    You are a helpful personal financial advisor.
    Analyze the following list of recent financial transactions (in JSON format).
    
    Transactions:
    ${JSON.stringify(recentTransactions)}

    Please provide:
    1. A brief 1-sentence summary of the user's financial health.
    2. Identification of the biggest spending area.
    3. Two specific, actionable tips to save money or improve budget based on these specific patterns.
    
    Keep the tone encouraging but professional. Format the response in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while analyzing your data. Please try again later.";
  }
};
