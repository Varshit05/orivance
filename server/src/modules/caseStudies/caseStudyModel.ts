import mongoose, { Schema, Document } from 'mongoose';

export interface IMetric {
  label: string;
  value: string;
}

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  clientName?: string;
  excerpt?: string;
  content: string; // Markdown content
  coverImage?: string;
  category?: string;
  tags: string[];
  metrics: IMetric[];
  author?: string;
  readTime?: string;
  publishedAt?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MetricSchema = new Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const CaseStudySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    clientName: {
      type: String,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    metrics: {
      type: [MetricSchema],
      default: [],
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    readTime: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CaseStudy = mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);
