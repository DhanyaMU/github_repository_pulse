import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const CommitFrequencyChart = () => {
  const [chartType, setChartType] = useState('line'); // line, bar
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  const commitData = [
    { date: '2025-07-12', commits: 23, additions: 1247, deletions: 456, contributors: 4 },
    { date: '2025-07-13', commits: 31, additions: 1834, deletions: 623, contributors: 5 },
    { date: '2025-07-14', commits: 18, additions: 967, deletions: 234, contributors: 3 },
    { date: '2025-07-15', commits: 42, additions: 2156, deletions: 1023, contributors: 6 },
    { date: '2025-07-16', commits: 35, additions: 1678, deletions: 789, contributors: 4 },
    { date: '2025-07-17', commits: 28, additions: 1345, deletions: 567, contributors: 5 },
    { date: '2025-07-18', commits: 19, additions: 892, deletions: 345, contributors: 3 }
  ];

  const repositoryBreakdown = [
    { name: 'frontend-dashboard', commits: 89, percentage: 45.2, color: '#22c55e' },
    { name: 'backend-api', commits: 67, percentage: 34.0, color: '#3b82f6' },
    { name: 'mobile-app', commits: 28, percentage: 14.2, color: '#f59e0b' },
    { name: 'data-pipeline', commits: 13, percentage: 6.6, color: '#ef4444' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{formatDate(label)}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-muted-foreground">Commits:</span>
              <span className="font-medium text-foreground">{data.commits}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-muted-foreground">Contributors:</span>
              <span className="font-medium text-foreground">{data.contributors}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-success">+{data.additions.toLocaleString()}</span>
              <span className="text-error">-{data.deletions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Commit Frequency Trends</h3>
          <p className="text-sm text-muted-foreground">Daily commit activity with code changes</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                chartType === 'line' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="TrendingUp" size={14} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                chartType === 'bar' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="BarChart3" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={commitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={commitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="commits" 
                    fill="var(--color-primary)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repository Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Repository Breakdown</h4>
          <div className="space-y-3">
            {repositoryBreakdown.map((repo) => (
              <div key={repo.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: repo.color }}
                    />
                    <span className="text-foreground font-medium truncate">{repo.name}</span>
                  </div>
                  <span className="text-muted-foreground">{repo.commits}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-smooth"
                    style={{ 
                      width: `${repo.percentage}%`,
                      backgroundColor: repo.color
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {repo.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {commitData.reduce((sum, day) => sum + day.commits, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Commits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              +{commitData.reduce((sum, day) => sum + day.additions, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Lines Added</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-error">
              -{commitData.reduce((sum, day) => sum + day.deletions, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Lines Deleted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {(commitData.reduce((sum, day) => sum + day.commits, 0) / commitData.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Daily Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitFrequencyChart;