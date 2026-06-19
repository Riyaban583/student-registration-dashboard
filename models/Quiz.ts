import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuizQuestion {
  _id?: string;
  prompt: string;
  options: IQuizOption[];
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  durationMinutes: number;
  questions: IQuizQuestion[];
  tags: string[];
  published: boolean;
  live: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IQuizOption>(
  {
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuizQuestion>(
  {
    prompt: { type: String, required: true, trim: true },
    options: {
      type: [OptionSchema],
      validate: {
        validator: (opts: IQuizOption[]) => Array.isArray(opts) && opts.length >= 2 && opts.some((o) => o.isCorrect),
        message: 'Each question needs at least two options and one correct answer',
      },
      required: true,
    },
  },
  { timestamps: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, min: 1 },
    questions: { type: [QuestionSchema], default: [] },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    live: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
