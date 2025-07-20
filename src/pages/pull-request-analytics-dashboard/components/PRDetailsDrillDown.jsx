import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PRDetailsDrillDown = () => {
  const [selectedPR, setSelectedPR] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const pullRequests = [
    {
      id: 1,
      title: 'Implement user authentication system',
      number: 247,
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      status: 'merged',
      createdAt: '2024-07-15T10:30:00Z',
      mergedAt: '2024-07-17T14:22:00Z',
      reviewers: [
        { name: 'Mike Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', approved: true },
        { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', approved: true }
      ],
      additions: 342,
      deletions: 89,
      commits: 8,
      comments: 12,
      conflicts: false,
      labels: ['feature', 'backend']
    },
    {
      id: 2,
      title: 'Fix responsive layout issues on mobile',
      number: 248,
      author: {
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      status: 'approved',
      createdAt: '2024-07-16T09:15:00Z',
      mergedAt: null,
      reviewers: [
        { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', approved: true },
        { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', approved: false }
      ],
      additions: 156,
      deletions: 203,
      commits: 5,
      comments: 8,
      conflicts: false,
      labels: ['bugfix', 'frontend']
    },
    {
      id: 3,
      title: 'Add comprehensive test coverage for API endpoints',
      number: 249,
      author: {
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      status: 'review',
      createdAt: '2024-07-17T16:45:00Z',
      mergedAt: null,
      reviewers: [
        { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', approved: false }
      ],
      additions: 428,
      deletions: 12,
      commits: 12,
      comments: 15,
      conflicts: true,
      labels: ['testing', 'backend']
    },
    {
      id: 4,
      title: 'Update documentation for new API version',
      number: 250,
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      status: 'draft',
      createdAt: '2024-07-18T11:20:00Z',
      mergedAt: null,
      reviewers: [],
      additions: 89,
      deletions: 34,
      commits: 3,
      comments: 2,
      conflicts: false,
      labels: ['documentation']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'merged': return 'text-success bg-success/10';
      case 'approved': return 'text-secondary bg-secondary/10';
      case 'review': return 'text-warning bg-warning/10';
      case 'draft': return 'text-muted-foreground bg-muted/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'merged': return 'GitMerge';
      case 'approved': return 'CheckCircle';
      case 'review': return 'Clock';
      case 'draft': return 'Edit';
      default: return 'GitPullRequest';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredPRs = filterStatus === 'all' 
    ? pullRequests 
    : pullRequests.filter(pr => pr.status === filterStatus);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Pull Requests</h3>
          <p className="text-sm text-muted-foreground">
            Detailed view with review chains and approval status
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-input border border-border rounded px-3 py-2 text-foreground"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
            <option value="merged">Merged</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPRs.map((pr) => (
          <div
            key={pr.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(pr.status)}`}>
                    <Icon name={getStatusIcon(pr.status)} size={12} />
                    <span className="capitalize">{pr.status}</span>
                  </div>
                  
                  <span className="text-sm font-medium text-foreground">
                    #{pr.number}
                  </span>
                  
                  {pr.conflicts && (
                    <div className="flex items-center space-x-1 text-error">
                      <Icon name="AlertTriangle" size={12} />
                      <span className="text-xs">Conflicts</span>
                    </div>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-foreground mb-2 hover:text-primary cursor-pointer">
                  {pr.title}
                </h4>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Image
                      src={pr.author.avatar}
                      alt={pr.author.name}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{pr.author.name}</span>
                  </div>
                  
                  <span>•</span>
                  <span>{formatTimeAgo(pr.createdAt)}</span>
                  
                  {pr.mergedAt && (
                    <>
                      <span>•</span>
                      <span>Merged {formatTimeAgo(pr.mergedAt)}</span>
                    </>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPR(selectedPR === pr.id ? null : pr.id)}
                iconName={selectedPR === pr.id ? "ChevronUp" : "ChevronDown"}
                iconSize={16}
                className="text-muted-foreground hover:text-foreground"
              />
            </div>

            {/* Code Changes Summary */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1 text-xs">
                <Icon name="Plus" size={12} className="text-success" />
                <span className="text-success font-medium">{pr.additions}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Icon name="Minus" size={12} className="text-error" />
                <span className="text-error font-medium">{pr.deletions}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="GitCommit" size={12} />
                <span>{pr.commits} commits</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="MessageSquare" size={12} />
                <span>{pr.comments} comments</span>
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center space-x-2 mb-3">
              {pr.labels.map((label, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Reviewers */}
            {pr.reviewers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Reviewers:</span>
                <div className="flex items-center space-x-2">
                  {pr.reviewers.map((reviewer, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className="relative">
                        <Image
                          src={reviewer.avatar}
                          alt={reviewer.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${
                          reviewer.approved ? 'bg-success' : 'bg-warning'
                        }`} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {reviewer.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Details */}
            {selectedPR === pr.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Timeline</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <Icon name="GitBranch" size={12} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Created {formatTimeAgo(pr.createdAt)}
                        </span>
                      </div>
                      {pr.mergedAt && (
                        <div className="flex items-center space-x-2">
                          <Icon name="GitMerge" size={12} className="text-success" />
                          <span className="text-muted-foreground">
                            Merged {formatTimeAgo(pr.mergedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Review Status</h5>
                    <div className="space-y-1">
                      {pr.reviewers.map((reviewer, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{reviewer.name}</span>
                          <span className={reviewer.approved ? 'text-success' : 'text-warning'}>
                            {reviewer.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPRs.length === 0 && (
        <div className="text-center py-8">
          <Icon name="GitPullRequest" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No pull requests found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default PRDetailsDrillDown;