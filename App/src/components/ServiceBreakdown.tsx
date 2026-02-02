import React from 'react';
import { TrendingUp, TrendingDown } from './ui/icons';

interface ServiceData {
  service: string;
  cost: number;
  percentage: number;
  change: number;
}

interface ServiceBreakdownProps {
  data: ServiceData[];
}

function ServiceBreakdown({ data }: ServiceBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getServiceIcon = (service: string) => {
    return service.substring(0, 2).toUpperCase();
  };

  const getServiceGradient = (index: number) => {
    const gradients = [
      'from-orange-500 to-red-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-cyan-500',
      'from-red-500 to-pink-500',
      'from-emerald-500 to-green-500',
      'from-gray-500 to-gray-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="glassmorphism rounded-xl p-6">
      <div className="space-y-3">
        {data.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-300 border border-gray-800/50 hover:border-gray-700"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getServiceGradient(index)} flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm shadow-lg`}>
              {getServiceIcon(service.service)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-semibold text-sm">{service.service}</h4>
                <span className="text-gray-400 text-xs">{service.percentage}%</span>
              </div>
              <p className="text-gray-400 text-sm">
                {formatCurrency(service.cost)}
              </p>
            </div>
            
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold ${
              service.change > 0 
                ? 'bg-orange-500/10 text-orange-400' 
                : service.change < 0 
                ? 'bg-green-500/10 text-green-400'
                : 'bg-gray-500/10 text-gray-400'
            }`}>
              {service.change > 0 ? (
                <TrendingUp size={14} />
              ) : service.change < 0 ? (
                <TrendingDown size={14} />
              ) : null}
              <span>{service.change > 0 ? '+' : ''}{service.change}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceBreakdown;


