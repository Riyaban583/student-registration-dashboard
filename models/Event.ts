import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
}

export interface IQuizResponse {
  studentId: Types.ObjectId;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  answers: {
    questionId: Types.ObjectId;
    selectedAnswer: number;
    isCorrect: boolean;
    timeTaken: number; // in seconds
  }[];
  totalScore: number;
  totalTimeTaken: number; // in seconds
  completedAt: Date;
}

export interface IEvent extends Document {
  eventName: string;
  eventDate: string;
  eventRegistrations: Types.ObjectId[]; // Array of Student ObjectIds
  attendance: {
    name: string;
    email: string;
    rollNo: string;
    present: boolean;
  }[];
  questions: IQuestion[]; // MCQ questions for the event
  quizResponses: IQuizResponse[]; // Student quiz responses
  quizActive: boolean; // Whether quiz is currently active
  currentQuestionId: Types.ObjectId | null; // Currently active question for students
  questionActivatedAt: Date | null; // When the current question was activated
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length === 4;
      },
      message: 'Must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  }
}, { _id: true });

const QuizResponseSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Students', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  rollNumber: { type: String, required: true },
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true },
      timeTaken: { type: Number, required: true }, // in seconds
    }
  ],
  totalScore: { type: Number, required: true, default: 0 },
  totalTimeTaken: { type: Number, required: true, default: 0 },
  completedAt: { type: Date, default: Date.now },
}, { _id: true });

const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true,
      index: true, // Index for faster queries
    },
    eventDate: {
      type: String,
      required: [true, 'Please provide an event date'],
    },
    eventRegistrations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student'
      },
    ],
    attendance: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        rollNo: { type: String, required: true },
        present: { type: Boolean, default: false },
      },
    ],
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    quizResponses: {
      type: [QuizResponseSchema],
      default: [],
    },
    quizActive: {
      type: Boolean,
      default: false,
    },
    currentQuestionId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    questionActivatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
