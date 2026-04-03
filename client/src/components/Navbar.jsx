import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard, CalendarCheck, ChevronDown, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleViewNotification = (type) => {
    if (type?.toUpperCase().startsWith('RESERVATION')) {
      navigate('/my-reservations');
    }
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservation', path: '/reservation' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-stone-50/90 backdrop-blur-xl border-b border-stone-200/50 transition-all duration-500">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="Leisure Lake"
              className="h-[60px] md:h-[100px] w-auto object-contain transition-transform duration-700 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8 xl:space-x-10">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium transition-colors hover:text-stone-900 ${isActive(link.path) ? 'text-stone-900' : 'text-stone-500'
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-stone-900"
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            ))}

            <div className="h-4 w-[1px] bg-stone-300 mx-2" /> {/* Divider */}

            {user && <NotificationBell onViewSource={handleViewNotification} />}

            {/* Auth Area */}
            {!user ? (
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/signin" className="text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2">
                  Sign In
                </Link>
                <Link to="/signup" className="border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50 px-4 lg:px-6 py-2.5 lg:py-3 text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium transition-colors duration-500 whitespace-nowrap">
                  Join Guestlist
                </Link>
              </div>
            ) : user.role === 'admin' ? (
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/admin" className="border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50 px-4 lg:px-6 py-2.5 lg:py-3 text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium transition-colors duration-500 flex items-center gap-2 whitespace-nowrap">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium text-stone-500 hover:text-red-800 transition-colors flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 lg:gap-3 text-stone-900 py-2 border-b border-transparent hover:border-stone-900 transition-colors"
                >
                  {user.avatarUrl && !imgError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      onError={() => setImgError(true)}
                      className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-stone-200 object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-400 border border-stone-200 uppercase tracking-tighter">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium block truncate max-w-[60px] lg:max-w-none">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-4 w-56 bg-stone-50 rounded-sm shadow-2xl border border-stone-200 py-4 z-50 text-stone-800"
                    >
                      <div className="px-5 py-3 border-b border-stone-200 mb-2">
                        <p className="text-xs font-semibold tracking-wide truncate">{user.name}</p>
                        <p className="text-xs text-stone-400 truncate mt-1">{user.email}</p>
                      </div>
                      <Link
                        to="/my-reservations"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-stone-500" /> Reservations
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest text-red-800 hover:bg-stone-100 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-4 md:hidden">
            {user && <NotificationBell onViewSource={handleViewNotification} />}
            <button
              className="p-2 text-stone-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6 stroke-1" /> : <Menu className="w-6 h-6 stroke-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100vh' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-stone-50 border-t border-stone-200 overflow-y-auto fixed top-24 left-0 w-full z-40"
          >
            <div className="px-6 py-10 flex flex-col items-center space-y-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className={`block text-3xl font-light ${isActive(link.path) ? 'text-stone-900' : 'text-stone-400 hover:text-stone-900 transition-colors'}`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-12 h-[1px] bg-stone-300 my-4" />

              {!user ? (
                <div className="flex flex-col items-center gap-6 w-full">
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-[0.2em] font-medium text-stone-500 hover:text-stone-900 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full text-center border border-stone-900 text-stone-900 px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium block">
                    Join Guestlist
                  </Link>
                </div>
              ) : user.role === 'admin' ? (
                <div className="flex flex-col items-center gap-6 w-full">
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="w-full text-center border border-stone-900 text-stone-900 px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium block">
                    Admin Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-xs uppercase tracking-[0.2em] font-medium text-red-800">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="text-xs text-stone-500 uppercase tracking-widest">Signed in as {user.name}</div>
                  <Link to="/my-reservations" onClick={() => setIsOpen(false)} className="w-full text-center border border-stone-900 text-stone-900 px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium block">
                    My Reservations
                  </Link>
                  <button onClick={handleLogout} className="text-xs uppercase tracking-[0.2em] font-medium text-red-800">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
