import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const CommitActivityChart = () => {
  const [selectedRepository, setSelectedRepository] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  const mockData = [
    {
      date: '2025-07-12',
      commits: 45,
      issueResolution: 85,
      repository: 'frontend-dashboard'
    },
    {
      date: '2025-07-13',
      commits: 32,
      issueResolution: 78,
      repository: 'backend-api'
    },
    {
      date: '2025-07-14',
      commits: 58,
      issueResolution: 92,
      repository: 'mobile-app'
    },
    {
      date: '2025-07-15',
      commits: 41,
      issueResolution: 88,
      repository: 'data-pipeline'
    },
    {
      date: '2025-07-16',
      commits: 67,
      issueResolution: 95,
      repository: 'ml-models'
    },
    {
      date: '2025-07-17',
      commits: 39,
      issueResolution: 82,
      repository: 'frontend-dashboard'
    },
    {
      date: '2025-07-18',
      commits: 52,
      issueResolution: 90,
      repository: 'backend-api'
    }
  ];

  const repositories = [
    { value: 'all', label: 'All Repositories' },
    { value: 'frontend-dashboard', label: 'Frontend Dashboard' },
    { value: 'backend-api', label: 'Backend API' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'data-pipeline', label: 'Data Pipeline' },
    { value: 'ml-models', label: 'ML Models' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {entry.name === 'Issue Resolution' ? `${entry.value}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDataPointClick = (data) => {
    console.log('Drill down to:', data);
    // In a real app, this would navigate to detailed view
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Commit Activity & Issue Resolution</h3>
            <p className="text-sm text-muted-foreground">Development velocity and issue resolution trends</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedRepository}
              onChange={(e) => setSelectedRepository(e.target.value)}
              className="bg-input border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {repositories.map(repo => (
                <option key={repo.value} value={repo.value}>{repo.label}</option>
              ))}
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-input border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <button className="text-muted-foreground hover:text-foreground transition-smooth">
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={mockData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={handleDataPointClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="commits" 
                fill="var(--color-primary)" 
                name="Commits"
                radius={[2, 2, 0, 0]}
                cursor="pointer"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="issueResolution" 
                stroke="var(--color-secondary)" 
                strokeWidth={3}
                name="Issue Resolution"
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Commits per day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span>Issue resolution rate</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-1 hover:text-foreground transition-smooth">
            <Icon name="Maximize2" size={14} />
            <span>Expand chart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitActivityChart;