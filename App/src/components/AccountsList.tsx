import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  monthlyBudget: number;
  currentSpend: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface AccountsListProps {
  accounts: Account[];
}

function AccountsList({ accounts }: AccountsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusVariant = (status: string): "success" | "warning" | "destructive" => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'success';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map(account => {
        const usagePercent = (account.currentSpend / account.monthlyBudget) * 100;
        const remaining = Math.max(0, account.monthlyBudget - account.currentSpend);
        
        return (
          <Card key={account.id} className="card-hover transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Account: {account.accountNumber}</p>
                </div>
                <Badge variant={getStatusVariant(account.status)} className="capitalize">
                  {account.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {formatCurrency(account.currentSpend)} / {formatCurrency(account.monthlyBudget)}
                    </span>
                    <span className="text-white font-semibold">
                      {usagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        account.status === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        account.status === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700/50">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Spent</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(account.currentSpend)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Remaining</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(remaining)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AccountsList;


