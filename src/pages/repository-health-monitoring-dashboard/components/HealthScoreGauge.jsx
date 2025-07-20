import React from 'react';
import Icon from '../../../components/AppIcon';

const HealthScoreGauge = ({ score, title, subtitle, threshold = { good: 80, warning: 60 } }) => {
  const getScoreColor = (score) => {
    if (score >= threshold.good) return 'text-success';
    if (score >= threshold.warning) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= threshold.good) return 'bg-success/10';
    if (score >= threshold.warning) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getScoreBorder = (score) => {
    if (score >= threshold.good) return 'border-success/20';
    if (score >= threshold.warning) return 'border-warning/20';
    return 'border-error/20';
  };

  const getScoreIcon = (score) => {
    if (score >= threshold.good) return 'CheckCircle';
    if (score >= threshold.warning) return 'AlertTriangle';
    return 'XCircle';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative p-6 rounded-lg border ${getScoreBackground(score)} ${getScoreBorder(score)} transition-smooth`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Icon 
          name={getScoreIcon(score)} 
          size={20} 
          className={getScoreColor(score)} 
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          <span className="text-muted-foreground">Good ≥{threshold.good}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-warning"></div>
          <span className="text-muted-foreground">Warning ≥{threshold.warning}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-error"></div>
          <span className="text-muted-foreground">Critical &lt;{threshold.warning}</span>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreGauge;