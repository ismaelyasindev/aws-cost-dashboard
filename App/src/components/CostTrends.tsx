import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { format } from 'date-fns';

interface CostTrendData {
  date: string;
  total: number;
  ec2: number;
  s3: number;
  rds: number;
  lambda: number;
  others: number;
}

interface CostTrendsProps {
  data: CostTrendData[];
}

function CostTrends({ data }: CostTrendsProps) {
  const formattedData = data.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'MMM yyyy')
  }));

  const formatCurrency = (value: number) => {
    return `£${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism rounded-lg p-4 shadow-xl border border-gray-700">
          <p className="text-white font-semibold mb-2">
            {payload[0].payload.displayDate}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm my-1">
              <span className="font-medium">{entry.name}:</span> £{entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glassmorphism rounded-xl p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="displayDate" 
            stroke="#94a3b8"
            style={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            style={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontFamily: 'Poppins' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#f59e0b" 
            strokeWidth={3}
            name="Total Cost"
            dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#000' }}
            activeDot={{ r: 7 }}
          />
          <Line 
            type="monotone" 
            dataKey="ec2" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="EC2"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="s3" 
            stroke="#22c55e" 
            strokeWidth={2}
            name="S3"
            dot={{ fill: '#22c55e', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="rds" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="RDS"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="lambda" 
            stroke="#ec4899" 
            strokeWidth={2}
            name="Lambda"
            dot={{ fill: '#ec4899', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostTrends;


