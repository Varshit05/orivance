import { Request, Response } from 'express';
import { CaseStudy } from './caseStudyModel.js';

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

export const getCaseStudies = async (req: Request, res: Response) => {
  try {
    const { category, isPublished } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = String(category);
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const caseStudies = await CaseStudy.find(filter).sort({ createdAt: -1 });
    res.status(200).json(caseStudies);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving case studies', error: error.message });
  }
};

export const getCaseStudyBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    let caseStudy = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      caseStudy = await CaseStudy.findById(identifier);
    }

    if (!caseStudy) {
      caseStudy = await CaseStudy.findOne({ slug: identifier.toLowerCase() });
    }

    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    res.status(200).json(caseStudy);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving case study', error: error.message });
  }
};

export const createCaseStudy = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      clientName,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      metrics,
      author,
      isPublished,
      publishedAt,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required fields.' });
    }

    // Handle slug auto-generation or formatting
    let finalSlug = slug ? slugify(slug) : slugify(title);
    if (!finalSlug) {
      finalSlug = `case-study-${Date.now()}`;
    }

    // Ensure slug uniqueness
    const existingCase = await CaseStudy.findOne({ slug: finalSlug });
    if (existingCase) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const estimatedReadTime = calculateReadTime(content);

    const newCaseStudy = new CaseStudy({
      title,
      slug: finalSlug,
      clientName,
      excerpt: excerpt || (content.substring(0, 150) + '...'),
      content,
      coverImage,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map(t => t.trim()) : [],
      metrics: Array.isArray(metrics) ? metrics : [],
      author: author || 'Admin',
      readTime: estimatedReadTime,
      isPublished: isPublished === true || isPublished === 'true',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    const savedCaseStudy = await newCaseStudy.save();
    res.status(201).json(savedCaseStudy);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating case study', error: error.message });
  }
};

export const updateCaseStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.content) {
      updateData.readTime = calculateReadTime(updateData.content);
      if (!updateData.excerpt) {
        updateData.excerpt = updateData.content.substring(0, 150) + '...';
      }
    }

    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
      const existingCase = await CaseStudy.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existingCase) {
        return res.status(400).json({ message: `The slug '${updateData.slug}' is already in use by another case study.` });
      }
    }

    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = String(updateData.tags).split(',').map((t: string) => t.trim());
    }

    if (updateData.metrics && !Array.isArray(updateData.metrics)) {
      updateData.metrics = [];
    }

    if (updateData.publishedAt) {
      updateData.publishedAt = new Date(updateData.publishedAt);
    }

    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCaseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    res.status(200).json(updatedCaseStudy);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating case study', error: error.message });
  }
};

export const deleteCaseStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCaseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!deletedCaseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    res.status(200).json({ message: 'Case study deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting case study', error: error.message });
  }
};
