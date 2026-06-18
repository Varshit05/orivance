import { Request, Response } from 'express';
import { News } from './newsModel.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

// Get all news (with optional filters)
export const getNews = async (req: Request, res: Response) => {
  try {
    const { category, importance } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = String(category);
    }

    if (importance) {
      filter.importance = String(importance);
    }

    // Sort by isPinned (true first) and then by publishedAt (newest first)
    const newsList = await News.find(filter).sort({ isPinned: -1, publishedAt: -1 });
    res.status(200).json(newsList);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving news updates', error: error.message });
  }
};

// Get single news update by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findById(id);

    if (!newsItem) {
      return res.status(404).json({ message: 'News update not found' });
    }

    res.status(200).json(newsItem);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving news update', error: error.message });
  }
};

// Create a new news update
export const createNews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      content,
      category,
      importance,
      isPinned,
      coverImage,
      publishedAt,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required fields.' });
    }

    const newNews = new News({
      title,
      content,
      category: category || 'General',
      importance: importance || 'Medium',
      isPinned: isPinned === true || isPinned === 'true',
      coverImage,
      author: req.admin?.username || 'Admin',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating news update', error: error.message });
  }
};

// Update an existing news update
export const updateNews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.publishedAt) {
      updateData.publishedAt = new Date(updateData.publishedAt);
    }

    if (updateData.isPinned !== undefined) {
      updateData.isPinned = updateData.isPinned === true || updateData.isPinned === 'true';
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      return res.status(404).json({ message: 'News update not found' });
    }

    res.status(200).json(updatedNews);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating news update', error: error.message });
  }
};

// Delete a news update
export const deleteNews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: 'News update not found' });
    }

    res.status(200).json({ message: 'News update deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting news update', error: error.message });
  }
};
