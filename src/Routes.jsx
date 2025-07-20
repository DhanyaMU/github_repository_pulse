import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import RepositoryOverviewDashboard from "pages/repository-overview-dashboard";
import PullRequestAnalyticsDashboard from "pages/pull-request-analytics-dashboard";
import RepositoryHealthMonitoringDashboard from "pages/repository-health-monitoring-dashboard";
import TeamProductivityAnalyticsDashboard from "pages/team-productivity-analytics-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<RepositoryOverviewDashboard />} />
        <Route path="/repository-overview-dashboard" element={<RepositoryOverviewDashboard />} />
        <Route path="/pull-request-analytics-dashboard" element={<PullRequestAnalyticsDashboard />} />
        <Route path="/repository-health-monitoring-dashboard" element={<RepositoryHealthMonitoringDashboard />} />
        <Route path="/team-productivity-analytics-dashboard" element={<TeamProductivityAnalyticsDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;