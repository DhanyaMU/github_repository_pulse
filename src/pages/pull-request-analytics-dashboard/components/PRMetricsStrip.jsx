import React from 'react';
import Icon from '../../../components/AppIcon';

const PRMetricsStrip = () => {
  const metrics = [
    {
      id: 'merge-time',
      label: 'Avg Merge Time',
      value: '2.4 days',
      change: -12.5,
      trend: 'down',
      icon: 'GitMerge',
      description: 'Average time from PR creation to merge'
    },
    {
      id: 'review-cycle',
      label: 'Review Cycle',
      value: '18.2 hrs',
      change: 8.3,
      trend: 'up',
      icon: 'Clock',
      description: 'Time spent in review process'
    },
    {
      id: 'approval-rate',
      label: 'Approval Rate',
      value: '94.2%',
      change: 2.1,
      trend: 'up',
      icon: 'CheckCircle',
      description: 'PRs approved without major changes'
    },
    {
      id: 'conflict-frequency',
      label: 'Merge Conflicts',
      value: '8.7%',
      change: -15.4,
      trend: 'down',
      icon: 'AlertTriangle',
      description: 'PRs with merge conflicts'
    }
  ];

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-smooth"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={metric.icon} size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
              <Icon name={getTrendIcon(metric.trend)} size={14} />
              <span className="text-xs font-medium">
                {Math.abs(metric.change)}%
              </span>
            </div>
          </div>
          
          <div className="mb-1">
            <span className="text-2xl font-bold text-foreground">
              {metric.value}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PRMetricsStrip;