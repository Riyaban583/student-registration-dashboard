"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getCurrentQuestion, submitAnswer } from "@/app/actions/events";
import { Clock, CheckCircle, XCircle, Trophy, AlertCircle, Award } from "lucide-react";
import { toast } from "sonner";

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface StudentQuizPollingProps {
  eventName: string;
  studentEmail: string;
}

export default function StudentQuizPolling({ eventName, studentEmail }: StudentQuizPollingProps) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; totalScore: number; totalAnswered: number } | null>(null);
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(true);
  const [showResult, setShowResult] = useState(false); // Control when to show result
  
  // Use ref to track question ID and prevent polling interference
  const questionIdRef = useRef<string | null>(null);
  const pendingResultRef = useRef<{ isCorrect: boolean; totalScore: number; totalAnswered: number } | null>(null);

  // Memoized polling function
  const checkForActiveQuestion = useCallback(async () => {
    // Don't poll if we're showing result
    if (showResult) {
      console.log('Skipping poll - showing result');
      return;
    }

    const res = await getCurrentQuestion(eventName, studentEmail);
    
    if (res.success && res.question) {
      const isNewQuestion = questionIdRef.current !== res.question._id;
      
      if (isNewQuestion) {
        // New question detected - reset everything
        questionIdRef.current = res.question._id;
        pendingResultRef.current = null;
        setQuestion(res.question);
        setEventId(res.eventId || "");
        setSelectedAnswer(null);
        setTimeLeft(res.remainingTime || 60);
        setQuestionStartTime(res.activatedAt ? new Date(res.activatedAt).getTime() : Date.now());
        setSubmitted(false);
        setResult(null);
        setShowResult(false);
        setError("");
        setLoading(false);
      }
    } else if (res.message === "No active question at the moment") {
      // Don't clear if we're about to show result
      if (!submitted || !pendingResultRef.current) {
        questionIdRef.current = null;
        setQuestion(null);
        setError("");
        setSubmitted(false);
      }
    } else if (res.message === "Question time has expired") {
      // Don't clear if we're about to show result
      if (!submitted || !pendingResultRef.current) {
        questionIdRef.current = null;
        setQuestion(null);
        setError("");
        setSubmitted(false);
        toast.info("Question time expired");
      }
    } else if (res.message === "You have already answered this question") {
      // Only set submitted if it's the same question
      if (questionIdRef.current === res.questionId) {
        setSubmitted(true);
        setError("You have already answered this question");
      }
    } else {
      setError(res.message || "");
    }
  }, [eventName, studentEmail, showResult, submitted]);

  // Poll every 1 second
  useEffect(() => {
    if (!polling) return;

    checkForActiveQuestion();
    const interval = setInterval(checkForActiveQuestion, 1000);
    return () => clearInterval(interval);
  }, [polling, checkForActiveQuestion]);

  // Timer countdown - independent from polling
  useEffect(() => {
    if (question && !loading && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // When timer ends, show result for everyone
    if (timeLeft === 0 && question && !loading && !showResult) {
      if (!submitted) {
        // Student didn't answer - auto-submit
        handleTimeExpired();
      } else if (submitted && pendingResultRef.current) {
        // Student answered - show the stored result now
        console.log('Timer ended, showing result:', pendingResultRef.current);
        setResult(pendingResultRef.current);
        setShowResult(true);
        
        const resultMessage = pendingResultRef.current.isCorrect 
          ? "✅ Correct Answer! 🎉" 
          : "❌ Incorrect Answer";
        toast.success(resultMessage, { duration: 3000 });
        
        // Reset after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
          setQuestion(null);
          setResult(null);
          setSelectedAnswer(null);
          setShowResult(false);
          setLoading(false);
          questionIdRef.current = null;
          pendingResultRef.current = null;
          checkForActiveQuestion();
        }, 5000);
      }
    }
  }, [question, loading, timeLeft, showResult, submitted]);

  async function handleOptionClick(optionIndex: number) {
    if (submitted || loading || selectedAnswer !== null) return;
    
    setSelectedAnswer(optionIndex);
    setLoading(true);
    
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    if (!question || !eventId) {
      setLoading(false);
      return;
    }
    
    const res = await submitAnswer(
      eventId,
      question._id,
      studentEmail,
      optionIndex,
      timeTaken > 60 ? 60 : timeTaken
    );

    if (res?.success) {
      setSubmitted(true);
      // Store result but don't show it yet - wait for timer to end
      pendingResultRef.current = {
        isCorrect: res.isCorrect || false,
        totalScore: res.totalScore || 0,
        totalAnswered: res.totalAnswered || 0,
      };
      toast.success("Answer locked! Wait for timer to see result...");
      setLoading(false);
    } else {
      toast.error(res?.message || "Failed to submit answer");
      setLoading(false);
      setSelectedAnswer(null);
    }
  }

  async function handleTimeExpired() {
    if (submitted || loading) return;
    
    setLoading(true);
    const timeTaken = 60;
    
    if (!question || !eventId) {
      setLoading(false);
      return;
    }
    
    const res = await submitAnswer(
      eventId,
      question._id,
      studentEmail,
      -1,
      timeTaken
    );

    if (res?.success) {
      setSubmitted(true);
      setResult({
        isCorrect: false,
        totalScore: res.totalScore || 0,
        totalAnswered: res.totalAnswered || 0,
      });
      toast.error("Time's up! No answer submitted");
      
      setTimeout(() => {
        setSubmitted(false);
        setQuestion(null);
        setResult(null);
        setSelectedAnswer(null);
        setLoading(false);
        questionIdRef.current = null;
        checkForActiveQuestion();
      }, 3000);
    } else {
      setLoading(false);
    }
  }

  // Waiting state
  if (!question && !error) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-pulse">
                <AlertCircle className="h-16 w-16 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Waiting for Question</h3>
                <p className="text-base text-slate-700 mt-2">
                  Your instructor will activate a question soon. Stay tuned!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && !question) {
    return (
      <Card className="border-2 border-slate-300 bg-white">
        <CardContent className="p-6 text-center">
          <Alert>
            <AlertDescription className="text-slate-900">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Result state
  if (submitted && result) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-slate-600 font-medium">Your Score</p>
                  <p className="text-3xl font-bold text-slate-900">{result.totalScore}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 font-medium">Answered</p>
                <p className="text-3xl font-bold text-slate-900">{result.totalAnswered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${result.isCorrect ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50'}`}>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {result.isCorrect ? (
                <CheckCircle className="h-20 w-20 text-green-600" />
              ) : (
                <XCircle className="h-20 w-20 text-red-600" />
              )}
              <div>
                <h3 className={`text-3xl font-bold ${result.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {result.isCorrect ? 'Correct Answer! 🎉' : 'Incorrect Answer'}
                </h3>
                <p className="text-base text-slate-700 mt-3">
                  Waiting for next question...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question display
  if (!question) return null;

  const progressPercentage = (timeLeft / 60) * 100;

  return (
    <div className="space-y-4">
      {/* Timer Card - Fixed at top */}
      <div className="sticky top-0 z-50 mb-4">
        <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-bold text-slate-900">Time Remaining</span>
              <div className="flex items-center gap-2">
                <Clock className={`h-6 w-6 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`} />
                <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-4" />
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card className="border-2 border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge className="text-base px-4 py-2 bg-indigo-600 text-white">
              🔴 LIVE
            </Badge>
            <span className="text-slate-900">Question</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`p-5 rounded-xl border-3 transition-all cursor-pointer transform hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? "border-indigo-600 bg-indigo-100 shadow-lg scale-[1.02]"
                    : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50"
                } ${submitted || loading ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    selectedAnswer === index
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg font-medium flex-1 ${
                    selectedAnswer === index ? "text-indigo-900" : "text-slate-900"
                  }`}>
                    {option}
                  </span>
                  {selectedAnswer === index && (
                    <CheckCircle className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-slate-600 font-medium">
              {selectedAnswer !== null 
                ? "✓ Answer submitted! Waiting for result..." 
                : "👆 Click on an option to submit your answer"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
