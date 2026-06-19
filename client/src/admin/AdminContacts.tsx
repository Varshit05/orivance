import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  Archive,
  RefreshCw,
  Inbox,
  User,
  Building,
  Calendar,
  ExternalLink,
  CheckCircle,
  X,
  MessageSquare,
  Copy,
} from 'lucide-react';

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface AdminContactsProps {
  token: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  handleAuthExpiry: () => void;
}

export default function AdminContacts({ token, showToast, handleAuthExpiry }: AdminContactsProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Fetch all contact submissions
  const fetchContacts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        showToast('Failed to fetch contact messages', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Update status handler
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied' | 'archived') => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        const updated = await response.json();
        setContacts((prev) => prev.map((c) => (c._id === id ? updated : c)));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(updated);
        }
        showToast(`Status updated to ${newStatus}`, 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (error) {
      showToast('Error communicating with server', 'error');
    }
  };

  // Delete message handler
  const handleDeleteContact = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleAuthExpiry();
        return;
      }

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(null);
        }
        setShowDeleteConfirm(null);
        showToast('Contact message deleted successfully', 'success');
      } else {
        showToast('Failed to delete message', 'error');
      }
    } catch (error) {
      showToast('Error communicating with server', 'error');
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: ContactSubmission['status']) => {
    const configs = {
      unread: 'bg-blue-50 border-blue-100 text-blue-700',
      read: 'bg-slate-100 border-slate-200 text-slate-700',
      replied: 'bg-emerald-50 border-emerald-100 text-emerald-700',
      archived: 'bg-amber-50 border-amber-100 text-amber-700',
    };
    const labels = {
      unread: 'Unread',
      read: 'Read',
      replied: 'Replied',
      archived: 'Archived',
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${configs[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Stats calculation
  const totalCount = contacts.length;
  const unreadCount = contacts.filter((c) => c.status === 'unread').length;
  const readCount = contacts.filter((c) => c.status === 'read').length;
  const repliedCount = contacts.filter((c) => c.status === 'replied').length;
  const archivedCount = contacts.filter((c) => c.status === 'archived').length;

  // Filter and Search Contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contact Responses</h2>
          <p className="text-sm text-slate-500">View and respond to customer form submissions.</p>
        </div>
        <button
          onClick={fetchContacts}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inbox</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs bg-blue-50/20">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Unread</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Read</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{readCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs bg-emerald-50/20">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Replied</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{repliedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs bg-amber-50/20 col-span-2 md:col-span-1">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Archived</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{archivedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/55">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, company or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-200 overflow-x-auto text-sm font-medium text-slate-500">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((tab) => {
            const counts = {
              all: totalCount,
              unread: unreadCount,
              read: readCount,
              replied: repliedCount,
              archived: archivedCount,
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-4 border-b-2 font-semibold capitalize whitespace-nowrap transition-colors outline-none ${
                  activeFilter === tab
                    ? 'border-blue-600 text-blue-600 bg-slate-50/20'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                {tab}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  activeFilter === tab ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content list / Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm font-semibold">Loading messages...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No responses found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              {contacts.length === 0
                ? "No submissions have been recorded through the contact page form yet."
                : "No contact submissions match your current search and status filter settings."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (contact.status === 'unread') {
                        handleUpdateStatus(contact._id, 'read');
                      }
                    }}
                    className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                      contact.status === 'unread' ? 'bg-blue-50/15 font-semibold text-slate-900' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[180px]">
                        <span className="truncate font-bold text-slate-800">{contact.name}</span>
                        <span className="text-xs text-slate-400 truncate">{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{contact.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate max-w-xs md:max-w-md text-slate-500 font-normal">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(contact.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold"
                      onClick={(e) => e.stopPropagation()} // Prevent triggering row click modal
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {contact.status === 'unread' ? (
                          <button
                            onClick={() => handleUpdateStatus(contact._id, 'read')}
                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as Read"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(contact._id, 'unread')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Mark as Unread"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}

                        {contact.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateStatus(contact._id, 'archived')}
                            className="p-1.5 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Archive message"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setShowDeleteConfirm(contact._id)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete message"
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
        )}
      </div>

      {/* Selected Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-ov-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Response Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted via website contact form</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 flex-1">
              {/* Meta information grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-xl border border-slate-200/60">
                <div className="flex items-start gap-3">
                  <User className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sender Name</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedContact.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedContact.company}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2 border-t border-slate-200/50 pt-3 mt-1">
                  <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-800">{selectedContact.email}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedContact.email);
                            showToast('Email copied to clipboard', 'success');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {selectedContact.status !== 'replied' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedContact._id, 'replied');
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedContact.email)}&su=${encodeURIComponent('Re: OriVance Contact Inquiry')}`;
                          window.open(gmailUrl, '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors w-fit shrink-0 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Send Reply
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2 border-t border-slate-200/50 pt-3">
                  <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received Date</p>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {new Date(selectedContact.createdAt).toLocaleString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message content */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Message Content</label>
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-5 leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {selectedContact.message}
                </div>
              </div>

              {/* Status Section */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status:</span>
                  {renderStatusBadge(selectedContact.status)}
                </div>
                <div className="flex items-center gap-2">
                  {selectedContact.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'replied')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Replied
                    </button>
                  )}
                  {selectedContact.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'archived')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => setShowDeleteConfirm(selectedContact._id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Submission
              </button>

              <div className="flex items-center gap-2">
                {selectedContact.status === 'unread' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedContact._id, 'read')}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedContact._id, 'unread')}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Mark as Unread
                  </button>
                )}
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-ov-lg space-y-4 animate-fade-in-up">
            <h4 className="font-bold text-slate-900 text-base">Delete Submission?</h4>
            <p className="text-sm text-slate-500">
              Are you sure you want to permanently delete this contact form submission? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteContact(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
