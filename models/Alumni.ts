import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumni extends Document {
  name: string;
  batch?: string;
  branch?: string;
  company: string;
  designation?: string;
  package?: string;
  linkedin: string;
  email?: string;
  phone: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlumniSchema = new Schema<IAlumni>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    package: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      required: [true, 'Please provide a LinkedIn URL'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);
