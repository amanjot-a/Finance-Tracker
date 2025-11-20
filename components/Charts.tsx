import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Transaction, TransactionType, CategoryBreakdown, DailyBalance } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ChartProps {
  transactions: Transaction[];
}

export const SpendingPieChart: React.FC<ChartProps> = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE);
  
  const dataMap = expenses.reduce<Record<string, number>>((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const data: CategoryBreakdown[] = Object.entries(dataMap)
    .map(([name, value]: [string, number]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BalanceHistoryChart: React.FC<ChartProps> = ({ transactions }) => {
  // Create a timeline of balances
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (sortedTx.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No transaction history
      </div>
    );
  }

  let runningBalance = 0;
  const dataPoints: DailyBalance[] = [];
  
  // Group by day for cleaner chart
  const groupedByDay: Record<string, number> = {};
  
  // Initialize with 0 balance at start of first date if needed, but let's just flow
  sortedTx.forEach(tx => {
    const day = tx.date.split('T')[0];
    if (!groupedByDay[day]) groupedByDay[day] = 0;
    
    if (tx.type === TransactionType.INCOME) {
      groupedByDay[day] += tx.amount;
    } else {
      groupedByDay[day] -= tx.amount;
    }
  });

  const days = Object.keys(groupedByDay).sort();
  
  days.forEach(day => {
    runningBalance += groupedByDay[day];
    dataPoints.push({
      date: day,
      balance: runningBalance
    });
  });

  // Format date for axis
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#6366f1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};