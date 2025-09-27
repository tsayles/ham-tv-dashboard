export interface SpaceWeatherData {
  sfi: number;
  kp: number;
  aindex: number;
  xray_class: string;
  updated_at: string;
}

export interface BandStat {
  band: string;
  count: number;
}

export interface BandActivityData {
  band_stats: BandStat[];
  ts: string;
}

export interface APRSStation {
  call: string;
  lat: number;
  lon: number;
  src: 'rf' | 'is';
  last_heard?: string;
}

export interface APRSData {
  stations: APRSStation[];
  ts: string;
}

export interface SatellitePass {
  name: string;
  aos: string;
  los: string;
  max_el: number;
}

export interface SatelliteData {
  passes: SatellitePass[];
  ts: string;
}

export interface DashboardData {
  spaceweather: SpaceWeatherData | null;
  bandActivity: BandActivityData | null;
  aprs: APRSData | null;
  satellites: SatelliteData | null;
}