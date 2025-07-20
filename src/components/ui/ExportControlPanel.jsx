import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Select from './Select';
import Icon from '../AppIcon';

const ExportControlPanel = () => {
  const location = useLocation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'json', label: 'JSON Data' },
    { value: 'png', label: 'PNG Image' }
  ];

  const getContextualExportOptions = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/repository-overview-dashboard':
        return {
          title: 'Repository Overview',
          description: 'Export repository health and activity summary',
          availableFormats: ['pdf', 'csv', 'png']
        };
      case '/pull-request-analytics-dashboard':
        return {
          title: 'Pull Request Analytics',
          description: 'Export code review process analytics',
          availableFormats: ['pdf', 'csv', 'json']
        };
      case '/team-productivity-analytics-dashboard':
        return {
          title: 'Team Productivity',
          description: 'Export team and individual productivity metrics',
          availableFormats: ['pdf', 'csv', 'png']
        };
      case '/repository-health-monitoring-dashboard':
        return {
          title: 'Health Monitoring',
          description: 'Export repository maintenance and health metrics',
          availableFormats: ['pdf', 'csv', 'json']
        };
      default:
        return {
          title: 'Dashboard Export',
          description: 'Export current dashboard data',
          availableFormats: ['pdf', 'csv']
        };
    }
  };

  const contextualOptions = getContextualExportOptions();
  const filteredFormatOptions = formatOptions.filter(option => 
    contextualOptions.availableFormats.includes(option.value)
  );

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `${contextualOptions.title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.${exportFormat}`;
      
      console.log(`Exporting ${filename} in ${exportFormat} format`);
      
      // In a real implementation, this would trigger the actual export
      // For now, we'll just show a success message
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setShowExportOptions(false);
    }
  };

  return (
    <div className="relative">
      {/* Export Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowExportOptions(!showExportOptions)}
        iconName="Download"
        iconPosition="left"
        iconSize={16}
        className="text-muted-foreground hover:text-foreground"
      >
        <span className="hidden sm:inline">Export</span>
      </Button>

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Export Data</h3>
              <button
                onClick={() => setShowExportOptions(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {contextualOptions.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {contextualOptions.description}
                </p>
              </div>

              <Select
                label="Export Format"
                options={filteredFormatOptions}
                value={exportFormat}
                onChange={setExportFormat}
                className="w-full"
              />

              <div className="bg-muted/50 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={14} className="text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">Export includes:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Current filter settings</li>
                      <li>Visible data range</li>
                      <li>Applied time period</li>
                      <li>Generated timestamp</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportOptions(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleExport}
                  loading={isExporting}
                  iconName={isExporting ? undefined : "Download"}
                  iconSize={16}
                  className="flex-1"
                >
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Export Sheet Overlay */}
      {showExportOptions && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-80 md:hidden"
          onClick={() => setShowExportOptions(false)}
        />
      )}

      {/* Mobile Export Sheet */}
      {showExportOptions && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-lg z-90 md:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
              <button
                onClick={() => setShowExportOptions(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-foreground mb-1">
                  {contextualOptions.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {contextualOptions.description}
                </p>
              </div>

              <Select
                label="Export Format"
                options={filteredFormatOptions}
                value={exportFormat}
                onChange={setExportFormat}
              />

              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExportOptions(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleExport}
                  loading={isExporting}
                  iconName={isExporting ? undefined : "Download"}
                  className="flex-1"
                >
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControlPanel;