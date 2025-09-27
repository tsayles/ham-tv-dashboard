import { useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import type { SatellitePass } from '../lib/types';

interface AudioSettings {
  enabled: boolean;
  highPriorityOnly: boolean;
  minElevation: number;
  prePassWarning: number; // minutes before AOS
}

/**
 * Hook to manage audio alerts for satellite passes
 * Plays synthesized audio alerts for high-priority passes
 */
export function useAudioAlerts(passes: SatellitePass[] | null) {
  const [settings] = useKV<AudioSettings>('audio-settings', {
    enabled: true,
    highPriorityOnly: true,
    minElevation: 30,
    prePassWarning: 5
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const alertedPassesRef = useRef<Set<string>>(new Set());

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Generate alert tone using Web Audio API
  const playAlertTone = (frequency: number, duration: number, type: 'warning' | 'urgent' = 'warning') => {
    if (!audioContextRef.current || !settings?.enabled) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Configure tone based on alert type
    if (type === 'urgent') {
      // Urgent: alternating high-low tone
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.frequency.setValueAtTime(frequency * 1.5, context.currentTime + 0.25);
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + 0.5);
      oscillator.frequency.setValueAtTime(frequency * 1.5, context.currentTime + 0.75);
    } else {
      // Warning: steady tone with slight fade
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    }

    oscillator.type = 'sine';
    
    // Envelope for smooth start/stop
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  // Check for high-priority passes and trigger alerts
  useEffect(() => {
    if (!passes || !settings?.enabled) return;

    const now = new Date().getTime();
    const warningWindow = (settings?.prePassWarning ?? 5) * 60 * 1000; // Convert to milliseconds

    passes.forEach(pass => {
      const aosTime = new Date(pass.aos).getTime();
      const timeUntilAos = aosTime - now;
      const passKey = `${pass.name}-${pass.aos}`;

      // Skip if already alerted for this pass
      if (alertedPassesRef.current.has(passKey)) return;

      // Check if this is a high-priority pass
      const isHighPriority = pass.max_el >= (settings?.minElevation ?? 30);
      if (settings?.highPriorityOnly && !isHighPriority) return;

      // Alert conditions
      const isImminentPass = timeUntilAos > 0 && timeUntilAos <= warningWindow;
      const isActivePass = timeUntilAos <= 0 && timeUntilAos > -60000; // Active for 1 minute

      if (isImminentPass) {
        // Warning tone for upcoming high-priority pass
        playAlertTone(800, 1.5, 'warning');
        alertedPassesRef.current.add(passKey);
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Satellite Pass Alert', {
            body: `${pass.name} pass in ${Math.round(timeUntilAos / 60000)} minutes (${pass.max_el}° max elevation)`,
            icon: '/favicon.ico',
            silent: false
          });
        }
      } else if (isActivePass && pass.max_el >= 60) {
        // Urgent tone for excellent passes that are active now
        playAlertTone(1000, 2, 'urgent');
        alertedPassesRef.current.add(`${passKey}-active`);
      }
    });

    // Clean up old alerted passes (older than 2 hours)
    const cutoffTime = now - (2 * 60 * 60 * 1000);
    alertedPassesRef.current.forEach(passKey => {
      const [, aosStr] = passKey.split('-');
      if (aosStr && new Date(aosStr).getTime() < cutoffTime) {
        alertedPassesRef.current.delete(passKey);
      }
    });
  }, [passes, settings]);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    settings,
    playTestAlert: () => playAlertTone(800, 1.5, 'warning'),
    playUrgentAlert: () => playAlertTone(1000, 2, 'urgent')
  };
}