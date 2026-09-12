"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getDriveQuestions, getDriveQuestionFilterOptions } from "@/app/actions/driveQuestions";
import { useToast } from "@/hooks/use-toast";

interface QuestionItem {
  id: string;
  company: string;
  branch: string;
  role: string;
  round: string;
  question: string;
  answer?: string;
  year?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  createdAt: string;
}

const BRANCH_OPTIONS = [
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

const ROUND_OPTIONS = [
  "All Rounds",
  "Coding / Online Assessment",
  "Technical Interview",
  "Aptitude Test",
  "HR Interview",
  "Group Discussion",
];

export default function PlacementQuestionsPage() {
  const { toast } = useToast();

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedRound, setSelectedRound] = useState("All Rounds");
  const [searchQuery, setSearchQuery] = useState("");

  // Accordion state for expanded answers
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [questionsRes, filterRes] = await Promise.all([
        getDriveQuestions(),
        getDriveQuestionFilterOptions(),
      ]);

      if (questionsRes.success && questionsRes.questions) {
        setQuestions(questionsRes.questions);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: questionsRes.error || "Failed to load questions",
        });
      }

      if (filterRes.success && filterRes.companies) {
        setAvailableCompanies(filterRes.companies);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Branch filter: if selected is not "All Branches", match question branch or questions open to "All"
      const branchMatch =
        selectedBranch === "All Branches" ||
        q.branch.toLowerCase() === selectedBranch.toLowerCase() ||
        q.branch.toLowerCase() === "all" ||
        q.branch.toLowerCase() === "all branches";

      // Company filter
      const companyMatch =
        selectedCompany === "All Companies" ||
        q.company.toLowerCase() === selectedCompany.toLowerCase();

      // Round filter
      const roundMatch =
        selectedRound === "All Rounds" ||
        q.round.toLowerCase() === selectedRound.toLowerCase();

      // Search query (matches question text, company, role, tags)
      const qText = (q.question || "").toLowerCase();
      const cText = (q.company || "").toLowerCase();
      const rText = (q.role || "").toLowerCase();
      const tagsText = (q.tags || []).join(" ").toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const searchMatch =
        !query ||
        qText.includes(query) ||
        cText.includes(query) ||
        rText.includes(query) ||
        tagsText.includes(query);

      return branchMatch && companyMatch && roundMatch && searchMatch;
    });
  }, [questions, selectedBranch, selectedCompany, selectedRound, searchQuery]);

  const resetFilters = () => {
    setSelectedBranch("All Branches");
    setSelectedCompany("All Companies");
    setSelectedRound("All Rounds");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedBranch !== "All Branches" ||
    selectedCompany !== "All Companies" ||
    selectedRound !== "All Rounds" ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/RTU logo.png" alt="RTU Logo" className="h-9 w-9 object-contain" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">Placement Cell</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Past Placement Drives Questions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/questions">
              <Button variant="outline" size="sm" className="text-xs">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                Admin Submit
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Placement Preparation Archive
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Past Placement Drive Questions
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mt-2">
            Real interview questions, coding challenges, and assessment problems asked in campus
            placement drives at RTU. Filter by your branch and company to prepare strategically.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-6">
            <div className="p-3 rounded-xl border bg-card/60 backdrop-blur">
              <div className="text-2xl font-bold text-primary">{questions.length}</div>
              <div className="text-xs text-muted-foreground">Total Questions</div>
            </div>
            <div className="p-3 rounded-xl border bg-card/60 backdrop-blur">
              <div className="text-2xl font-bold text-foreground">
                {availableCompanies.length || (questions.length ? new Set(questions.map((q) => q.company)).size : 0)}
              </div>
              <div className="text-xs text-muted-foreground">Companies</div>
            </div>
            <div className="p-3 rounded-xl border bg-card/60 backdrop-blur">
              <div className="text-2xl font-bold text-foreground">
                {new Set(questions.map((q) => q.branch)).size || 0}
              </div>
              <div className="text-xs text-muted-foreground">Branches Covered</div>
            </div>
          </div>
        </section>

        {/* Filters Card */}
        <Card className="mb-8 shadow-sm border-muted">
          <CardHeader className="pb-3 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Filter Drive Questions</CardTitle>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset Filters
                </Button>
              )}
            </div>
            <CardDescription className="text-xs">
              Select your branch and target company to find relevant questions asked in past drives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Branch Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b === "All Branches" ? "🎓 All Branches" : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Company Name
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="All Companies">🏢 All Companies</option>
                  {availableCompanies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Round Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Round / Type
                </label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ROUND_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === "All Rounds" ? "📝 All Rounds" : r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Keyword Search
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search question, role, DSA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground border-t">
                <span className="font-medium">Active:</span>
                {selectedBranch !== "All Branches" && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    Branch: {selectedBranch}
                  </Badge>
                )}
                {selectedCompany !== "All Companies" && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    Company: {selectedCompany}
                  </Badge>
                )}
                {selectedRound !== "All Rounds" && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    Round: {selectedRound}
                  </Badge>
                )}
                {searchQuery.trim() && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                <span className="ml-auto text-xs font-medium text-foreground">
                  Showing {filteredQuestions.length} of {questions.length} questions
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">Loading drive questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card className="text-center py-16 px-4">
            <CardContent className="space-y-4">
              <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <h3 className="text-lg font-bold">No Questions Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No questions match your current filters. Try changing or clearing your branch,
                company, or search keyword.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = !!expandedAnswers[q.id];
              return (
                <Card
                  key={q.id}
                  className="hover:border-primary/40 transition-colors shadow-sm overflow-hidden"
                >
                  <CardHeader className="pb-3 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Company Badge */}
                        <Badge
                          variant="default"
                          className="font-semibold text-xs flex items-center gap-1 px-2.5 py-1"
                        >
                          <Building2 className="h-3 w-3" />
                          {q.company}
                        </Badge>

                        {/* Branch Badge */}
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {q.branch}
                        </Badge>

                        {/* Round Badge */}
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Layers className="h-3 w-3 text-muted-foreground" />
                          {q.round}
                        </Badge>
                      </div>

                      {/* Year & Index */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {q.year && (
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3" /> {q.year}
                          </span>
                        )}
                        <span className="font-mono text-muted-foreground/60">#{idx + 1}</span>
                      </div>
                    </div>

                    {/* Role / Designation */}
                    {q.role && (
                      <p className="text-xs font-medium text-muted-foreground">
                        Role: <span className="text-foreground font-semibold">{q.role}</span>
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Question Content */}
                    <div className="p-4 rounded-xl bg-muted/40 border border-muted text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                      {q.question}
                    </div>

                    {/* Answer / Solution Accordion */}
                    {q.answer && (
                      <div className="pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnswer(q.id)}
                          className="text-xs font-semibold text-primary hover:text-primary/80 p-0 h-auto flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Hide Approach & Solution
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              View Approach & Solution
                            </>
                          )}
                        </Button>

                        {isExpanded && (
                          <div className="mt-3 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm whitespace-pre-wrap leading-relaxed text-foreground animate-in fade-in-50 duration-200">
                            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5" /> Suggested Approach / Answer
                            </div>
                            <div className="text-muted-foreground text-sm font-normal">
                              {q.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col items-center space-y-1">
          <span>© {new Date().getFullYear()} Placement Cell. All rights reserved.</span>
          <span className="text-xs">Curated for RTU Students Campus Placement Preparation</span>
        </div>
      </footer>
    </div>
  );
}
