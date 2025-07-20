import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const HealthControlPanel = ({ onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    healthThreshold: 'standard',
    alertSensitivity: 'medium',
    updateFrequency: '15min',
    notificationChannels: ['email']
  });

  const thresholdOptions = [
    { value: 'strict', label: 'Strict (90/70)' },
    { value: 'standard', label: 'Standard (80/60)' },
    { value: 'relaxed', label: 'Relaxed (70/50)' },
    { value: 'custom', label: 'Custom' }
  ];

  const sensitivityOptions = [
    { value: 'low', label: 'Low - Critical only' },
    { value: 'medium', label: 'Medium - Warning & Critical' },
    { value: 'high', label: 'High - All alerts' }
  ];

  const frequencyOptions = [
    { value: '5min', label: 'Every 5 minutes' },
    { value: '15min', label: 'Every 15 minutes' },
    { value: '30min', label: 'Every 30 minutes' },
    { value: '1hour', label: 'Every hour' }
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email notifications' },
    { value: 'slack', label: 'Slack integration' },
    { value: 'webhook', label: 'Webhook alerts' },
    { value: 'dashboard', label: 'Dashboard only' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const presetConfigurations = [
    {
      name: 'Development Team',
      description: 'Balanced monitoring for active development',
      settings: {
        healthThreshold: 'standard',
        alertSensitivity: 'medium',
        updateFrequency: '15min',
        notificationChannels: ['email', 'slack']
      }
    },
    {
      name: 'Production Critical',
      description: 'Strict monitoring for production repositories',
      settings: {
        healthThreshold: 'strict',
        alertSensitivity: 'high',
        updateFrequency: '5min',
        notificationChannels: ['email', 'slack', 'webhook']
      }
    },
    {
      name: 'Maintenance Mode',
      description: 'Minimal alerts for stable repositories',
      settings: {
        healthThreshold: 'relaxed',
        alertSensitivity: 'low',
        updateFrequency: '1hour',
        notificationChannels: ['dashboard']
      }
    }
  ];

  const applyPreset = (preset) => {
    setSettings(preset.settings);
    onSettingsChange?.(preset.settings);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Health Monitoring Controls</h3>
              <p className="text-sm text-muted-foreground">Configure thresholds and alert settings</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Quick Presets */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Quick Presets</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presetConfigurations.map((preset) => (
                <div
                  key={preset.name}
                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-smooth cursor-pointer"
                  onClick={() => applyPreset(preset)}
                >
                  <h5 className="text-sm font-medium text-foreground mb-1">{preset.name}</h5>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Health Thresholds"
              description="Define good/warning score boundaries"
              options={thresholdOptions}
              value={settings.healthThreshold}
              onChange={(value) => handleSettingChange('healthThreshold', value)}
            />

            <Select
              label="Alert Sensitivity"
              description="Control which alerts are triggered"
              options={sensitivityOptions}
              value={settings.alertSensitivity}
              onChange={(value) => handleSettingChange('alertSensitivity', value)}
            />

            <Select
              label="Update Frequency"
              description="How often to refresh health data"
              options={frequencyOptions}
              value={settings.updateFrequency}
              onChange={(value) => handleSettingChange('updateFrequency', value)}
            />

            <Select
              label="Notification Channels"
              description="Where to send health alerts"
              options={notificationOptions}
              value={settings.notificationChannels}
              onChange={(value) => handleSettingChange('notificationChannels', value)}
              multiple
            />
          </div>

          {/* Custom Threshold Settings */}
          {settings.healthThreshold === 'custom' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Custom Thresholds</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Good Threshold"
                  type="number"
                  placeholder="80"
                  min="0"
                  max="100"
                  description="Minimum score for healthy status"
                />
                <Input
                  label="Warning Threshold"
                  type="number"
                  placeholder="60"
                  min="0"
                  max="100"
                  description="Minimum score before warning"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Last updated: 2 minutes ago</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RotateCcw"
                iconPosition="left"
              >
                Reset to Default
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                iconPosition="left"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthControlPanel;