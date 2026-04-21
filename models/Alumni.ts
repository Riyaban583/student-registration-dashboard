import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumni extends Document {
  name: string;
  batch: string; // Graduation Year
  branch: string; // Course/Branch
  company: string;
  designation: string;
  package?: string; // Optional package details
  linkedin: string;
  phone: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlumniSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: String, // e.g., '2023'
      required: true,
    },
    branch: {
      type: String, 
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    package: {
      type: String,
    },
    linkedin: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Alumni = mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);

export default Alumni;
