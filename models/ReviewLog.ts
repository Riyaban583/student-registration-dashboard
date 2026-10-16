import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewLog extends Document {
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  previous: {
    reviewDomain1?: number | null;
    reviewDomain2?: number | null;
    comment?: string;
    roundOneAttendance?: boolean;
    roundTwoAttendance?: boolean;
    roundOneQualified?: boolean;
    roundTwoQualified?: boolean;
  };
  updated: {
    reviewDomain1?: number | null;
    reviewDomain2?: number | null;
    comment?: string;
    roundOneAttendance?: boolean;
    roundTwoAttendance?: boolean;
    roundOneQualified?: boolean;
    roundTwoQualified?: boolean;
  };
  changes: string[];
  deviceInfo: {
    deviceName?: string;
    deviceId?: string;
    browser?: string;
    os?: string;
    deviceType?: string;
    ip?: string;
    rawUserAgent?: string;
  };
  createdAt: Date;
}

const ReviewLogSchema = new Schema<IReviewLog>(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentRollNumber: {
      type: String,
      required: true,
      index: true,
    },
    previous: {
      type: Schema.Types.Mixed,
      default: {},
    },
    updated: {
      type: Schema.Types.Mixed,
      default: {},
    },
    changes: {
      type: [String],
      default: [],
    },
    deviceInfo: {
      deviceName: { type: String, default: 'Unknown Device' },
      deviceId: { type: String, default: '' },
      browser: { type: String, default: 'Unknown' },
      os: { type: String, default: 'Unknown' },
      deviceType: { type: String, default: 'Desktop' },
      ip: { type: String, default: 'Unknown' },
      rawUserAgent: { type: String, default: '' },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable append-only logs
  }
);

if (mongoose.models.ReviewLog) {
  delete mongoose.models.ReviewLog;
}

export default mongoose.model<IReviewLog>('ReviewLog', ReviewLogSchema);
