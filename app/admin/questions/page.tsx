"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  Sparkles,
  HelpCircle,
  Search,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getDriveQuestions,
  addDriveQuestion,
  updateDriveQuestion,
  deleteDriveQuestion,
  checkQuestionsAccess,
  verifyAndAuthenticateQuestionsAccess,
  logoutQuestionsAccess,
} from "@/app/actions/driveQuestions";
import { logout } from "@/app/actions/user";

interface QuestionItem {
  id: string;
  company: string;
  branch: string;
  role: string;
  round: string;
  question: string;
  answer?: string;
  year?: string;
  createdAt: string;
}

const BRANCHES = [
  "All Branches",
  "CSE",
  "ECE",
  "ME",
  "CE",
  "EE",
  "IT",
  "PCE",
  "PE",
  "AE",
  "EIC",
  "CHE",
  "P&I",
  "Other",
];

const ROUNDS = [
  "Coding / Online Assessment",
  "Technical Interview",
  "Aptitude Test",
  "HR Interview",
  "Group Discussion",
];

export default function AdminQuestionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State for Add
  const [formData, setFormData] = useState({
    company: "",
    branch: "All Branches",
    role: "Software Development Engineer",
    round: "Technical Interview",
    year: new Date().getFullYear().toString(),
    question: "",
    answer: "",
  });

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    company: "",
    branch: "All Branches",
    role: "",
    round: "Technical Interview",
    year: "",
    question: "",
    answer: "",
  });

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await getDriveQuestions();
      if (res.success && res.questions) {
        setQuestions(res.questions);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error || "Failed to load questions",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load questions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const hasAccess = await checkQuestionsAccess();
        setIsAuthenticated(hasAccess);
        if (hasAccess) {
          await loadQuestions();
        } else {
          setLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    try {
      const res = await verifyAndAuthenticateQuestionsAccess(passwordInput);
      if (res.success) {
        toast({
          title: "Access Granted",
          description: "Unlocked drive questions management portal.",
        });
        setIsAuthenticated(true);
        setPasswordInput("");
        await loadQuestions();
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: res.error || "Incorrect password.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to verify password",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    await logoutQuestionsAccess();
    await logout();
    setIsAuthenticated(false);
    toast({
      title: "Session Locked",
      description: "Logged out from questions management.",
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.question.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Company name and question content are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addDriveQuestion({
        company: formData.company,
        branch: formData.branch,
        role: formData.role,
        round: formData.round,
        year: formData.year,
        question: formData.question,
        answer: formData.answer,
      });

      if (res.success) {
        toast({
          title: "Question Added Successfully",
          description: `${formData.company} question has been published to student portal.`,
        });
        setFormData({
          company: "",
          branch: "All Branches",
          role: "Software Development Engineer",
          round: "Technical Interview",
          year: new Date().getFullYear().toString(),
          question: "",
          answer: "",
        });
        await loadQuestions();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error || "Failed to add question",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setEditFormData({
      company: q.company,
      branch: q.branch,
      role: q.role || "",
      round: q.round || "Technical Interview",
      year: q.year || "",
      question: q.question,
      answer: q.answer || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    setIsSubmitting(true);
    try {
      const res = await updateDriveQuestion(editingQuestion.id, {
        company: editFormData.company,
        branch: editFormData.branch,
        role: editFormData.role,
        round: editFormData.round,
        year: editFormData.year,
        question: editFormData.question,
        answer: editFormData.answer,
      });

      if (res.success) {
        toast({
          title: "Updated Successfully",
          description: "Question details updated.",
        });
        setIsEditOpen(false);
        setEditingQuestion(null);
        await loadQuestions();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error || "Failed to update question",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update question",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete this question for ${company}?`)) {
      return;
    }

    try {
      const res = await deleteDriveQuestion(id);
      if (res.success) {
        toast({
          title: "Deleted",
          description: "Question deleted successfully.",
        });
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error || "Failed to delete question",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete question",
      });
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      q.company.toLowerCase().includes(query) ||
      q.branch.toLowerCase().includes(query) ||
      q.question.toLowerCase().includes(query) ||
      (q.role || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/RTU logo.png" alt="RTU Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-base font-bold">Placement Drive Questions</h1>
              <p className="text-xs text-muted-foreground">Admin & Alumni Contribution Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/placement-questions">
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Student Portal
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/admin/scanner">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                    Scanner
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs">
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Lock / Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Gate: Password Prompt if not authenticated */}
      {isAuthenticated === false ? (
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg border-primary/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Drive Questions Access</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Enter your <strong>Admin Password</strong> or <strong>Alumni Section Password</strong> to submit, edit, and manage placement drive questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Access Password</label>
                  <div className="relative">
                    <KeyRound className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Admin or Alumni password..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="pl-9"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isVerifying} className="w-full">
                  {isVerifying ? "Verifying..." : "Unlock Management Access"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t py-3">
              <Link
                href="/placement-questions"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ← Return to Student Questions Portal
              </Link>
            </CardFooter>
          </Card>
        </main>
      ) : loading ? (
        <main className="flex-1 container mx-auto px-4 py-20 text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Checking authorization...</p>
        </main>
      ) : (
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
          {/* Submit Question Card */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Submit Placement Drive Question</CardTitle>
                  <CardDescription className="text-xs">
                    Add questions asked in past campus drives to help students prepare.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      Company Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g. TCS, Infosys, Celebal..."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      Target Branch <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      required
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Role / Designation</label>
                    <Input
                      placeholder="e.g. SDE, Associate Engineer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>

                  {/* Round */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Interview Round / Type</label>
                    <select
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {ROUNDS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Drive Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Drive Year</label>
                    <Input
                      placeholder="2026"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    Question Content <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Enter the complete question, problem statement, or discussion topic..."
                    rows={4}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                  />
                </div>

                {/* Suggested Answer / Solution / Tips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    Suggested Approach / Answer / Tips (Optional)
                  </label>
                  <Textarea
                    placeholder="Provide hints, time complexity, key concepts, or model answers..."
                    rows={3}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Submitting Question..." : "Publish Question to Portal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Questions Management */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base">All Submitted Drive Questions</CardTitle>
                <CardDescription className="text-xs">
                  Total {questions.length} questions submitted across all branches
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Loading questions...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No questions found. Submit the first question above!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Round</TableHead>
                        <TableHead>Question Preview</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell className="font-semibold text-foreground">
                            {q.company}
                            {q.year && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({q.year})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {q.branch}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{q.round}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="line-clamp-2 text-xs text-foreground">{q.question}</p>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(q)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(q.id, q.company)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Question Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Placement Question</DialogTitle>
                <DialogDescription>Update the question or interview details</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="space-y-3 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Company</label>
                    <Input
                      value={editFormData.company}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, company: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Branch</label>
                    <select
                      value={editFormData.branch}
                      onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Role</label>
                    <Input
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Round</label>
                    <select
                      value={editFormData.round}
                      onChange={(e) => setEditFormData({ ...editFormData, round: e.target.value })}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    >
                      {ROUNDS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Drive Year</label>
                    <Input
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Question</label>
                  <Textarea
                    rows={4}
                    value={editFormData.question}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, question: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Suggested Approach / Answer</label>
                  <Textarea
                    rows={3}
                    value={editFormData.answer}
                    onChange={(e) => setEditFormData({ ...editFormData, answer: e.target.value })}
                  />
                </div>

                <DialogFooter className="pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      )}
    </div>
  );
}
