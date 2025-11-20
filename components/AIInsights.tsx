import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction } from '../types';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const advice = await getFinancialAdvice(transactions);
    setInsights(advice);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg">AI Financial Advisor</h3>
          </div>
          {!loading && (
             <button 
             onClick={handleGenerate}
             className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm"
           >
             {insights ? 'Refresh Analysis' : 'Analyze Finances'}
           </button>
          )}
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-white/80">
            <RefreshCw className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Crunching your numbers...</p>
          </div>
        ) : insights ? (
          <div className="prose prose-invert prose-sm max-w-none">
             <div className="whitespace-pre-wrap font-light text-indigo-50 leading-relaxed">
                {insights}
             </div>
          </div>
        ) : (
          <div className="text-indigo-100 text-sm">
            <p className="mb-4">
              Get personalized insights about your spending habits, category breakdowns, and saving tips powered by Gemini AI.
            </p>
            <button 
              onClick={handleGenerate}
              className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
            >
              Generate Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
