'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { toast, useToast } from '@/hooks/use-toast';
import { getAllUsers } from '@/app/actions/user';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import { markStudentAttendence } from '../actions/events';


export default function AttendancePage() {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string; user?: any }>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleScan = async (decodedText: string) => {
    if (!decodedText) return;
    
    console.log("Scanner Detected Text:", decodedText);

    try {
      let userId = "";
      const text = decodedText.trim();

      // Flexible extraction: handles URLs or raw strings
      if (text.includes("/scan/")) {
        userId = text.split("/scan/").pop()?.split(/[?#]/)[0] || "";
      } else if (text.startsWith("http")) {
        try {
          const urlObj = new URL(text);
          userId = urlObj.pathname.split("/").filter(Boolean).pop() || "";
        } catch (e) {
          userId = text.split("/").pop() || "";
        }
      } else {
        userId = text;
      }

      if (!userId || userId.length < 5) {
        console.warn("Extracted ID looks invalid:", userId);
        return;
      }

      setScanning(false);

      const attendanceResult = await markStudentAttendence(userId);
      setScanResult({
        success: attendanceResult.success,
        message: attendanceResult.message || attendanceResult.error || "Unknown error",
        user: attendanceResult.user,
      });

      if (attendanceResult.success) {
        toast({ title: "Success", description: attendanceResult.message });
        const usersResult = await getAllUsers();
        if (usersResult.success) setUsers(usersResult.users || []);
      } else {
        throw new Error(attendanceResult.error || "Failed to mark attendance");
      }
    } catch (error: any) {
      console.error("Scan processing error:", error);
      toast({ variant: "destructive", title: "Scan Error", description: error.message });
    }
  };

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isMounted = true;

    if (scanning) {
      const startScanner = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (!isMounted) return;

          html5QrCode = new Html5Qrcode("qr-reader");
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
            () => {}
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
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(err => console.warn("Error stopping scanner:", err));
        }
      };
    }
  }, [scanning]);

  return (
    <div className='flex justify-between items-center flex-col min-h-screen bg-background'>
      <style dangerouslySetInnerHTML={{ __html: `
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
        #qr-reader {
          border: none !important;
        }
      `}} />
      <h1 className='mx-auto font-bold md:text-4xl text-2xl mt-32'>Student Attendance</h1>

      <div className='mt-16 w-full max-w-md px-4'>
        <Card>
          <CardHeader>
            <CardTitle>QR Scanner</CardTitle>
            <CardDescription>Scan student QR codes to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {scanning ? (
              <div>
                <div id="qr-reader" className="w-full aspect-square relative overflow-hidden rounded-lg border-2 border-primary bg-black shadow-lg mx-auto" />
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
      </div>
    </div>
  )
}
