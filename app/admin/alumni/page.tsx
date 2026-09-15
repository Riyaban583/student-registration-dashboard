"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Trash2, Edit, Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAlumni, addAlumni, deleteAlumni, updateAlumni } from "@/app/actions/alumni";
import { logout } from "@/app/actions/user";

export default function ManageAlumniPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [alumniItems, setAlumniItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    branch: "",
    company: "",
    designation: "",
    package: "",
    linkedin: "",
    phone: "",
    description: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadAlumni() {
    setLoading(true);
    const result = await getAlumni();
    if (result.success && result.alumni) {
        setAlumniItems(result.alumni);
    } else {
        toast({ title: "Error", description: "Failed to load alumni data", variant: "destructive" });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAlumni();
  }, [toast]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingId) {
      const result = await updateAlumni(editingId, formData);
      if (result.success) {
        toast({ title: "Success", description: "Alumni updated successfully" });
        setEditingId(null);
        setFormData({ name: "", batch: "", branch: "", company: "", designation: "", package: "", linkedin: "", phone: "", description: "", imageUrl: "" });
        loadAlumni();
      } else {
        toast({ title: "Error", description: result.error || "Failed to update", variant: "destructive" });
      }
    } else {
      const result = await addAlumni(formData);
      if (result.success) {
        toast({ title: "Success", description: "Alumni added successfully" });
        setFormData({ name: "", batch: "", branch: "", company: "", designation: "", package: "", linkedin: "", phone: "", description: "", imageUrl: "" });
        loadAlumni();
      } else {
        toast({ title: "Error", description: result.error || "Failed to add", variant: "destructive" });
      }
    }

    setIsSubmitting(false);
  };

  const handleEdit = (alumni: any) => {
    setEditingId(alumni.id);
    setFormData({
      name: alumni.name,
      batch: alumni.batch,
      branch: alumni.branch || "",
      company: alumni.company,
      designation: alumni.designation,
      package: alumni.package || "",
      linkedin: alumni.linkedin,
      phone: alumni.phone || "",
      description: alumni.description || "",
      imageUrl: alumni.imageUrl || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni record?")) return;
    
    const result = await deleteAlumni(id);
    if (result.success) {
      toast({ title: "Success", description: "Alumni deleted" });
      loadAlumni();
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Placement Cell Admin</h1>
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Alumni" : "Add New Alumni"}</CardTitle>
                <CardDescription>
                  Enter alumni details to display on the portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Batch (Year)</label>
                    <Input name="batch" value={formData.batch} onChange={handleInputChange} required placeholder="e.g. 2023" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Branch/Course</label>
                    <Select value={formData.branch} onValueChange={(value) => setFormData(prev => ({...prev, branch: value}))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="ECE">ECE</SelectItem>
                        <SelectItem value="ME">ME</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="EE">EE</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="PCE">PCE</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="AE">AE</SelectItem>
                        <SelectItem value="EIC">EIC</SelectItem>
                        <SelectItem value="CHE">CHE</SelectItem>
                        <SelectItem value="P&I">P&I</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input name="company" value={formData.company} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role / Designation</label>
                    <Input name="designation" value={formData.designation} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Package (Optional)</label>
                    <Input name="package" value={formData.package} onChange={handleInputChange} placeholder="e.g. 12 LPA" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone No</label>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input name="linkedin" value={formData.linkedin} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Profile Image URL (Optional)</label>
                    <Input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://.../photo.jpg" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : editingId ? "Update Alumni" : "Add Alumni"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" className="w-full mt-2" onClick={() => {
                        setEditingId(null);
                        setFormData({ name: "", batch: "", branch: "", company: "", designation: "", package: "", linkedin: "", phone: "", description: "", imageUrl: "" });
                    }}>
                      Cancel Edit
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Alumni Records</CardTitle>
                <CardDescription>All registered alumni details</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alumniItems.map((alumni) => (
                        <TableRow key={alumni.id}>
                          <TableCell className="font-medium">{alumni.name}</TableCell>
                          <TableCell>{alumni.batch}</TableCell>
                          <TableCell>{alumni.branch}</TableCell>
                          <TableCell>{alumni.company}</TableCell>
                          <TableCell>{alumni.designation}</TableCell>
                          <TableCell>{alumni.phone}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(alumni)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(alumni.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {alumniItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">No records found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
