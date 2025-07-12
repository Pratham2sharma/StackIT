import React, { useState } from 'react';
import '../assets/style.css';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo state - replace with actual auth
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Demo user data - replace with actual user data
  const user = {
    name: 'John Doe',
    avatar: 'JD'
  };

  // Demo notifications
  const notifications = [
    { id: 1, text: 'Your question received a new answer', time: '2 min ago', unread: true },
    { id: 2, text: 'Someone mentioned you in a comment', time: '1 hour ago', unread: true },
    { id: 3, text: 'Your answer was accepted', time: '3 hours ago', unread: false }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo and Navigation */}
        <div className="navbar-left">
          <img src="/src/assets/img/stackit-logo.png" alt="StackIT" className="navbar-logo" />
          <nav className="navbar-nav">
            <a href="/" className="nav-link">
              Questions
            </a>
            <a href="/tags" className="nav-link">
              Tags
            </a>
            {isLoggedIn && (
              <a href="/ask" className="nav-link btn-ask">
                Ask Question
              </a>
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <>
              {/* Notifications Bell */}
              <div className="notifications-menu">
                <button className="notifications-bell" onClick={() => setShowNotifications(!showNotifications)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h4>Notifications</h4>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                          <p className="notification-text">{notification.text}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="user-menu">
                <button className="user-avatar" onClick={toggleUserMenu}>
                  {user.avatar}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item">Profile</button>
                    <button className="dropdown-item">My Questions</button>
                    <button className="dropdown-item">My Answers</button>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Auth Buttons */
            <>
              <a href="/login" className="btn-login">
                Login
              </a>
              <a href="/register" className="btn-signup">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;