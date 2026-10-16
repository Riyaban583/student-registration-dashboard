"use client";

import { useEffect, useState } from "react";
import {
  getAllRecruitments,
  review as reviewStudent,
  getStudentReviewLogs,
  getAllReviewLogs,
} from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Search,
  X,
  History,
  Clock,
  Smartphone,
  Laptop,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  ScrollBar,
  ScrollArea
} from "@/components/ui/scroll-area";


interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  universityRollNo: string;
  year: string;
  eventName: string;
  phoneNumber: string;
  qrCode: string;
  attendance: any[];
  cgpa: string;
  back: string;
  summary: string;
  clubs: string;
  linkedin: string;
  aim: string;
  believe: string;
  expect: string;
  domain: string[];
  review?: number;
  reviewDomain1?: number | null;
  reviewDomain2?: number | null;
  comment?: string;
  roundOneAttendance?: boolean;
  roundTwoAttendance?: boolean;
  roundOneQualified?: boolean;
  roundTwoQualified?: boolean;
}

interface ReviewLogItem {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  changes: string[];
  previous: any;
  updated: any;
  deviceInfo: {
    deviceName?: string;
    deviceId?: string;
    browser?: string;
    os?: string;
    deviceType?: string;
    ip?: string;
    rawUserAgent?: string;
  };
  createdAt: string;
}

export default function AdminReviewPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  // Device tracking
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");

  // Audit logs modal
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsList, setLogsList] = useState<ReviewLogItem[]>([]);
  const [activeLogStudent, setActiveLogStudent] = useState<{ id?: string; name?: string; rollNumber?: string } | null>(null);

  // filters
  const [searchName, setSearchName] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  useEffect(() => {
    fetchStudents();

    // Initialize or read persistent device identifier from localStorage
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("portal_admin_device_id");
      if (!storedId) {
        storedId = "DEV-" + Math.random().toString(36).substring(2, 7).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
        localStorage.setItem("portal_admin_device_id", storedId);
      }
      setDeviceId(storedId);

      const storedName = localStorage.getItem("portal_admin_device_name") || "";
      setDeviceName(storedName);

      const handleDeviceRegEvent = () => {
        const updatedName = localStorage.getItem("portal_admin_device_name") || "";
        setDeviceName(updatedName);
      };
      window.addEventListener("admin_device_registered", handleDeviceRegEvent);
      return () => {
        window.removeEventListener("admin_device_registered", handleDeviceRegEvent);
      };
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const res = await getAllRecruitments();
    if (res.success) {
      setStudents(res.students ?? []);
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
    setLoading(false);
  };

  const handleUpdate = async (student: Student) => {
    let currentAdminName = deviceName.trim();
    if (!currentAdminName && typeof window !== "undefined") {
      currentAdminName = (localStorage.getItem("portal_admin_device_name") || "").trim();
    }

    if (!currentAdminName) {
      const enteredName = prompt("Reviewer/Admin Name is MANDATORY for audit tracking. Please enter your name:");
      if (!enteredName || enteredName.trim().length < 2) {
        toast({
          variant: "destructive",
          title: "Reviewer Name Required",
          description: "Marks cannot be saved without entering a verified reviewer name.",
        });
        return;
      }
      currentAdminName = enteredName.trim();
      setDeviceName(currentAdminName);
      localStorage.setItem("portal_admin_device_name", currentAdminName);
    }

    const clientInfo = {
      deviceId,
      deviceName: currentAdminName,
    };

    const data = {
      studentId: student.id,
      review: student.review,
      reviewDomain1: student.reviewDomain1,
      reviewDomain2: student.reviewDomain2,
      comment: student.comment,
      roundOneAttendance: student.roundOneAttendance,
      roundTwoAttendance: student.roundTwoAttendance,
      roundOneQualified: student.roundOneQualified,
      roundTwoQualified: student.roundTwoQualified,
      clientInfo,
    };

    const res = await reviewStudent(data);

    if (res.success) {
      toast({ title: "Success", description: "Student updated and audit log recorded" });

      // ✅ Update only this student in state, don’t reset everything
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, ...data } : s))
      );
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
  };

  const openStudentLogs = async (student: Student) => {
    setActiveLogStudent({ id: student.id, name: student.name, rollNumber: student.rollNumber });
    setLogsModalOpen(true);
    setLogsLoading(true);
    const res = await getStudentReviewLogs(student.id);
    if (res.success && res.logs) {
      setLogsList(res.logs);
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error || "Failed to load audit logs" });
    }
    setLogsLoading(false);
  };

  const openAllAuditLogs = async () => {
    setActiveLogStudent(null);
    setLogsModalOpen(true);
    setLogsLoading(true);
    const res = await getAllReviewLogs(100);
    if (res.success && res.logs) {
      setLogsList(res.logs);
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error || "Failed to load audit logs" });
    }
    setLogsLoading(false);
  };

  const handleDeviceRename = () => {
    const newName = prompt(
      "Enter a friendly name/nickname for this device (e.g., 'Rahul Laptop' or 'Lab iPad'):",
      deviceName
    );
    if (newName !== null) {
      const trimmed = newName.trim();
      setDeviceName(trimmed);
      localStorage.setItem("portal_admin_device_name", trimmed);
      toast({
        title: "Device Name Saved",
        description: `This device will now be recorded as "${trimmed || 'Default OS/Browser'}" in edit logs.`,
      });
    }
  };


  const handleInputChange = (id: string, field: string, value: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // filter students
  const filteredStudents = students.filter((s) => {
    const matchesBranch = branchFilter ? s.branch === branchFilter : true;
    const matchesDomain = domainFilter ? s.domain?.includes(domainFilter) : true;
    const matchesName = searchName.trim()
      ? (s.name || "").toLowerCase().includes(searchName.trim().toLowerCase())
      : true;

    return matchesBranch && matchesDomain && matchesName;
  });

  // collect unique values for dropdowns
  const uniqueBranches = Array.from(
    new Set(students.map((s) => s.branch).filter(Boolean))
  );
  const uniqueDomains = Array.from(
    new Set(students.flatMap((s) => s.domain || []).filter(Boolean))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Admin: Review Students</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Marks updates are logged automatically with device info, IP, and timestamps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Current Reviewer Identifier Pill */}
          <button
            type="button"
            onClick={handleDeviceRename}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs hover:border-amber-500 transition shadow-sm text-left"
            title="Click to change your Reviewer / Admin Name on this device"
          >
            <User className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-800 dark:text-amber-300 font-medium">Reviewer:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {deviceName || "Not set (Click to name)"}
            </span>
          </button>

          <Button
            variant="outline"
            size="sm"
            className="border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white flex items-center gap-1.5 font-medium"
            onClick={openAllAuditLogs}
            title="View all student edit history across all devices"
          >
            <History className="h-4 w-4 text-amber-500" />
            All Audit Logs
          </Button>

          <Link href="/admin/analytics">
            <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              Analytics Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Name Search */}
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchName && (
            <button
              type="button"
              onClick={() => setSearchName("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={branchFilter || "ALL"}
          onValueChange={(val) => setBranchFilter(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Branches</SelectItem>
            {uniqueBranches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={domainFilter || "ALL"}
          onValueChange={(val) => setDomainFilter(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Domains</SelectItem>
            {uniqueDomains.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchName("");
            setBranchFilter("");
            setDomainFilter("");
          }}
        >
          Reset
        </Button>

        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border bg-gray-500">Name</th>
                <th className="px-2 py-1 border bg-gray-500">Roll Number</th>
                <th className="px-2 py-1 border bg-gray-500">Email</th>
                <th className="px-2 py-1 border bg-gray-500">Branch</th>
                <th className="px-2 py-1 border bg-gray-500">Domain</th>
                <th className="px-2 py-1 border bg-gray-500">Domain 1 (0-10)</th>
                <th className="px-2 py-1 border bg-gray-500">Domain 2 (0-10)</th>
                <th className="px-2 py-1 border bg-gray-500">Comment</th>
                <th className="px-2 py-1 border bg-gray-500">Round 1 Attendance</th>
                <th className="px-2 py-1 border bg-gray-500">Round 2 Attendance</th>
                <th className="px-2 py-1 border bg-gray-500">Round 1 Qualified</th>
                <th className="px-2 py-1 border bg-gray-500">Round 2 Qualified</th>
                <th className="px-2 py-1 border bg-gray-500">Action & Logs</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-8 text-gray-500">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-2 py-1 border" onClick={() => {
                    setSelectedStudent(student);
                    setOpen(true);
                  }}>{student.name}</td>
                  <td className="px-2 py-1 border" onClick={() => {
                    setSelectedStudent(student)
                    setOpen(true)
                  }}>{student.rollNumber}</td>
                  <td className="px-2 py-1 border" onClick={() => {
                    setSelectedStudent(student);
                    setOpen(true);
                  }}>{student.email}</td>
                  <td className="px-2 py-1 border">{student.branch}</td>
                  <td className="px-2 py-1 border">
                    {student.domain?.join(", ") || ""}
                  </td>

                  <td className="px-2 py-1 border">
                    <div className="text-xs text-gray-400 mb-1">{student.domain?.[0] || "—"}</div>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={student.reviewDomain1 ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(
                          student.id,
                          "reviewDomain1",
                          value === "" ? null : Number(value)
                        );
                      }}
                    />
                  </td>

                  <td className="px-2 py-1 border">
                    <div className="text-xs text-gray-400 mb-1">{student.domain?.[1] || "—"}</div>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={student.reviewDomain2 ?? ""}
                      disabled={!student.domain?.[1]}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(
                          student.id,
                          "reviewDomain2",
                          value === "" ? null : Number(value)
                        );
                      }}
                    />
                  </td>


                  <td className="px-2 py-1 border">
                    <Input
                      type="text"
                      value={student.comment ?? ""}
                      onChange={(e) =>
                        handleInputChange(student.id, "comment", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundOneAttendance ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundOneAttendance", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundTwoAttendance ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundTwoAttendance", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundOneQualified ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundOneQualified", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <Checkbox
                      checked={student.roundTwoQualified ?? false}
                      onCheckedChange={(checked) =>
                        handleInputChange(student.id, "roundTwoQualified", checked)
                      }
                    />
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button size="sm" onClick={() => handleUpdate(student)}>Save</Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-xs px-2.5 h-9 text-slate-700 dark:text-slate-200"
                        onClick={() => openStudentLogs(student)}
                        title="View edit history and device logs for this student"
                      >
                        <History className="h-3.5 w-3.5 text-amber-500" />
                        Logs
                      </Button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-8 bg-gray-950 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto custom-scrollbar w-full max-w-5xl">
          {selectedStudent && (
            <div className="space-y-8 text-gray-200">
              {/* Header Section with Name and Roll Number */}
              <div className="text-center">
                <h3 className="text-4xl font-extrabold tracking-tight text-white">{selectedStudent.name}</h3>
                <p className="text-lg text-gray-400 mt-2 font-medium">{selectedStudent.rollNumber}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Core Details */}
                <div className="p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 space-y-4">
                  <h4 className="text-xl font-bold text-gray-100 border-b border-gray-700 pb-2 mb-4">Core Information</h4>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">Branch:</span>
                      <span>{selectedStudent.branch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">Year:</span>
                      <span>{selectedStudent.year}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">University Roll No:</span>
                      <span>{selectedStudent.universityRollNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">CGPA:</span>
                      <span className="font-bold text-green-400">{selectedStudent.cgpa}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">Backlogs:</span>
                      <span className="font-bold text-red-400">{selectedStudent.back}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">Email:</span>
                      <a href={`mailto:${selectedStudent.email}`} className="text-blue-400 hover:underline">{selectedStudent.email}</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-50">Phone:</span>
                      <span>{selectedStudent.phoneNumber}</span>
                    </div>
                    {selectedStudent.linkedin && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-50">LinkedIn:</span>
                        <a href={selectedStudent.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[150px]">
                          {selectedStudent.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Domains and Aspiration */}
                <div className="p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 space-y-6">
                  <h4 className="text-xl font-bold text-gray-100 border-b border-gray-700 pb-2 mb-4">Aspirations & Interests</h4>

                  <div>
                    <h5 className="text-md font-semibold text-gray-300 mb-2">Domains</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.domain?.map(d => (
                        <span key={d} className="px-4 py-1 text-sm font-medium bg-purple-900 text-purple-300 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-md font-semibold text-gray-300 mb-2">Clubs</h5>
                    <p className="text-sm text-gray-400">{selectedStudent.clubs}</p>
                  </div>

                  <div>
                    <h5 className="text-md font-semibold text-gray-300 mb-2">Aim</h5>
                    <p className="text-sm text-gray-400">{selectedStudent.aim}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Summary & Beliefs */}
              <div className="p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 space-y-6">
                <h4 className="text-xl font-bold text-gray-100 border-b border-gray-700 pb-2 mb-4">Why should we have you in PTP?</h4>
                <p className="text-gray-300 leading-relaxed">{selectedStudent.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                  <div>
                    <h5 className="text-md font-semibold text-gray-300 mb-2">What I Believe</h5>
                    <p className="text-gray-400">{selectedStudent.believe}</p>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold text-gray-300 mb-2">What I Expect</h5>
                    <p className="text-gray-400">{selectedStudent.expect}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Immutable Audit Log Dialog (Read-only, Tamper-proof) */}
      <Dialog open={logsModalOpen} onOpenChange={setLogsModalOpen}>
        <DialogContent className="p-6 bg-slate-950 text-slate-100 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto w-full max-w-4xl border border-slate-800">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                  <History className="h-6 w-6 text-amber-400" />
                  {activeLogStudent
                    ? `Audit Logs: ${activeLogStudent.name}`
                    : "System Audit Logs (All Edit Activity)"}
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-1">
                  {activeLogStudent
                    ? `Roll Number: ${activeLogStudent.rollNumber} • Complete chronological edit history`
                    : "All recent review and marks updates recorded across all admin devices"}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Immutable & Tamper-Proof</span>
              </div>
            </div>
          </DialogHeader>

          {logsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400 mb-2" />
              <p>Loading audit trail...</p>
            </div>
          ) : logsList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="h-12 w-12 text-slate-600 mx-auto" />
              <p className="text-lg font-medium text-slate-300">No edit history recorded yet</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Any changes made to marks, comments, or attendance from now on will automatically record the editing device, IP address, and timestamp here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 my-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Showing {logsList.length} recorded update{logsList.length > 1 ? 's' : ''}</span>
                <span className="text-slate-500 italic">History cannot be edited or deleted</span>
              </div>

              {logsList.map((log) => {
                const dateObj = new Date(log.createdAt);
                const formattedDate = dateObj.toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-semibold text-slate-200">
                          {formattedDate}
                        </span>
                        {!activeLogStudent && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-medium">
                            {log.studentName} ({log.studentRollNumber})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800 flex items-center gap-1.5 font-medium">
                          {log.deviceInfo?.deviceType === "Mobile" ? (
                            <Smartphone className="h-3.5 w-3.5 text-purple-400" />
                          ) : (
                            <Laptop className="h-3.5 w-3.5 text-purple-400" />
                          )}
                          {log.deviceInfo?.deviceName || `${log.deviceInfo?.os} (${log.deviceInfo?.browser})`}
                        </span>

                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          IP: {log.deviceInfo?.ip || "Unknown"}
                        </span>

                        {log.deviceInfo?.deviceId && (
                          <span className="px-2 py-1 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/60 font-mono text-[11px]" title={`Device ID: ${log.deviceInfo.deviceId}`}>
                            ID: {log.deviceInfo.deviceId.slice(0, 10)}...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Changes Made:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {log.changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-200 font-mono flex items-center gap-1.5"
                          >
                            <span className="text-amber-400 font-bold">▶</span>
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}




