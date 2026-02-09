import React, { useState, useEffect } from 'react';
import { Cloud } from './components/ui/icons';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { ErrorMessage } from './components/ui/error-message';
import CostOverview from './components/CostOverview';
import ServiceBreakdown from './components/ServiceBreakdown';
import CostTrends from './components/CostTrends';
import BudgetAlerts from './components/BudgetAlerts';
import AccountsList from './components/AccountsList';
import RegionalCosts from './components/RegionalCosts';

// In production the API is on the same origin; in local dev use localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_URL ?? '';

interface DashboardData {
  accounts: any[];
  costOverview: any;
  serviceBreakdown: any[];
  costTrends: any[];
  budgetAlerts: any[];
  regionalCosts: any[];
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          accounts,
          costOverview,
          serviceBreakdown,
          costTrends,
          budgetAlerts,
          regionalCosts
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/accounts`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/cost-overview`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/service-breakdown`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/cost-trends`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/budget-alerts`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/regional-costs`).then(res => res.json())
        ]);

        setData({
          accounts,
          costOverview,
          serviceBreakdown,
          costTrends,
          budgetAlerts,
          regionalCosts
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Cloud size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">AWS Cost Dashboard</h1>
                <p className="text-xs text-gray-400">Enterprise Multi-Account View</p>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gradient mb-2" style={{ letterSpacing: '-0.05em' }}>
            Cost & Billing Overview
          </h2>
          <p className="text-gray-400">Monitor and analyze your AWS spending across all accounts</p>
        </div>

        <CostOverview data={data!.costOverview} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Accounts Overview</h2>
          <AccountsList accounts={data!.accounts} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Budget Alerts</h2>
          <BudgetAlerts alerts={data!.budgetAlerts} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Cost Trends (Last 7 Months)</h2>
          <CostTrends data={data!.costTrends} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Service Breakdown</h2>
            <ServiceBreakdown data={data!.serviceBreakdown} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Regional Distribution</h2>
            <RegionalCosts data={data!.regionalCosts} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


