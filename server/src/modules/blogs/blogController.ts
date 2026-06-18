import { Request, Response } from 'express';
import { Blog } from './blogModel.js';

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

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { category, isPublished } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = String(category);
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blogs', error: error.message });
  }
};

export const getBlogBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    let blog = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(identifier);
    }

    if (!blog) {
      blog = await Blog.findOne({ slug: identifier.toLowerCase() });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blog post', error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
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
      finalSlug = `post-${Date.now()}`;
    }

    // Ensure slug uniqueness
    const existingBlog = await Blog.findOne({ slug: finalSlug });
    if (existingBlog) {
      // Append a unique timestamp/identifier if user didn't specify slug or if custom slug conflicts
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const estimatedReadTime = calculateReadTime(content);

    const newBlog = new Blog({
      title,
      slug: finalSlug,
      excerpt: excerpt || (content.substring(0, 150) + '...'),
      content,
      coverImage,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map(t => t.trim()) : [],
      author: author || 'Admin',
      readTime: estimatedReadTime,
      isPublished: isPublished === true || isPublished === 'true',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
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
      const existingBlog = await Blog.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existingBlog) {
        return res.status(400).json({ message: `The slug '${updateData.slug}' is already in use by another blog post.` });
      }
    } else if (updateData.title) {
      // Don't auto-regenerate slug unless requested, to avoid breaking links.
      // But if the user cleared it or explicitly wants it:
      // For editing, we usually preserve slug unless they edit it. We won't auto-regenerate it here.
    }

    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = String(updateData.tags).split(',').map((t: string) => t.trim());
    }

    if (updateData.publishedAt) {
      updateData.publishedAt = new Date(updateData.publishedAt);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};
