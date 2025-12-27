"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuizById, submitQuizAttempt } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock3, CheckCircle2 } from 'lucide-react';

interface QuizQuestion {
  id: string;
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [result, setResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [participant, setParticipant] = useState({ name: '', email: '', rollNumber: '' });
  const [started, setStarted] = useState(false);

  const quizId = useMemo(() => (params?.quizId ? params.quizId.toString() : ''), [params?.quizId]);

  useEffect(() => {
    async function load() {
      if (!quizId) return;
      const res = await getQuizById(quizId);
      if (res.success && res.quiz) {
        setQuiz({
          id: res.quiz.id,
          title: res.quiz.title,
          description: res.quiz.description,
          durationMinutes: res.quiz.durationMinutes,
          questions: res.quiz.questions as QuizQuestion[],
        });
        // Timer starts after credentials are validated and user clicks Start
      } else {
        toast({ variant: 'destructive', title: 'Quiz not found', description: res.error });
        router.push('/quizzes');
      }
      setLoading(false);
    }
    load();
  }, [quizId, router, toast]);

  useEffect(() => {
    if (!started || !timeLeft || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, result]);

  useEffect(() => {
    if (started && timeLeft === 0 && !result) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, started]);

  const validateCredentials = () => {
    const nameOk = participant.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email.trim());
    const rollOk = /^\d{2}\/\d{3}$/.test(participant.rollNumber.trim());
    return { nameOk, emailOk, rollOk };
  };

  const handleStart = () => {
    const { nameOk, emailOk, rollOk } = validateCredentials();
    if (!nameOk || !emailOk || !rollOk) {
      const msgs: string[] = [];
      if (!nameOk) msgs.push('Valid name required');
      if (!emailOk) msgs.push('Valid email required');
      if (!rollOk) msgs.push('Roll number must be like 23/456');
      toast({ variant: 'destructive', title: 'Incomplete credentials', description: msgs.join(' • ') });
      return;
    }
    setStarted(true);
    setTimeLeft((quiz?.durationMinutes || 0) * 60);
    setStartedAt(new Date());
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    const payload = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedIndex: typeof answers[q.id] === 'number' ? answers[q.id] : -1,
    }));

    const res = await submitQuizAttempt({
      quizId: quiz.id,
      answers: payload,
      participant,
      startedAt: startedAt?.toISOString(),
    });

    if (res.success) {
      setResult({
        score: Number((res as any).score ?? 0),
        totalQuestions: Number((res as any).totalQuestions ?? 0),
        percentage: Number((res as any).percentage ?? 0),
      });
      toast({ title: 'Quiz submitted', description: `You scored ${res.score}/${res.totalQuestions}` });
      setShowReview(true);
    } else {
      toast({ variant: 'destructive', title: 'Submit failed', description: res.error });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Timed Assessment</p>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {started && timeLeft !== null && !result && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <Link href="/quizzes">
              <Button variant="ghost" size="sm">Back</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About this quiz</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Duration</Label>
              <p className="font-semibold">{quiz.durationMinutes} minutes</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Questions</Label>
              <p className="font-semibold">{quiz.questions.length}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Your details (required)</Label>
              <div className="grid md:grid-cols-3 gap-2">
                <Input
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) => setParticipant((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  placeholder="Email"
                  value={participant.email}
                  onChange={(e) => setParticipant((p) => ({ ...p, email: e.target.value }))}
                />
                <Input
                  placeholder="Roll No (e.g., 23/456)"
                  value={participant.rollNumber}
                  onChange={(e) => setParticipant((p) => ({ ...p, rollNumber: e.target.value }))}
                />
              </div>
              {!started && !result && (
                <div className="pt-2">
                  <Button onClick={handleStart}>Start Quiz</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {result ? (
          <Card className="border-primary">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Result</CardTitle>
                <CardDescription>Auto-evaluated instantly.</CardDescription>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg font-semibold">
                Score: {result.score}/{result.totalQuestions} ({result.percentage}%)
              </p>
              <Progress value={result.percentage} />
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Button className="w-full sm:w-auto" variant="outline" onClick={() => router.push('/quizzes')}>
                  Choose another quiz
                </Button>
                <Button className="w-full sm:w-auto" onClick={() => window.location.reload()}>Retake</Button>
                <Button className="w-full sm:w-auto" variant="secondary" onClick={() => setShowReview((v) => !v)}>
                  {showReview ? 'Hide Analysis' : 'Show Analysis'}
                </Button>
              </div>
              {showReview && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-semibold">Answers Review</h3>
                  {quiz.questions.map((q, idx) => {
                    const selected = answers[q.id];
                    const correctIndex = q.options.findIndex((o) => o.isCorrect);
                    const isCorrect = typeof selected === 'number' && selected === correctIndex;
                    return (
                      <Card key={q.id} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                        <CardHeader>
                          <CardTitle className="text-sm">{idx + 1}. {q.prompt}</CardTitle>
                          <CardDescription>
                            {isCorrect ? 'Correct' : 'Incorrect'} — Your answer: {typeof selected === 'number' && selected >= 0 ? q.options[selected]?.text : 'No selection'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${opt.isCorrect ? 'bg-green-100 text-green-700' : optIdx === selected ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'}`}
                              >
                                {opt.isCorrect ? 'Correct' : optIdx === selected ? 'Selected' : 'Option'}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ) : started ? (
          <div className="space-y-4">
            {quiz.questions.map((q, index) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-base">{index + 1}. {q.prompt}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[q.id]?.toString() ?? ''}
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: Number(value) }))
                    }
                  >
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value={optIndex.toString()} id={`${q.id}-${optIndex}`} />
                        <Label htmlFor={`${q.id}-${optIndex}`} className="cursor-pointer">
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Quiz
              </Button>
              {started && timeLeft !== null && (
                <p className="text-sm text-muted-foreground">Time left: {formatTime(timeLeft)}</p>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Enter your credentials above and click Start Quiz.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
    
  );
}
