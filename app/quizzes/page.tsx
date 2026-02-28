"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listQuizzes } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export default function QuizCatalogPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadQuizzes = async () => {
    setLoading(true);
    const res = await listQuizzes();
    if (res.success) {
      setQuizzes(res.quizzes || []);
      setFiltered(res.quizzes || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuizzes();
    
    // Auto-reload quizzes when user switches back to this tab
    const handleFocus = () => loadQuizzes();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      quizzes.filter(
        (item) => item.title.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q)
      )
    );
  }, [query, quizzes]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <p className="text-xs text-muted-foreground">Assessments</p>
              <h1 className="text-xl font-bold">Available Quizzes</h1>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">Attempt MCQ tests</p>
            <p className="text-sm text-muted-foreground">Pick a quiz to start a timed assessment and get instant results.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-fit">
            <div className="flex items-center gap-2 w-full sm:w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={loadQuizzes} disabled={loading}>
              {loading ? '...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {quiz.title}
                  <Badge variant="secondary">{quiz.durationMinutes} mins</Badge>
                </CardTitle>
                <CardDescription className="line-clamp-3">{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{quiz.questionCount} questions</span>
                <Link href={`/quizzes/${quiz.id}`}>
                  <Button size="sm">Attempt</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No quizzes found.
              </CardContent>
            </Card>
          )}
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
