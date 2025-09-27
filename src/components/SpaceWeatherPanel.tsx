import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Activity, Lightning, Globe } from "@phosphor-icons/react";
import type { SpaceWeatherData } from "../lib/types";

interface SpaceWeatherPanelProps {
  data: SpaceWeatherData | null;
}

function getConditionColor(type: string, value: number | string): string {
  switch (type) {
    case 'kp':
      if (typeof value === 'number') {
        if (value <= 2) return 'bg-green-600';
        if (value <= 4) return 'bg-yellow-600';
        if (value <= 6) return 'bg-orange-600';
        return 'bg-red-600';
      }
      break;
    case 'sfi':
      if (typeof value === 'number') {
        if (value >= 150) return 'bg-green-600';
        if (value >= 100) return 'bg-yellow-600';
        return 'bg-orange-600';
      }
      break;
    case 'xray':
      if (typeof value === 'string') {
        const level = value.charAt(0);
        if (level === 'A' || level === 'B') return 'bg-green-600';
        if (level === 'C') return 'bg-yellow-600';
        if (level === 'M') return 'bg-orange-600';
        return 'bg-red-600';
      }
      break;
  }
  return 'bg-muted';
}

export function SpaceWeatherPanel({ data }: SpaceWeatherPanelProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-tv-lg text-muted-foreground">Loading space weather...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <Sun size={64} className="text-accent" />
        <h1 className="text-tv-xl font-bold">Space Weather</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-4 mb-4">
            <Activity size={48} className="text-accent" />
            <div>
              <h2 className="text-tv-lg font-semibold">Solar Flux Index</h2>
              <p className="text-tv-sm text-muted-foreground">10.7 cm Radio Flux</p>
            </div>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-tv-xl font-mono font-bold text-foreground">{data.sfi}</span>
            <Badge className={`${getConditionColor('sfi', data.sfi)} text-white text-tv-sm`}>
              {data.sfi >= 150 ? 'GOOD' : data.sfi >= 100 ? 'FAIR' : 'POOR'}
            </Badge>
          </div>
        </Card>

        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-4 mb-4">
            <Lightning size={48} className="text-accent" />
            <div>
              <h2 className="text-tv-lg font-semibold">K-Index</h2>
              <p className="text-tv-sm text-muted-foreground">Geomagnetic Activity</p>
            </div>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-tv-xl font-mono font-bold text-foreground">{data.kp}</span>
            <Badge className={`${getConditionColor('kp', data.kp)} text-white text-tv-sm`}>
              {data.kp <= 2 ? 'QUIET' : data.kp <= 4 ? 'UNSETTLED' : data.kp <= 6 ? 'ACTIVE' : 'STORM'}
            </Badge>
          </div>
        </Card>

        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-4 mb-4">
            <Globe size={48} className="text-accent" />
            <div>
              <h2 className="text-tv-lg font-semibold">A-Index</h2>
              <p className="text-tv-sm text-muted-foreground">Planetary Activity</p>
            </div>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-tv-xl font-mono font-bold text-foreground">{data.aindex}</span>
            <Badge className={`${data.aindex <= 7 ? 'bg-green-600' : data.aindex <= 15 ? 'bg-yellow-600' : 'bg-red-600'} text-white text-tv-sm`}>
              {data.aindex <= 7 ? 'QUIET' : data.aindex <= 15 ? 'ACTIVE' : 'STORM'}
            </Badge>
          </div>
        </Card>

        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-4 mb-4">
            <Lightning size={48} className="text-accent" />
            <div>
              <h2 className="text-tv-lg font-semibold">X-Ray Flux</h2>
              <p className="text-tv-sm text-muted-foreground">Solar Flare Activity</p>
            </div>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-tv-xl font-mono font-bold text-foreground">{data.xray_class}</span>
            <Badge className={`${getConditionColor('xray', data.xray_class)} text-white text-tv-sm`}>
              {data.xray_class.charAt(0) === 'A' || data.xray_class.charAt(0) === 'B' ? 'NORMAL' : 
               data.xray_class.charAt(0) === 'C' ? 'MINOR' : 
               data.xray_class.charAt(0) === 'M' ? 'MODERATE' : 'STRONG'}
            </Badge>
          </div>
        </Card>
      </div>

      <div className="text-center pt-8">
        <p className="text-tv-sm text-muted-foreground">
          Updated: {new Date(data.updated_at).toLocaleTimeString()} UTC
        </p>
      </div>
    </div>
  );
}