import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const PRVolumeTimeline = () => {
  const [selectedMetric, setSelectedMetric] = useState('volume');
  
  const data = [
    {
      date: '2024-06-01',
      volume: 23,
      merged: 18,
      conflicts: 2,
      avgMergeTime: 2.1,
      sprint: 'Sprint 12'
    },
    {
      date: '2024-06-08',
      volume: 31,
      merged: 24,
      conflicts: 4,
      avgMergeTime: 2.8,
      sprint: 'Sprint 12'
    },
    {
      date: '2024-06-15',
      volume: 28,
      merged: 22,
      conflicts: 3,
      avgMergeTime: 2.3,
      sprint: 'Sprint 13'
    },
    {
      date: '2024-06-22',
      volume: 35,
      merged: 29,
      conflicts: 5,
      avgMergeTime: 3.2,
      sprint: 'Sprint 13'
    },
    {
      date: '2024-06-29',
      volume: 42,
      merged: 35,
      conflicts: 6,
      avgMergeTime: 2.9,
      sprint: 'Sprint 13'
    },
    {
      date: '2024-07-06',
      volume: 38,
      merged: 31,
      conflicts: 4,
      avgMergeTime: 2.4,
      sprint: 'Sprint 14'
    },
    {
      date: '2024-07-13',
      volume: 45,
      merged: 38,
      conflicts: 7,
      avgMergeTime: 3.1,
      sprint: 'Sprint 14'
    },
    {
      date: '2024-07-18',
      volume: 29,
      merged: 24,
      conflicts: 3,
      avgMergeTime: 2.2,
      sprint: 'Sprint 14'
    }
  ];

  const metrics = [
    {
      key: 'volume',
      label: 'PR Volume',
      color: 'var(--color-primary)',
      icon: 'GitPullRequest'
    },
    {
      key: 'merged',
      label: 'Merged PRs',
      color: 'var(--color-success)',
      icon: 'GitMerge'
    },
    {
      key: 'conflicts',
      label: 'Conflicts',
      color: 'var(--color-error)',
      icon: 'AlertTriangle'
    },
    {
      key: 'avgMergeTime',
      label: 'Avg Merge Time (days)',
      color: 'var(--color-warning)',
      icon: 'Clock'
    }
  ];

  const sprintBoundaries = [
    { date: '2024-06-14', sprint: 'Sprint 12 End' },
    { date: '2024-06-28', sprint: 'Sprint 13 End' },
    { date: '2024-07-12', sprint: 'Sprint 14 End' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">PR Volume</span>
              <span className="text-xs font-medium text-foreground">{data.volume}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Merged</span>
              <span className="text-xs font-medium text-success">{data.merged}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Conflicts</span>
              <span className="text-xs font-medium text-error">{data.conflicts}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Avg Merge Time</span>
              <span className="text-xs font-medium text-warning">{data.avgMergeTime}d</span>
            </div>
            <div className="border-t border-border pt-1 mt-2">
              <span className="text-xs font-medium text-foreground">{data.sprint}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">PR Volume Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Pull request trends with sprint boundaries
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-smooth ${
                selectedMetric === metric.key
                  ? 'bg-accent text-accent-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={metric.icon} size={14} />
              <span className="hidden sm:inline">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-80" aria-label="PR Volume Timeline Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Sprint boundary lines */}
            {sprintBoundaries.map((boundary, index) => (
              <ReferenceLine
                key={index}
                x={boundary.date}
                stroke="var(--color-muted-foreground)"
                strokeDasharray="2 2"
                strokeOpacity={0.5}
              />
            ))}
            
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={selectedMetricData.color}
              strokeWidth={2}
              dot={{ fill: selectedMetricData.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: selectedMetricData.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sprint Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-muted-foreground opacity-50" />
              <span className="text-muted-foreground">Sprint boundaries</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="text-muted-foreground">
                +{((data[data.length - 1][selectedMetric] - data[0][selectedMetric]) / data[0][selectedMetric] * 100).toFixed(1)}% 
                vs start
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRVolumeTimeline;