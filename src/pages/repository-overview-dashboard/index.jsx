import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import repositoryService from '../../utils/repositoryService';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import ExportControlPanel from '../../components/ui/ExportControlPanel';
import KPICard from './components/KPICard';
import ActivityFeed from './components/ActivityFeed';
import CommitActivityChart from './components/CommitActivityChart';
import RepositoryGrid from './components/RepositoryGrid';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RepositoryOverviewDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (!authLoading) {
      loadRepositories();
    }
  }, [authLoading, user]);

  useEffect(() => {
    let interval;
    if (autoRefresh && user) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
        loadRepositories();
      }, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, user]);

  const loadRepositories = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const result = await repositoryService.getRepositories();
      if (result?.success) {
        setRepositories(result.data || []);
      }
    } catch (error) {
      console.log('Error loading repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPI data from real repositories
  const calculateKPIData = () => {
    if (!repositories?.length) {
      return [
        {
          title: 'Total Repositories',
          value: '0',
          change: 'No data',
          changeType: 'neutral',
          icon: 'GitBranch',
          status: 'neutral',
          sparklineData: []
        },
        {
          title: 'Healthy Repos',
          value: '0',
          change: 'No data',
          changeType: 'neutral',
          icon: 'CheckCircle',
          status: 'neutral',
          sparklineData: []
        },
        {
          title: 'Total Issues',
          value: '0',
          change: 'No data',
          changeType: 'neutral',
          icon: 'AlertCircle',
          status: 'neutral',
          sparklineData: []
        },
        {
          title: 'Avg Health Score',
          value: '0%',
          change: 'No data',
          changeType: 'neutral',
          icon: 'Activity',
          status: 'neutral',
          sparklineData: []
        }
      ];
    }

    const totalRepos = repositories.length;
    const healthyRepos = repositories.filter(repo => repo.health_status === 'healthy').length;
    const totalIssues = repositories.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0);
    const avgHealthScore = Math.round(
      repositories.reduce((sum, repo) => sum + (repo.health_score || 0), 0) / totalRepos
    );

    return [
      {
        title: 'Total Repositories',
        value: totalRepos.toString(),
        change: `${totalRepos} active`,
        changeType: 'positive',
        icon: 'GitBranch',
        status: 'healthy',
        sparklineData: [totalRepos - 3, totalRepos - 2, totalRepos - 1, totalRepos]
      },
      {
        title: 'Healthy Repos',
        value: healthyRepos.toString(),
        change: `${Math.round((healthyRepos / totalRepos) * 100)}%`,
        changeType: healthyRepos / totalRepos > 0.7 ? 'positive' : 'warning',
        icon: 'CheckCircle',
        status: healthyRepos / totalRepos > 0.7 ? 'healthy' : 'warning',
        sparklineData: [healthyRepos - 2, healthyRepos - 1, healthyRepos, healthyRepos]
      },
      {
        title: 'Open Issues',
        value: totalIssues.toString(),
        change: totalIssues < 50 ? 'Under control' : 'Needs attention',
        changeType: totalIssues < 50 ? 'positive' : 'warning',
        icon: 'AlertCircle',
        status: totalIssues < 50 ? 'healthy' : 'warning',
        sparklineData: [totalIssues + 5, totalIssues + 2, totalIssues - 1, totalIssues]
      },
      {
        title: 'Avg Health Score',
        value: `${avgHealthScore}%`,
        change: avgHealthScore > 80 ? 'Excellent' : avgHealthScore > 60 ? 'Good' : 'Needs improvement',
        changeType: avgHealthScore > 80 ? 'positive' : avgHealthScore > 60 ? 'neutral' : 'warning',
        icon: 'Activity',
        status: avgHealthScore > 80 ? 'healthy' : avgHealthScore > 60 ? 'warning' : 'critical',
        sparklineData: [avgHealthScore - 5, avgHealthScore - 2, avgHealthScore + 1, avgHealthScore]
      }
    ];
  };

  const kpiData = calculateKPIData();

  const refreshIntervals = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' }
  ];

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
    if (user) {
      loadRepositories();
    }
  };

  const formatLastUpdated = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Show preview mode for non-authenticated users
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GlobalFilterBar />
        
        <main className="pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Repository Overview</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor repository health and development activity across all projects
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-accent/50 border border-border rounded-lg px-4 py-2">
                  <span className="text-sm text-muted-foreground">
                    <strong>Preview Mode:</strong> Sign in to see real data
                  </span>
                </div>
              </div>
            </div>

            {/* Preview KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Repositories', value: '12', change: '+2 this week', icon: 'GitBranch', status: 'healthy' },
                { title: 'Healthy Repos', value: '10', change: '83% healthy', icon: 'CheckCircle', status: 'healthy' },
                { title: 'Open Issues', value: '23', change: '-5 this week', icon: 'AlertCircle', status: 'warning' },
                { title: 'Avg Health Score', value: '87%', change: '+3% improvement', icon: 'Activity', status: 'healthy' }
              ].map((kpi, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/5 backdrop-blur-sm"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon name={kpi.icon} size={20} className="text-primary" />
                      </div>
                      <div className="w-12 h-12 bg-muted/50 rounded flex items-center justify-center">
                        <Icon name="Lock" size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{kpi.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Repository Grid with preview overlay */}
            <div className="mb-8">
              <RepositoryGrid />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterBar />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Repository Overview</h1>
              <p className="text-muted-foreground mt-2">
                Monitor repository health and development activity across all projects
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh Controls */}
              <div className="hidden md:flex items-center space-x-2 bg-card border border-border rounded-lg px-3 py-2">
                <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="bg-transparent text-sm text-foreground focus:outline-none"
                  disabled={!autoRefresh || !user}
                >
                  {refreshIntervals.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-8 h-4 rounded-full transition-smooth ${
                    autoRefresh && user ? 'bg-primary' : 'bg-muted'
                  }`}
                  disabled={!user}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-smooth ${
                    autoRefresh && user ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Last updated:</span>
                  <span className="font-mono">{formatLastUpdated(lastUpdated)}</span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                iconName="RefreshCw"
                iconSize={16}
                disabled={loading}
              >
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <ExportControlPanel />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Chart Section */}
            <div className="xl:col-span-2">
              <CommitActivityChart />
            </div>
            
            {/* Activity Feed */}
            <div className="xl:col-span-1">
              <ActivityFeed />
            </div>
          </div>

          {/* Repository Grid */}
          <div className="mb-8">
            <RepositoryGrid />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                iconName="GitPullRequest"
                iconPosition="left"
              >
                View Pull Requests
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Users"
                iconPosition="left"
              >
                Team Analytics
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Activity"
                iconPosition="left"
              >
                Health Monitoring
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryOverviewDashboard;