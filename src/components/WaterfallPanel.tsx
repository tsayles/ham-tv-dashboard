import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waveform, ChartBar } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

interface WaterfallPanelProps {
  data?: any;
}

export function WaterfallPanel({ data }: WaterfallPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let currentRow = 0;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Create gradient for spectrum colors
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#1e40af');   // Blue
      gradient.addColorStop(0.2, '#3b82f6'); // Light Blue
      gradient.addColorStop(0.4, '#10b981'); // Green
      gradient.addColorStop(0.6, '#f59e0b'); // Yellow
      gradient.addColorStop(0.8, '#ef4444'); // Red
      gradient.addColorStop(1, '#dc2626');   // Dark Red

      // Generate waterfall line
      const imageData = ctx.createImageData(width, 1);
      const data = imageData.data;

      for (let x = 0; x < width; x++) {
        // Simulate spectrum data with some noise and peaks
        let intensity = Math.random() * 0.3; // Base noise
        
        // Add some peaks at specific frequencies
        const freq = x / width;
        if (Math.abs(freq - 0.3) < 0.05) intensity += 0.4 + Math.sin(Date.now() / 1000 + x) * 0.2;
        if (Math.abs(freq - 0.7) < 0.03) intensity += 0.6 + Math.sin(Date.now() / 800 + x) * 0.3;
        
        intensity = Math.min(intensity, 1);
        
        // Convert to color
        const hue = (1 - intensity) * 240; // Blue to red
        const saturation = intensity * 100;
        const lightness = 20 + intensity * 60;
        
        const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
        
        const pixelIndex = x * 4;
        data[pixelIndex] = rgb[0];     // R
        data[pixelIndex + 1] = rgb[1]; // G
        data[pixelIndex + 2] = rgb[2]; // B
        data[pixelIndex + 3] = 255;    // A
      }

      // Scroll existing data down
      ctx.drawImage(canvas, 0, 0, width, height - 1, 0, 1, width, height - 1);
      
      // Draw new line at top
      ctx.putImageData(imageData, 0, 0);

      currentRow++;
      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="h-full p-12 space-y-8">
      <div className="flex items-center gap-6 mb-12">
        <Waveform size={64} className="text-accent" />
        <div>
          <h1 className="text-tv-xl font-bold">Live Waterfall</h1>
          <p className="text-tv-lg text-muted-foreground">14.074 MHz FT8</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <ChartBar size={32} className="text-green-500" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">14.074</div>
              <div className="text-tv-sm text-muted-foreground">MHz</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <Waveform size={32} className="text-blue-500" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">FT8</div>
              <div className="text-tv-sm text-muted-foreground">Mode</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse" />
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">LIVE</div>
              <div className="text-tv-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="text-accent">S9</div>
            <div>
              <div className="text-tv-lg font-mono font-bold text-foreground">-73</div>
              <div className="text-tv-sm text-muted-foreground">dBm</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-tv-lg font-semibold">Spectrum Display</h2>
          <div className="flex gap-4">
            <Badge className="bg-blue-600 text-white text-tv-sm">3 kHz</Badge>
            <Badge className="bg-accent text-accent-foreground text-tv-sm">Auto Scale</Badge>
          </div>
        </div>
        
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <canvas 
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Frequency scale */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-50 flex items-center justify-between px-4 text-tv-sm text-white font-mono">
            <span>14.071</span>
            <span>14.074</span>
            <span>14.077</span>
          </div>
          
          {/* Time scale */}
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-black bg-opacity-50 flex flex-col justify-between py-2 text-tv-xs text-white font-mono">
            <span className="rotate-90 text-center">Now</span>
            <span className="rotate-90 text-center">-30s</span>
            <span className="rotate-90 text-center">-60s</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-tv-sm text-muted-foreground">
            Simulated waterfall display - Live RF integration coming soon
          </p>
        </div>
      </Card>
    </div>
  );
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}