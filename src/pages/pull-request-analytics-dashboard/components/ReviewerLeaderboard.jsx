import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ReviewerLeaderboard = () => {
  const [sortBy, setSortBy] = useState('reviews');
  
  const reviewers = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      reviews: 47,
      avgResponseTime: '2.3 hrs',
      approvalRate: 94.2,
      workload: 'high',
      status: 'active'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      reviews: 42,
      avgResponseTime: '1.8 hrs',
      approvalRate: 89.5,
      workload: 'medium',
      status: 'active'
    },
    {
      id: 3,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reviews: 38,
      avgResponseTime: '3.1 hrs',
      approvalRate: 91.8,
      workload: 'medium',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      reviews: 35,
      avgResponseTime: '4.2 hrs',
      approvalRate: 96.1,
      workload: 'low',
      status: 'away'
    },
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      reviews: 31,
      avgResponseTime: '2.7 hrs',
      approvalRate: 87.3,
      workload: 'low',
      status: 'active'
    },
    {
      id: 6,
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      reviews: 28,
      avgResponseTime: '5.1 hrs',
      approvalRate: 92.7,
      workload: 'low',
      status: 'active'
    }
  ];

  const getWorkloadColor = (workload) => {
    switch (workload) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const sortedReviewers = [...reviewers].sort((a, b) => {
    switch (sortBy) {
      case 'reviews':
        return b.reviews - a.reviews;
      case 'responseTime':
        return parseFloat(a.avgResponseTime) - parseFloat(b.avgResponseTime);
      case 'approvalRate':
        return b.approvalRate - a.approvalRate;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Reviewer Leaderboard</h3>
          <p className="text-sm text-muted-foreground">
            Team review performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-input border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="reviews">Reviews</option>
            <option value="responseTime">Response Time</option>
            <option value="approvalRate">Approval Rate</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedReviewers.map((reviewer, index) => (
          <div
            key={reviewer.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-smooth"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative">
                <Image
                  src={reviewer.avatar}
                  alt={reviewer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(reviewer.status)}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {reviewer.name}
                  </span>
                  {index < 3 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Award" size={12} className="text-warning" />
                      <span className="text-xs text-warning font-medium">
                        #{index + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {reviewer.reviews} reviews
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {reviewer.avgResponseTime} avg
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {reviewer.approvalRate}% approval
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className={`text-xs font-medium ${getWorkloadColor(reviewer.workload)}`}>
                  {reviewer.workload.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">workload</div>
              </div>
              
              <div className="w-16 bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    reviewer.workload === 'high' ? 'bg-error' :
                    reviewer.workload === 'medium' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{
                    width: `${
                      reviewer.workload === 'high' ? 85 :
                      reviewer.workload === 'medium' ? 60 : 35
                    }%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">
              {reviewers.reduce((sum, r) => sum + r.reviews, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Reviews</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">
              {(reviewers.reduce((sum, r) => sum + parseFloat(r.avgResponseTime), 0) / reviewers.length).toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">
              {(reviewers.reduce((sum, r) => sum + r.approvalRate, 0) / reviewers.length).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Team Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerLeaderboard;