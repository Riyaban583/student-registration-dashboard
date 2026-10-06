"use client";

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
import { GraduationCap, ArrowLeft, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { getStudentById, getStudentByEmail } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string;
  eventName: string;
  phoneNumber: string;
  universityRollNo: string;
  qrCode: string;
  attendance: {
    date: string;
    present: boolean;
  }[];

  cgpa?: string;
  back?: string;
  summary?: string;
  clubs?: string;
  aim?: string;
  believe?: string;
  expect?: string;
  domain?: string[];
  linkedin?: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { toast } = useToast();

  const [user, setUser] = useState<User | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (userId) {
        setLoading(true);
        const result = await getStudentById(userId);
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

useEffect(() => {
  const emailParam = searchParams.get("email");

  async function fetchFromParams() {
    if (emailParam) {
      console.log("Fetching user by email:", emailParam);
      setLoading(true);
      await handleSearch(emailParam); // Search by email param
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  fetchFromParams();
}, [searchParams]);


  const handleSearch = async (paramEmail?:string) => {
     const searchEmail = String(paramEmail || email || "").trim();  // use param if given, else state
    if (!searchEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your roll number",
      });
      return;
    }

    setSearchLoading(true);
    console.log("Searching for user with email:", searchEmail);
    const result = await getStudentByEmail(searchEmail);

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
                Enter your email to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={() => handleSearch()} disabled={searchLoading}>
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
            <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Student Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Name
                      </dt>
                      {user && <div>{user.name}</div>}
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Roll Number
                      </dt>
                      <dd>{user.rollNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd className="truncate">{user.email}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card> */}

              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Student Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div>
                       <a href="https://chat.whatsapp.com/GL20pqoZgFNKTTKL6emzBX" className="hover:underline bg-gray-200 px-3 py-2 mb-2 rounded-lg text-black font-semibold" target="_blank" rel="noopener noreferrer">
              Join Whatsapp Group
            </a>
                      <dt className="font-medium text-muted-foreground mt-3">
                        Name
                      </dt>
                      <dd className="text-lg font-semibold">{user.name}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Roll Number
                      </dt>
                      <dd>{user.rollNumber}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        University Roll No.
                      </dt>
                      <dd>{user.universityRollNo}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Branch
                      </dt>
                      <dd>{user.branch}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Year
                      </dt>
                      <dd>{user.year}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Phone Number
                      </dt>
                      <dd>{user.phoneNumber}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd className="truncate">{user.email}</dd>
                    </div>

                    <div className="pt-2">
                      <dt className="font-medium text-muted-foreground">
                        Event Name
                      </dt>
                      <dd className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded px-2 py-1 inline-block font-semibold">
                        {user.eventName}
                      </dd>
                    </div>
                    {user.linkedin && (
                      <div className="pt-2">
                        <dt className="font-medium text-muted-foreground">LinkedIn</dt>
                        <dd>
                          <a
                            href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium text-sm"
                          >
                            View LinkedIn Profile
                          </a>
                        </dd>
                      </div>
                    )}
                    {user.cgpa && (
                      <div>
                        <dt className="font-medium text-muted-foreground">CGPA</dt>
                        <dd>{user.cgpa}</dd>
                      </div>
                    )}
                    {user.back && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Active Backlogs</dt>
                        <dd>{user.back}</dd>
                      </div>
                    )}
                    {user.domain && user.domain.length > 0 && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Selected Domains</dt>
                        <dd>{user.domain.join(', ')}</dd>
                      </div>
                    )}
                    {user.clubs && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Clubs</dt>
                        <dd>{user.clubs}</dd>
                      </div>
                    )}
                    {user.aim && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Aim</dt>
                        <dd className="whitespace-pre-line break-words">{user.aim}</dd>
                      </div>
                    )}
                  </dl>

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
                                {format(
                                  toZonedTime(
                                    new Date(record.date),
                                    "Asia/Kolkata"
                                  ),
                                  "PPP"
                                )}
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
function searchUser(emailParam: string) {
  throw new Error("Function not implemented.");
}

