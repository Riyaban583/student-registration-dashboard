import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuizAnswer {
  questionId: Types.ObjectId;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface IParticipant {
  name?: string;
  email?: string;
  rollNumber?: string;
}

export interface IQuizAttempt extends Document {
  quiz: Types.ObjectId;
  participant: IParticipant;
  answers: IQuizAnswer[];
  score: number;
  totalQuestions: number;
  startedAt: Date;
  completedAt: Date;
  durationSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    rollNumber: { type: String, trim: true },
  },
  { _id: false }
);

const AnswerSchema = new Schema<IQuizAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    participant: { type: ParticipantSchema, default: {} },
    answers: { type: [AnswerSchema], default: [] },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
    durationSeconds: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
