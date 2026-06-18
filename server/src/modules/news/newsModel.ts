import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  category: 'Announcement' | 'Product Update' | 'Company News' | 'Community' | 'General';
  importance: 'Low' | 'Medium' | 'High' | 'Critical';
  isPinned: boolean;
  coverImage?: string;
  author: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Announcement', 'Product Update', 'Company News', 'Community', 'General'],
      default: 'General',
    },
    importance: {
      type: String,
      required: [true, 'Importance level is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      default: 'Admin',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const News = mongoose.model<INews>('News', NewsSchema);
