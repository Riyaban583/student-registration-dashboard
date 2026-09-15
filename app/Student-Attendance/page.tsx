'use client'
import React, { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast';
import { getAllUsers } from '@/app/actions/user';
import { markStudentAttendence } from '../actions/events';
import { useQrScanner } from '@/hooks/useQrScanner';
import { QrScannerCard } from '@/components/scanner/QrScannerCard';

export default function AttendancePage() {
  const { toast } = useToast();

  const handleScanProcess = useCallback(async (decodedText: string) => {
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

      const attendanceResult = await markStudentAttendence(userId);
      setScanResult({
        success: attendanceResult.success,
        message: attendanceResult.message || attendanceResult.error || "Unknown error",
        user: attendanceResult.user,
      });

      if (attendanceResult.success) {
        toast({ title: "Success", description: attendanceResult.message });
        // Optional: refresh user list if needed on this page
      } else {
        toast({ variant: "destructive", title: "Scan Error", description: attendanceResult.error });
      }
    } catch (error: any) {
      console.error("Scan processing error:", error);
      toast({ variant: "destructive", title: "Scan Error", description: error.message });
    }
  }, [toast]);

  const { scanning, setScanning, scanResult, setScanResult } = useQrScanner({
    onScan: handleScanProcess
  });

  return (
    <div className='flex justify-between items-center flex-col min-h-screen bg-background'>
      <h1 className='mx-auto font-bold md:text-4xl text-2xl mt-32'>Student Attendance</h1>

      <div className='mt-16 w-full max-w-md px-4'>
        <QrScannerCard
          scanning={scanning}
          setScanning={setScanning}
          scanResult={scanResult}
        />
      </div>
    </div>
  )
}
