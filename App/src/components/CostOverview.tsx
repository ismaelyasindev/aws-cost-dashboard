import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from './ui/icons';

interface CostOverviewData {
  totalMonthlySpend: number;
  totalBudget: number;
  percentOfBudget: number;
  previousMonthSpend: number;
  changePercent: number;
  forecastedMonthEnd: number;
  savingsOpportunities: number;
}

interface CostOverviewProps {
  data: CostOverviewData;
}

function CostOverview({ data }: CostOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getBudgetVariant = (percent: number): "success" | "warning" | "destructive" => {
    if (percent >= 100) return 'destructive';
    if (percent >= 90) return 'warning';
    return 'success';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="card-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Total Monthly Spend
            </CardTitle>
            <DollarSign size={18} className="text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(data.totalMonthlySpend)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {data.changePercent > 0 ? (
              <TrendingUp size={16} className="text-orange-400" />
            ) : (
              <TrendingDown size={16} className="text-green-400" />
            )}
            <span className={data.changePercent > 0 ? 'text-orange-400' : 'text-green-400'}>
              {data.changePercent > 0 ? '+' : ''}{data.changePercent}%
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Budget Usage
            </CardTitle>
            <Badge variant={getBudgetVariant(data.percentOfBudget)}>
              {data.percentOfBudget}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(data.totalBudget)}
          </div>
          <div className="text-sm text-gray-400">
            {formatCurrency(data.totalBudget - data.totalMonthlySpend)} remaining
          </div>
          <div className="mt-3 w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                data.percentOfBudget >= 100 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                data.percentOfBudget >= 90 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.min(data.percentOfBudget, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Forecasted Month End
            </CardTitle>
            <TrendingUp size={18} className="text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(data.forecastedMonthEnd)}
          </div>
          <div className="text-sm text-gray-400">
            Based on current trends
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover transition-all duration-300 border-blue-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Savings Opportunities
            </CardTitle>
            <Badge variant="info">Available</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {formatCurrency(data.savingsOpportunities)}
          </div>
          <div className="text-sm text-gray-400">
            Potential monthly savings
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CostOverview;


