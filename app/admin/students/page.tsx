"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, ArrowLeft, Users, LogOut, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getAllStudents, logout } from '@/app/actions/user';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  universityRollNo: string;
  branch: string;
  year: string;
  eventName: string;
  phoneNumber: string;
  attendance: {
    date: string;
    present: boolean;
  }[];
  createdAt: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const result = await getAllStudents();
        if (result.success) {
          setStudents(result.students || []);
        } else {
          throw new Error(result.error || "Failed to fetch students");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [toast]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const exportToCSV = () => {
    if (students.length === 0) return;

    const headers = [
      'Name', 
      'Email', 
      'Roll Number', 
      'University Roll No', 
      'Branch', 
      'Year', 
      'Event Name', 
      'Phone Number', 
      'Total Attendance', 
      'Registration Date'
    ];

    const csvData = students.map(student => [
      student.name,
      student.email,
      student.rollNumber,
      student.universityRollNo,
      student.branch,
      student.year,
      student.eventName,
      student.phoneNumber,
      student.attendance ? student.attendance.length : 0,
      student.createdAt ? format(new Date(student.createdAt), 'yyyy-MM-dd') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <Link href="/admin/scanner">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Registered Students</h2>
            <Button onClick={exportToCSV} disabled={students.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>
                Complete list of all registered students with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading student data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>University Roll No</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Total Attendance</TableHead>
                        <TableHead>Registered On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.universityRollNo}</TableCell>
                          <TableCell>{student.branch}</TableCell>
                          <TableCell>{student.year}</TableCell>
                          <TableCell>{student.eventName}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell>{student.attendance ? student.attendance.length : 0}</TableCell>
                          <TableCell>
                            {student.createdAt ? format(new Date(student.createdAt), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
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
