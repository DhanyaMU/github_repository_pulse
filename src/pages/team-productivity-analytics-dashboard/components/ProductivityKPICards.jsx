import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductivityKPICards = () => {
  const kpiData = [
    {
      id: 'commits',
      title: 'Commits per Developer',
      value: '12.4',
      unit: '/day',
      change: '+8.2%',
      trend: 'up',
      benchmark: '10.8',
      icon: 'GitCommit',
      color: 'text-success'
    },
    {
      id: 'reviews',
      title: 'Code Review Participation',
      value: '87%',
      unit: '',
      change: '+5.1%',
      trend: 'up',
      benchmark: '82%',
      icon: 'GitPullRequest',
      color: 'text-primary'
    },
    {
      id: 'resolution',
      title: 'Issue Resolution Velocity',
      value: '2.3',
      unit: 'days avg',
      change: '-12.5%',
      trend: 'down',
      benchmark: '2.6',
      icon: 'CheckCircle',
      color: 'text-warning'
    },
    {
      id: 'collaboration',
      title: 'Collaboration Index',
      value: '8.7',
      unit: '/10',
      change: '+3.4%',
      trend: 'up',
      benchmark: '8.4',
      icon: 'Users',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-accent flex items-center justify-center ${kpi.color}`}>
              <Icon name={kpi.icon} size={20} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-error' : 'text-muted-foreground'
            }`}>
              <Icon 
                name={kpi.trend === 'up' ? 'TrendingUp' : kpi.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span>{kpi.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
              <span className="text-sm text-muted-foreground">{kpi.unit}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Benchmark: {kpi.benchmark}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
                <span className="text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductivityKPICards;