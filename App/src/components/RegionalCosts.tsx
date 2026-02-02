import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';

interface RegionalCost {
  region: string;
  name: string;
  cost: number;
  percentage: number;
}

interface RegionalCostsProps {
  data: RegionalCost[];
}

function RegionalCosts({ data }: RegionalCostsProps) {
  const colors = ['#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#14b8a6'];

  const formatCurrency = (value: number) => {
    return `£${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism rounded-lg p-4 shadow-xl border border-gray-700">
          <p className="text-white font-semibold mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-gray-400 text-xs mb-2">
            {payload[0].payload.region}
          </p>
          <p className="text-orange-400 text-sm font-medium">
            Cost: £{payload[0].value?.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glassmorphism rounded-xl p-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            type="number"
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            style={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            type="category"
            dataKey="name" 
            stroke="#94a3b8"
            style={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}
            width={100}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar 
            dataKey="cost" 
            radius={[0, 8, 8, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RegionalCosts;


