import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  const mockActivities = [
    {
      id: 1,
      type: 'commit',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'frontend-dashboard',
      message: 'Add responsive navigation component',
      timestamp: new Date(Date.now() - 300000),
      hash: 'a1b2c3d'
    },
    {
      id: 2,
      type: 'pr_merged',
      user: {
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'backend-api',
      message: 'Implement user authentication middleware',
      timestamp: new Date(Date.now() - 600000),
      prNumber: 142
    },
    {
      id: 3,
      type: 'issue_closed',
      user: {
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'mobile-app',
      message: 'Fix memory leak in image loading',
      timestamp: new Date(Date.now() - 900000),
      issueNumber: 89
    },
    {
      id: 4,
      type: 'commit',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'data-pipeline',
      message: 'Optimize database query performance',
      timestamp: new Date(Date.now() - 1200000),
      hash: 'x9y8z7w'
    },
    {
      id: 5,
      type: 'pr_opened',
      user: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'ml-models',
      message: 'Add new recommendation algorithm',
      timestamp: new Date(Date.now() - 1500000),
      prNumber: 67
    },
    {
      id: 6,
      type: 'issue_opened',
      user: {
        name: 'Lisa Park',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      repository: 'frontend-dashboard',
      message: 'Dark mode toggle not working on mobile',
      timestamp: new Date(Date.now() - 1800000),
      issueNumber: 156
    }
  ];

  useEffect(() => {
    setActivities(mockActivities);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        const newActivity = {
          id: Date.now(),
          type: ['commit', 'pr_merged', 'issue_closed'][Math.floor(Math.random() * 3)],
          user: mockActivities[Math.floor(Math.random() * mockActivities.length)].user,
          repository: ['frontend-dashboard', 'backend-api', 'mobile-app'][Math.floor(Math.random() * 3)],
          message: 'Real-time activity update',
          timestamp: new Date(),
          hash: Math.random().toString(36).substr(2, 7)
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'commit': return 'GitCommit';
      case 'pr_merged': return 'GitMerge';
      case 'pr_opened': return 'GitPullRequest';
      case 'issue_closed': return 'CheckCircle';
      case 'issue_opened': return 'AlertCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'commit': return 'text-primary';
      case 'pr_merged': return 'text-success';
      case 'pr_opened': return 'text-secondary';
      case 'issue_closed': return 'text-success';
      case 'issue_opened': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Live Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse-slow' : 'bg-muted-foreground'}`} />
              <span className="text-sm text-muted-foreground">
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={isLive ? 'Pause' : 'Play'} size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-smooth ${
              index === 0 && isLive ? 'animate-pulse-slow' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={getActivityIcon(activity.type)} 
                    size={14} 
                    className={getActivityColor(activity.type)}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {activity.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">
                  {activity.message}
                </p>
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-muted-foreground">{activity.repository}</span>
                  {activity.hash && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                        {activity.hash}
                      </code>
                    </>
                  )}
                  {activity.prNumber && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-secondary">#{activity.prNumber}</span>
                    </>
                  )}
                  {activity.issueNumber && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-warning">#{activity.issueNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-smooth">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;