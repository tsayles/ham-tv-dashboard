import type { SpaceWeatherData, BandActivityData, APRSData, SatelliteData, APRSStation, SatellitePass } from './types';

const CALLSIGNS = [
  'KE4HET-9', 'N0CALL', 'W1ABC-5', 'K5DEF', 'VE3GHI-7', 'JA1JKL',
  'G0MNO', 'DL2PQR', 'VK4STU-2', 'PY2VWX', 'EA1YZ', 'OH3ABC-9'
];

const SATELLITE_NAMES = [
  'ISS', 'AO-91', 'AO-92', 'SO-50', 'PO-101', 'RS-44', 'IO-86', 'AO-27'
];

const BANDS = ['40m', '20m', '10m', '2m', '70cm'];

export class DataSimulator {
  private baseTime = Date.now();

  generateSpaceWeather(): SpaceWeatherData {
    const variation = Math.sin(Date.now() / 300000) * 0.3;
    return {
      sfi: Math.round(120 + variation * 80 + Math.random() * 20),
      kp: Math.round((2.5 + variation * 2 + Math.random() * 1.5) * 10) / 10,
      aindex: Math.round(8 + variation * 15 + Math.random() * 5),
      xray_class: this.generateXrayClass(),
      updated_at: new Date().toISOString()
    };
  }

  generateBandActivity(): BandActivityData {
    const timeOfDay = (Date.now() / 1000 / 3600) % 24;
    const nightBoost = timeOfDay > 20 || timeOfDay < 6 ? 1.5 : 1.0;
    
    return {
      band_stats: BANDS.map(band => ({
        band,
        count: Math.round(this.getBandBaseActivity(band) * nightBoost * (0.7 + Math.random() * 0.6))
      })),
      ts: new Date().toISOString()
    };
  }

  generateAPRSData(): APRSData {
    const stationCount = 8 + Math.round(Math.random() * 12);
    const stations: APRSStation[] = [];
    
    for (let i = 0; i < stationCount; i++) {
      const call = CALLSIGNS[Math.floor(Math.random() * CALLSIGNS.length)];
      const lastHeardMinutes = Math.floor(Math.random() * 60);
      const lastHeard = new Date(Date.now() - lastHeardMinutes * 60000);
      
      stations.push({
        call,
        lat: 47.0 + (Math.random() - 0.5) * 2,
        lon: -122.0 + (Math.random() - 0.5) * 2,
        src: Math.random() > 0.7 ? 'is' as const : 'rf' as const,
        last_heard: lastHeard.toISOString()
      });
    }
    
    return {
      stations,
      ts: new Date().toISOString()
    };
  }

  generateSatelliteData(): SatelliteData {
    const passes: SatellitePass[] = [];
    const baseTime = Date.now();
    
    for (let i = 0; i < 6; i++) {
      const satellite = SATELLITE_NAMES[Math.floor(Math.random() * SATELLITE_NAMES.length)];
      const aosTime = new Date(baseTime + (i * 2 + Math.random() * 3) * 3600 * 1000);
      const passLength = 8 + Math.random() * 7; // 8-15 minutes
      const losTime = new Date(aosTime.getTime() + passLength * 60 * 1000);
      
      passes.push({
        name: satellite,
        aos: aosTime.toISOString(),
        los: losTime.toISOString(),
        max_el: Math.round(15 + Math.random() * 75)
      });
    }
    
    return {
      passes: passes.sort((a, b) => new Date(a.aos).getTime() - new Date(b.aos).getTime()),
      ts: new Date().toISOString()
    };
  }

  private generateXrayClass(): string {
    const classes = ['A', 'B', 'C', 'M', 'X'];
    const weights = [30, 50, 15, 4, 1]; // Probability weights
    
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < classes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const magnitude = (Math.random() * 9 + 1).toFixed(1);
        return `${classes[i]}${magnitude}`;
      }
    }
    
    return 'B1.0';
  }

  private getBandBaseActivity(band: string): number {
    const baseActivity = {
      '40m': 150,
      '20m': 200,
      '10m': 80,
      '2m': 25,
      '70cm': 15
    };
    return baseActivity[band as keyof typeof baseActivity] || 50;
  }
}