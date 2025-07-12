import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Trash2, Ban, Shield, AlertTriangle } from 'lucide-react';
import useAdminStore from '../store/adminStore';
import useAuthStore from '../store/authStore';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { users, questions, getAllUsers, getAllQuestions, toggleBanUser, deleteUser, deleteQuestion, deleteAnswer, isLoading, error } = useAdminStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      getAllUsers();
      getAllQuestions();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-[#8E8E93]">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleBanUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to ban/unban ${userName}?`)) {
      const result = await toggleBanUser(userId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleDeleteQuestion = async (questionId, questionTitle) => {
    if (confirm(`Are you sure you want to delete "${questionTitle}"? This will also delete all answers.`)) {
      const result = await deleteQuestion(questionId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (confirm('Are you sure you want to delete this answer?')) {
      const result = await deleteAnswer(answerId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-[#8E8E93]">Manage users, questions, and answers</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'questions'
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Questions ({questions.length})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#1C1C1E] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2C2C2E]">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">Name</th>
                    <th className="text-left p-4 text-white font-semibold">Email</th>
                    <th className="text-left p-4 text-white font-semibold">Role</th>
                    <th className="text-left p-4 text-white font-semibold">Status</th>
                    <th className="text-left p-4 text-white font-semibold">Joined</th>
                    <th className="text-left p-4 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-[#2C2C2E]">
                      <td className="p-4 text-white">{user.name}</td>
                      <td className="p-4 text-[#8E8E93]">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.isBanned 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-[#8E8E93]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {user.role !== 'admin' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBanUser(user._id, user.name)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isBanned
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                              title={user.isBanned ? 'Unban User' : 'Ban User'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id} className="bg-[#1C1C1E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{question.title}</h3>
                    <p className="text-[#8E8E93] text-sm mb-2">
                      By {question.author?.name} • {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag) => (
                        <span key={tag} className="bg-[#2C2C2E] text-[#8E8E93] px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question._id, question.title)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Answers */}
                {question.answers && question.answers.length > 0 && (
                  <div className="border-t border-[#2C2C2E] pt-4">
                    <h4 className="text-white font-medium mb-3">Answers ({question.answers.length})</h4>
                    <div className="space-y-3">
                      {question.answers.map((answer) => (
                        <div key={answer._id} className="bg-[#2C2C2E] rounded-lg p-4 flex justify-between items-start">
                          <div className="flex-1">
                            <div 
                              className="text-[#8E8E93] text-sm mb-2 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: answer.content.substring(0, 200) + '...' }}
                            />
                            <p className="text-xs text-[#8E8E93]">
                              By {answer.author?.name} • {new Date(answer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAnswer(answer._id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors ml-4"
                            title="Delete Answer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-pulse text-[#8E8E93]">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;