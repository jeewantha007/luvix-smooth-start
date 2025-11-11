import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, Users } from 'lucide-react';

export default function Adminpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [users, setUsers] = useState([
    { id: 1, email: 'user1@example.com', tokens: 1000, responses: 50 },
    { id: 2, email: 'user2@example.com', tokens: 500, responses: 25 },
    { id: 3, email: 'user3@example.com', tokens: 2000, responses: 100 },
  ]);

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

  const handleRegister = () => {
    if (formData.email && formData.password && formData.tokens && formData.responses) {
      const newUser = {
        id: users.length + 1,
        email: formData.email,
        tokens: parseInt(formData.tokens),
        responses: parseInt(formData.responses)
      };
      setUsers([...users, newUser]);
      setFormData({ email: '', password: '', tokens: '', responses: '' });
      alert('User registered successfully!');
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('adminAuthenticated');
    // Redirect to login page
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">
              Luvix Admin Panel
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'register'
                ? 'bg-[#15873f] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <UserPlus size={20} />
            Register User
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-[#15873f] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Users size={20} />
            Existing Users
          </button>
        </div>

        {/* Register User Form */}
        {activeTab === 'register' && (
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Register New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Number of Tokens
                  </label>
                  <input
                    type="number"
                    name="tokens"
                    value={formData.tokens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Number of Responses
                  </label>
                  <input
                    type="number"
                    name="responses"
                    value={formData.responses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15873f] focus:border-transparent transition"
                    placeholder="50"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="w-full py-3 px-4 bg-[#15873f] hover:bg-[#127334] text-white font-semibold rounded-lg transition duration-200 shadow-lg"
              >
                Register User
              </button>
            </div>
          </div>
        )}

        {/* Existing Users List */}
        {activeTab === 'users' && (
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Existing Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-4 text-zinc-300 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-semibold">Tokens</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-semibold">Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800 transition">
                      <td className="py-3 px-4 text-white">{user.id}</td>
                      <td className="py-3 px-4 text-white">{user.email}</td>
                      <td className="py-3 px-4 text-white">{user.tokens}</td>
                      <td className="py-3 px-4 text-white">{user.responses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}