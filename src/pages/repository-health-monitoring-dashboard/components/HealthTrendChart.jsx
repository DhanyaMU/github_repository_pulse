import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HealthTrendChart = ({ data, title, height = 400 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="text-foreground font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Overall Health</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-muted-foreground">Maintenance Index</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Community Engagement</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Technical Debt</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for thresholds */}
            <ReferenceLine y={80} stroke="var(--color-success)" strokeDasharray="2 2" />
            <ReferenceLine y={60} stroke="var(--color-warning)" strokeDasharray="2 2" />
            
            <Line
              type="monotone"
              dataKey="overallHealth"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="maintenanceIndex"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="communityEngagement"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="technicalDebt"
              stroke="var(--color-warning)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-warning)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthTrendChart;