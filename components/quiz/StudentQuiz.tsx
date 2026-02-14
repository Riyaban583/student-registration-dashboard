"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getStudentQuiz, submitQuizResponse } from "@/app/actions/events";
import { Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface QuizProps {
  eventName: string;
  studentEmail: string;
}

export default function StudentQuiz({ eventName, studentEmail }: QuizProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number; timeTaken: number }[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNextQuestion(); // Auto-submit when time runs out
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, quizCompleted]);

  async function loadQuiz() {
    setLoading(true);
    const result = await getStudentQuiz(eventName, studentEmail);
    
    if (result.success) {
      setQuestions(result.questions || []);
      setEventId(result.eventId || "");
      setQuestionStartTime(Date.now());
    } else {
      setError(result.message || "Failed to load quiz");
      toast.error(result.message);
    }
    setLoading(false);
  }

  function handleNextQuestion() {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuestion = questions[currentQuestionIndex];

    // Save answer (even if not selected, default to -1)
    const newAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: selectedAnswer !== null ? selectedAnswer : -1,
      timeTaken: timeTaken > 60 ? 60 : timeTaken,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
      setTimeLeft(60);
    } else {
      submitQuiz(updatedAnswers);
    }
  }

  async function submitQuiz(finalAnswers: typeof answers) {
    setLoading(true);
    const result = await submitQuizResponse(eventId, studentEmail, finalAnswers);
    
    if (result.success) {
      setQuizCompleted(true);
      setScore(result.score || 0);
      setTotalQuestions(result.totalQuestions || 0);
      toast.success("Quiz submitted successfully!");
    } else {
      toast.error(result.message || "Failed to submit quiz");
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-lg">Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
          <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-blue-600">
            {score}/{totalQuestions}
          </div>
          <p className="text-xl text-slate-600">
            You scored {score} out of {totalQuestions} questions correctly!
          </p>
          <div className="pt-4">
            <Progress value={(score! / totalQuestions) * 100} className="h-4" />
          </div>
          <p className="text-sm text-slate-500 pt-4">
            Check the leaderboard to see your ranking!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8 text-center">
          <Alert>
            <AlertDescription>No questions available for this quiz.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`} />
              <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Q{currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => setSelectedAnswer(parseInt(val))}>
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAnswer === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
                onClick={() => setSelectedAnswer(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                  <span className="font-bold">{String.fromCharCode(65 + index)}.</span> {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-slate-500">
              {selectedAnswer !== null ? "Answer selected" : "Select an answer to continue"}
            </p>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              size="lg"
              className="min-w-[150px]"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
