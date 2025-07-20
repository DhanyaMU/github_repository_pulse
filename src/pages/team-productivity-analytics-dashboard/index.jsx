import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import ExportControlPanel from '../../components/ui/ExportControlPanel';
import ProductivityKPICards from './components/ProductivityKPICards';
import ContributorActivityHeatmap from './components/ContributorActivityHeatmap';
import TeamLeaderboard from './components/TeamLeaderboard';
import CommitFrequencyChart from './components/CommitFrequencyChart';
import TeamComparisonPanel from './components/TeamComparisonPanel';
import WorkloadBalanceWidget from './components/WorkloadBalanceWidget';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const TeamProductivityAnalyticsDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [contributorFilter, setContributorFilter] = useState([]);
  const [timeComparison, setTimeComparison] = useState('wow'); // wow, mom, qoq
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  const teamOptions = [
    { value: 'all', label: 'All Teams' },
    { value: 'frontend', label: 'Frontend Team' },
    { value: 'backend', label: 'Backend Team' },
    { value: 'devops', label: 'DevOps Team' },
    { value: 'mobile', label: 'Mobile Team' }
  ];

  const contributorOptions = [
    { value: 'sarah', label: 'Sarah Chen' },
    { value: 'mike', label: 'Mike Rodriguez' },
    { value: 'alex', label: 'Alex Thompson' },
    { value: 'emma', label: 'Emma Wilson' },
    { value: 'david', label: 'David Kim' },
    { value: 'lisa', label: 'Lisa Park' }
  ];

  const comparisonOptions = [
    { value: 'wow', label: 'Week-over-Week' },
    { value: 'mom', label: 'Month-over-Month' },
    { value: 'qoq', label: 'Quarter-over-Quarter' }
  ];

  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 300000); // Update every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isRealTimeEnabled]);

  const formatLastUpdate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterBar />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">Team Productivity Analytics</h1>
              <p className="text-muted-foreground">
                Track individual and team performance patterns, identify collaboration trends, and optimize resource allocation
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-success animate-pulse-slow' : 'bg-muted'}`} />
                <span>{isRealTimeEnabled ? 'Live Updates' : 'Static View'}</span>
                <span>•</span>
                <span>{formatLastUpdate(lastUpdated)}</span>
              </div>
              <ExportControlPanel />
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Select
                label="Team Selector"
                options={teamOptions}
                value={selectedTeam}
                onChange={setSelectedTeam}
                className="w-full"
              />
              
              <Select
                label="Contributors"
                options={contributorOptions}
                value={contributorFilter}
                onChange={setContributorFilter}
                multiple
                searchable
                clearable
                className="w-full"
              />
              
              <Select
                label="Time Comparison"
                options={comparisonOptions}
                value={timeComparison}
                onChange={setTimeComparison}
                className="w-full"
              />
              
              <div className="flex items-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                  iconName={isRealTimeEnabled ? "Pause" : "Play"}
                  iconSize={16}
                  className="flex-1"
                >
                  {isRealTimeEnabled ? 'Pause' : 'Resume'} Live
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="RefreshCw"
                  iconSize={16}
                  onClick={() => setLastUpdated(new Date())}
                />
              </div>
            </div>
          </div>

          {/* Productivity KPI Cards */}
          <ProductivityKPICards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            {/* Contributor Activity Heatmap - 12 columns */}
            <div className="xl:col-span-3">
              <ContributorActivityHeatmap />
            </div>
            
            {/* Team Leaderboard - 4 columns */}
            <div className="xl:col-span-1">
              <TeamLeaderboard />
            </div>
          </div>

          {/* Dual Panel Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <CommitFrequencyChart />
            <TeamComparisonPanel />
          </div>

          {/* Workload Balance Widget */}
          <div className="mb-6">
            <WorkloadBalanceWidget />
          </div>

          {/* Advanced Analytics Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">Velocity predictions and workload balancing recommendations</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="TrendingUp"
                iconSize={16}
              >
                View Predictions
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Velocity Prediction */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Velocity Prediction</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Sprint:</span>
                    <span className="font-medium text-foreground">+12% faster</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium text-success">87%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="w-4/5 h-2 bg-success rounded-full" />
                  </div>
                </div>
              </div>

              {/* Bottleneck Detection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <h4 className="text-sm font-medium text-foreground">Bottleneck Detection</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Code Reviews:</span>
                    <span className="font-medium text-warning">2.3 days avg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span className="font-medium text-warning">Medium</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View Recommendations
                  </Button>
                </div>
              </div>

              {/* Team Health Score */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Heart" size={16} className="text-success" />
                  <h4 className="text-sm font-medium text-foreground">Team Health Score</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">8.7</div>
                    <div className="text-xs text-muted-foreground">out of 10</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-foreground">92%</div>
                      <div className="text-muted-foreground">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">15%</div>
                      <div className="text-muted-foreground">Burnout Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamProductivityAnalyticsDashboard;