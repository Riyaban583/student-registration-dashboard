'use server'
import Event from "@/models/Event";
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Students from '@/models/Students'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import { any } from 'zod';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/email';
import { registrationTemplate } from '@/mail/studentRegistration';
import { AttendanceTemplate } from "@/mail/StudentAttendanceMail";
import { reminderEmailTemplate } from "@/mail/Remind";




export async function createEvent(eventName: string, eventDate: string) {
  try {
    const newEvent = new Event({ eventName, eventDate });
    await newEvent.save();
    console.log("Event created:", newEvent);
    return newEvent;
    
  } catch (error) {
    console.error("Error creating event:", error);

  }
}


export async function getEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    console.log('Event Data with questions:', events.map((e: any) => ({ 
      name: e.eventName, 
      questionCount: e.questions?.length || 0 
    })));
    
    // Convert all ObjectIds to strings for proper serialization
    return events.map((event: any) => {
      const serializedEvent: any = {
        ...event,
        _id: event._id.toString(),
        eventRegistrations: event.eventRegistrations?.map((id: any) => id.toString()) || [],
        attendance: event.attendance?.map((att: any) => ({
          ...att,
          _id: att._id?.toString(),
        })) || [],
      };

      // Serialize questions array if it exists
      if (event.questions && Array.isArray(event.questions)) {
        serializedEvent.questions = event.questions.map((q: any) => ({
          _id: q._id?.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }));
      } else {
        serializedEvent.questions = [];
      }

      return serializedEvent;
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}


export async function deleteEvent(id: string) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      console.error("Event not found:", id);
      return null;
    }
    console.log("Event deleted:", deletedEvent);
    return deletedEvent;
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}



import { toZonedTime, format } from "date-fns-tz";
import { QrCode } from 'lucide-react';
import { yearsToDays } from 'date-fns';
import { eventNames } from "process";

const indiaTimeZone = "Asia/Kolkata"; // IST

export async function markStudentAttendence(userId: string) {
  try {
    await connectToDatabase();
 

    let user = await Students.findOne({
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
    });


    if(!user){
      return { success: false, error: 'User not found' };

    }

    // ✅ Convert today's date to IST (without time)
    const todayIST = format(toZonedTime(new Date(), indiaTimeZone), 'yyyy-MM-dd');

    // ✅ Check if attendance is already marked for today
    const attendanceToday = user.attendance.find((a: any) => {
      const attendanceDateIST = format(
        toZonedTime(new Date(a.date), indiaTimeZone),
        'yyyy-MM-dd'
      );

      return attendanceDateIST === todayIST; // Compare only the date part
    });

    if (attendanceToday) {
      return {
        success: true,
        message: 'Attendance already marked for today',
        user: {
          id: user._id.toString(),
          name: user.name,
          rollNumber: user.rollNumber
        }
      };
    }

    // ✅ Store attendance date in UTC (safe for database)
    user.attendance.push({
      date: new Date().toISOString(),
      present: true
    });

    await user.save();
    const html = AttendanceTemplate(user.name,user.rollNumber,user.eventName)
    const mailResponse = await sendMail({
      to: user.email,
      subject: 'Thanks For Attending the Event',
      html
    });
    revalidatePath('/Student-Attendance');

    return {
      success: true,
      message: 'Attendance marked successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        rollNumber: user.rollNumber
      }
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'Failed to mark attendance' };
  }
}




export async function RemainerStudents(id: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(id);
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    const students = await Students.find({ eventName: event.eventName });
    if (!students || students.length === 0) {
      return { success: false, message: 'No students found for this event' };
    }

    const mailPromises = students.map((student: any) =>
      sendMail({
        to: student.email,
        subject: `Reminder: PTP - ${event.eventName}`,
        html: reminderEmailTemplate(student.name, event.eventName, "PTP - HALL", "3:00 PM"),
      })
    );

    await Promise.all(mailPromises);

    return { success: true, message: 'Reminder emails sent successfully' };
  } catch (error) {
    console.error('Error in RemainerStudents:', error);
    return { success: false, message: 'Something went wrong' };
  }
}

// Add MCQ question to an event
export async function addQuestionToEvent(
  eventId: string,
  question: string,
  options: string[],
  correctAnswer: number
) {
  try {
    await connectToDatabase();

    console.log('Adding question to event ID:', eventId);

    if (options.length !== 4) {
      return { success: false, message: 'Must provide exactly 4 options' };
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return { success: false, message: 'Correct answer must be between 0 and 3' };
    }

    // First check if event exists
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      console.log('Event not found with ID:', eventId);
      return { success: false, message: 'Event not found' };
    }

    console.log('Event found:', existingEvent.eventName);
    console.log('Current questions count:', existingEvent.questions?.length || 0);

    // Use findByIdAndUpdate with $push to add the question
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          questions: {
            question,
            options,
            correctAnswer,
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      console.log('Failed to update event');
      return { success: false, message: 'Failed to update event' };
    }

    console.log('Question added successfully. Total questions:', updatedEvent.questions?.length || 0);

    return { success: true, message: 'Question added successfully' };
  } catch (error: any) {
    console.error('Error adding question:', error);
    console.error('Error details:', error.message);
    return { success: false, message: `Failed to add question: ${error.message}` };
  }
}

// Delete a question from an event
export async function deleteQuestionFromEvent(eventId: string, questionId: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId);
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    event.questions = event.questions.filter(
      (q: any) => q._id.toString() !== questionId
    );

    await event.save();

    return { success: true, message: 'Question deleted successfully' };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, message: 'Failed to delete question' };
  }
}

// Get all questions for an event
export async function getEventQuestions(eventId: string) {
  try {
    await connectToDatabase();

    const event: any = await Event.findById(eventId).lean();
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    // Convert question _ids to strings for serialization
    const questions = (event.questions || []).map((q: any) => ({
      ...q,
      _id: q._id.toString(),
    }));

    return { success: true, questions };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, message: 'Failed to fetch questions' };
  }
}

// Set current active question for students
export async function setActiveQuestion(eventId: string, questionId: string | null) {
  try {
    await connectToDatabase();

    const event = await Event.findByIdAndUpdate(
      eventId,
      { 
        currentQuestionId: questionId,
        quizActive: questionId !== null,
        questionActivatedAt: questionId !== null ? new Date() : null
      },
      { new: true }
    );

    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    return { 
      success: true, 
      message: questionId ? 'Question activated for students' : 'Question deactivated',
      currentQuestionId: event.currentQuestionId?.toString() || null
    };
  } catch (error) {
    console.error('Error setting active question:', error);
    return { success: false, message: 'Failed to set active question' };
  }
}

// Get current active question for student (without correct answer)
export async function getCurrentQuestion(eventName: string, studentEmail: string) {
  try {
    await connectToDatabase();

    const event: any = await Event.findOne({ eventName }).lean();
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    if (!event.quizActive || !event.currentQuestionId) {
      return { success: false, message: 'No active question at the moment' };
    }

    // Check if question has expired (60 seconds)
    if (event.questionActivatedAt) {
      const activatedTime = new Date(event.questionActivatedAt).getTime();
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - activatedTime) / 1000);
      
      if (elapsedSeconds >= 60) {
        // Auto-deactivate expired question
        await Event.findByIdAndUpdate(event._id, {
          currentQuestionId: null,
          quizActive: false,
          questionActivatedAt: null,
        });
        return { success: false, message: 'Question time has expired' };
      }
    }

    // Find the current question
    const currentQuestion = event.questions?.find(
      (q: any) => q._id.toString() === event.currentQuestionId?.toString()
    );

    if (!currentQuestion) {
      return { success: false, message: 'Question not found' };
    }

    // Check if student already answered this question
    const studentResponse = event.quizResponses?.find(
      (r: any) => r.studentEmail === studentEmail
    );

    const alreadyAnswered = studentResponse?.answers?.some(
      (ans: any) => ans.questionId.toString() === event.currentQuestionId?.toString()
    );

    if (alreadyAnswered) {
      return { success: false, message: 'You have already answered this question', questionId: event.currentQuestionId?.toString() };
    }

    // Calculate remaining time
    const activatedTime = event.questionActivatedAt ? new Date(event.questionActivatedAt).getTime() : Date.now();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - activatedTime) / 1000);
    const remainingSeconds = Math.max(0, 60 - elapsedSeconds);

    // Return question without correct answer
    return { 
      success: true, 
      question: {
        _id: currentQuestion._id.toString(),
        question: currentQuestion.question,
        options: currentQuestion.options,
      },
      eventId: event._id.toString(),
      eventName: event.eventName,
      remainingTime: remainingSeconds,
      activatedAt: event.questionActivatedAt
    };
  } catch (error) {
    console.error('Error fetching current question:', error);
    return { success: false, message: 'Failed to fetch question' };
  }
}

// Submit answer for current question
export async function submitAnswer(
  eventId: string,
  questionId: string,
  studentEmail: string,
  selectedAnswer: number,
  timeTaken: number
) {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId);
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    // Get student details
    const student = await Students.findOne({ email: studentEmail });
    if (!student) {
      return { success: false, message: 'Student not found' };
    }

    // Find the question
    const question = event.questions.find((q: any) => q._id.toString() === questionId);
    if (!question) {
      return { success: false, message: 'Question not found' };
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    // Find or create student response
    let studentResponse = event.quizResponses.find(
      (r: any) => r.studentEmail === studentEmail
    );

    if (!studentResponse) {
      // Create new response entry
      event.quizResponses.push({
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        rollNumber: student.rollNumber,
        answers: [{
          questionId,
          selectedAnswer,
          isCorrect,
          timeTaken,
        }],
        totalScore: isCorrect ? 1 : 0,
        totalTimeTaken: timeTaken,
        completedAt: new Date(),
      });
    } else {
      // Check if already answered this question
      const alreadyAnswered = studentResponse.answers.some(
        (ans: any) => ans.questionId.toString() === questionId
      );

      if (alreadyAnswered) {
        return { success: false, message: 'You have already answered this question' };
      }

      // Add answer to existing response
      studentResponse.answers.push({
        questionId,
        selectedAnswer,
        isCorrect,
        timeTaken,
      });

      // Update totals
      if (isCorrect) studentResponse.totalScore++;
      studentResponse.totalTimeTaken += timeTaken;
      studentResponse.completedAt = new Date();
    }

    await event.save();

    return { 
      success: true, 
      message: 'Answer submitted successfully',
      isCorrect,
      totalScore: studentResponse?.totalScore || (isCorrect ? 1 : 0),
      totalAnswered: studentResponse?.answers.length || 1
    };
  } catch (error) {
    console.error('Error submitting answer:', error);
    return { success: false, message: 'Failed to submit answer' };
  }
}

// Get leaderboard for an event - shows ALL registered students
export async function getQuizLeaderboard(eventId: string) {
  try {
    await connectToDatabase();

    const event: any = await Event.findById(eventId).lean();
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    // Get all students registered for this event
    const allStudents = await Students.find({ eventName: event.eventName }).lean();

    // Create a map of student responses for quick lookup
    const responseMap = new Map();
    (event.quizResponses || []).forEach((response: any) => {
      responseMap.set(response.studentEmail, {
        totalScore: response.totalScore,
        totalTimeTaken: response.totalTimeTaken,
        completedAt: response.completedAt,
      });
    });

    // Build leaderboard with ALL students
    const leaderboard = allStudents.map((student: any) => {
      const response = responseMap.get(student.email);
      
      return {
        studentName: student.name,
        rollNumber: student.rollNumber,
        studentEmail: student.email,
        totalScore: response?.totalScore || 0,
        totalTimeTaken: response?.totalTimeTaken || 0,
        completedAt: response?.completedAt || null,
        hasSubmitted: !!response,
      };
    });

    // Sort by score (descending) and then by time (ascending)
    leaderboard.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore; // Higher score first
      }
      if (a.totalScore === 0 && b.totalScore === 0) {
        return 0; // Keep original order for non-participants
      }
      return a.totalTimeTaken - b.totalTimeTaken; // Lower time first
    });

    return { 
      success: true, 
      leaderboard,
      totalQuestions: event.questions?.length || 0,
      totalStudents: allStudents.length,
      participatedStudents: responseMap.size,
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, message: 'Failed to fetch leaderboard' };
  }
}

// Clear quiz leaderboard - delete all quiz responses for an event
export async function clearQuizLeaderboard(eventId: string) {
  try {
    await connectToDatabase();

    const event = await Event.findByIdAndUpdate(
      eventId,
      { 
        $set: { quizResponses: [] } // Clear all quiz responses
      },
      { new: true }
    );

    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    console.log('Quiz leaderboard cleared for event:', event.eventName);

    return { 
      success: true, 
      message: 'Leaderboard cleared successfully. All quiz responses have been deleted.'
    };
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return { success: false, message: 'Failed to clear leaderboard' };
  }
}
