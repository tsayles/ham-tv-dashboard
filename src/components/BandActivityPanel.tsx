import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radio } from "@phosphor-icons/react";
import type { BandActivityData } from "../lib/types";

interface BandActivityPanelProps {
  data: BandActivityData | null;
}

function getBandColor(band: string): string {
  const colors = {
    '40m': 'bg-blue-500',
    '20m': 'bg-green-500',
    '10m': 'bg-yellow-500',
    '2m': 'bg-orange-500',
    '70cm': 'bg-red-500'
  };
  return colors[band as keyof typeof colors] || 'bg-muted';
}

function getActivityLevel(count: number): string {
  if (count > 150) return 'HIGH';
  if (count > 75) return 'MEDIUM';
  if (count > 20) return 'LOW';
  return 'QUIET';
}

export function BandActivityPanel({ data }: BandActivityPanelProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-tv-lg text-muted-foreground">Loading band activity...</div>
      </div>
    );
  }

  const maxCount = Math.max(...data.band_stats.map(b => b.count), 1);

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <Radio size={64} className="text-accent" />
        <h1 className="text-tv-xl font-bold">Band Activity</h1>
      </div>

      <div className="space-y-8">
        {data.band_stats.map((band, index) => (
          <Card key={band.band} className="p-8 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className={`w-8 h-8 rounded-full ${getBandColor(band.band)}`} />
                <div>
                  <h2 className="text-tv-lg font-semibold">{band.band}</h2>
                  <p className="text-tv-sm text-muted-foreground">
                    {getActivityLevel(band.count)} Activity
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-tv-xl font-mono font-bold text-foreground">
                  {band.count}
                </div>
                <div className="text-tv-sm text-muted-foreground">spots</div>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={(band.count / maxCount) * 100}
                className="h-6"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-tv-sm text-muted-foreground">
          Updated: {new Date(data.ts).toLocaleTimeString()} UTC
        </p>
      </div>
    </div>
  );
}