import { useState, useEffect, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { DataSimulator } from '../lib/dataSimulator';
import type { DashboardData } from '../lib/types';
import { SpaceWeatherPanel } from './SpaceWeatherPanel';
import { BandActivityPanel } from './BandActivityPanel';
import { APRSPanel } from './APRSPanel';
import { SatellitePanel } from './SatellitePanel';
import { WaterfallPanel } from './WaterfallPanel';
import { AudioSettings } from './AudioSettings';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Gear, Circle } from "@phosphor-icons/react";
import { useAudioAlerts } from '../hooks/useAudioAlerts';

const PANELS = [
  { id: 'spaceweather', name: 'Space Weather', component: SpaceWeatherPanel },
  { id: 'bands', name: 'Band Activity', component: BandActivityPanel },
  { id: 'aprs', name: 'APRS', component: APRSPanel },
  { id: 'satellites', name: 'Satellites', component: SatellitePanel },
  { id: 'waterfall', name: 'Waterfall', component: WaterfallPanel },
  { id: 'audio', name: 'Audio Settings', component: AudioSettings }
];

const ROTATION_INTERVAL = 25000; // 25 seconds
const DATA_UPDATE_INTERVAL = 15000; // 15 seconds

export function Dashboard() {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isRotating, setIsRotating] = useKV('dashboard-rotating', 'true');
  const [showSettings, setShowSettings] = useState(false);
  const rotating = isRotating === 'true';
  const [data, setData] = useState<DashboardData>({
    spaceweather: null,
    bandActivity: null,
    aprs: null,
    satellites: null
  });
  
  const simulator = new DataSimulator();
  const { playTestAlert, playUrgentAlert } = useAudioAlerts(data.satellites?.passes || null);

  const updateData = useCallback(() => {
    setData({
      spaceweather: simulator.generateSpaceWeather(),
      bandActivity: simulator.generateBandActivity(),
      aprs: simulator.generateAPRSData(),
      satellites: simulator.generateSatelliteData()
    });
  }, []);

  // Initialize data
  useEffect(() => {
    updateData();
  }, [updateData]);

  // Data update interval
  useEffect(() => {
    const interval = setInterval(updateData, DATA_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateData]);

  // Panel rotation
  useEffect(() => {
    if (!rotating) return;

    const interval = setInterval(() => {
      setCurrentPanel(prev => (prev + 1) % PANELS.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [rotating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          setCurrentPanel(prev => prev === 0 ? PANELS.length - 1 : prev - 1);
          break;
        case 'ArrowRight':
          setCurrentPanel(prev => (prev + 1) % PANELS.length);
          break;
        case ' ':
          event.preventDefault();
          setIsRotating(prev => prev === 'true' ? 'false' : 'true');
          break;
        case 'g':
          // Toggle settings panel
          if (PANELS[currentPanel].id === 'audio') {
            setCurrentPanel(0); // Go back to first panel
          } else {
            setCurrentPanel(PANELS.findIndex(p => p.id === 'audio'));
          }
          break;
        case 'Escape':
          setIsRotating('false');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setIsRotating]);

  const CurrentPanelComponent = PANELS[currentPanel].component;
  const panelData = (() => {
    switch (PANELS[currentPanel].id) {
      case 'spaceweather':
        return data.spaceweather;
      case 'bands':
        return data.bandActivity;
      case 'aprs':
        return data.aprs;
      case 'satellites':
        return data.satellites;
      case 'audio':
        return { onTestAlert: playTestAlert, onTestUrgent: playUrgentAlert };
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-6">
            <h1 className="text-tv-lg font-bold">Ham TV Dashboard</h1>
            <Badge className="bg-green-600 text-white text-tv-sm">
              SIMULATION MODE
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Panel indicators */}
            <div className="flex gap-2">
              {PANELS.map((panel, index) => (
                <button
                  key={panel.id}
                  onClick={() => setCurrentPanel(index)}
                  className="focus-visible:focus-visible"
                >
                  <Circle 
                    size={16} 
                    weight={index === currentPanel ? 'fill' : 'regular'}
                    className={index === currentPanel ? 'text-accent' : 'text-muted-foreground'}
                  />
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRotating(rotating ? 'false' : 'true')}
                className="text-tv-sm"
              >
                {rotating ? <Pause size={20} /> : <Play size={20} />}
                {rotating ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const audioIndex = PANELS.findIndex(p => p.id === 'audio');
                  setCurrentPanel(currentPanel === audioIndex ? 0 : audioIndex);
                }}
                className="text-tv-sm"
              >
                <Gear size={20} />
                Audio
              </Button>
            </div>
          </div>
        </div>

        {/* Panel navigation */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-tv-lg font-semibold">
                {PANELS[currentPanel].name}
              </span>
              <Badge variant="outline" className="text-tv-sm">
                {currentPanel + 1} of {PANELS.length}
              </Badge>
            </div>
            
            {rotating && (
              <div className="flex items-center gap-2 text-tv-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Auto-rotating
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main panel content */}
      <div className="pt-32 pb-8">
        <CurrentPanelComponent data={panelData as any} />
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between text-tv-sm text-muted-foreground">
          <div>
            Use arrow keys to navigate • Space to pause/resume • G for audio settings • ESC to stop rotation
          </div>
          <div>
            {new Date().toLocaleString()} UTC
          </div>
        </div>
      </div>
    </div>
  );
}