"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  getEvents, 
  getEventQuestions,
  setActiveQuestion,
  getQuizLeaderboard,
  clearQuizLeaderboard
} from "@/app/actions/events";
import { Play, Pause, Trophy, Eye, Clock, Award, Trash2 } from "lucide-react";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  questions?: Question[];
  quizActive?: boolean;
  currentQuestionId?: string | null;
}

interface LeaderboardEntry {
  studentName: string;
  rollNumber: string;
  studentEmail: string;
  totalScore: number;
  totalTimeTaken: number;
  hasSubmitted: boolean;
}

export default function QuizManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    fetchEvents();
    
    // Auto-refresh events every 2 seconds for real-time updates
    const interval = setInterval(() => {
      fetchEvents();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh leaderboard when it's open
  useEffect(() => {
    if (showLeaderboard && selectedEvent) {
      const interval = setInterval(() => {
        loadLeaderboard(selectedEvent._id, false); // false = don't show loading state on refresh
      }, 2000); // Refresh every 2 seconds
      
      return () => clearInterval(interval);
    }
  }, [showLeaderboard, selectedEvent]);

  async function fetchEvents() {
    const res = await getEvents();
    if (res) {
      setEvents(res);
    }
  }

  async function loadQuestions(eventId: string) {
    const res = await getEventQuestions(eventId);
    if (res?.success) {
      setQuestions(res.questions || []);
    }
  }

  async function handleActivateQuestion(eventId: string, questionId: string) {
    setLoading(true);
    const res = await setActiveQuestion(eventId, questionId);
    
    if (res?.success) {
      toast.success("Question activated for 60 seconds!");
      setActiveQuestionId(questionId);
      fetchEvents();
      
      // Auto-deactivate after 60 seconds
      setTimeout(async () => {
        await setActiveQuestion(eventId, null);
        setActiveQuestionId(null);
        toast.info("Question time expired - auto-deactivated");
        fetchEvents();
      }, 60000);
    } else {
      toast.error(res?.message || "Failed to activate question");
    }
    setLoading(false);
  }

  async function handleDeactivateQuestion(eventId: string) {
    setLoading(true);
    const res = await setActiveQuestion(eventId, null);
    
    if (res?.success) {
      toast.success("Question deactivated");
      setActiveQuestionId(null);
      fetchEvents();
    } else {
      toast.error(res?.message || "Failed to deactivate question");
    }
    setLoading(false);
  }

  async function loadLeaderboard(eventId: string, showLoadingState = true) {
    if (showLoadingState) {
      setLoading(true);
    }
    
    const res = await getQuizLeaderboard(eventId);
    
    if (res?.success) {
      setLeaderboard(res.leaderboard || []);
      setTotalQuestions(res.totalQuestions || 0);
      setShowLeaderboard(true);
    } else {
      if (showLoadingState) {
        toast.error("Failed to load leaderboard");
      }
    }
    
    if (showLoadingState) {
      setLoading(false);
    }
  }

  async function handleClearLeaderboard(eventId: string) {
    if (!confirm("Are you sure you want to clear the leaderboard? This will delete all quiz responses and cannot be undone.")) {
      return;
    }

    setLoading(true);
    const res = await clearQuizLeaderboard(eventId);
    
    if (res?.success) {
      toast.success("Leaderboard cleared successfully!");
      // Reload leaderboard to show empty state
      await loadLeaderboard(eventId, false);
    } else {
      toast.error(res?.message || "Failed to clear leaderboard");
    }
    setLoading(false);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Quiz Management & Leaderboard
        </CardTitle>
        <CardDescription>
          Activate questions for students and view real-time leaderboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No events available. Create an event first.
          </p>
        ) : (
          events.map((event) => (
            <Card key={event._id} className="border-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{event.eventName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.questions?.length || 0} questions available
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            loadQuestions(event._id);
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Manage Questions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Activate Questions - {event.eventName}</DialogTitle>
                          <DialogDescription>
                            Click on a question to show it to students. Only one question can be active at a time.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                          {questions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No questions added yet
                            </p>
                          ) : (
                            questions.map((q, index) => (
                              <Card 
                                key={q._id} 
                                className={`border-2 cursor-pointer transition-all ${
                                  activeQuestionId === q._id
                                    ? "border-green-500 bg-green-50"
                                    : "border-slate-200 hover:border-blue-300"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm">
                                      Q{index + 1}. {q.question}
                                    </h4>
                                    {activeQuestionId === q._id ? (
                                      <Badge className="bg-green-600">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Active
                                      </Badge>
                                    ) : null}
                                  </div>
                                  <div className="space-y-1 mb-3">
                                    {q.options.map((option, optIndex) => (
                                      <p key={optIndex} className="text-xs text-slate-600">
                                        {String.fromCharCode(65 + optIndex)}. {option}
                                      </p>
                                    ))}
                                  </div>
                                  {activeQuestionId === q._id ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => handleDeactivateQuestion(event._id)}
                                      disabled={loading}
                                    >
                                      <Pause className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="w-full"
                                      onClick={() => handleActivateQuestion(event._id, q._id)}
                                      disabled={loading}
                                    >
                                      <Play className="h-4 w-4 mr-2" />
                                      Activate for Students
                                    </Button>
                                  )}
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showLeaderboard && selectedEvent?._id === event._id} onOpenChange={setShowLeaderboard}>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            loadLeaderboard(event._id);
                          }}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Leaderboard
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col p-0">
                        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg mb-0 flex-shrink-0">
                          <DialogTitle className="flex items-center justify-between text-white text-2xl">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-7 w-7 text-yellow-300" />
                              Leaderboard - {event.eventName}
                            </div>
                            <Badge className="bg-white text-indigo-600 text-lg px-3 py-1">
                              {leaderboard.length} Students
                            </Badge>
                          </DialogTitle>
                          <DialogDescription className="text-white/90 text-base mt-2">
                            Real-time rankings based on score and speed • Scroll to see all students
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto px-6 pb-6 scroll-smooth">
                          {loading ? (
                            <p className="text-center py-8">Loading leaderboard...</p>
                          ) : leaderboard.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No submissions yet
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                  <TableRow className="hover:bg-slate-100 border-b-2 border-slate-300">
                                    <TableHead className="w-16 text-slate-900 font-bold text-sm py-2">Rank</TableHead>
                                    <TableHead className="text-slate-900 font-bold text-sm py-2">Student Name</TableHead>
                                    <TableHead className="text-slate-900 font-bold text-sm py-2">Roll Number</TableHead>
                                    <TableHead className="text-center text-slate-900 font-bold text-sm py-2">Score</TableHead>
                                    <TableHead className="text-center text-slate-900 font-bold text-sm py-2">Time Taken</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {leaderboard.map((entry, index) => (
                                    <TableRow 
                                      key={index} 
                                      className={`hover:bg-slate-100 transition-colors ${index < 3 ? "bg-yellow-50" : "bg-white"}`}
                                    >
                                      <TableCell className="font-bold text-slate-900 text-sm py-3">
                                        {index === 0 && <Award className="h-5 w-5 text-yellow-500 inline mr-1" />}
                                        {index === 1 && <Award className="h-5 w-5 text-slate-400 inline mr-1" />}
                                        {index === 2 && <Award className="h-5 w-5 text-orange-600 inline mr-1" />}
                                        #{index + 1}
                                      </TableCell>
                                      <TableCell className="font-medium text-slate-900 text-sm py-3">{entry.studentName}</TableCell>
                                      <TableCell className="text-slate-900 text-sm py-3">{entry.rollNumber}</TableCell>
                                      <TableCell className="text-center py-3">
                                        <Badge variant="outline" className="font-bold text-slate-900 border-slate-900 text-sm px-2 py-0.5">
                                          {entry.totalScore}/{totalQuestions}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center py-3">
                                        <div className="flex items-center justify-center gap-1 text-slate-900 text-sm">
                                          <Clock className="h-3 w-3 text-slate-900" />
                                          {formatTime(entry.totalTimeTaken)}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleClearLeaderboard(event._id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Leaderboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
