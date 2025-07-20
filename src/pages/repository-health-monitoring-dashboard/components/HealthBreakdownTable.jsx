import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthBreakdownTable = ({ repositories }) => {
  const [sortBy, setSortBy] = useState('overallHealth');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthBadge = (score) => {
    if (score >= 80) return 'bg-success/10 text-success border-success/20';
    if (score >= 60) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-error/10 text-error border-error/20';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedRepositories = [...repositories].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedRepositories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRepositories = sortedRepositories.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    { key: 'name', label: 'Repository', sortable: true },
    { key: 'overallHealth', label: 'Health Score', sortable: true },
    { key: 'codeCoverage', label: 'Coverage', sortable: true },
    { key: 'documentation', label: 'Docs', sortable: true },
    { key: 'issueResponseTime', label: 'Response Time', sortable: true },
    { key: 'contributorDiversity', label: 'Contributors', sortable: true },
    { key: 'lastActivity', label: 'Last Activity', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Repository Health Breakdown</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <Icon
                        name={
                          sortBy === column.key
                            ? sortOrder === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRepositories.map((repo) => (
              <tr key={repo.id} className="hover:bg-accent/50 transition-smooth">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="GitBranch" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{repo.name}</p>
                      <p className="text-xs text-muted-foreground">{repo.language}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getHealthColor(repo.overallHealth)}`}>
                      {repo.overallHealth}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getHealthBadge(repo.overallHealth)}`}>
                      {repo.overallHealth >= 80 ? 'Healthy' : repo.overallHealth >= 60 ? 'Warning' : 'Critical'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getHealthColor(repo.codeCoverage).replace('text-', 'bg-')}`}
                        style={{ width: `${repo.codeCoverage}%` }}
                      />
                    </div>
                    <span className="text-sm text-foreground">{repo.codeCoverage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Icon
                      name={repo.documentation >= 80 ? 'CheckCircle' : repo.documentation >= 60 ? 'AlertCircle' : 'XCircle'}
                      size={16}
                      className={getHealthColor(repo.documentation)}
                    />
                    <span className="text-sm text-foreground">{repo.documentation}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{repo.issueResponseTime}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {repo.topContributors.slice(0, 3).map((contributor, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                          title={contributor.name}
                        >
                          <span className="text-xs font-medium text-primary">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      +{repo.contributorDiversity - 3}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{repo.lastActivity}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={14}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Settings"
                      iconSize={14}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      iconSize={14}
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, repositories.length)} of {repositories.length} repositories
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                iconSize={16}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                iconSize={16}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthBreakdownTable;