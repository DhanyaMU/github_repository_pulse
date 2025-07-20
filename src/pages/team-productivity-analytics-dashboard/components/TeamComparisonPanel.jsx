import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TeamComparisonPanel = () => {
  const [selectedTeams, setSelectedTeams] = useState(['frontend', 'backend']);
  const [comparisonMetric, setComparisonMetric] = useState('velocity');

  const teams = [
    {
      id: 'frontend',
      name: 'Frontend Team',
      members: 4,
      color: '#22c55e',
      metrics: {
        velocity: 8.7,
        quality: 92,
        collaboration: 85,
        efficiency: 78
      },
      details: {
        commits: 156,
        prs: 34,
        reviews: 89,
        issues: 23
      }
    },
    {
      id: 'backend',
      name: 'Backend Team',
      members: 3,
      color: '#3b82f6',
      metrics: {
        velocity: 7.9,
        quality: 88,
        collaboration: 91,
        efficiency: 82
      },
      details: {
        commits: 142,
        prs: 28,
        reviews: 76,
        issues: 18
      }
    },
    {
      id: 'devops',
      name: 'DevOps Team',
      members: 2,
      color: '#f59e0b',
      metrics: {
        velocity: 6.8,
        quality: 95,
        collaboration: 78,
        efficiency: 89
      },
      details: {
        commits: 89,
        prs: 15,
        reviews: 45,
        issues: 12
      }
    },
    {
      id: 'mobile',
      name: 'Mobile Team',
      members: 3,
      color: '#ef4444',
      metrics: {
        velocity: 7.2,
        quality: 86,
        collaboration: 82,
        efficiency: 75
      },
      details: {
        commits: 98,
        prs: 22,
        reviews: 54,
        issues: 16
      }
    }
  ];

  const metricConfigs = {
    velocity: { label: 'Development Velocity', unit: '/10', icon: 'Zap' },
    quality: { label: 'Code Quality Score', unit: '%', icon: 'Shield' },
    collaboration: { label: 'Collaboration Index', unit: '%', icon: 'Users' },
    efficiency: { label: 'Process Efficiency', unit: '%', icon: 'Target' }
  };

  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else if (prev.length < 3) {
        return [...prev, teamId];
      }
      return prev;
    });
  };

  const getSelectedTeams = () => {
    return teams.filter(team => selectedTeams.includes(team.id));
  };

  const getMetricComparison = () => {
    const selectedTeamData = getSelectedTeams();
    const maxValue = Math.max(...selectedTeamData.map(team => team.metrics[comparisonMetric]));
    
    return selectedTeamData.map(team => ({
      ...team,
      percentage: (team.metrics[comparisonMetric] / maxValue) * 100,
      isLeader: team.metrics[comparisonMetric] === maxValue
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Comparison</h3>
          <p className="text-sm text-muted-foreground">Compare performance across teams</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={comparisonMetric}
            onChange={(e) => setComparisonMetric(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground"
          >
            {Object.entries(metricConfigs).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Select Teams to Compare (max 3)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => toggleTeamSelection(team.id)}
              disabled={!selectedTeams.includes(team.id) && selectedTeams.length >= 3}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-smooth ${
                selectedTeams.includes(team.id)
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
              } ${!selectedTeams.includes(team.id) && selectedTeams.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <div className="text-left min-w-0">
                <div className="text-sm font-medium truncate">{team.name}</div>
                <div className="text-xs opacity-75">{team.members} members</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name={metricConfigs[comparisonMetric].icon} size={16} className="text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">
            {metricConfigs[comparisonMetric].label} Comparison
          </h4>
        </div>

        {getMetricComparison().map((team) => (
          <div key={team.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span className="text-sm font-medium text-foreground">{team.name}</span>
                {team.isLeader && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-warning/10 rounded-full">
                    <Icon name="Crown" size={10} className="text-warning" />
                    <span className="text-xs text-warning">Leader</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {team.metrics[comparisonMetric]}{metricConfigs[comparisonMetric].unit}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-smooth"
                style={{ 
                  width: `${team.percentage}%`,
                  backgroundColor: team.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">Detailed Metrics</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground">Team</th>
                <th className="text-center py-2 text-muted-foreground">Commits</th>
                <th className="text-center py-2 text-muted-foreground">PRs</th>
                <th className="text-center py-2 text-muted-foreground">Reviews</th>
                <th className="text-center py-2 text-muted-foreground">Issues</th>
              </tr>
            </thead>
            <tbody>
              {getSelectedTeams().map((team) => (
                <tr key={team.id} className="border-b border-border/50">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-medium text-foreground">{team.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 text-foreground">{team.details.commits}</td>
                  <td className="text-center py-3 text-foreground">{team.details.prs}</td>
                  <td className="text-center py-3 text-foreground">{team.details.reviews}</td>
                  <td className="text-center py-3 text-foreground">{team.details.issues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={14}
          >
            Export Comparison
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
          >
            Refresh Data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={14}
          >
            Configure Metrics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamComparisonPanel;