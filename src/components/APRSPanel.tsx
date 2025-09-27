import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, Globe } from "@phosphor-icons/react";
import type { APRSData } from "../lib/types";

interface APRSPanelProps {
  data: APRSData | null;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date().getTime();
  const then = new Date(timestamp).getTime();
  const diffMinutes = Math.floor((now - then) / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes === 1) return '1 min ago';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}

export function APRSPanel({ data }: APRSPanelProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-tv-lg text-muted-foreground">Loading APRS data...</div>
      </div>
    );
  }

  const rfStations = data.stations.filter(s => s.src === 'rf');
  const isStations = data.stations.filter(s => s.src === 'is');

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <MapPin size={64} className="text-accent" />
        <div>
          <h1 className="text-tv-xl font-bold">APRS Activity</h1>
          <p className="text-tv-lg text-muted-foreground">Local Stations</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <Radio size={32} className="text-green-500" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">
                {rfStations.length}
              </div>
              <div className="text-tv-sm text-muted-foreground">RF Stations</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <Globe size={32} className="text-blue-500" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">
                {isStations.length}
              </div>
              <div className="text-tv-sm text-muted-foreground">Internet Stations</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <MapPin size={32} className="text-accent" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">
                {data.stations.length}
              </div>
              <div className="text-tv-sm text-muted-foreground">Total Stations</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4 mb-6">
            <Radio size={32} className="text-green-500" />
            <h2 className="text-tv-lg font-semibold">RF Stations</h2>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {rfStations.slice(0, 8).map((station, index) => (
              <div key={`${station.call}-${index}`} className="flex items-center justify-between">
                <div>
                  <div className="text-tv-base font-mono font-semibold text-foreground">
                    {station.call}
                  </div>
                  <div className="text-tv-sm text-muted-foreground">
                    {station.lat.toFixed(3)}, {station.lon.toFixed(3)}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 text-white text-tv-xs">RF</Badge>
                  {station.last_heard && (
                    <div className="text-tv-xs text-muted-foreground mt-1">
                      {formatTimeAgo(station.last_heard)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {rfStations.length === 0 && (
              <div className="text-tv-sm text-muted-foreground text-center py-8">
                No RF stations heard
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4 mb-6">
            <Globe size={32} className="text-blue-500" />
            <h2 className="text-tv-lg font-semibold">Internet Stations</h2>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {isStations.slice(0, 8).map((station, index) => (
              <div key={`${station.call}-${index}`} className="flex items-center justify-between">
                <div>
                  <div className="text-tv-base font-mono font-semibold text-foreground">
                    {station.call}
                  </div>
                  <div className="text-tv-sm text-muted-foreground">
                    {station.lat.toFixed(3)}, {station.lon.toFixed(3)}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-600 text-white text-tv-xs">IS</Badge>
                  {station.last_heard && (
                    <div className="text-tv-xs text-muted-foreground mt-1">
                      {formatTimeAgo(station.last_heard)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isStations.length === 0 && (
              <div className="text-tv-sm text-muted-foreground text-center py-8">
                No internet stations
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="text-center pt-8">
        <p className="text-tv-sm text-muted-foreground">
          Updated: {new Date(data.ts).toLocaleTimeString()} UTC
        </p>
      </div>
    </div>
  );
}