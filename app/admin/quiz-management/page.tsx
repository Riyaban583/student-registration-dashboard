"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  createQuiz,
  deleteQuiz,
  getQuizAnalytics,
  getQuizById,
  listQuizzes,
  updateQuiz,
  toggleLive,
} from '@/app/actions/quiz';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Trash2, ArrowLeft, BarChart3, Save } from 'lucide-react';

interface OptionState {
  text: string;
  isCorrect: boolean;
}

interface QuestionState {
  id?: string;
  prompt: string;
  options: OptionState[];
}

interface QuizState {
  id?: string;
  title: string;
  description: string;
  durationMinutes: number;
  tags: string;
  questions: QuestionState[];
}

const emptyQuiz: QuizState = {
  title: '',
  description: '',
  durationMinutes: 10,
  tags: '',
  questions: [
    {
      prompt: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
    },
  ],
};

export default function QuizManagementPage() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState<QuizState>(emptyQuiz);
  const [analytics, setAnalytics] = useState<{ attempts: number; avgScore: number; avgPercent: number; rows: any[] } | null>(null);
  const [showUniqueOnly, setShowUniqueOnly] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<'all' | 'unique'>('all');

  const getUniqueRows = (rows: any[]) => {
    const map = new Map<string, any>();
    rows.forEach((row: any) => {
      const key = row.participant?.rollNumber || row.participant?.email || row.id;
      const prev = map.get(key);
      if (!prev || new Date(row.completedAt) > new Date(prev.completedAt)) {
        map.set(key, row);
      }
    });
    return Array.from(map.values());
  };

  const uniqueRows = useMemo(() => (analytics ? getUniqueRows(analytics.rows) : []), [analytics]);
  const displayStats = useMemo(() => {
    const rows = analyticsTab === 'unique' ? uniqueRows : analytics?.rows || [];
    const attempts = analyticsTab === 'unique' ? rows.length : analytics?.attempts || 0;
    const avgScore = rows.length
      ? Number((rows.reduce((sum: number, r: any) => sum + (Number(r.score) || 0), 0) / rows.length).toFixed(2))
      : 0;
    const avgPercent = rows.length
      ? Number((rows.reduce((sum: number, r: any) => sum + (Number(r.percent) || 0), 0) / rows.length).toFixed(1))
      : 0;
    return { attempts, avgScore, avgPercent, rows };
  }, [analyticsTab, uniqueRows, analytics]);

  const isEditing = useMemo(() => Boolean(selectedQuizId), [selectedQuizId]);

  const loadQuizzes = async () => {
    setLoading(true);
    const res = await listQuizzes(true);
    if (res.success) {
      setQuizzes(res.quizzes || []);
      // Auto-select first quiz to show analytics immediately
      if ((res.quizzes || []).length > 0 && !selectedQuizId) {
        const firstId = (res.quizzes || [])[0]?.id;
        setSelectedQuizId(firstId);
        loadQuiz(firstId);
      }
    } else {
      toast({ variant: 'destructive', title: 'Failed to load quizzes', description: res.error });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedQuizId(null);
    setQuizForm({ ...emptyQuiz, questions: [...emptyQuiz.questions.map((q) => ({ ...q, options: q.options.map((o) => ({ ...o })) }))] });
    setAnalytics(null);
  };

  const loadQuiz = async (id: string) => {
    setSelectedQuizId(id);
    const res = await getQuizById(id);
    if (res.success && res.quiz) {
      setQuizForm({
        id: res.quiz.id,
        title: res.quiz.title,
        description: res.quiz.description || '',
        durationMinutes: res.quiz.durationMinutes,
        tags: '',
        questions: res.quiz.questions.map((q: any) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options.map((o: any) => ({ text: o.text, isCorrect: !!o.isCorrect })),
        })),
      });
      loadAnalytics(id);
    }
  };

  const loadAnalytics = async (id: string) => {
    const res = await getQuizAnalytics(id);
    if (res.success) {
      setAnalytics({
        attempts: res.summary?.attempts ?? 0,
        avgScore: res.summary?.avgScore ?? 0,
        avgPercent: res.summary?.avgPercent ?? 0,
        rows: res.attempts || [],
      });
    } else {
      setAnalytics(null);
    }
  };

  const handleDownloadExcel = async () => {
    if (!analytics) return;
    const rowsSource = analyticsTab === 'unique' ? uniqueRows : analytics.rows;

    const exportRows = rowsSource.map((row: any) => ({
      Name: row.participant?.name || '',
      Email: row.participant?.email || '',
      RollNumber: row.participant?.rollNumber || '',
      Score: row.score,
      TotalQuestions: row.totalQuestions,
      Percent: row.percent,
      CompletedAt: new Date(row.completedAt).toLocaleString(),
    }));

    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, analyticsTab === 'unique' ? 'Unique' : 'All');
      const safeTitle = (quizForm.title || 'Quiz').replace(/[^\w\-]+/g, '_');
      XLSX.writeFile(wb, `${safeTitle}_${analyticsTab}_analytics.xlsx`);
      toast({ title: 'Report downloaded' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Download failed', description: e?.message || 'Could not create Excel' });
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const updateQuestion = (index: number, updater: (q: QuestionState) => QuestionState) => {
    setQuizForm((prev) => {
      const copy = { ...prev, questions: [...prev.questions] };
      copy.questions[index] = updater(copy.questions[index]);
      return copy;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      title: quizForm.title,
      description: quizForm.description,
      durationMinutes: Number(quizForm.durationMinutes),
      tags: quizForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      questions: quizForm.questions,
    } as any;

    const res = isEditing
      ? await updateQuiz(selectedQuizId as string, payload)
      : await createQuiz(payload);

    if (res.success) {
      toast({ title: isEditing ? 'Quiz updated' : 'Quiz created' });
      resetForm();
      await loadQuizzes();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.error });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this quiz and its attempts?');
    if (!confirmed) return;
    const res = await deleteQuiz(id);
    if (res.success) {
      toast({ title: 'Quiz deleted' });
      if (selectedQuizId === id) resetForm();
      loadQuizzes();
    } else {
      toast({ variant: 'destructive', title: 'Delete failed', description: res.error });
    }
  };

  const handleToggleLive = async (id: string) => {
    setToggleLoading(id);
    const res = await toggleLive(id);
    if (res.success) {
      toast({ title: res.live ? 'Quiz is now live ✓' : 'Quiz is no longer live' });
      await loadQuizzes();
    } else {
      toast({ variant: 'destructive', title: 'Toggle failed', description: res.error });
    }
    setToggleLoading(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <p className="text-xs text-muted-foreground">Admin</p>
              <h1 className="text-xl font-bold">Quiz Management</h1>
              {selectedQuizId && quizForm.title && (
                <p className="text-sm text-primary font-semibold mt-1">Editing: {quizForm.title}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/scanner">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/quizzes">
              <Button variant="outline" size="sm">View Quizzes</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="self-start">
          <CardHeader className="space-y-1">
            <CardTitle>{isEditing ? 'Edit Quiz' : 'Create Quiz'}</CardTitle>
            <CardDescription>Build question banks and control availability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={quizForm.title}
                onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Aptitude Mock 1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quizForm.description}
                onChange={(e) => setQuizForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What this test covers"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={quizForm.durationMinutes}
                  onChange={(e) => setQuizForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={quizForm.tags}
                  onChange={(e) => setQuizForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="aptitude, reasoning"
                />
              </div>
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Questions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setQuizForm((prev) => ({
                    ...prev,
                    questions: [
                      ...prev.questions,
                      {
                        prompt: '',
                        options: [
                          { text: '', isCorrect: true },
                          { text: '', isCorrect: false },
                        ],
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {quizForm.questions.map((question, qIndex) => (
                <Card key={qIndex} className="border-dashed">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="flex-1 mr-3">
                      <Label>Question {qIndex + 1}</Label>
                      <Textarea
                        value={question.prompt}
                        onChange={(e) => updateQuestion(qIndex, (q) => ({ ...q, prompt: e.target.value }))}
                        placeholder="Enter question text"
                        className="mt-2"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setQuizForm((prev) => ({
                          ...prev,
                          questions: prev.questions.filter((_, idx) => idx !== qIndex),
                        }))
                      }
                      disabled={quizForm.questions.length === 1}
                      title="Remove question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          className="h-4 w-4"
                          checked={option.isCorrect}
                          onChange={() =>
                            updateQuestion(qIndex, (q) => ({
                              ...q,
                              options: q.options.map((opt, idx) => ({ ...opt, isCorrect: idx === oIndex })),
                            }))
                          }
                          aria-label="Mark option as correct"
                          title="Mark option as correct"
                        />
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            updateQuestion(qIndex, (q) => ({
                              ...q,
                              options: q.options.map((opt, idx) =>
                                idx === oIndex ? { ...opt, text: e.target.value } : opt
                              ),
                            }))
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className={option.isCorrect ? 'border-green-500 ' : ''}
                        />
                        {option.isCorrect && (
                          <Badge className="bg-green-600 text-white">Correct</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuestion(qIndex, (q) => ({
                              ...q,
                              options: q.options.filter((_, idx) => idx !== oIndex),
                            }))
                          }
                          disabled={question.options.length <= 2}
                          title="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuestion(qIndex, (q) => ({
                          ...q,
                          options: [...q.options, { text: '', isCorrect: false }],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} disabled={submitting || loading}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Create Quiz'}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={resetForm} disabled={submitting}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Banks</CardTitle>
              <CardDescription>Published and draft quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading quizzes...</p>
              ) : quizzes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No quizzes yet. Create one to get started.</p>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="border-muted">
                      <CardContent className="py-4 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold leading-none">{quiz.title}</h3>
                            {quiz.live ? (
                              <Badge className="bg-green-600">Live</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
                          <div className="text-xs text-muted-foreground flex gap-3">
                            <span>{quiz.durationMinutes} mins</span>
                            <span>{quiz.questionCount} questions</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleLive(quiz.id)}
                            disabled={toggleLoading === quiz.id}
                          >
                            {toggleLoading === quiz.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {quiz.live ? 'Make Draft' : 'Go Live'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => loadQuiz(quiz.id)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(quiz.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Result Analytics</CardTitle>
                <CardDescription>Recent attempts for the selected quiz.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                {selectedQuizId && analytics && (
                  <Button size="sm" variant="outline" onClick={handleDownloadExcel}>
                    Download Excel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedQuizId && (
                <p className="text-sm text-muted-foreground">Select a quiz to view analytics.</p>
              )}
              {selectedQuizId && analytics && (
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <span>Attempts: {displayStats.attempts}</span>
                    <span>Avg Score: {displayStats.avgScore}</span>
                    <span>Avg %: {displayStats.avgPercent}%</span>
                  </div>
                  <Tabs value={analyticsTab} onValueChange={(v) => setAnalyticsTab((v as 'all' | 'unique'))}>
                    <TabsList>
                      <TabsTrigger value="all">All Attempts</TabsTrigger>
                      <TabsTrigger value="unique">Unique Participants</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      {analytics.rows.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attempts yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Percent</TableHead>
                                <TableHead>Completed</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analytics.rows.slice(0, 25).map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>
                                    <div className="space-y-0.5">
                                      <p className="font-medium">{row.participant?.name || row.participant?.email || 'Anonymous'}</p>
                                      <p className="text-xs text-muted-foreground">{row.participant?.rollNumber}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {row.score}/{row.totalQuestions}
                                  </TableCell>
                                  <TableCell>{row.percent}%</TableCell>
                                  <TableCell>
                                    {new Date(row.completedAt).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="unique">
                      {uniqueRows.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attempts yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Best Score</TableHead>
                                <TableHead>Percent</TableHead>
                                <TableHead>Last Attempt</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uniqueRows.map((row: any) => (
                                <TableRow key={row.id}>
                                  <TableCell>
                                    <div className="space-y-0.5">
                                      <p className="font-medium">{row.participant?.name || row.participant?.email || 'Anonymous'}</p>
                                      <p className="text-xs text-muted-foreground">{row.participant?.rollNumber}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {row.score}/{row.totalQuestions}
                                  </TableCell>
                                  <TableCell>{row.percent}%</TableCell>
                                  <TableCell>
                                    {new Date(row.completedAt).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
