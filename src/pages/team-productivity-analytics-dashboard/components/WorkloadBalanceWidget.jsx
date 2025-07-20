import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkloadBalanceWidget = () => {
  const [viewMode, setViewMode] = useState('current'); // current, projected
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const workloadData = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      currentLoad: 85,
      projectedLoad: 92,
      capacity: 100,
      tasks: 12,
      status: 'overloaded',
      skills: ['React', 'TypeScript', 'UI/UX']
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      currentLoad: 72,
      projectedLoad: 68,
      capacity: 100,
      tasks: 9,
      status: 'optimal',
      skills: ['Node.js', 'Python', 'API Design']
    },
    {
      id: 3,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      currentLoad: 45,
      projectedLoad: 58,
      capacity: 100,
      tasks: 6,
      status: 'underutilized',
      skills: ['Full Stack', 'DevOps', 'Testing']
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      currentLoad: 78,
      projectedLoad: 75,
      capacity: 100,
      tasks: 8,
      status: 'optimal',
      skills: ['DevOps', 'AWS', 'Docker']
    },
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      currentLoad: 91,
      projectedLoad: 88,
      capacity: 100,
      tasks: 14,
      status: 'overloaded',
      skills: ['React', 'Mobile', 'Design']
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      overloaded: { color: '#ef4444', bg: 'bg-error/10', text: 'text-error', label: 'Overloaded' },
      optimal: { color: '#22c55e', bg: 'bg-success/10', text: 'text-success', label: 'Optimal' },
      underutilized: { color: '#f59e0b', bg: 'bg-warning/10', text: 'text-warning', label: 'Under-utilized' }
    };
    return configs[status] || configs.optimal;
  };

  const getLoadPercentage = (member) => {
    return viewMode === 'current' ? member.currentLoad : member.projectedLoad;
  };

  const pieData = workloadData.map(member => ({
    name: member.name,
    value: getLoadPercentage(member),
    color: getStatusConfig(member.status).color
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.payload.name}</p>
          <p className="text-xs text-muted-foreground">Workload: {data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const getRecommendations = () => {
    const overloaded = workloadData.filter(m => m.status === 'overloaded');
    const underutilized = workloadData.filter(m => m.status === 'underutilized');
    
    const recommendations = [];
    
    if (overloaded.length > 0 && underutilized.length > 0) {
      recommendations.push({
        type: 'rebalance',
        message: `Consider redistributing tasks from ${overloaded[0].name} to ${underutilized[0].name}`,
        action: 'Rebalance Workload'
      });
    }
    
    if (overloaded.length > 1) {
      recommendations.push({
        type: 'hire',
        message: `${overloaded.length} team members are overloaded. Consider hiring or redistributing work.`,
        action: 'Review Capacity'
      });
    }
    
    return recommendations;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workload Balance</h3>
          <p className="text-sm text-muted-foreground">Team capacity and task distribution</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setViewMode('current')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                viewMode === 'current' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setViewMode('projected')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                viewMode === 'projected' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Projected
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Distribution Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Distribution Overview</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Workloads */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Individual Workloads</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {workloadData.map((member) => {
              const statusConfig = getStatusConfig(member.status);
              const loadPercentage = getLoadPercentage(member);
              
              return (
                <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{member.tasks} tasks</span>
                        <div className={`px-2 py-0.5 rounded-full ${statusConfig.bg}`}>
                          <span className={`text-xs ${statusConfig.text}`}>{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-smooth"
                        style={{ 
                          width: `${loadPercentage}%`,
                          backgroundColor: statusConfig.color
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="text-xs bg-muted px-1 py-0.5 rounded text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{member.skills.length - 2}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-foreground">{loadPercentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {getRecommendations().length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Recommendations</h4>
          <div className="space-y-2">
            {getRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-accent/30 rounded-lg">
                <Icon 
                  name={rec.type === 'rebalance' ? 'ArrowLeftRight' : 'AlertTriangle'} 
                  size={16} 
                  className="text-warning mt-0.5 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{rec.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-auto p-1"
                  >
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.round(workloadData.reduce((sum, member) => sum + getLoadPercentage(member), 0) / workloadData.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Utilization</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {workloadData.filter(m => m.status === 'overloaded').length}
            </div>
            <div className="text-xs text-muted-foreground">Overloaded</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {workloadData.filter(m => m.status === 'underutilized').length}
            </div>
            <div className="text-xs text-muted-foreground">Under-utilized</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkloadBalanceWidget;