const express = require('express');
const cors = require('cors');
const path = require('path');
const billingData = require('./data/billing-data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all accounts
app.get('/api/accounts', (req, res) => {
  res.json(billingData.accounts);
});

// Get cost overview
app.get('/api/cost-overview', (req, res) => {
  res.json(billingData.costOverview);
});

// Get service breakdown
app.get('/api/service-breakdown', (req, res) => {
  res.json(billingData.serviceBreakdown);
});

// Get cost trends (time series)
app.get('/api/cost-trends', (req, res) => {
  res.json(billingData.costTrends);
});

// Get budget alerts
app.get('/api/budget-alerts', (req, res) => {
  res.json(billingData.budgetAlerts);
});

// Get regional costs
app.get('/api/regional-costs', (req, res) => {
  res.json(billingData.regionalCosts);
});

// Get account details
app.get('/api/accounts/:accountId', (req, res) => {
  const account = billingData.accounts.find(a => a.id === req.params.accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(account);
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`AWS Cost Dashboard API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Serving React app at http://localhost:${PORT}`);
  }
});

