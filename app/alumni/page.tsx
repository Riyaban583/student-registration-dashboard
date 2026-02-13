"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, XCircle, Download, Linkedin, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllAlumni, saveAlumniBulk } from "@/app/actions/alumni";

interface Alumni {
  id: string;
  name: string;
  company: string;
  linkedin: string;
  email: string;
  phone: string;
}

const HEADER_ALIASES: Record<string, keyof Omit<Alumni, "id">> = {
  name: "name",
  fullname: "name",
  "full name": "name",
  company: "company",
  organization: "company",
  linkedin: "linkedin",
  "linkedin url": "linkedin",
  "linkedin profile": "linkedin",
  email: "email",
  "email address": "email",
  phone: "phone",
  "phone number": "phone",
  mobile: "phone",
  "mobile number": "phone",
};

const REQUIRED_FIELDS: Array<keyof Omit<Alumni, "id">> = [
  "name",
  "company",
  "linkedin",
  "email",
  "phone",
];

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function toSafeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function createId(index: number) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `alumni-${Date.now()}-${index}`;
}

function buildSampleCsv() {
  return [
    "name,company,linkedin url,email,phone",
    "Aarav Sharma,Infosys,https://www.linkedin.com/in/aaravsharma,aarav@example.com,9876543210",
    "Isha Mehta,TCS,https://www.linkedin.com/in/ishamehta,isha@example.com,9123456780",
  ].join("\n");
}

export default function AlumniPage() {
  const { toast } = useToast();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllAlumni();
      if (result.success) {
        setAlumni(result.alumni || []);
      } else {
        throw new Error(result.error || "Failed to fetch alumni");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load alumni",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  const companies = useMemo(() => {
    const unique = new Set(
      alumni
        .map((item) => item.company.trim())
        .filter((value) => value.length > 0)
    );
    return ["all", ...Array.from(unique).sort()];
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return alumni.filter((item) => {
      if (companyFilter !== "all" && item.company !== companyFilter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.company.toLowerCase().includes(normalizedQuery) ||
        item.email.toLowerCase().includes(normalizedQuery) ||
        item.phone.toLowerCase().includes(normalizedQuery) ||
        item.linkedin.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [alumni, companyFilter, query]);

  const handleCsvUpload = async (file?: File | null) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please upload a .csv file.",
      });
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        toast({
          variant: "destructive",
          title: "CSV is empty",
          description: "Add header and at least one alumni row.",
        });
        return;
      }

      const headerCells = parseCsvLine(lines[0]).map(normalizeHeader);
      const headerMap = headerCells.map((cell) => HEADER_ALIASES[cell]);

      const missingRequired = REQUIRED_FIELDS.filter(
        (field) => !headerMap.includes(field)
      );

      if (missingRequired.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing columns",
          description: `Required columns: ${missingRequired.join(", ")}.`,
        });
        return;
      }

      const parsed: Alumni[] = [];

      for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i]);
        if (values.every((value) => value.trim().length === 0)) {
          continue;
        }

        const record: Partial<Alumni> = { id: createId(i) };
        values.forEach((value, index) => {
          const key = headerMap[index];
          if (!key) return;
          (record as Alumni)[key] = value.trim();
        });

        const hasAllFields = REQUIRED_FIELDS.every(
          (field) => record[field] && record[field]?.toString().trim().length
        );

        if (hasAllFields) {
          parsed.push(record as Alumni);
        }
      }

      if (parsed.length === 0) {
        toast({
          variant: "destructive",
          title: "No valid alumni found",
          description: "Check that every row has all required fields.",
        });
        return;
      }

      const saveResult = await saveAlumniBulk(
        parsed.map((record) => ({
          name: record.name,
          company: record.company,
          linkedin: record.linkedin,
          email: record.email,
          phone: record.phone,
        }))
      );

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save alumni");
      }

      await loadAlumni();
      setQuery("");
      setCompanyFilter("all");
      toast({
        title: "Upload complete",
        description: `Saved ${parsed.length} alumni to the database.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error?.message || "Unable to read the CSV file.",
      });
    }
  };

  const handleSampleDownload = () => {
    const blob = new Blob([buildSampleCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumni_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Alumni Directory</p>
              <h1 className="text-xl font-bold">Placement Cell</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Alumni Gallery</h2>
            <p className="text-muted-foreground">
              Upload a CSV to save alumni to the database and generate cards instantly.
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(event) => handleCsvUpload(event.target.files?.[0])}
                  className="max-w-sm"
                />
                <Button type="button" variant="outline" onClick={handleSampleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
                <Button type="button" variant="ghost" onClick={() => setAlumni([])} disabled={alumni.length === 0}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear List
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Required columns (case-insensitive): name, company, linkedin url, email, phone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle>Search & Filter</CardTitle>
                <p className="text-sm text-muted-foreground">{filteredAlumni.length} results</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, company, email, phone..."
                    className="pl-9 w-72"
                  />
                </div>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company === "all" ? "All Companies" : company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[65vh] pr-4">
                {loading ? (
                  <div className="py-16 text-center text-muted-foreground">
                    Loading alumni...
                  </div>
                ) : filteredAlumni.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground">
                    Upload a CSV to view alumni cards.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAlumni.map((person) => (
                      <Card key={person.id} className="h-full">
                        <CardHeader className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                              {person.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{person.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{person.company}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                            {person.linkedin ? (
                              <a
                                href={toSafeUrl(person.linkedin)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            ) : (
                              <span className="text-muted-foreground">Not provided</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${person.email}`} className="hover:underline">
                              {person.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${person.phone}`} className="hover:underline">
                              {person.phone}
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          (c) {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
