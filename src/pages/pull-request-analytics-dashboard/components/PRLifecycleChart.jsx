import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PRLifecycleChart = () => {
  const data = [
    {
      week: 'Week 1',
      draft: 12,
      review: 28,
      approved: 15,
      merged: 22,
      total: 77
    },
    {
      week: 'Week 2',
      draft: 8,
      review: 32,
      approved: 18,
      merged: 25,
      total: 83
    },
    {
      week: 'Week 3',
      draft: 15,
      review: 24,
      approved: 22,
      merged: 19,
      total: 80
    },
    {
      week: 'Week 4',
      draft: 10,
      review: 35,
      approved: 16,
      merged: 28,
      total: 89
    },
    {
      week: 'Week 5',
      draft: 6,
      review: 29,
      approved: 24,
      merged: 31,
      total: 90
    },
    {
      week: 'Week 6',
      draft: 11,
      review: 26,
      approved: 20,
      merged: 26,
      total: 83
    },
    {
      week: 'Week 7',
      draft: 9,
      review: 31,
      approved: 19,
      merged: 24,
      total: 83
    },
    {
      week: 'Week 8',
      draft: 13,
      review: 27,
      approved: 25,
      merged: 29,
      total: 94
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {entry.dataKey}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground">
                  {entry.value}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-1 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Total</span>
                <span className="text-xs font-bold text-foreground">{total}</span>
              </div>
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
          <h3 className="text-lg font-semibold text-foreground">PR Lifecycle Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Pull request status distribution over time
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded-sm" />
            <span className="text-muted-foreground">Draft</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-sm" />
            <span className="text-muted-foreground">Review</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-secondary rounded-sm" />
            <span className="text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-sm" />
            <span className="text-muted-foreground">Merged</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80" aria-label="PR Lifecycle Stacked Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="draft" 
              stackId="a" 
              fill="var(--color-muted)" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="review" 
              stackId="a" 
              fill="var(--color-warning)" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="approved" 
              stackId="a" 
              fill="var(--color-secondary)" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="merged" 
              stackId="a" 
              fill="var(--color-success)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PRLifecycleChart;