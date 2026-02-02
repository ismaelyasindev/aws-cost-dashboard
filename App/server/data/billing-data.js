// Hardcoded enterprise-level AWS billing data
// Represents a large company with multiple AWS accounts

const accounts = [
  {
    id: 'acc-001',
    name: 'Production',
    accountNumber: '123456789012',
    monthlyBudget: 500000,
    currentSpend: 487234.56,
    status: 'warning'
  },
  {
    id: 'acc-002',
    name: 'Staging',
    accountNumber: '123456789013',
    monthlyBudget: 50000,
    currentSpend: 32145.78,
    status: 'healthy'
  },
  {
    id: 'acc-003',
    name: 'Development',
    accountNumber: '123456789014',
    monthlyBudget: 30000,
    currentSpend: 28934.21,
    status: 'warning'
  },
  {
    id: 'acc-004',
    name: 'Data Analytics',
    accountNumber: '123456789015',
    monthlyBudget: 200000,
    currentSpend: 187654.32,
    status: 'healthy'
  },
  {
    id: 'acc-005',
    name: 'Machine Learning',
    accountNumber: '123456789016',
    monthlyBudget: 150000,
    currentSpend: 163478.91,
    status: 'critical'
  }
];

const costOverview = {
  totalMonthlySpend: 899447.78,
  totalBudget: 930000,
  percentOfBudget: 96.7,
  previousMonthSpend: 823456.12,
  changePercent: 9.2,
  forecastedMonthEnd: 945000,
  savingsOpportunities: 45234.00
};

const serviceBreakdown = [
  { service: 'EC2', cost: 245678.34, percentage: 27.3, change: 5.2 },
  { service: 'S3', cost: 134567.89, percentage: 15.0, change: -2.1 },
  { service: 'RDS', cost: 123456.78, percentage: 13.7, change: 8.4 },
  { service: 'Lambda', cost: 87654.32, percentage: 9.7, change: 12.3 },
  { service: 'CloudFront', cost: 76543.21, percentage: 8.5, change: 3.6 },
  { service: 'ECS', cost: 65432.10, percentage: 7.3, change: 6.8 },
  { service: 'DynamoDB', cost: 54321.09, percentage: 6.0, change: -1.5 },
  { service: 'ElastiCache', cost: 43210.98, percentage: 4.8, change: 2.9 },
  { service: 'Route53', cost: 23456.78, percentage: 2.6, change: 0.4 },
  { service: 'CloudWatch', cost: 21098.76, percentage: 2.3, change: 4.1 },
  { service: 'VPC', cost: 12345.67, percentage: 1.4, change: -0.8 },
  { service: 'IAM', cost: 5432.10, percentage: 0.6, change: 0.0 },
  { service: 'Others', cost: 6249.76, percentage: 0.7, change: 1.2 }
];

const costTrends = [
  { date: '2024-07-01', total: 756234.12, ec2: 198234.56, s3: 124567.89, rds: 98765.43, lambda: 67890.12, others: 266776.12 },
  { date: '2024-08-01', total: 789456.23, ec2: 215678.90, s3: 132456.78, rds: 105678.90, lambda: 72345.67, others: 263296.98 },
  { date: '2024-09-01', total: 812345.67, ec2: 223456.78, s3: 128901.23, rds: 112345.67, lambda: 78901.23, others: 268740.76 },
  { date: '2024-10-01', total: 823456.12, ec2: 234567.89, s3: 138567.89, rds: 114567.89, lambda: 81234.56, others: 254517.89 },
  { date: '2024-11-01', total: 845678.90, ec2: 238901.23, s3: 136789.01, rds: 117890.12, lambda: 83456.78, others: 268641.76 },
  { date: '2024-12-01', total: 867890.12, ec2: 242345.67, s3: 135678.90, rds: 120123.45, lambda: 85678.90, others: 284063.20 },
  { date: '2025-01-01', total: 899447.78, ec2: 245678.34, s3: 134567.89, rds: 123456.78, lambda: 87654.32, others: 308090.45 }
];

const budgetAlerts = [
  {
    id: 'alert-001',
    account: 'Production',
    severity: 'warning',
    message: 'Monthly spend at 97.4% of budget',
    threshold: 95,
    current: 97.4,
    timestamp: '2025-01-05T10:30:00Z'
  },
  {
    id: 'alert-002',
    account: 'Machine Learning',
    severity: 'critical',
    message: 'Monthly spend exceeded budget by 9%',
    threshold: 100,
    current: 109.0,
    timestamp: '2025-01-05T09:15:00Z'
  },
  {
    id: 'alert-003',
    account: 'Development',
    severity: 'warning',
    message: 'EC2 costs up 45% from last month',
    threshold: 20,
    current: 45,
    timestamp: '2025-01-05T08:00:00Z'
  },
  {
    id: 'alert-004',
    account: 'Data Analytics',
    severity: 'info',
    message: 'S3 Intelligent-Tiering saved £12,345 this month',
    threshold: 0,
    current: 12345,
    timestamp: '2025-01-04T14:20:00Z'
  }
];

const regionalCosts = [
  { region: 'us-east-1', name: 'N. Virginia', cost: 342567.89, percentage: 38.1 },
  { region: 'us-west-2', name: 'Oregon', cost: 234567.78, percentage: 26.1 },
  { region: 'eu-west-1', name: 'Ireland', cost: 178901.23, percentage: 19.9 },
  { region: 'ap-southeast-1', name: 'Singapore', cost: 87654.32, percentage: 9.7 },
  { region: 'eu-central-1', name: 'Frankfurt', cost: 43210.98, percentage: 4.8 },
  { region: 'ap-northeast-1', name: 'Tokyo', cost: 12545.58, percentage: 1.4 }
];

module.exports = {
  accounts,
  costOverview,
  serviceBreakdown,
  costTrends,
  budgetAlerts,
  regionalCosts
};


