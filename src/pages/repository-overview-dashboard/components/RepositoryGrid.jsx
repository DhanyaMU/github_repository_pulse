import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import repositoryService from '../../../utils/repositoryService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RepositoryGrid = () => {
  const { user, loading: authLoading } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('health_score');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (!authLoading) {
      loadRepositories();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time changes
    const channel = repositoryService.subscribeToAllRepositories((payload) => {
      console.log('Repository change:', payload);
      // Reload repositories on any change
      loadRepositories();
    });

    return () => {
      repositoryService.unsubscribe(channel);
    };
  }, [user]);

  const loadRepositories = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await repositoryService.getRepositories();
      
      if (result?.success) {
        setRepositories(result.data || []);
      } else {
        setError(result?.error || 'Failed to load repositories');
      }
    } catch (error) {
      setError('Failed to load repositories');
      console.log('Repository loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-500',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'Go': 'bg-cyan-500'
    };
    return colors[language] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatLastCommit = (timestamp) => {
    if (!timestamp) return 'No commits';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedRepositories = [...repositories].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
    >
      <span>{children}</span>
      {sortBy === field && (
        <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
      )}
    </button>
  );

  // Show auth preview for non-authenticated users
  if (!user && !authLoading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Repository Overview</h3>
              <p className="text-sm text-muted-foreground">Health metrics and activity across all repositories</p>
            </div>
          </div>
        </div>
        
        <div className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to view your repositories and access real-time monitoring features.
            </p>
            <div className="bg-accent/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Preview Mode:</strong> This dashboard would show your connected repositories with live health metrics, commit activity, and team collaboration data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Repository Overview</h3>
              <p className="text-sm text-muted-foreground">Loading repository data...</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Repository Overview</h3>
              <p className="text-sm text-muted-foreground">Error loading repositories</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <Icon name="AlertCircle" size={32} className="text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Repositories</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadRepositories} variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Repository Overview</h3>
              <p className="text-sm text-muted-foreground">No repositories found</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <Icon name="GitBranch" size={32} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Repositories</h3>
          <p className="text-muted-foreground">
            You don't have access to any repositories yet. Contact your administrator to get access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Repository Overview</h3>
            <p className="text-sm text-muted-foreground">Health metrics and activity across all repositories</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter" iconSize={16}>
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={loadRepositories}>
              <Icon name="RefreshCw" size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <SortButton field="name">Repository</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="language">Language</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="health_score">Health</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="stars_count">Stars</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="forks_count">Forks</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="open_issues_count">Issues</SortButton>
              </th>
              <th className="text-left p-4">
                <SortButton field="last_commit_at">Last Activity</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRepositories.map((repo) => (
              <tr key={repo.id} className="border-b border-border hover:bg-accent/50 transition-smooth">
                <td className="p-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Icon name="GitBranch" size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{repo.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
                      {repo.description || 'No description'}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                    <span className="text-sm text-foreground">{repo.language || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(repo.health_status)} 
                      size={16} 
                      className={getStatusColor(repo.health_status)}
                    />
                    <span className="text-sm font-medium text-foreground">{repo.health_score}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{repo.stars_count?.toLocaleString() || '0'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{repo.forks_count?.toLocaleString() || '0'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{repo.open_issues_count || '0'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{formatLastCommit(repo.last_commit_at)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {sortedRepositories.map((repo) => (
          <div key={repo.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="GitBranch" size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{repo.name}</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                    <span className="text-xs text-muted-foreground">{repo.language || 'Unknown'}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{repo.description || 'No description'}</p>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                <Icon 
                  name={getStatusIcon(repo.health_status)} 
                  size={14} 
                  className={getStatusColor(repo.health_status)}
                />
                <span className="text-sm font-medium text-foreground">{repo.health_score}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stars:</span>
                <span className="text-foreground">{repo.stars_count?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Forks:</span>
                <span className="text-foreground">{repo.forks_count?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issues:</span>
                <span className="text-foreground">{repo.open_issues_count || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span className="text-foreground">{repo.owner?.full_name || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last activity:</span>
                <span className="text-muted-foreground">{formatLastCommit(repo.last_commit_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryGrid;