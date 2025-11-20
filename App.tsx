import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, List, Settings } from 'lucide-react';
import { Transaction, TransactionType, FinancialSummary } from './types';
import { StatsCard } from './components/StatsCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SpendingPieChart, BalanceHistoryChart } from './components/Charts';
import { AIInsights } from './components/AIInsights';

function App() {
  // -- State --
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  // -- Effects --
  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // -- Handlers --
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // -- Derived State --
  const summary: FinancialSummary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinTrack AI</h1>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Balance" amount={summary.balance} type="balance" />
          <StatsCard title="Total Income" amount={summary.totalIncome} type="income" />
          <StatsCard title="Total Expenses" amount={summary.totalExpense} type="expense" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts & AI) - Visible on Dashboard Tab or Desktop */}
          <div className={`lg:col-span-2 space-y-8 ${activeTab === 'transactions' ? 'hidden lg:block' : 'block'}`}>
            
            {/* AI Section */}
            <AIInsights transactions={transactions} />

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h4 className="text-sm font-semibold text-slate-500 mb-4">Spending by Category</h4>
                   <SpendingPieChart transactions={transactions} />
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-500 mb-4">Balance Trend</h4>
                   <BalanceHistoryChart transactions={transactions} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (List) - Visible on Transactions Tab or Desktop */}
          <div className={`lg:col-span-1 ${activeTab === 'dashboard' ? 'hidden lg:block' : 'block'}`}>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-40">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'transactions' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="text-xs font-medium">Transactions</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <TransactionForm onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}

export default App;
