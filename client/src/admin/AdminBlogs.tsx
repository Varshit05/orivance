import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, FolderOpen, Pencil, Trash2, Link2, Code, Quote, UploadCloud, X, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  readTime?: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminBlogsProps {
  token: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  handleAuthExpiry: () => void;
}

export default function AdminBlogs({ token, showToast, handleAuthExpiry }: AdminBlogsProps) {
  // Tabs within Blogs: 'list' | 'editor'
  const [blogView, setBlogView] = useState<'list' | 'editor'>('list');

  // Blog List State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Regulatory Compliance');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState('OriVance Expert');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().substring(0, 10));

  // Image Upload States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('upload');

  // Dialogs and Confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Tags Array when Tags Input changes
  useEffect(() => {
    const parsed = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setTags(parsed);
  }, [tagsInput]);

  // Fetch blogs on load
  const fetchBlogs = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        showToast('Failed to fetch blogs from server', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Helper: auto slugify
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Handle Title Change (auto slug)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  // Estimate Read Time in client
  const getReadTime = (text: string): string => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.ceil(words / wpm) || 1} min read`;
  };

  // Handle Markdown Insertion helpers
  const insertMarkdown = (syntax: 'bold' | 'italic' | 'heading1' | 'heading2' | 'link' | 'code' | 'quote') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'heading1':
        replacement = `\n# ${selectedText || 'Heading 1'}\n`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'heading2':
        replacement = `\n## ${selectedText || 'Heading 2'}\n`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link Title'}](https://example.com)`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'code':
        replacement = `\`\`\`\n${selectedText || 'code block'}\n\`\`\``;
        cursorOffset = selectedText ? 0 : 4;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'Blockquote text'}\n`;
        cursorOffset = selectedText ? 0 : 2;
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setContent(newValue);

    // Reset focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + replacement.length - cursorOffset,
        start + replacement.length - cursorOffset
      );
    }, 50);
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await fetch('/api/blogs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCoverImage(data.filePath);
        showToast('Image uploaded successfully!', 'success');
      } else {
        const err = await response.json();
        showToast(err.message || 'Image upload failed', 'error');
      }
    } catch (error) {
      showToast('Error uploading image to server', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler: Create or Update Blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (!title.trim() || !content.trim()) {
      showToast('Title and Content are required', 'error');
      return;
    }

    const payload = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      isPublished,
      publishedAt: new Date(publishedAt).toISOString(),
    };

    try {
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        showToast(editingId ? 'Blog post updated!' : 'Blog post created!', 'success');
        resetForm();
        fetchBlogs();
        setBlogView('list');
      } else {
        const err = await response.json();
        showToast(err.message || 'Action failed', 'error');
      }
    } catch (error) {
      showToast('Network error submitting blog', 'error');
    }
  };

  // Delete Action
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        showToast('Blog post deleted successfully', 'success');
        setBlogs(prev => prev.filter(b => b._id !== id));
        setShowDeleteConfirm(null);
      } else {
        showToast('Failed to delete blog post', 'error');
      }
    } catch (error) {
      showToast('Network error deleting blog', 'error');
    }
  };

  // Populate form for Editing
  const startEdit = (blog: Blog) => {
    setEditingId(blog._id || null);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt || '');
    setContent(blog.content);
    setCoverImage(blog.coverImage || '');
    setCategory(blog.category);
    setTagsInput(blog.tags.join(', '));
    setAuthor(blog.author);
    setIsPublished(blog.isPublished);
    setPublishedAt(new Date(blog.publishedAt).toISOString().substring(0, 10));

    // Choose mode based on image
    if (blog.coverImage && blog.coverImage.startsWith('/uploads')) {
      setImageUploadType('upload');
    } else if (blog.coverImage) {
      setImageUploadType('url');
    }

    setBlogView('editor');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCategory('Regulatory Compliance');
    setTagsInput('');
    setTags([]);
    setAuthor('OriVance Expert');
    setIsPublished(false);
    setPublishedAt(new Date().toISOString().substring(0, 10));
    setImageUploadType('upload');
  };

  const cancelEdit = () => {
    resetForm();
    setBlogView('list');
  };

  // Simple Markdown Parser for Preview
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return '';
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#0b1a2e] mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#0b1a2e] mt-5 mb-3 border-b border-slate-200 pb-1">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#0b1a2e] mt-6 mb-4">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

    // Code block
    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-white p-4 rounded-md my-4 overflow-x-auto text-sm font-mono"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Bullet lists
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="ml-6 list-disc text-slate-600 my-1">$1</li>');

    // Blockquotes
    html = html.replace(/^\>\s+(.*$)/gim, '<blockquote class="border-l-4 border-blue-600 pl-4 italic text-slate-600 my-3">$1</blockquote>');

    // Paragraphs split
    html = html.split('\n\n').map(p => {
      const trimmed = p.trim();
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<blockquote')
      ) {
        return p;
      }
      return `<p class="text-slate-600 leading-relaxed mb-4">${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');

    return html;
  };

  // Search & Filter Blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === '' || b.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">

      {/* Active Tab View: Dashboard */}
      {blogView === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter, Search and Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Blogs Directory</h2>
              <p className="text-sm text-slate-500">Search and manage existing publication entries.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setBlogView('editor');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-4.5 py-2 text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Blog
            </button>
          </div>

          {/* Filters & Search Row */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search blogs by title, excerpt or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              >
                <option value="">All Categories</option>
                <option value="Regulatory Compliance">Regulatory Compliance</option>
                <option value="Business Acceleration">Business Acceleration</option>
                <option value="Contract Lifecycle">Contract Lifecycle</option>
                <option value="Knowledge Intelligence">Knowledge Intelligence</option>
                <option value="Legal Ops Excellence">Legal Ops Excellence</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Loading Blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs text-center px-4">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Blogs found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {blogs.length === 0
                  ? "Get started by creating your very first blog post."
                  : "No blogs match your current search and filter settings."}
              </p>
              {blogs.length === 0 && (
                <button
                  onClick={() => {
                    resetForm();
                    setBlogView('editor');
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-500 transition-colors"
                >
                  Create a Blog Post
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Blog</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
                    {filteredBlogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-3">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                alt=""
                                className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=120';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                                {blog.title.substring(0, 2)}
                              </div>
                            )}
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">{blog.title}</p>
                              <p className="text-xs text-slate-500 truncate">{blog.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{blog.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {blog.isPublished ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(blog)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-all"
                              title="Edit Post"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setShowDeleteConfirm(blog._id || null)}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-all"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Tab View: Editor (Form) */}
      {blogView === 'editor' && (
        <div className="space-y-4 animate-fade-in">
          <button
            type="button"
            onClick={cancelEdit}
            className="inline-flex items-center gap-1.5 max-w-fit cursor-pointer rounded-lg border border-slate-200 bg-white 
            text-slate-600 hover:text-slate-800 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Blogs
          </button>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Editor panel */}
            <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? 'Edit Blog' : 'Create Blog'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Use markdown to structure your blog content.</p>
                </div>
                <div className="flex items-center gap-3">

                  <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {content ? getReadTime(content) : '0 min read'} ({content.trim().split(/\s+/).filter(Boolean).length} words)
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="blog-title" className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  id="blog-title"
                  type="text"
                  placeholder="Enter article title..."
                  value={title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 
                           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="blog-slug" className="text-sm font-semibold text-slate-700">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setSlug(generateSlug(title))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    Reset Slug
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-slate-400 border-r border-slate-200 pr-2 bg-slate-100 rounded-l-lg select-none">
                    /blog/
                  </span>
                  <input
                    id="blog-slug"
                    type="text"
                    placeholder="url-friendly-slug"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    required
                    className="w-full pl-18 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="blog-excerpt" className="text-sm font-semibold text-slate-700">Short Excerpt</label>
                  <span className="text-xs text-slate-400">{excerpt.length}/200 chars recommended</span>
                </div>
                <textarea
                  id="blog-excerpt"
                  placeholder="Provide a brief introductory summary..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  maxLength={300}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                />
              </div>

              {/* Markdown Editor & Preview */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="blog-content" className="text-sm font-semibold text-slate-700">Article Content (Markdown Supported)</label>

                  {/* Markdown toolbar */}
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('bold')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs font-bold w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('italic')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs italic w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('heading1')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('heading2')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('link')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Link"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('code')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Code Block"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('quote')}
                      className="p-1 text-slate-700 hover:bg-white rounded text-xs w-6 h-6 flex items-center justify-center border border-transparent hover:border-slate-200 transition-all"
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <textarea
                      id="blog-content"
                      ref={contentRef}
                      placeholder="Write article content using markdown format..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={14}
                      required
                      className="w-full h-full min-h-[350px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors font-mono"
                    />
                  </div>

                  {/* Live Preview Render */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 overflow-y-auto max-h-[500px]">
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-200 pb-2 mb-3">Live Render Typography Preview</div>
                    {content ? (
                      <div
                        className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                      />
                    ) : (
                      <p className="text-slate-400 text-sm italic">Live markdown parsed preview will render here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar controls */}
            <div className="space-y-6">
              {/* Meta Controls panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Publication settings</h3>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Publish to blog</p>
                    <p className="text-xs text-slate-400">{isPublished ? 'Visible on main site' : 'Private draft'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isPublished ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {/* Publish Date */}
                <div className="space-y-1.5">
                  <label htmlFor="pub-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Publish Date</label>
                  <input
                    id="pub-date"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label htmlFor="blog-author" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Author Name</label>
                  <input
                    id="blog-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="blog-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    id="blog-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Regulatory Compliance">Regulatory Compliance</option>
                    <option value="Business Acceleration">Business Acceleration</option>
                    <option value="Contract Lifecycle">Contract Lifecycle</option>
                    <option value="Knowledge Intelligence">Knowledge Intelligence</option>
                    <option value="Legal Ops Excellence">Legal Ops Excellence</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label htmlFor="blog-tags" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags (comma-separated)</label>
                  <input
                    id="blog-tags"
                    type="text"
                    placeholder="e.g. compliance, risk, ai, audit"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Media panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800">Cover Media</h3>
                  <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('upload')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${imageUploadType === 'upload' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${imageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {imageUploadType === 'upload' ? (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-blue-600 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all duration-200 group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {uploadingImage ? (
                        <div className="flex flex-col items-center py-2">
                          <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-2" />
                          <p className="text-xs text-slate-500 font-medium">Uploading image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors mb-2" />
                          <p className="text-xs font-semibold text-slate-700">Click to upload file</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="cover-url" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image URL</label>
                    <input
                      id="cover-url"
                      type="url"
                      placeholder="Paste URL link here..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                )}

                {coverImage && (
                  <div className="relative border border-slate-200 rounded-lg overflow-hidden group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-32 object-cover bg-slate-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=320';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate text-center font-mono">
                      {coverImage}
                    </div>
                  </div>
                )}
              </div>

              {/* Submissions Action Panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all"
                >
                  {editingId ? 'Update Post' : 'Publish Blog'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-500 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-lg p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-full text-red-600 shrink-0 border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Blog</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Are you sure you want to permanently delete this blog post? This action will remove the post from the MongoDB database immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Keep Blog
              </button>
              <button
                type="button"
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
