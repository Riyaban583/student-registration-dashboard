"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toZonedTime } from "date-fns-tz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GraduationCap, ArrowLeft, Calendar, Download, Edit, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { getUserById, getUserByRollNumber, updateUserInfo } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch?: string;
  qrCode: string;
  attendance: {
    date: string;
    present: boolean;
  }[];
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { toast } = useToast();

  const [user, setUser] = useState<User | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [rollNumber, setRollNumber] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Edit Student Info state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState("");
  const [editName, setEditName] = useState("");
  const [editRollNumber, setEditRollNumber] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenEdit = () => {
    if (user) {
      setEditBranch(user.branch || "");
      setEditName(user.name || "");
      setEditRollNumber(user.rollNumber || "");
      setEditEmail(user.email || "");
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!editBranch) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select your branch.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateUserInfo(user.id, {
        branch: editBranch,
        name: editName,
        email: editEmail,
        rollNumber: editRollNumber,
      });

      if (res.success && res.user) {
        setUser((prev) => prev ? { ...prev, ...res.user } : null);
        toast({
          title: "Profile Updated",
          description: "Student info and branch have been updated successfully.",
        });
        setIsEditModalOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: res.error || "Failed to update student info.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An error occurred while updating.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      if (userId) {
        setLoading(true);
        const result = await getUserById(userId);
        if (result.success) {
          if (result.user) {
            if (result.user) {
              if (result.user) {
                if (result.user) {
                  setUser(result.user);
                }
              }
            }
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to fetch user data",
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, toast]);

  const handleSearch = async () => {
    const normalizedRollNumber = rollNumber.trim();

    if (!normalizedRollNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your roll number",
      });
      return;
    }

    setSearchLoading(true);
  const result = await getUserByRollNumber(normalizedRollNumber);

    if (result.success && result.user) {
      setUser(result.user);
      toast({
        title: "Success",
        description: "User found successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "User not found",
      });
    }
    setSearchLoading(false);
  };

  // const downloadQR = () => {
  //   if (!user) return;

  //   const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
  //   if (!canvas) return;

  //   const url = canvas.toDataURL('image/png');
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `qr-code-${user.rollNumber}.png`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const downloadQR = () => {
    if (!user) return;

    const svg = document.querySelector("#qr-code-svg") as SVGElement;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${user.rollNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {!user && !loading ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Find Your Dashboard</CardTitle>
              <CardDescription>
                Enter your roll number to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : user ? (
          <div className="max-w-4xl mx-auto">
            {!user.branch && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-200">Branch details missing</p>
                    <p className="text-sm text-amber-800/80 dark:text-amber-300/80">
                      Please update your branch ASAP on this dashboard to ensure placement records are up to date.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleOpenEdit}
                  className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                >
                  Add Branch Now
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Core Team Member Dashboard</h2>
              <Button variant="outline" size="sm" onClick={handleOpenEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Student Info
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base">Student Info</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="h-8 px-2 text-xs">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Name
                      </dt>
                      <dd className="font-semibold text-foreground">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Roll Number
                      </dt>
                      <dd className="font-medium text-foreground">{user.rollNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Branch
                      </dt>
                      <dd className="pt-0.5">
                        {user.branch ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {user.branch}
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold inline-flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> Not Added Yet
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd className="truncate text-muted-foreground">{user.email}</dd>
                    </div>
                  </dl>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenEdit}
                    className="w-full mt-4 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit Student Info
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your QR Code</CardTitle>
                  <CardDescription>
                    Scan this code to mark your attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={user.qrCode}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <Button variant="outline" onClick={downloadQR}>
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="attendance">
              <TabsList className="mb-4">
                <TabsTrigger value="attendance">Attendance History</TabsTrigger>
              </TabsList>

              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Attendance Records
                    </CardTitle>
                    <CardDescription>
                      Your attendance history for placement activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.attendance && user.attendance.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.attendance.map((record, index) => (
                            <TableRow key={index}>
                              <TableCell>
                              {format(toZonedTime(new Date(record.date), "Asia/Kolkata"), "PPP")}
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                  Present
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No attendance records found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Edit Student Info Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Student Info</DialogTitle>
                  <DialogDescription>
                    Update your details and add or change your branch.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Branch <span className="text-destructive">*</span></label>
                    <select
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      required
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="EE">EE</option>
                      <option value="IT">IT</option>
                      <option value="PCE">PCE</option>
                      <option value="PE">PE</option>
                      <option value="AE">AE</option>
                      <option value="EIC">EIC</option>
                      <option value="CHE">CHE</option>
                      <option value="P&I">P&I</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Roll Number</label>
                    <Input
                      value={editRollNumber}
                      onChange={(e) => setEditRollNumber(e.target.value)}
                      placeholder="Roll Number"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
