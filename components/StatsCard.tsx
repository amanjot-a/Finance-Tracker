import React from 'react';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, amount, type }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  let icon;
  let colorClass;
  let bgClass;

  switch (type) {
    case 'income':
      icon = <ArrowUp className="w-5 h-5 text-emerald-600" />;
      colorClass = 'text-emerald-600';
      bgClass = 'bg-emerald-50';
      break;
    case 'expense':
      icon = <ArrowDown className="w-5 h-5 text-rose-600" />;
      colorClass = 'text-rose-600';
      bgClass = 'bg-rose-50';
      break;
    default:
      icon = <Wallet className="w-5 h-5 text-indigo-600" />;
      colorClass = 'text-indigo-600';
      bgClass = 'bg-indigo-50';
      break;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02] duration-200">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{formattedAmount}</h3>
      </div>
      <div className={`p-3 rounded-full ${bgClass}`}>
        {icon}
      </div>
    </div>
  );
};
