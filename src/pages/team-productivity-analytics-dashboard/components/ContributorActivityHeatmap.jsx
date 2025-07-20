import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ContributorActivityHeatmap = () => {
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // week, month

  // Mock heatmap data for the last 7 days
  const contributors = [
    { id: 1, name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face' },
    { id: 2, name: 'Mike Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
    { id: 3, name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
    { id: 4, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face' },
    { id: 5, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face' },
    { id: 6, name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face' }
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock activity data
  const generateActivityData = (contributorId) => {
    const data = {};
    days.forEach((day, dayIndex) => {
      data[day] = {};
      hours.forEach(hour => {
        // Simulate realistic work patterns
        let intensity = 0;
        if (hour >= 9 && hour <= 17 && dayIndex < 5) { // Work hours on weekdays
          intensity = Math.random() * 0.8 + 0.2;
        } else if (hour >= 19 && hour <= 22) { // Evening coding
          intensity = Math.random() * 0.4;
        } else if (dayIndex >= 5 && hour >= 10 && hour <= 16) { // Weekend activity
          intensity = Math.random() * 0.3;
        }
        data[day][hour] = Math.floor(intensity * 10);
      });
    });
    return data;
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-muted';
    if (intensity <= 2) return 'bg-success/20';
    if (intensity <= 4) return 'bg-success/40';
    if (intensity <= 6) return 'bg-success/60';
    if (intensity <= 8) return 'bg-success/80';
    return 'bg-success';
  };

  const getTimezoneDisplay = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${timezone} (UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)})`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Contributor Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Daily commit patterns • {getTimezoneDisplay()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                viewMode === 'week' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded transition-smooth ${
                viewMode === 'month' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Month
            </button>
          </div>
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-6">
        {contributors.map((contributor) => {
          const activityData = generateActivityData(contributor.id);
          const isSelected = selectedContributor === contributor.id;
          
          return (
            <div 
              key={contributor.id}
              className={`border rounded-lg p-4 transition-smooth cursor-pointer ${
                isSelected ? 'border-primary bg-accent/50' : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => setSelectedContributor(isSelected ? null : contributor.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={contributor.avatar} 
                    alt={contributor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{contributor.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 50 + 20)} commits this week
                    </p>
                  </div>
                </div>
                <Icon 
                  name={isSelected ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map(day => (
                  <div key={day} className="text-xs text-center text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map(day => (
                  <div key={day} className="grid grid-rows-24 gap-px">
                    {hours.map(hour => {
                      const intensity = activityData[day][hour];
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`w-full h-1 rounded-sm ${getIntensityColor(intensity)} transition-smooth hover:scale-110`}
                          title={`${day} ${hour}:00 - ${intensity} commits`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Peak Hours:</span>
                      <p className="font-medium text-foreground">9AM - 11AM</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Commits:</span>
                      <p className="font-medium text-foreground">{Math.floor(Math.random() * 50 + 20)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Active Days:</span>
                      <p className="font-medium text-foreground">5/7</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg/Day:</span>
                      <p className="font-medium text-foreground">{(Math.random() * 10 + 5).toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded-sm" />
            <div className="w-3 h-3 bg-success/20 rounded-sm" />
            <div className="w-3 h-3 bg-success/40 rounded-sm" />
            <div className="w-3 h-3 bg-success/60 rounded-sm" />
            <div className="w-3 h-3 bg-success rounded-sm" />
          </div>
          <span>More</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>Updated 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default ContributorActivityHeatmap;