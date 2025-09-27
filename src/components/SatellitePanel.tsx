import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Planet, Timer, TrendUp } from "@phosphor-icons/react";
import type { SatelliteData } from "../lib/types";
import { useState, useEffect } from "react";

interface SatellitePanelProps {
  data: SatelliteData | null;
}

function formatCountdown(aosTime: string): string {
  const now = new Date().getTime();
  const aos = new Date(aosTime).getTime();
  const diff = aos - now;
  
  if (diff <= 0) return 'ACTIVE';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

function getElevationColor(elevation: number): string {
  if (elevation >= 60) return 'bg-green-600';
  if (elevation >= 30) return 'bg-yellow-600';
  if (elevation >= 15) return 'bg-orange-600';
  return 'bg-red-600';
}

function getElevationLabel(elevation: number): string {
  if (elevation >= 60) return 'EXCELLENT';
  if (elevation >= 30) return 'GOOD';
  if (elevation >= 15) return 'FAIR';
  return 'POOR';
}

export function SatellitePanel({ data }: SatellitePanelProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-tv-lg text-muted-foreground">Loading satellite data...</div>
      </div>
    );
  }

  const nextPasses = data.passes.slice(0, 5);

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <Planet size={64} className="text-accent" />
        <div>
          <h1 className="text-tv-xl font-bold">Satellite Passes</h1>
          <p className="text-tv-lg text-muted-foreground">Next 24 Hours</p>
        </div>
      </div>

      <div className="space-y-6">
        {nextPasses.map((pass, index) => {
          const isNext = index === 0;
          const aosDate = new Date(pass.aos);
          const losDate = new Date(pass.los);
          const duration = Math.round((losDate.getTime() - aosDate.getTime()) / (1000 * 60));
          
          return (
            <Card 
              key={`${pass.name}-${pass.aos}`} 
              className={`p-8 bg-card border-border ${isNext ? 'ring-2 ring-accent' : ''}`}
            >
              <div className="grid grid-cols-5 gap-8 items-center">
                <div className="flex items-center gap-4">
                  <Planet size={40} className={isNext ? 'text-accent' : 'text-muted-foreground'} />
                  <div>
                    <div className="text-tv-lg font-bold text-foreground">
                      {pass.name}
                    </div>
                    {isNext && (
                      <Badge className="bg-accent text-accent-foreground text-tv-xs mt-1">
                        NEXT PASS
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <Timer size={24} className="text-muted-foreground" />
                    <span className="text-tv-sm text-muted-foreground">AOS</span>
                  </div>
                  <div className="text-tv-base font-mono font-bold text-foreground">
                    {aosDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-tv-sm text-muted-foreground">
                    {aosDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <TrendUp size={24} className="text-muted-foreground" />
                    <span className="text-tv-sm text-muted-foreground">Max El</span>
                  </div>
                  <div className="text-tv-base font-mono font-bold text-foreground">
                    {pass.max_el}°
                  </div>
                  <Badge className={`${getElevationColor(pass.max_el)} text-white text-tv-xs`}>
                    {getElevationLabel(pass.max_el)}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="text-tv-sm text-muted-foreground mb-2">Duration</div>
                  <div className="text-tv-base font-mono font-bold text-foreground">
                    {duration}m
                  </div>
                  <div className="text-tv-sm text-muted-foreground">
                    {losDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} LOS
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-tv-sm text-muted-foreground mb-2">Countdown</div>
                  <div className={`text-tv-base font-mono font-bold ${
                    formatCountdown(pass.aos) === 'ACTIVE' ? 'text-accent' : 'text-foreground'
                  }`}>
                    {formatCountdown(pass.aos)}
                  </div>
                  {formatCountdown(pass.aos) === 'ACTIVE' && (
                    <Badge className="bg-green-600 text-white text-tv-xs mt-1">
                      LIVE NOW
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <p className="text-tv-sm text-muted-foreground">
          Updated: {new Date(data.ts).toLocaleTimeString()} UTC
        </p>
      </div>
    </div>
  );
}