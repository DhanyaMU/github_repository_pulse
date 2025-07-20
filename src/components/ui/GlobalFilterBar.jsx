import React, { useState } from 'react';
import Select from './Select';

import Button from './Button';
import Icon from '../AppIcon';

const GlobalFilterBar = () => {
  const [selectedRepository, setSelectedRepository] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const repositoryOptions = [
    { value: 'repo1', label: 'frontend-dashboard' },
    { value: 'repo2', label: 'backend-api' },
    { value: 'repo3', label: 'mobile-app' },
    { value: 'repo4', label: 'data-pipeline' },
    { value: 'repo5', label: 'ml-models' }
  ];

  const dateRangeOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: 'custom', label: 'Custom range' }
  ];

  const contributorOptions = [
    { value: 'user1', label: 'Sarah Chen' },
    { value: 'user2', label: 'Mike Rodriguez' },
    { value: 'user3', label: 'Alex Thompson' },
    { value: 'user4', label: 'Emma Wilson' },
    { value: 'user5', label: 'David Kim' }
  ];

  const handleClearFilters = () => {
    setSelectedRepository('');
    setDateRange('7d');
    setSelectedContributors([]);
  };

  const hasActiveFilters = selectedRepository || dateRange !== '7d' || selectedContributors.length > 0;

  return (
    <div className="bg-card border-b border-border sticky top-16 z-90">
      <div className="px-6 py-4">
        {/* Desktop Filter Bar */}
        <div className="hidden lg:flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-64">
              <Select
                placeholder="Select repository"
                options={repositoryOptions}
                value={selectedRepository}
                onChange={setSelectedRepository}
                searchable
                clearable
              />
            </div>
            
            <div className="w-48">
              <Select
                placeholder="Time range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div className="w-64">
              <Select
                placeholder="Filter contributors"
                options={contributorOptions}
                value={selectedContributors}
                onChange={setSelectedContributors}
                multiple
                searchable
                clearable
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                iconSize={16}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Icon name="Filter" size={16} />
              <span>{hasActiveFilters ? 'Filtered' : 'All data'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              className="flex-1 justify-between"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={16} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                iconSize={16}
                className="ml-2 text-muted-foreground hover:text-foreground"
              />
            )}
          </div>

          {/* Expandable Mobile Filters */}
          {isExpanded && (
            <div className="mt-4 space-y-4 transition-expand">
              <Select
                label="Repository"
                placeholder="Select repository"
                options={repositoryOptions}
                value={selectedRepository}
                onChange={setSelectedRepository}
                searchable
                clearable
              />
              
              <Select
                label="Time Range"
                placeholder="Select time range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
              />
              
              <Select
                label="Contributors"
                placeholder="Filter by contributors"
                options={contributorOptions}
                value={selectedContributors}
                onChange={setSelectedContributors}
                multiple
                searchable
                clearable
              />
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {selectedRepository && (
              <div className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                <Icon name="GitBranch" size={12} />
                <span>{repositoryOptions.find(r => r.value === selectedRepository)?.label}</span>
                <button
                  onClick={() => setSelectedRepository('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {dateRange !== '7d' && (
              <div className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                <Icon name="Calendar" size={12} />
                <span>{dateRangeOptions.find(d => d.value === dateRange)?.label}</span>
                <button
                  onClick={() => setDateRange('7d')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {selectedContributors.length > 0 && (
              <div className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-md text-xs">
                <Icon name="Users" size={12} />
                <span>{selectedContributors.length} contributor{selectedContributors.length > 1 ? 's' : ''}</span>
                <button
                  onClick={() => setSelectedContributors([])}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalFilterBar;