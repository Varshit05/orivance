import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, FolderOpen, Pencil, Trash2, Link2, Code, Quote, UploadCloud, X, AlertTriangle, ArrowLeft, BarChart3 } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
}

interface CaseStudy {
  _id?: string;
  title: string;
  slug: string;
  clientName?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  metrics: Metric[];
  author: string;
  readTime?: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminCaseStudiesProps {
  token: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  handleAuthExpiry: () => void;
}

export default function AdminCaseStudies({ token, showToast, handleAuthExpiry }: AdminCaseStudiesProps) {
  // Tabs within Case Studies: 'list' | 'editor'
  const [caseView, setCaseView] = useState<'list' | 'editor'>('list');

  // Case Studies List State
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [clientName, setClientName] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Legal Ops Excellence');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState('OriVance Expert');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().substring(0, 10));

  // Dynamic Metrics State
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newMetricValue, setNewMetricValue] = useState('');
  const [newMetricLabel, setNewMetricLabel] = useState('');

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

  // Fetch case studies on load
  const fetchCaseStudies = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/admin/case-studies', {
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
        setCaseStudies(data);
      } else {
        showToast('Failed to fetch case studies from server', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
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

  // Metric management
  const handleAddMetric = () => {
    if (!newMetricValue.trim() || !newMetricLabel.trim()) {
      showToast('Please enter both metric value and label', 'error');
      return;
    }
    setMetrics(prev => [...prev, { value: newMetricValue.trim(), label: newMetricLabel.trim() }]);
    setNewMetricValue('');
    setNewMetricLabel('');
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(prev => prev.filter((_, i) => i !== index));
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
      const response = await fetch('/api/admin/case-studies/upload', {
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

  // Submit Handler: Create or Update Case Study
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
      clientName,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      metrics,
      author,
      isPublished,
      publishedAt: new Date(publishedAt).toISOString(),
    };

    try {
      const url = editingId ? `/api/admin/case-studies/${editingId}` : '/api/admin/case-studies';
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
        showToast(editingId ? 'Case study updated!' : 'Case study created!', 'success');
        resetForm();
        fetchCaseStudies();
        setCaseView('list');
      } else {
        const err = await response.json();
        showToast(err.message || 'Action failed', 'error');
      }
    } catch (error) {
      showToast('Network error submitting case study', 'error');
    }
  };

  // Delete Action
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, {
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
        showToast('Case study deleted successfully', 'success');
        setCaseStudies(prev => prev.filter(c => c._id !== id));
        setShowDeleteConfirm(null);
      } else {
        showToast('Failed to delete case study', 'error');
      }
    } catch (error) {
      showToast('Network error deleting case study', 'error');
    }
  };

  // Populate form for Editing
  const startEdit = (caseStudy: CaseStudy) => {
    setEditingId(caseStudy._id || null);
    setTitle(caseStudy.title);
    setSlug(caseStudy.slug);
    setClientName(caseStudy.clientName || '');
    setExcerpt(caseStudy.excerpt || '');
    setContent(caseStudy.content);
    setCoverImage(caseStudy.coverImage || '');
    setCategory(caseStudy.category);
    setTagsInput(caseStudy.tags.join(', '));
    setMetrics(caseStudy.metrics || []);
    setAuthor(caseStudy.author);
    setIsPublished(caseStudy.isPublished);
    setPublishedAt(new Date(caseStudy.publishedAt).toISOString().substring(0, 10));

    // Choose mode based on image
    if (caseStudy.coverImage && caseStudy.coverImage.startsWith('/uploads')) {
      setImageUploadType('upload');
    } else if (caseStudy.coverImage) {
      setImageUploadType('url');
    }

    setCaseView('editor');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setClientName('');
    setExcerpt('');
    // Pre-populate content with a clean structural template for drafting success stories
    setContent('# Business Challenge\n\n[Describe client pain points, workflows, costs before OriVance]\n\n# The Solution\n\n[Describe implementation details and OriVance modules deployed]\n\n# Business Impact\n\n[Detail results: percentage gains, cost reductions, time saved]');
    setCoverImage('');
    setCategory('Legal Ops Excellence');
    setTagsInput('');
    setTags([]);
    setMetrics([]);
    setAuthor('OriVance Expert');
    setIsPublished(false);
    setPublishedAt(new Date().toISOString().substring(0, 10));
    setImageUploadType('upload');
  };

  const cancelEdit = () => {
    resetForm();
    setCaseView('list');
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

  // Search & Filter Case Studies
  const filteredCases = caseStudies.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.clientName && c.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.excerpt && c.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === '' || c.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">

      {/* Active Tab View: List Directory */}
      {caseView === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Case Studies Portfolio</h2>
              <p className="text-sm text-slate-500">Draft, configure, and publish OriVance success stories and metrics.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setCaseView('editor');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-4.5 py-2 text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Case Study
            </button>
          </div>

          {/* Filters Row */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search case studies by title, client name or excerpt..."
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

          {/* Table List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Loading Portfolio...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs text-center px-4">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Case Studies found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {caseStudies.length === 0
                  ? "Build credibility and proof. Post your first client success story."
                  : "No case studies match your current filters."}
              </p>
              {caseStudies.length === 0 && (
                <button
                  onClick={() => {
                    resetForm();
                    setCaseView('editor');
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-500 transition-colors"
                >
                  Create a Case Study
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Title / Client</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Metrics</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Published Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
                    {filteredCases.map((cs) => (
                      <tr key={cs._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-3">
                            {cs.coverImage ? (
                              <img
                                src={cs.coverImage}
                                alt=""
                                className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-indigo-100">
                                {cs.clientName ? cs.clientName.substring(0, 2) : cs.title.substring(0, 2)}
                              </div>
                            )}
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">{cs.title}</p>
                              <p className="text-xs text-slate-500 truncate">
                                Client: <span className="font-semibold text-slate-600">{cs.clientName || 'N/A'}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
                            {cs.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cs.metrics && cs.metrics.length > 0 ? (
                              cs.metrics.map((m, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100" title={m.label}>
                                  {m.value}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs italic">No metrics</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cs.isPublished ? (
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
                          {new Date(cs.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(cs)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-all"
                              title="Edit Case Study"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setShowDeleteConfirm(cs._id || null)}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-all"
                              title="Delete Case Study"
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

      {/* Active Tab View: Editor Panel */}
      {caseView === 'editor' && (
        <div className="space-y-4 animate-fade-in">
          <button
            type="button"
            onClick={cancelEdit}
            className="inline-flex items-center gap-1.5 max-w-fit cursor-pointer rounded-lg border border-slate-200 bg-white 
            text-slate-600 hover:text-slate-800 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Case Studies
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Editor Panel */}
            <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? 'Edit Success Story' : 'Draft Success Story'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Use markdown to structure the business case, challenges, and solutions.</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="cs-title" className="text-sm font-semibold text-slate-700">Case Study Title</label>
                <input
                  id="cs-title"
                  type="text"
                  placeholder="e.g., Accelerating Legal Review at Global Financial Institution"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 
                           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {/* Client & Slug Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Name */}
                <div className="space-y-1.5">
                  <label htmlFor="cs-client" className="text-sm font-semibold text-slate-700">Client / Organization Name</label>
                  <input
                    id="cs-client"
                    type="text"
                    placeholder="e.g., Acme Corp, Major Investment Bank"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 
                             focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="cs-slug" className="text-sm font-semibold text-slate-700">URL Slug</label>
                    <button
                      type="button"
                      onClick={() => setSlug(generateSlug(title))}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      Reset Slug
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[10px] sm:text-xs text-slate-400 border-r border-slate-200 pr-2 bg-slate-100 rounded-l-lg select-none">
                      /case-studies/
                    </span>
                    <input
                      id="cs-slug"
                      type="text"
                      placeholder="client-success-story"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      required
                      className="w-full pl-28 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Metrics Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Tangible Proof Metrics (KPIs)
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Attach measurable gains, e.g. Cost Savings: "40%" or Time Saved: "15 Days".</p>

                {/* Add Metric Form */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. 40%, 15 Days, 10x)"
                      value={newMetricValue}
                      onChange={(e) => setNewMetricValue(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Label (e.g. Cost Savings, Review Speedup)"
                      value={newMetricLabel}
                      onChange={(e) => setNewMetricLabel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMetric}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors border border-transparent shadow-sm flex items-center justify-center"
                  >
                    Add Metric
                  </button>
                </div>

                {/* Metrics Badges List */}
                {metrics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                    {metrics.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/40 text-slate-700">
                        <div className="truncate pr-2">
                          <span className="block text-indigo-700 font-extrabold text-sm">{m.value}</span>
                          <span className="block text-[10px] text-slate-500 font-medium truncate" title={m.label}>{m.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMetric(idx)}
                          className="p-1 hover:bg-indigo-100 text-indigo-400 hover:text-indigo-700 rounded-md transition-colors"
                          title="Remove metric"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No metrics added yet. Add one to show highlights.</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="cs-excerpt" className="text-sm font-semibold text-slate-700">Short Excerpt / Portfolio Hook</label>
                  <span className="text-xs text-slate-400">{excerpt.length}/200 chars recommended</span>
                </div>
                <textarea
                  id="cs-excerpt"
                  placeholder="Provide a brief introductory hook for the case study list page..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  maxLength={300}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                />
              </div>

              {/* Content Markdown Area & Preview */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="cs-content" className="text-sm font-semibold text-slate-700">Full Success Story (Markdown)</label>

                  {/* Toolbar */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <textarea
                      id="cs-content"
                      ref={contentRef}
                      placeholder="Write success story using markdown..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={16}
                      required
                      className="w-full h-full min-h-[400px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors font-mono"
                    />
                  </div>

                  {/* Markdown Preview */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 overflow-y-auto max-h-[550px]">
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-200 pb-2 mb-3">Live Story Preview</div>
                    {content ? (
                      <div
                        className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                      />
                    ) : (
                      <p className="text-slate-400 text-sm italic">Type markdown in the left pane to preview layout here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              {/* Publication Settings */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Publication settings</h3>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Publish Case Study</p>
                    <p className="text-xs text-slate-400">{isPublished ? 'Visible in portfolio' : 'Saved as draft'}</p>
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

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="cs-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    id="cs-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Regulatory Compliance">Regulatory Compliance</option>
                    <option value="Business Acceleration">Business Acceleration</option>
                    <option value="Contract Lifecycle">Contract Lifecycle</option>
                    <option value="Knowledge Intelligence">Knowledge Intelligence</option>
                    <option value="Legal Ops Excellence">Legal Ops Excellence</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Author Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="cs-author" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Author / Publisher</label>
                  <input
                    id="cs-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Publish Date */}
                <div className="space-y-1.5">
                  <label htmlFor="cs-publishedAt" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Publication Date</label>
                  <input
                    id="cs-publishedAt"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image Settings */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Cover image</h3>

                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageUploadType('upload')}
                    className={`flex-1 py-1 px-2.5 rounded-md font-semibold text-center transition-all ${imageUploadType === 'upload' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Local File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('url')}
                    className={`flex-1 py-1 px-2.5 rounded-md font-semibold text-center transition-all ${imageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Image URL
                  </button>
                </div>

                {imageUploadType === 'upload' ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full py-6 border-2 border-dashed border-slate-200 hover:border-blue-600/70 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all text-slate-500 group"
                    >
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">
                        {uploadingImage ? 'Uploading to server...' : 'Click to upload cover image'}
                      </span>
                      <span className="text-[10px] text-slate-400">JPEG, PNG, WebP (max 5MB)</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-fade-in">
                    <label htmlFor="cs-cover-url" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image Web Address</label>
                    <input
                      id="cs-cover-url"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                )}

                {coverImage && (
                  <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group animate-fade-in">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
                      title="Clear image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Metadata tags</h3>
                <div className="space-y-1.5">
                  <label htmlFor="cs-tags" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comma Separated Tags</label>
                  <input
                    id="cs-tags"
                    type="text"
                    placeholder="e.g., legal-tech, compliance, efficiency"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-0.5 rounded-md bg-slate-150 text-slate-700 px-2 py-0.5 text-xs font-medium border border-slate-200 capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-sm font-semibold shadow-md transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Case Study'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 py-2.5 text-sm font-semibold transition-colors shadow-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-slate-500 text-sm mt-1">This will permanently remove this case study and all of its metrics from the system.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg shadow-md transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors shadow-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
