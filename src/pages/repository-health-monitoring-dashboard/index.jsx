import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import ExportControlPanel from '../../components/ui/ExportControlPanel';
import HealthScoreGauge from './components/HealthScoreGauge';
import HealthTrendChart from './components/HealthTrendChart';
import AlertFeed from './components/AlertFeed';
import HealthBreakdownTable from './components/HealthBreakdownTable';
import HealthControlPanel from './components/HealthControlPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RepositoryHealthMonitoringDashboard = () => {
  const [healthSettings, setHealthSettings] = useState({
    healthThreshold: 'standard',
    alertSensitivity: 'medium',
    updateFrequency: '15min',
    notificationChannels: ['email']
  });

  // Mock data for health metrics
  const healthMetrics = {
    overallHealth: 78,
    maintenanceIndex: 85,
    communityEngagement: 72,
    technicalDebt: 65
  };

  // Mock data for health trend chart
  const healthTrendData = [
    {
      date: "Dec 11",
      overallHealth: 82,
      maintenanceIndex: 88,
      communityEngagement: 75,
      technicalDebt: 68
    },
    {
      date: "Dec 12",
      overallHealth: 79,
      maintenanceIndex: 86,
      communityEngagement: 73,
      technicalDebt: 66
    },
    {
      date: "Dec 13",
      overallHealth: 81,
      maintenanceIndex: 87,
      communityEngagement: 74,
      technicalDebt: 67
    },
    {
      date: "Dec 14",
      overallHealth: 78,
      maintenanceIndex: 85,
      communityEngagement: 72,
      technicalDebt: 65
    },
    {
      date: "Dec 15",
      overallHealth: 80,
      maintenanceIndex: 86,
      communityEngagement: 73,
      technicalDebt: 66
    },
    {
      date: "Dec 16",
      overallHealth: 77,
      maintenanceIndex: 84,
      communityEngagement: 71,
      technicalDebt: 64
    },
    {
      date: "Dec 17",
      overallHealth: 78,
      maintenanceIndex: 85,
      communityEngagement: 72,
      technicalDebt: 65
    },
    {
      date: "Dec 18",
      overallHealth: 78,
      maintenanceIndex: 85,
      communityEngagement: 72,
      technicalDebt: 65
    }
  ];

  // Mock data for alerts
  const alertsData = [
    {
      id: 1,
      repository: "frontend-dashboard",
      severity: "critical",
      message: "Code coverage dropped below 60% threshold. Current coverage: 45%",
      timestamp: new Date(Date.now() - 300000),
      recommendation: "Review recent commits and add missing test cases",
      actions: ["View Coverage", "Add Tests"]
    },
    {
      id: 2,
      repository: "backend-api",
      severity: "warning",
      message: "Issue response time increased to 4.2 days, exceeding 3-day target",
      timestamp: new Date(Date.now() - 900000),
      recommendation: "Assign more reviewers to reduce response time",
      actions: ["View Issues", "Assign Reviewers"]
    },
    {
      id: 3,
      repository: "mobile-app",
      severity: "info",
      message: "Documentation completeness improved to 85%",
      timestamp: new Date(Date.now() - 1800000),
      recommendation: "Continue improving documentation coverage",
      actions: ["View Docs"]
    },
    {
      id: 4,
      repository: "data-pipeline",
      severity: "warning",
      message: "No commits in the last 7 days, repository may be stale",
      timestamp: new Date(Date.now() - 3600000),
      recommendation: "Check if repository is actively maintained",
      actions: ["View Activity", "Contact Team"]
    },
    {
      id: 5,
      repository: "ml-models",
      severity: "critical",
      message: "Technical debt ratio reached 85%, immediate attention required",
      timestamp: new Date(Date.now() - 7200000),
      recommendation: "Schedule refactoring sprint to reduce technical debt",
      actions: ["View Debt", "Plan Refactor"]
    }
  ];

  // Mock data for repository breakdown
  const repositoriesData = [
    {
      id: 1,
      name: "frontend-dashboard",
      language: "TypeScript",
      overallHealth: 78,
      codeCoverage: 45,
      documentation: 92,
      issueResponseTime: "2.1 days",
      contributorDiversity: 8,
      lastActivity: "2 hours ago",
      topContributors: [
        { name: "Sarah Chen", commits: 156 },
        { name: "Mike Rodriguez", commits: 134 },
        { name: "Alex Thompson", commits: 98 }
      ]
    },
    {
      id: 2,
      name: "backend-api",
      language: "Python",
      overallHealth: 85,
      codeCoverage: 78,
      documentation: 88,
      issueResponseTime: "4.2 days",
      contributorDiversity: 12,
      lastActivity: "1 hour ago",
      topContributors: [
        { name: "Emma Wilson", commits: 203 },
        { name: "David Kim", commits: 187 },
        { name: "Lisa Zhang", commits: 145 }
      ]
    },
    {
      id: 3,
      name: "mobile-app",
      language: "Swift",
      overallHealth: 92,
      codeCoverage: 82,
      documentation: 85,
      issueResponseTime: "1.8 days",
      contributorDiversity: 6,
      lastActivity: "30 minutes ago",
      topContributors: [
        { name: "James Wilson", commits: 178 },
        { name: "Maria Garcia", commits: 156 },
        { name: "Tom Anderson", commits: 134 }
      ]
    },
    {
      id: 4,
      name: "data-pipeline",
      language: "Python",
      overallHealth: 65,
      codeCoverage: 55,
      documentation: 72,
      issueResponseTime: "6.5 days",
      contributorDiversity: 4,
      lastActivity: "7 days ago",
      topContributors: [
        { name: "Robert Chen", commits: 89 },
        { name: "Anna Smith", commits: 67 },
        { name: "John Doe", commits: 45 }
      ]
    },
    {
      id: 5,
      name: "ml-models",
      language: "Python",
      overallHealth: 58,
      codeCoverage: 38,
      documentation: 65,
      issueResponseTime: "8.2 days",
      contributorDiversity: 3,
      lastActivity: "3 days ago",
      topContributors: [
        { name: "Dr. Sarah Kim", commits: 234 },
        { name: "Alex Johnson", commits: 123 },
        { name: "Maya Patel", commits: 89 }
      ]
    }
  ];

  const handleHealthSettingsChange = (newSettings) => {
    setHealthSettings(newSettings);
    console.log('Health settings updated:', newSettings);
  };

  const getOverallHealthStatus = () => {
    const score = healthMetrics.overallHealth;
    if (score >= 80) return { status: 'Healthy', color: 'text-success', icon: 'CheckCircle' };
    if (score >= 60) return { status: 'Warning', color: 'text-warning', icon: 'AlertTriangle' };
    return { status: 'Critical', color: 'text-error', icon: 'XCircle' };
  };

  const overallStatus = getOverallHealthStatus();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      console.log('Health data refreshed at:', new Date().toLocaleTimeString());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterBar />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Repository Health Monitoring
              </h1>
              <p className="text-muted-foreground">
                Comprehensive oversight of code quality, maintenance patterns, and community engagement
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
                <Icon name={overallStatus.icon} size={16} className={overallStatus.color} />
                <span className="text-sm font-medium text-foreground">
                  Portfolio Status: {overallStatus.status}
                </span>
              </div>
              <ExportControlPanel />
            </div>
          </div>

          {/* Health Control Panel */}
          <div className="mb-8">
            <HealthControlPanel onSettingsChange={handleHealthSettingsChange} />
          </div>

          {/* Primary Health Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <HealthScoreGauge
              score={healthMetrics.overallHealth}
              title="Overall Health"
              subtitle="Repository portfolio score"
            />
            <HealthScoreGauge
              score={healthMetrics.maintenanceIndex}
              title="Maintenance Index"
              subtitle="Code quality & upkeep"
            />
            <HealthScoreGauge
              score={healthMetrics.communityEngagement}
              title="Community Engagement"
              subtitle="Contributor activity"
            />
            <HealthScoreGauge
              score={healthMetrics.technicalDebt}
              title="Technical Debt"
              subtitle="Code maintainability"
              threshold={{ good: 70, warning: 50 }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Health Trend Chart - 3 columns */}
            <div className="lg:col-span-3">
              <HealthTrendChart
                data={healthTrendData}
                title="Health Metrics Trend Analysis"
                height={400}
              />
            </div>

            {/* Alert Feed - 1 column */}
            <div className="lg:col-span-1">
              <AlertFeed alerts={alertsData} />
            </div>
          </div>

          {/* Repository Health Breakdown Table */}
          <div className="mb-8">
            <HealthBreakdownTable repositories={repositoriesData} />
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="TrendingUp" size={20} className="text-success" />
                <h3 className="text-lg font-semibold text-foreground">Health Predictions</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next 7 days</span>
                  <span className="text-sm font-medium text-success">+2.3% improvement</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next 30 days</span>
                  <span className="text-sm font-medium text-warning">-1.1% decline</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm font-medium text-foreground">87%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Calendar" size={20} className="text-secondary" />
                <h3 className="text-lg font-semibold text-foreground">Maintenance Schedule</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dependencies update</span>
                  <span className="text-sm font-medium text-foreground">Dec 20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Security audit</span>
                  <span className="text-sm font-medium text-foreground">Dec 25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Performance review</span>
                  <span className="text-sm font-medium text-foreground">Jan 2</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Zap" size={20} className="text-warning" />
                <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Generate Health Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Bell"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Configure Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Manage Thresholds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryHealthMonitoringDashboard;