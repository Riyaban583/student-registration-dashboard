"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  createEvent, 
  getEvents, 
  deleteEvent as deleteEventAction,
  RemainerStudents,
  addQuestionToEvent,
  deleteQuestionFromEvent,
  getEventQuestions,
  setActiveQuestion,
  getQuizLeaderboard
} from "@/app/actions/events";
import { Plus, Trash2, HelpCircle, CheckCircle, Play, Pause, Trophy, Eye, EyeOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Attendance {
  name: string;
  email: string;
  rollNo: string;
  present: boolean;
}

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
  attendance: Attendance[];
  questions?: Question[];
}

export default function EventManager() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Question form states
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("0");
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [viewQuestionsEventId, setViewQuestionsEventId] = useState<string>("");
  const [eventQuestions, setEventQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await getEvents();
    if (res) {
      setEvents(res);
    } else {
      toast.error("Failed to fetch events");
    }
    setLoading(false);
  }

  async function createPTPEvent() {
    if (!eventName || !eventDate) {
      toast.error("Please fill in all fields");
      return;
    }
    if (new Date(eventDate) < new Date()) {
      toast.error("Event date cannot be in the past");
      return;
    }

    const res = await createEvent(eventName, eventDate);

    if (res?.ok) {
      toast.success("Event created successfully!");
      setEventName("");
      setEventDate("");
      fetchEvents();
    } else {
      toast.error("Failed to create event");
    }
  }

  async function handleReminderEvent(id: string){
    const res = await RemainerStudents(id)
    if(res?.success){
      toast.success("Student Reminded Successfully")
      fetchEvents()
    }else{
      toast.error("Failed to reminded")
    }
  }

  async function handleDeleteEvent(id: string) {
    const res = await deleteEventAction(id);
    if (res?.ok) {
      toast.success("Event deleted successfully!");
      fetchEvents();
    } else {
      toast.error("Failed to delete event");
    }
  }

  async function handleAddQuestion() {
    if (!questionText || !option1 || !option2 || !option3 || !option4) {
      toast.error("Please fill in all question fields");
      return;
    }

    const options = [option1, option2, option3, option4];
    
    console.log("Adding question to event:", selectedEventId);
    console.log("Question data:", { questionText, options, correctAnswer });
    
    const res = await addQuestionToEvent(
      selectedEventId,
      questionText,
      options,
      parseInt(correctAnswer)
    );

    console.log("Add question response:", res);

    if (res?.success) {
      toast.success("Question added successfully!");
      // Reset form
      setQuestionText("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer("0");
      setShowQuestionDialog(false);
      // Refresh events to show updated question count
      await fetchEvents();
    } else {
      toast.error(res?.message || "Failed to add question");
    }
  }

  async function handleViewQuestions(eventId: string) {
    setViewQuestionsEventId(eventId);
    const res = await getEventQuestions(eventId);
    if (res?.success) {
      setEventQuestions(res.questions || []);
    } else {
      toast.error("Failed to load questions");
    }
  }

  async function handleDeleteQuestion(eventId: string, questionId: string) {
    const res = await deleteQuestionFromEvent(eventId, questionId);
    if (res?.success) {
      toast.success("Question deleted successfully!");
      handleViewQuestions(eventId); // Refresh questions
      fetchEvents();
    } else {
      toast.error("Failed to delete question");
    }
  }

  return (
    <Tabs defaultValue="create" className="w-full mb-10">
      <TabsList className="mb-4">
        <TabsTrigger value="create">New Event</TabsTrigger>
        <TabsTrigger value="list">All Events</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              type="date"
            />
            <Button onClick={createPTPEvent}>Create Event</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="list">
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground">No events found.</p>
            ) : (
              events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{event.eventName}</h3>
                        <p className="text-sm text-muted-foreground">Date: {event.eventDate}</p>
                        <p className="text-sm text-muted-foreground">
                          Questions: {event.questions?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setShowQuestionDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewQuestions(event._id)}
                          >
                            <HelpCircle className="h-4 w-4 mr-2" />
                            View Questions ({event.questions?.length || 0})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Questions for {event.eventName}</DialogTitle>
                            <DialogDescription>
                              Manage MCQ questions for this event
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {eventQuestions.length === 0 ? (
                              <p className="text-center text-muted-foreground py-8">
                                No questions added yet
                              </p>
                            ) : (
                              eventQuestions.map((q, index) => (
                                <Card key={q._id} className="border-2 border-slate-200 bg-white shadow-sm">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                      <h4 className="font-semibold text-base text-slate-900">
                                        Q{index + 1}. {q.question}
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-red-50"
                                        onClick={() => handleDeleteQuestion(event._id, q._id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <div className="space-y-2">
                                      {q.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                            optIndex === q.correctAnswer
                                              ? "bg-green-50 border-green-400 shadow-sm"
                                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                                          }`}
                                        >
                                          {optIndex === q.correctAnswer ? (
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                          ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                                          )}
                                          <span className={`text-sm font-medium ${
                                            optIndex === q.correctAnswer 
                                              ? "text-green-900" 
                                              : "text-slate-700"
                                          }`}>
                                            <span className="font-bold">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    {q.correctAnswer !== undefined && (
                                      <div className="mt-3 pt-3 border-t border-slate-200">
                                        <p className="text-xs text-slate-600">
                                          <span className="font-semibold">Correct Answer:</span> Option {String.fromCharCode(65 + q.correctAnswer)}
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled
                      >
                        Download Attendance
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="hover:bg-red-700 hover:text-white" 
                        onClick={() => handleReminderEvent(event._id)}
                      >
                        Reminder
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* Add Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add MCQ Question</DialogTitle>
            <DialogDescription>
              Create a multiple choice question for this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="Enter your question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <Input
                placeholder="Option A"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
              />
              <Input
                placeholder="Option B"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
              />
              <Input
                placeholder="Option C"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
              />
              <Input
                placeholder="Option D"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
              />
            </div>

            <div>
              <Label>Correct Answer</Label>
              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="opt-a" />
                  <Label htmlFor="opt-a">Option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="opt-b" />
                  <Label htmlFor="opt-b">Option B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="opt-c" />
                  <Label htmlFor="opt-c">Option C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="opt-d" />
                  <Label htmlFor="opt-d">Option D</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestion}>
                Add Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
