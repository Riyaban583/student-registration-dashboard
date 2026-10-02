"use client";

import { useEffect, useState } from "react";
import { getAllRecruitments } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users, Briefcase, GraduationCap, Building } from "lucide-react";
import Link from "next/link";
import * as XLSX from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [domainFilter, setDomainFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  useEffect(() => {
    fetchStudents();
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

  // Export to Excel
  const exportToExcel = () => {
    if (students.length === 0) return;
    
    // Prepare data for excel
    const excelData = students.map((s, index) => ({
      "S.No": index + 1,
      "Name": s.name,
      "Email": s.email,
      "Roll Number": s.rollNumber,
      "University Roll": s.universityRollNo,
      "Branch": s.branch,
      "Year": s.year,
      "Phone": s.phoneNumber,
      "CGPA": s.cgpa,
      "Active Backlogs": s.back,
      "Domains": s.domain?.join(", ") || "",
      "Clubs": s.clubs,
      "Aim": s.aim,
      "Review Score": s.review || "Not reviewed",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    
    // Generate excel file
    XLSX.writeFile(workbook, "PTP_Recruitment_Data.xlsx");
    
    toast({
      title: "Success!",
      description: "Excel file downloaded successfully.",
    });
  };

  // Filtered Data
  const filteredStudents = students.filter(s => {
    const matchDomain = domainFilter === "All" || (s.domain && s.domain.includes(domainFilter));
    const matchBranch = branchFilter === "All" || s.branch === branchFilter;
    return matchDomain && matchBranch;
  });

  // Calculate Metrics based on FILTERED data
  const totalRegistrations = filteredStudents.length;
  
  // Calculate Branch Data
  const branchCounts = filteredStudents.reduce((acc: any, student) => {
    if (student.branch) {
      acc[student.branch] = (acc[student.branch] || 0) + 1;
    }
    return acc;
  }, {});
  const branchData = Object.keys(branchCounts).map(key => ({
    name: key,
    count: branchCounts[key]
  }));

  // Calculate Domain Data
  const domainCounts = filteredStudents.reduce((acc: any, student) => {
    if (student.domain && Array.isArray(student.domain)) {
      student.domain.forEach((d: string) => {
        acc[d] = (acc[d] || 0) + 1;
      });
    }
    return acc;
  }, {});
  const domainData = Object.keys(domainCounts).map(key => ({
    name: key,
    value: domainCounts[key]
  })).sort((a, b) => b.value - a.value);

  // Unique lists for filters
  const uniqueBranches = Array.from(new Set(students.map(s => s.branch).filter(Boolean)));
  const uniqueDomains = Array.from(new Set(students.flatMap(s => s.domain || []).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-1">PTP Core Team Recruitment Insights</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Link href="/admin/scanner/review">
            <Button variant="outline" className="border-gray-700 text-gray-800 hover:text-white hover:bg-gray-800">
              Go to Reviews
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={80} /></div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Registrations</p>
              <h3 className="text-4xl font-extrabold text-white">{totalRegistrations}</h3>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Building size={80} /></div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Branches</p>
              <h3 className="text-4xl font-extrabold text-blue-400">{branchData.length}</h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase size={80} /></div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Domains</p>
              <h3 className="text-4xl font-extrabold text-purple-400">{domainData.length}</h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
               <p className="text-gray-400 text-sm font-medium mb-3">Quick Filters</p>
               <div className="space-y-2">
                 <select 
                   className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-blue-500 text-white"
                   value={branchFilter}
                   onChange={(e) => setBranchFilter(e.target.value)}
                 >
                   <option value="All">All Branches</option>
                   {uniqueBranches.map((b: any) => <option key={b} value={b}>{b}</option>)}
                 </select>
                 <select 
                   className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-blue-500 text-white"
                   value={domainFilter}
                   onChange={(e) => setDomainFilter(e.target.value)}
                 >
                   <option value="All">All Domains</option>
                   {uniqueDomains.map((d: any) => <option key={d} value={d}>{d}</option>)}
                 </select>
               </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Domain Popularity (Pie Chart) */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-purple-400" />
                Domain Popularity
              </h3>
              <div className="h-80 w-full">
                {domainData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={domainData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {domainData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">No domain data</div>
                )}
              </div>
            </div>

            {/* Branch Distribution (Bar Chart) */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                <Building className="mr-2 h-5 w-5 text-blue-400" />
                Branch Distribution
              </h3>
              <div className="h-80 w-full">
                {branchData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                      <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                      <Tooltip 
                        cursor={{fill: '#374151', opacity: 0.4}}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {branchData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">No branch data</div>
                )}
              </div>
            </div>

          </div>

          {/* Table Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl overflow-hidden">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-green-400" />
                  Recent Registrations Preview
                </h3>
                <span className="text-sm text-gray-400">Showing top 10</span>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-gray-300">
                 <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                   <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Name</th>
                     <th className="px-4 py-3">Branch</th>
                     <th className="px-4 py-3">CGPA</th>
                     <th className="px-4 py-3">Domains</th>
                     <th className="px-4 py-3 rounded-tr-lg">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredStudents.slice(0, 10).map((student, idx) => (
                     <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                       <td className="px-4 py-3 font-medium text-white">{student.name}</td>
                       <td className="px-4 py-3">{student.branch}</td>
                       <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${Number(student.cgpa) >= 8 ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-300'}`}>
                           {student.cgpa || 'N/A'}
                         </span>
                       </td>
                       <td className="px-4 py-3 truncate max-w-xs">{student.domain?.join(", ")}</td>
                       <td className="px-4 py-3">
                         <Link href="/admin/scanner/review" className="text-blue-400 hover:text-blue-300 hover:underline">
                           Review
                         </Link>
                       </td>
                     </tr>
                   ))}
                   {filteredStudents.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No students match the current filters</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
