import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, Users, FileText, Download, RefreshCw, Mail, Lock, Hash, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import logo from '../components/steps/logo.png';
interface User {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string;
  remaining_tokens: number;
  remaining_responses: number;
}

interface Submission {
  id: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  industry?: string;
  selected_plan?: string;
  success_looks?: string;
  created_at: string;
  signature_date?: string;
}

export default function Adminpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [onboardDialogOpen, setOnboardDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tokens: '',
    responses: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.tokens || !formData.responses) {
      toast.error('Please fill in all fields');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          total_tokens: parseInt(formData.tokens),
          total_responses: parseInt(formData.responses),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ email: '', password: '', tokens: '', responses: '' });
        toast.success('User registered successfully!');
        if (activeTab === 'users') {
          fetchUsers();
        }
      } else {
        toast.error(`Registration failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      toast.error('Failed to register user. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions || []);
      } else {
        setError(data.error || 'Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setSubmissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab, fetchUsers, fetchSubmissions]);

  const handleExportSubmission = async (submissionId: string, businessName: string) => {
    try {
      toast.loading('Exporting document...', { id: 'export' });
      const response = await fetch(`/api/submissions/${submissionId}/export`);
      
      if (!response.ok) {
        throw new Error('Failed to export submission');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${businessName.replace(/\s+/g, "_")}_Onboarding_Form.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document exported successfully!', { id: 'export' });
    } catch (err) {
      console.error('Error exporting submission:', err);
      toast.error('Failed to export submission. Please try again.', { id: 'export' });
    }
  };

  // Handle mark as onboarded - open dialog
  const handleMarkAsOnboarded = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setOnboardDialogOpen(true);
  };

  // Confirm mark as onboarded
  const confirmMarkAsOnboarded = async () => {
    if (!selectedSubmissionId) return;

    try {
      toast.loading('Marking as onboarded...', { id: 'onboard' });
      const response = await fetch(`/api/submissions/${selectedSubmissionId}/onboard`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the submissions list
        fetchSubmissions();
        setOnboardDialogOpen(false);
        setSelectedSubmissionId(null);
        toast.success('Submission marked as onboarded successfully!', { id: 'onboard' });
      } else {
        toast.error(`Failed to mark as onboarded: ${data.error}`, { id: 'onboard' });
      }
    } catch (err) {
      console.error('Error marking submission as onboarded:', err);
      toast.error('Failed to mark submission as onboarded. Please try again.', { id: 'onboard' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Enhanced Navbar */}
      <nav className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#15873f] to-[#0d5a29] rounded-lg flex items-center justify-center shadow-lg">
                <img src={logo} alt="Luvix" className="w-10 h-10" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Luvix Admin Panel
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#15873f] to-[#0d5a29] text-white shadow-[#15873f]/50 scale-105'
                : 'bg-zinc-800/80 backdrop-blur-sm text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200'
            }`}
          >
            <UserPlus size={20} />
            <span>Register User</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-[#15873f] to-[#0d5a29] text-white shadow-[#15873f]/50 scale-105'
                : 'bg-zinc-800/80 backdrop-blur-sm text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200'
            }`}
          >
            <Users size={20} />
            <span>Existing Users</span>
            {users.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {users.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              activeTab === 'submissions'
                ? 'bg-gradient-to-r from-[#15873f] to-[#0d5a29] text-white shadow-[#15873f]/50 scale-105'
                : 'bg-zinc-800/80 backdrop-blur-sm text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200'
            }`}
          >
            <FileText size={20} />
            <span>Submissions</span>
            {submissions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {submissions.length}
              </span>
            )}
          </button>
        </div>

        {/* Register User Form */}
        {activeTab === 'register' && (
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800/50 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Register New User</h2>
              <p className="text-zinc-400">Create a new account with custom token and response limits</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2.5 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition-all duration-200 hover:border-zinc-600"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2.5 flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition-all duration-200 hover:border-zinc-600"
                  placeholder="Enter a secure password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2.5 flex items-center gap-2">
                    <Hash size={16} />
                    Token Allocation
                  </label>
                  <input
                    type="number"
                    name="tokens"
                    value={formData.tokens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition-all duration-200 hover:border-zinc-600"
                    placeholder="e.g., 10000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2.5 flex items-center gap-2">
                    <MessageSquare size={16} />
                    Response Allocation
                  </label>
                  <input
                    type="number"
                    name="responses"
                    value={formData.responses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition-all duration-200 hover:border-zinc-600"
                    placeholder="e.g., 100"
                    min="0"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#15873f] to-[#0d5a29] hover:from-[#127334] hover:to-[#0a4821] text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {registering ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Register User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Existing Users List */}
        {activeTab === 'users' && (
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
                <p className="text-zinc-400">View and manage all registered users</p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#15873f] to-[#0d5a29] hover:from-[#127334] hover:to-[#0a4821] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 backdrop-blur-sm">
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            )}

            {loading && users.length === 0 ? (
              <div className="text-center py-16">
                <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-[#15873f]" />
                <p className="text-zinc-400 text-lg">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16">
                <Users size={48} className="mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400 text-lg">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-800/50">
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Email</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Tokens</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Responses</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Created</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Last Sign In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} className={`border-t border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${index % 2 === 1 ? 'bg-zinc-800/10' : ''}`}>
                        <td className="py-4 px-6 text-white font-medium">{user.email || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                            {user.remaining_tokens ?? 0}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                            {user.remaining_responses ?? 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-zinc-300">
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-zinc-300">
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : <span className="text-zinc-500 italic">Never</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* New Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Form Submissions</h2>
                <p className="text-zinc-400">View and export client onboarding submissions</p>
              </div>
              <button
                onClick={fetchSubmissions}
                disabled={submissionsLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#15873f] to-[#0d5a29] hover:from-[#127334] hover:to-[#0a4821] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw size={18} className={submissionsLoading ? 'animate-spin' : ''} />
                <span>{submissionsLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 backdrop-blur-sm">
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            )}

            {submissionsLoading && submissions.length === 0 ? (
              <div className="text-center py-16">
                <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-[#15873f]" />
                <p className="text-zinc-400 text-lg">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400 text-lg">No submissions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-800/50">
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Contact Name</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Email</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Business</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Contact Phone</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Plan</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Date</th>
                      <th className="text-left py-4 px-6 text-zinc-300 font-bold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <tr key={submission.id} className={`border-t border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${index % 2 === 1 ? 'bg-zinc-800/10' : ''}`}>
                        <td className="py-4 px-6 text-white font-medium">{submission.contact_name || 'N/A'}</td>
                        <td className="py-4 px-6 text-zinc-300">{submission.contact_email || 'N/A'}</td>
                        <td className="py-4 px-6 text-white font-medium">{submission.business_name || 'N/A'}</td>
                        <td className="py-4 px-6 text-zinc-300">{submission.contact_phone || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 bg-[#15873f]/20 text-[#15873f] rounded-full text-sm font-semibold">
                            {submission.selected_plan || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-zinc-300">
                          {submission.created_at 
                            ? new Date(submission.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExportSubmission(submission.id, submission.business_name)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#15873f] to-[#0d5a29] hover:from-[#127334] hover:to-[#0a4821] text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                              title="Export as Word Document"
                            >
                              <Download size={16} />
                              <span>Export</span>
                            </button>
                            <button
                              onClick={() => handleMarkAsOnboarded(submission.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                              title="Mark as Onboarded"
                            >
                              <CheckCircle size={16} />
                              <span>Onboard</span>
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
        )}
      </div>

      {/* Onboard Confirmation Dialog */}
      <AlertDialog open={onboardDialogOpen} onOpenChange={setOnboardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Onboarded?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this submission as onboarded? It will be removed from this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMarkAsOnboarded} className="bg-[#15873f] hover:bg-[#127334]">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}