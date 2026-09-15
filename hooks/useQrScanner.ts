'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';

interface UseQrScannerProps {
  onScan: (decodedText: string) => Promise<void>;
}

export function useQrScanner({ onScan }: UseQrScannerProps) {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string; user?: any }>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
  }, []);

  const handleScan = useCallback(async (decodedText: string) => {
    if (!decodedText) return;
    
    // Stop scanning immediately on detection to prevent multiple scans
    setScanning(false);
    await stopScanner();
    
    await onScan(decodedText);
  }, [onScan, stopScanner]);

  useEffect(() => {
    let isMounted = true;

    if (scanning) {
      const startScanner = async () => {
        try {
          // Small delay to ensure DOM element is ready
          await new Promise(resolve => setTimeout(resolve, 150));
          if (!isMounted) return;

          const html5QrCode = new Html5Qrcode("qr-reader");
          html5QrCodeRef.current = html5QrCode;

          const config = { 
            fps: 20, 
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * 0.7);
              return {
                  width: qrboxSize,
                  height: qrboxSize
              };
            },
            aspectRatio: 1.0 
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            handleScan,
            () => {} // Ignore scan errors (normal during searching)
          );
        } catch (err) {
          console.error("Unable to start scanning", err);
          if (isMounted) {
            toast({
              variant: "destructive",
              title: "Scanner Error",
              description: "Could not access camera. Please ensure permissions are granted.",
            });
            setScanning(false);
          }
        }
      };

      startScanner();

      return () => {
        isMounted = false;
        stopScanner();
      };
    }
  }, [scanning, handleScan, stopScanner, toast]);

  return {
    scanning,
    setScanning,
    scanResult,
    setScanResult,
  };
}
