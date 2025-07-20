import React from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import ExportControlPanel from '../../components/ui/ExportControlPanel';
import PRMetricsStrip from './components/PRMetricsStrip';
import PRLifecycleChart from './components/PRLifecycleChart';
import ReviewerLeaderboard from './components/ReviewerLeaderboard';
import PRVolumeTimeline from './components/PRVolumeTimeline';
import PRDetailsDrillDown from './components/PRDetailsDrillDown';

const PullRequestAnalyticsDashboard = () => {
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
                Pull Request Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive insights into code review processes, merge patterns, and development velocity optimization
              </p>
            </div>
            <ExportControlPanel />
          </div>

          {/* Primary Metrics Strip */}
          <PRMetricsStrip />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* PR Lifecycle Chart - 8 columns */}
            <div className="lg:col-span-8">
              <PRLifecycleChart />
            </div>
            
            {/* Reviewer Leaderboard - 4 columns */}
            <div className="lg:col-span-4">
              <ReviewerLeaderboard />
            </div>
          </div>

          {/* Full-width Timeline */}
          <div className="mb-8">
            <PRVolumeTimeline />
          </div>

          {/* PR Details Drill-down */}
          <PRDetailsDrillDown />
        </div>
      </main>
    </div>
  );
};

export default PullRequestAnalyticsDashboard;