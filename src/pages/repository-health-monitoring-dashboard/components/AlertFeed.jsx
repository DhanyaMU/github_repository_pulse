import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ alerts }) => {
  const [filter, setFilter] = useState('all');

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertBackground = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error/10 border-error/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-secondary/10 border-secondary/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filter);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Health Alerts</h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Live updates</span>
          </div>
        </div>

        <div className="flex space-x-1">
          {['all', 'critical', 'warning', 'info'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-smooth capitalize ${
                filter === severity
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {severity}
              {severity !== 'all' && (
                <span className="ml-1 text-xs">
                  ({alerts.filter(a => a.severity === severity).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No alerts for selected filter</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-smooth hover:bg-accent/50 ${getAlertBackground(alert.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    name={getAlertIcon(alert.severity)}
                    size={16}
                    className={`mt-0.5 ${getAlertColor(alert.severity)}`}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {alert.repository}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {alert.message}
                    </p>
                    
                    {alert.recommendation && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Lightbulb" size={12} className="text-warning" />
                        <span className="text-xs text-muted-foreground">
                          {alert.recommendation}
                        </span>
                      </div>
                    )}
                    
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="flex space-x-2 mt-2">
                        {alert.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="xs"
                            className="text-xs"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          iconPosition="left"
          className="w-full"
        >
          Configure Alerts
        </Button>
      </div>
    </div>
  );
};

export default AlertFeed;