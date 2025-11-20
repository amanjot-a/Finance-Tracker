import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Trash2, Tag } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No transactions yet</h3>
        <p className="text-slate-500 mt-1">Add your first expense or income to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {sortedTransactions.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#94a3b8' }}
              >
                {tx.category.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{tx.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{tx.category}</span>
                  <span>•</span>
                  <span>{new Date(tx.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-bold ${
                tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'
              }`}>
                {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
              </span>
              <button 
                onClick={() => onDelete(tx.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Delete transaction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
