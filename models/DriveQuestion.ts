import mongoose, { Schema, Document } from 'mongoose';

export interface IDriveQuestion extends Document {
  company: string;
  branch: string;
  role: string;
  round: string;
  question: string;
  answer?: string;
  year?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DriveQuestionSchema = new Schema<IDriveQuestion>(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      index: true,
    },
    branch: {
      type: String,
      required: [true, 'Please provide branch'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'General / SDE',
    },
    round: {
      type: String,
      trim: true,
      default: 'Technical Interview',
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Please provide question content'],
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: new Date().getFullYear().toString(),
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

if (mongoose.models.DriveQuestion) {
  delete mongoose.models.DriveQuestion;
}

export default mongoose.models.DriveQuestion || mongoose.model<IDriveQuestion>('DriveQuestion', DriveQuestionSchema);
