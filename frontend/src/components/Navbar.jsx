import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useQuestionStore from '../store/questionStore';
import useNotificationStore from '../store/notificationStore';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const { user, logout } = useAuthStore();
  const { setSearchQuery } = useQuestionStore();
  const { notifications, unreadCount, getNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  
  // Fetch notifications when user logs in
  React.useEffect(() => {
    if (user) {
      getNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(getNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, getNotifications]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.question) {
      navigate(`/questions/${notification.question._id}`);
    }
    setShowNotifications(false);
  };

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };
  
  const handleSearch = (value) => {
    setSearchValue(value);
    setSearchQuery(value);
    if (value && window.location.pathname !== '/questions') {
      navigate('/questions');
    }
  };

  return (
    <header className="bg-[#1C1C1E] border-b border-[#3A3A3C] px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/src/assets/img/StackIT-LOGO.png" alt="StackIT" className="h-8 md:h-10 w-auto cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4">
          <Link to="/questions" className="text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
            Questions
          </Link>
          <Link to="/tags" className="text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
            Tags
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#2C2C2E] text-white placeholder-[#8E8E93] border border-[#3A3A3C] rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] focus:bg-[#1C1C1E] transition-all duration-200"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Mobile Search Icon and Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {!showMobileSearch && (
            <>
              <button 
                className="text-[#8E8E93] hover:text-white p-2"
                onClick={() => setShowMobileSearch(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                className="text-[#8E8E93] hover:text-white p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-[#2C2C2E] text-white placeholder-[#8E8E93] border border-[#3A3A3C] rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] focus:bg-[#1C1C1E] transition-all duration-200"
                autoFocus
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] hover:text-white"
                onClick={() => {
                  setShowMobileSearch(false)
                  setSearchValue('')
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Auth Section */}
        <div className={`hidden md:flex items-center gap-3 relative`}>
          {isLoggedIn ? (
            <>
              {/* Notifications Bell */}
              <div className="relative">
                <button className="relative bg-transparent border-none text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] p-2 rounded-md transition-all duration-200" onClick={() => setShowNotifications(!showNotifications)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B35] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-4 text-center">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg shadow-2xl w-80 z-50 overflow-hidden">
                    <div className="px-4 py-4 bg-[#2C2C2E] border-b border-[#3A3A3C] flex justify-between items-center">
                      <h4 className="text-white font-semibold m-0">Notifications</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[#007AFF] text-xs hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(notification => (
                        <div 
                          key={notification._id} 
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 border-b border-[#3A3A3C] cursor-pointer hover:bg-[#2C2C2E] transition-colors last:border-b-0 ${
                            !notification.isRead ? 'bg-[#FF6B35]/5 border-l-4 border-l-[#FF6B35]' : ''
                          }`}
                        >
                          <p className="text-white text-sm mb-1 leading-5">{notification.message}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[#8E8E93] text-xs">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="px-4 py-8 text-center text-[#8E8E93]">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="relative">
                <button className="w-9 h-9 rounded-full gradient-orange text-white border-none font-semibold text-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" onClick={toggleUserMenu}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg shadow-2xl min-w-44 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-[#2C2C2E]">
                      <span className="text-white font-semibold text-sm">{user.name}</span>
                      <div className="text-[#8E8E93] text-xs">{user.email}</div>
                    </div>
                    <hr className="border-none h-px bg-[#3A3A3C] m-0" />
                    <button className="w-full px-4 py-3 bg-transparent border-none text-[#8E8E93] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white">Profile</button>
                    <button className="w-full px-4 py-3 bg-transparent border-none text-[#8E8E93] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white">My Questions</button>
                    <button className="w-full px-4 py-3 bg-transparent border-none text-[#8E8E93] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white">My Answers</button>
                    <button className="w-full px-4 py-3 bg-transparent border-none text-[#FF6B35] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-[#FF6B35]/10" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#8E8E93] bg-transparent border border-[#3A3A3C] px-4 py-2 rounded-md font-medium transition-all duration-200 hover:text-white hover:border-[#FF6B35] hover:bg-[#2C2C2E] no-underline inline-block">
                Login
              </Link>
              <Link to="/register" className="gradient-orange text-white border-none px-5 py-2 rounded-md font-semibold transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md no-underline inline-block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#1C1C1E] border-t border-[#3A3A3C] px-4 py-4">
          {/* Mobile Navigation */}
          <nav className="space-y-2">
            <Link to="/questions" className="block text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
              Questions
            </Link>
            <Link to="/tags" className="block text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
              Tags
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="block text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
                Admin Panel
              </Link>
            )}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="block w-full text-left text-[#FF6B35] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] px-3 py-2 rounded-md font-medium transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="block gradient-orange text-white px-4 py-2 rounded-md font-semibold shadow-sm transition-all duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;