import { useState } from 'react';
import { CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminBlogs from './AdminBlogs';
import AdminNews from './AdminNews';
import AdminContacts from './AdminContacts';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminPortal() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState<string>('blogs');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper: Show custom toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLoginSuccess = (newToken: string, username: string) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', username);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    showToast('Logged out successfully.', 'info');
  };

  const handleAuthExpiry = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    showToast('Session expired. Please log in again.', 'error');
  };

  if (!token) {
    return (
      <>
        <AdminLogin onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        {/* Floating Custom Toast Banners */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full font-sans">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in-up transition-all ${toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-slate-900 border-slate-800 text-white'
                }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : toast.type === 'error' ? (
                  <AlertOctagon className="w-5 h-5 text-red-500" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-grow text-xs sm:text-sm font-semibold">{toast.message}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout}>
      {activeTab === 'blogs' && (
        <AdminBlogs token={token} showToast={showToast} handleAuthExpiry={handleAuthExpiry} />
      )}

      {activeTab === 'news' && (
        <AdminNews token={token} showToast={showToast} handleAuthExpiry={handleAuthExpiry} />
      )}

      {activeTab === 'contacts' && (
        <AdminContacts token={token} showToast={showToast} handleAuthExpiry={handleAuthExpiry} />
      )}

      {/* Floating Custom Toast Banners */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full font-sans">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in-up transition-all ${toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-slate-900 border-slate-800 text-white'
              }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : toast.type === 'error' ? (
                <AlertOctagon className="w-5 h-5 text-red-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-grow text-xs sm:text-sm font-semibold">{toast.message}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
