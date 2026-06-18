import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, FolderOpen, Pencil, Trash2, Link2, Code, Quote, UploadCloud, X, AlertTriangle, ArrowLeft, Pin, ShieldAlert, Award } from 'lucide-react';

interface NewsItem {
  _id?: string;
  title: string;
  content: string;
  category: 'Announcement' | 'Product Update' | 'Company News' | 'Community' | 'General';
  importance: 'Low' | 'Medium' | 'High' | 'Critical';
  isPinned: boolean;
  coverImage?: string;
  author: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminNewsProps {
  token: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  handleAuthExpiry: () => void;
}

export default function AdminNews({ token, showToast, handleAuthExpiry }: AdminNewsProps) {
  // Tabs within News: 'list' | 'editor'
  const [view, setView] = useState<'list' | 'editor'>('list');

  // List State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [importanceFilter, setImportanceFilter] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Announcement' | 'Product Update' | 'Company News' | 'Community' | 'General'>('General');
  const [importance, setImportance] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [isPinned, setIsPinned] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().substring(0, 10));

  // Image Upload States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('upload');

  // Dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch news list
  const fetchNews = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/admin/news', {
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
        setNews(data);
      } else {
        showToast('Failed to fetch news updates from server', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Markdown tool helper
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

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + replacement.length - cursorOffset,
        start + replacement.length - cursorOffset
      );
    }, 50);
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await fetch('/api/admin/blogs/upload', {
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

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (!title.trim() || !content.trim()) {
      showToast('Title and Content are required', 'error');
      return;
    }

    const payload = {
      title,
      content,
      category,
      importance,
      isPinned,
      coverImage: coverImage || undefined,
      publishedAt: new Date(publishedAt).toISOString(),
    };

    try {
      const url = editingId ? `/api/admin/news/${editingId}` : '/api/admin/news';
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
        showToast(editingId ? 'News update updated!' : 'News update published!', 'success');
        resetForm();
        fetchNews();
        setView('list');
      } else {
        const err = await response.json();
        showToast(err.message || 'Action failed', 'error');
      }
    } catch (error) {
      showToast('Network error submitting news update', 'error');
    }
  };

  // Quick toggle pinned state directly from table
  const handleTogglePin = async (item: NewsItem) => {
    if (!token || !item._id) return;
    try {
      const response = await fetch(`/api/admin/news/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPinned: !item.isPinned }),
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        showToast(item.isPinned ? 'Post unpinned.' : 'Post pinned to top.', 'success');
        fetchNews();
      } else {
        showToast('Failed to toggle pin state.', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server.', 'error');
    }
  };

  // Delete action
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
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
        showToast('News update deleted successfully', 'success');
        setNews(prev => prev.filter(n => n._id !== id));
        setShowDeleteConfirm(null);
      } else {
        showToast('Failed to delete news update', 'error');
      }
    } catch (error) {
      showToast('Network error deleting news update', 'error');
    }
  };

  const startEdit = (item: NewsItem) => {
    setEditingId(item._id || null);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setImportance(item.importance);
    setIsPinned(item.isPinned);
    setCoverImage(item.coverImage || '');
    setPublishedAt(new Date(item.publishedAt).toISOString().substring(0, 10));

    if (item.coverImage && item.coverImage.startsWith('/uploads')) {
      setImageUploadType('upload');
    } else if (item.coverImage) {
      setImageUploadType('url');
    }

    setView('editor');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setImportance('Medium');
    setIsPinned(false);
    setCoverImage('');
    setPublishedAt(new Date().toISOString().substring(0, 10));
    setImageUploadType('upload');
  };

  const cancelEdit = () => {
    resetForm();
    setView('list');
  };

  const parseMarkdown = (markdown: string) => {
    if (!markdown) return '';
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#0b1a2e] mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#0b1a2e] mt-5 mb-3 border-b border-slate-200 pb-1">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#0b1a2e] mt-6 mb-4">$1</h1>');

    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-white p-4 rounded-md my-4 overflow-x-auto text-sm font-mono"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="ml-6 list-disc text-slate-600 my-1">$1</li>');

    html = html.replace(/^\>\s+(.*$)/gim, '<blockquote class="border-l-4 border-blue-600 pl-4 italic text-slate-600 my-3">$1</blockquote>');

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

  const filteredNews = news.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesImportance = importanceFilter === '' || item.importance === importanceFilter;

    return matchesSearch && matchesCategory && matchesImportance;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Pinned dialogs */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-150 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">Are you sure you want to permanently delete this news update? This action is irreversible.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Delete Update
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">News & Updates Directory</h2>
              <p className="text-sm text-slate-500">Post announcements, company news, and system updates.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setView('editor');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-4.5 py-2 text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Update
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search updates by title, content or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              >
                <option value="">All Categories</option>
                <option value="Announcement">Announcement</option>
                <option value="Product Update">Product Update</option>
                <option value="Company News">Company News</option>
                <option value="Community">Community</option>
                <option value="General">General</option>
              </select>

              <select
                value={importanceFilter}
                onChange={(e) => setImportanceFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              >
                <option value="">All Importances</option>
                <option value="Low">Low Importance</option>
                <option value="Medium">Medium Importance</option>
                <option value="High">High Importance</option>
                <option value="Critical">Critical Importance</option>
              </select>
            </div>
          </div>

          {/* List Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Loading Updates...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs text-center px-4">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No News updates found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {news.length === 0
                  ? "Get started by posting your very first news update."
                  : "No updates match your current filters."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4 w-12 text-center">Pin</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Importance</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
                    {filteredNews.map((item) => (
                      <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${item.isPinned ? 'bg-amber-50/20' : ''}`}>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleTogglePin(item)}
                            className={`p-1 rounded-md transition-colors ${item.isPinned ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-100/50' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
                            title={item.isPinned ? "Unpin update" : "Pin update to top"}
                          >
                            <Pin className="w-4 h-4 fill-current" />
                          </button>
                        </td>
                        <td className="px-6 py-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-3">
                            {item.coverImage ? (
                              <img
                                src={item.coverImage}
                                alt=""
                                className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                                {item.category.substring(0, 2)}
                              </div>
                            )}
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">{item.title}</p>
                              {item.isPinned && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold uppercase mt-0.5">
                                  Pinned
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.importance === 'Critical' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 border border-red-200">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Critical
                            </span>
                          ) : item.importance === 'High' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                              <Award className="w-3.5 h-3.5" />
                              High
                            </span>
                          ) : item.importance === 'Medium' ? (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
                              Medium
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500 border border-slate-100">
                              Low
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{item.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {new Date(item.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-all"
                              title="Edit Update"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setShowDeleteConfirm(item._id || null)}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-all"
                              title="Delete Update"
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

      {view === 'editor' && (
        <div className="space-y-4 animate-fade-in">
          <button
            type="button"
            onClick={cancelEdit}
            className="inline-flex items-center gap-1.5 max-w-fit cursor-pointer rounded-lg border border-slate-200 bg-white 
            text-slate-600 hover:text-slate-800 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Directory
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Editor panel */}
            <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? 'Edit News Update' : 'Publish News Update'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Use markdown to draft updates and announcements.</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="news-title" className="text-sm font-semibold text-slate-700">Headline Title</label>
                <input
                  id="news-title"
                  type="text"
                  placeholder="Enter headlines or title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 
                           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {/* Content Markdown Editor */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="news-content" className="text-sm font-semibold text-slate-700">Update Content (Markdown Supported)</label>

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
                      id="news-content"
                      ref={contentRef}
                      placeholder="Write news content details..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={14}
                      required
                      className="w-full h-full min-h-[350px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors font-mono"
                    />
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 overflow-y-auto max-h-[500px]">
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-200 pb-2 mb-3">Live Render Typography Preview</div>
                    {content ? (
                      <div
                        className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                      />
                    ) : (
                      <p className="text-slate-400 text-sm italic">Live markdown preview will render here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar controls */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Update settings</h3>

                {/* Pin to Top */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Pin to top</p>
                    <p className="text-xs text-slate-400">Force display at the top of lists</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPinned ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isPinned ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {/* Category Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="news-category" className="text-sm font-semibold text-slate-700">Category</label>
                  <select
                    id="news-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Product Update">Product Update</option>
                    <option value="Company News">Company News</option>
                    <option value="Community">Community</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Importance Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="news-importance" className="text-sm font-semibold text-slate-700">Importance Level</label>
                  <select
                    id="news-importance"
                    value={importance}
                    onChange={(e) => setImportance(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Published Date */}
                <div className="space-y-1.5">
                  <label htmlFor="news-date" className="text-sm font-semibold text-slate-700">Publication Date</label>
                  <input
                    id="news-date"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:outline-none"
                  />
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Cover Media Image</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageUploadType('upload')}
                        className={`text-xs px-2 py-0.5 rounded font-bold ${imageUploadType === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadType('url')}
                        className={`text-xs px-2 py-0.5 rounded font-bold ${imageUploadType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {imageUploadType === 'upload' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50/50 transition-colors relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {coverImage ? (
                        <div className="relative group rounded overflow-hidden max-h-40">
                          <img
                            src={coverImage}
                            alt="Preview"
                            className="w-full object-cover max-h-40 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setCoverImage('')}
                            className="absolute top-2 right-2 bg-slate-900/80 text-white hover:bg-slate-950 p-1 rounded-full shadow transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center py-2 cursor-pointer w-full"
                        >
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                          <span className="text-xs font-semibold text-slate-600">
                            {uploadingImage ? 'Uploading Image...' : 'Click to upload Cover Media'}
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                      {coverImage && (
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-full object-cover max-h-40 rounded border mt-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=240';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-sm font-semibold shadow-sm transition-all"
                  >
                    {editingId ? 'Save Changes' : 'Publish Update'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
