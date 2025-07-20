import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, sparklineData, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-accent flex items-center justify-center ${getStatusColor(status)}`}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {change && (
                <div className={`flex items-center space-x-1 ${getChangeColor(changeType)}`}>
                  <Icon name={getChangeIcon(changeType)} size={14} />
                  <span className="text-sm font-medium">{change}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sparkline */}
        <div className="w-20 h-12">
          <svg width="80" height="48" viewBox="0 0 80 48" className="overflow-visible">
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {sparklineData && sparklineData.length > 1 && (
              <>
                <path
                  d={`M 0 ${48 - (sparklineData[0] / Math.max(...sparklineData)) * 48} ${sparklineData
                    .map((point, index) => 
                      `L ${(index / (sparklineData.length - 1)) * 80} ${48 - (point / Math.max(...sparklineData)) * 48}`
                    )
                    .join(' ')}`}
                  fill={`url(#gradient-${title})`}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={getStatusColor(status)}
                />
              </>
            )}
          </svg>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Last 7 days</span>
        <div className={`flex items-center space-x-1 ${getStatusColor(status)}`}>
          <div className="w-2 h-2 rounded-full bg-current" />
          <span className="capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;