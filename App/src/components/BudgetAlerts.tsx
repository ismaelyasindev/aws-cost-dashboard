import React from 'react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';

interface Alert {
  id: string;
  account: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  threshold: number;
  current: number;
  timestamp: string;
}

interface BudgetAlertsProps {
  alerts: Alert[];
}

function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm');
  };

  const getSeverityVariant = (severity: string): "destructive" | "warning" | "info" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 shadow-red-500/50';
      case 'warning': return 'bg-orange-500 shadow-orange-500/50';
      case 'info': return 'bg-blue-500 shadow-blue-500/50';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="glassmorphism rounded-xl p-4 flex items-start gap-4 transition-all duration-300 hover:border-gray-600"
        >
          <div className="flex-shrink-0 mt-1">
            <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)} shadow-lg animate-pulse`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="text-white font-medium text-sm">
                  <span className="font-semibold">{alert.account}:</span> {alert.message}
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  {formatTimestamp(alert.timestamp)}
                </p>
              </div>
              <Badge variant={getSeverityVariant(alert.severity)} className="capitalize flex-shrink-0">
                {alert.severity}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetAlerts;

