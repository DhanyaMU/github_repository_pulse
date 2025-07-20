import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TeamLeaderboard = () => {
  const [sortBy, setSortBy] = useState('score'); // score, commits, reviews
  const [timeframe, setTimeframe] = useState('week'); // week, month, quarter

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      role: 'Senior Frontend Developer',
      score: 94,
      commits: 47,
      reviews: 23,
      linesAdded: 2847,
      linesDeleted: 1203,
      issuesResolved: 12,
      trend: 'up',
      badge: 'top-performer'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Backend Developer',
      score: 89,
      commits: 52,
      reviews: 18,
      linesAdded: 3124,
      linesDeleted: 987,
      issuesResolved: 8,
      trend: 'up',
      badge: 'consistent'
    },
    {
      id: 3,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Full Stack Developer',
      score: 87,
      commits: 41,
      reviews: 31,
      linesAdded: 2156,
      linesDeleted: 1456,
      issuesResolved: 15,
      trend: 'stable',
      badge: 'reviewer'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      role: 'DevOps Engineer',
      score: 82,
      commits: 29,
      reviews: 14,
      linesAdded: 1834,
      linesDeleted: 2103,
      issuesResolved: 6,
      trend: 'down',
      badge: 'optimizer'
    },
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Frontend Developer',
      score: 78,
      commits: 35,
      reviews: 12,
      linesAdded: 2234,
      linesDeleted: 876,
      issuesResolved: 9,
      trend: 'up',
      badge: 'rising-star'
    },
    {
      id: 6,
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
      role: 'QA Engineer',
      score: 75,
      commits: 18,
      reviews: 27,
      linesAdded: 1245,
      linesDeleted: 543,
      issuesResolved: 22,
      trend: 'stable',
      badge: 'quality-guardian'
    }
  ];

  const getBadgeConfig = (badge) => {
    const badges = {
      'top-performer': { icon: 'Trophy', color: 'text-warning', bg: 'bg-warning/10' },
      'consistent': { icon: 'Target', color: 'text-success', bg: 'bg-success/10' },
      'reviewer': { icon: 'Eye', color: 'text-primary', bg: 'bg-primary/10' },
      'optimizer': { icon: 'Zap', color: 'text-secondary', bg: 'bg-secondary/10' },
      'rising-star': { icon: 'Star', color: 'text-accent-foreground', bg: 'bg-accent' },
      'quality-guardian': { icon: 'Shield', color: 'text-muted-foreground', bg: 'bg-muted' }
    };
    return badges[badge] || badges['consistent'];
  };

  const sortedMembers = [...teamMembers].sort((a, b) => {
    switch (sortBy) {
      case 'commits':
        return b.commits - a.commits;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return b.score - a.score;
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Leaderboard</h3>
          <p className="text-sm text-muted-foreground">Performance rankings and engagement metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground"
          >
            <option value="score">Score</option>
            <option value="commits">Commits</option>
            <option value="reviews">Reviews</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedMembers.map((member, index) => {
          const badgeConfig = getBadgeConfig(member.badge);
          const rank = index + 1;
          
          return (
            <div 
              key={member.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-smooth hover:shadow-md ${
                rank === 1 ? 'border-warning bg-warning/5' : 
                rank === 2 ? 'border-muted-foreground bg-muted/20' : 
                rank === 3 ? 'border-accent bg-accent/20' : 'border-border hover:border-muted-foreground'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {rank <= 3 ? (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank === 1 ? 'bg-warning text-warning-foreground' :
                    rank === 2 ? 'bg-muted-foreground text-background': 'bg-accent text-accent-foreground'
                  }`}>
                    {rank}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
                )}
              </div>

              {/* Avatar and Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-foreground truncate">{member.name}</h4>
                    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${badgeConfig.bg}`}>
                      <Icon name={badgeConfig.icon} size={10} className={badgeConfig.color} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-foreground">{member.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{member.commits}</div>
                  <div className="text-xs text-muted-foreground">Commits</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{member.reviews}</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{member.issuesResolved}</div>
                  <div className="text-xs text-muted-foreground">Issues</div>
                </div>
              </div>

              {/* Trend */}
              <div className="flex-shrink-0">
                <div className={`flex items-center space-x-1 ${
                  member.trend === 'up' ? 'text-success' : 
                  member.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                }`}>
                  <Icon 
                    name={
                      member.trend === 'up' ? 'TrendingUp' : 
                      member.trend === 'down' ? 'TrendingDown' : 'Minus'
                    } 
                    size={14} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {teamMembers.reduce((sum, member) => sum + member.commits, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Commits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {teamMembers.reduce((sum, member) => sum + member.reviews, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {(teamMembers.reduce((sum, member) => sum + member.score, 0) / teamMembers.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {teamMembers.reduce((sum, member) => sum + member.issuesResolved, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Issues Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderboard;