'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';

interface QrScannerCardProps {
  scanning: boolean;
  setScanning: (scanning: boolean) => void;
  scanResult: { success: boolean; message: string; user?: any } | null;
  title?: string;
  description?: string;
}

export function QrScannerCard({
  scanning,
  setScanning,
  scanResult,
  title = "QR Scanner",
  description = "Scan student QR codes to mark attendance"
}: QrScannerCardProps) {
  return (
    <Card className="w-full">
      <style>{`
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
        #qr-reader {
          border: none !important;
        }
      `}</style>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div>
            <div 
              id="qr-reader" 
              className="w-full aspect-square relative overflow-hidden rounded-lg border-2 border-primary bg-black shadow-lg mx-auto max-w-sm" 
            />
            <Button variant="outline" className="w-full mt-4" onClick={() => setScanning(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="text-center">
            {scanResult && (
              <Alert variant={scanResult.success ? "default" : "destructive"} className="mb-4 text-left">
                {scanResult.success ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{scanResult.message}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={() => setScanning(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
