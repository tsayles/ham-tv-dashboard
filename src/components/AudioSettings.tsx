import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SpeakerHigh, SpeakerX, Warning, Bell } from "@phosphor-icons/react";
import { useKV } from '@github/spark/hooks';

interface AudioSettings {
  enabled: boolean;
  highPriorityOnly: boolean;
  minElevation: number;
  prePassWarning: number;
}

interface AudioSettingsProps {
  onTestAlert?: () => void;
  onTestUrgent?: () => void;
}

/**
 * Audio settings panel for satellite pass alerts
 * Allows users to configure alert preferences and test tones
 */
export function AudioSettings({ onTestAlert, onTestUrgent }: AudioSettingsProps) {
  const [settings, setSettings] = useKV<AudioSettings>('audio-settings', {
    enabled: true,
    highPriorityOnly: true,
    minElevation: 30,
    prePassWarning: 5
  });

  const updateSetting = <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const elevationOptions = [
    { value: 15, label: 'Fair (15°+)', color: 'bg-red-600' },
    { value: 30, label: 'Good (30°+)', color: 'bg-yellow-600' },
    { value: 60, label: 'Excellent (60°+)', color: 'bg-green-600' }
  ];

  const warningOptions = [
    { value: 1, label: '1 minute' },
    { value: 2, label: '2 minutes' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' }
  ];

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-tv-lg text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        {settings.enabled ? (
          <SpeakerHigh size={64} className="text-accent" />
        ) : (
          <SpeakerX size={64} className="text-muted-foreground" />
        )}
        <div>
          <h1 className="text-tv-xl font-bold">Audio Alert Settings</h1>
          <p className="text-tv-lg text-muted-foreground">Configure satellite pass notifications</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Master Enable */}
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell size={32} className="text-muted-foreground" />
              <div>
                <h3 className="text-tv-lg font-bold">Enable Audio Alerts</h3>
                <p className="text-tv-sm text-muted-foreground">
                  Play synthesized tones for satellite passes
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
              className="scale-150"
            />
          </div>
        </Card>

        {/* High Priority Only */}
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Warning size={32} className="text-muted-foreground" />
              <div>
                <h3 className="text-tv-lg font-bold">High Priority Passes Only</h3>
                <p className="text-tv-sm text-muted-foreground">
                  Only alert for passes meeting elevation threshold
                </p>
              </div>
            </div>
            <Switch
              checked={settings.highPriorityOnly}
              onCheckedChange={(checked) => updateSetting('highPriorityOnly', checked)}
              disabled={!settings.enabled}
              className="scale-150"
            />
          </div>
        </Card>

        {/* Minimum Elevation */}
        <Card className="p-8 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-tv-lg font-bold mb-2">Minimum Elevation</h3>
            <p className="text-tv-sm text-muted-foreground">
              Alert threshold for pass quality
            </p>
          </div>
          <div className="flex gap-4">
            {elevationOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.minElevation === option.value ? "default" : "secondary"}
                onClick={() => updateSetting('minElevation', option.value)}
                disabled={!settings.enabled || !settings.highPriorityOnly}
                className="flex-1 text-tv-sm py-6"
              >
                <Badge className={`${option.color} text-white mr-2`}>
                  {option.value}°
                </Badge>
                {option.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Pre-pass Warning */}
        <Card className="p-8 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-tv-lg font-bold mb-2">Pre-pass Warning</h3>
            <p className="text-tv-sm text-muted-foreground">
              How early to alert before AOS
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {warningOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.prePassWarning === option.value ? "default" : "secondary"}
                onClick={() => updateSetting('prePassWarning', option.value)}
                disabled={!settings.enabled}
                className="text-tv-sm py-6"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Test Alerts */}
        <Card className="p-8 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-tv-lg font-bold mb-2">Test Audio Alerts</h3>
            <p className="text-tv-sm text-muted-foreground">
              Preview alert tones and system notifications
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={onTestAlert}
              disabled={!settings.enabled}
              variant="secondary"
              className="flex-1 text-tv-sm py-6"
            >
              <Bell size={24} className="mr-2" />
              Test Warning Tone
            </Button>
            <Button
              onClick={onTestUrgent}
              disabled={!settings.enabled}
              variant="secondary"
              className="flex-1 text-tv-sm py-6"
            >
              <Warning size={24} className="mr-2" />
              Test Urgent Tone
            </Button>
          </div>
        </Card>

        {/* Status Info */}
        <Card className="p-8 bg-card border-border">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              {settings.enabled ? (
                <>
                  <Badge className="bg-green-600 text-white text-tv-sm">ALERTS ENABLED</Badge>
                  {settings.highPriorityOnly && (
                    <Badge className="bg-yellow-600 text-white text-tv-sm">
                      {settings.minElevation}°+ ONLY
                    </Badge>
                  )}
                </>
              ) : (
                <Badge className="bg-red-600 text-white text-tv-sm">ALERTS DISABLED</Badge>
              )}
            </div>
            <p className="text-tv-sm text-muted-foreground">
              {settings.enabled 
                ? `Alerts will play ${settings.prePassWarning} minutes before AOS`
                : 'Enable alerts to receive satellite pass notifications'
              }
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}