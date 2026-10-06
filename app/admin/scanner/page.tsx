"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GraduationCap, ArrowLeft, QrCode, CheckCircle, XCircle, LogOut, ArrowRight, BarChart3, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { markAttendance, getAllUsers, logout } from '@/app/actions/user';
import EventManager from '@/components/event/Events';
import { useQrScanner } from '@/hooks/useQrScanner';
import { QrScannerCard } from '@/components/scanner/QrScannerCard';

export default function ScannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        throw new Error(result.error || "Failed to fetch users");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

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
        userId = text; // Assume it's a raw ID
      }

      if (!userId || userId.length < 5) {
        console.warn("Extracted ID looks invalid:", userId);
        return;
      }

      const attendanceResult = await markAttendance(userId);
      setScanResult({
        success: attendanceResult.success,
        message: attendanceResult.message || attendanceResult.error || "Unknown error",
        user: attendanceResult.user,
      });

      if (attendanceResult.success) {
        toast({ title: "Success", description: attendanceResult.message });
        await fetchUsers();
      } else {
        toast({ variant: "destructive", title: "Scan Error", description: attendanceResult.error });
      }
    } catch (error: any) {
      console.error("Scan processing error:", error);
      toast({ variant: "destructive", title: "Scan Error", description: error.message });
    }
  }, [toast, fetchUsers]);

  const { scanning, setScanning, scanResult, setScanResult } = useQrScanner({
    onScan: handleScanProcess
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Function to count attendance for today
  const getTodayAttendanceCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return users.filter(user =>
      user.attendance && user.attendance.some((a: any) => {
        const attendanceDate = new Date(a.date);
        attendanceDate.setHours(0, 0, 0, 0);
        return attendanceDate.getTime() === today.getTime();
      })
    ).length;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
             <Link href="/admin/quiz-management">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Quiz Manage
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/admin/scanner/review">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Get all registered students
              </Button>
            </Link>
            <Link href="/admin/alumni">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Manage Alumni
              </Button>
            </Link>
            <Link href="/admin/questions">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Manage Drive Questions
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{getTodayAttendanceCount()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {users.length > 0
                    ? `${Math.round((getTodayAttendanceCount() / users.length) * 100)}%`
                    : '0%'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <QrScannerCard
              scanning={scanning}
              setScanning={setScanning}
              scanResult={scanResult}
            />

            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>Students present today</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter(user => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            return user.attendance && user.attendance.some((a: any) => {
                              const attendanceDate = new Date(a.date);
                              attendanceDate.setHours(0, 0, 0, 0);
                              return attendanceDate.getTime() === today.getTime();
                            });
                          })
                          .map(user => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const todayAttendance = user.attendance.find((a: any) => {
                              const attendanceDate = new Date(a.date);
                              attendanceDate.setHours(0, 0, 0, 0);
                              return attendanceDate.getTime() === today.getTime();
                            });

                            return (
                              <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.rollNumber}</TableCell>
                                <TableCell>
                                  {todayAttendance ? format(new Date(todayAttendance.date), 'h:mm a') : ''}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {users.filter(user => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          return user.attendance && user.attendance.some((a: any) => {
                            const attendanceDate = new Date(a.date);
                            attendanceDate.setHours(0, 0, 0, 0);
                            return attendanceDate.getTime() === today.getTime();
                          });
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                No attendance records for today
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <EventManager />

          <Tabs value="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Students</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>
                      Complete list of registered students
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={refreshing || loading}
                      className="h-9 px-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      title="Refresh Student Records"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "Refreshing..." : "Refresh"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatsOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Branch-Wise Statistics
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Total Attendance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.rollNumber}</TableCell>
                              <TableCell>
                                {user.branch ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                    {user.branch}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs italic">
                                    Not Specified
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.attendance ? user.attendance.length : 0}</TableCell>
                            </TableRow>
                          ))}
                          {users.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No students registered yet
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Branch-Wise Statistics Popup Dialog */}
          <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Branch-Wise Student Statistics
                </DialogTitle>
                <DialogDescription>
                  Count of registered students categorized by branch
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                {(() => {
                  const branchStats = users.reduce((acc: Record<string, number>, user: any) => {
                    const branch = user.branch && user.branch.trim() ? user.branch.trim() : 'Not Specified';
                    acc[branch] = (acc[branch] || 0) + 1;
                    return acc;
                  }, {});

                  const sortedBranchStats = Object.entries(branchStats).sort(
                    ([aBranch, aCount], [bBranch, bCount]) => (bCount as number) - (aCount as number)
                  );

                  if (sortedBranchStats.length === 0) {
                    return (
                      <p className="text-center py-6 text-muted-foreground text-sm">
                        No registered students found.
                      </p>
                    );
                  }

                  return (
                    <>
                      <div className="divide-y rounded-lg border">
                        {sortedBranchStats.map(([branch, count]) => (
                          <div
                            key={branch}
                            className="flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-base">
                                {branch}
                              </span>
                              {branch === 'Not Specified' && (
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                  (Pending update)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground font-bold">→</span>
                              <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground px-1">
                        <span>Total Branches: {sortedBranchStats.length}</span>
                        <span className="font-semibold text-foreground">
                          Total Students: {users.length}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

