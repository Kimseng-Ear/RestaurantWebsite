import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Check, CheckCheck, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = ({ onViewSource }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
        className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors focus:outline-none"
      >
        <Bell size={22} className="stroke-[1.5px]" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 mt-4 w-80 sm:w-96 origin-top-right overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-stone-100 z-[100]"
          >
            <div className="p-5 border-b border-stone-50 flex items-center justify-between bg-stone-50/50">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 uppercase tracking-tighter"
                >
                  <CheckCheck size={14} /> Clear all
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-stone-50">
                  {notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => {
                        if (onViewSource && n.type) {
                          if (!n.isRead) markAsRead(n._id);
                          onViewSource(n.type, n.referenceId);
                          setIsOpen(false);
                        }
                      }}
                      className={`p-4 transition-all relative group cursor-pointer border-l-2 ${!n.isRead ? 'bg-amber-50/50 border-amber-500 hover:bg-amber-100/50' : 'bg-transparent border-transparent hover:bg-stone-50/80'}`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${!n.isRead ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-stone-200'}`} />
                        <div className="flex-1 space-y-1">
                          <p className={`text-[13px] leading-snug tracking-tight ${!n.isRead ? 'text-stone-900 font-semibold' : 'text-stone-500 font-medium'}`}>
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="flex items-center gap-1 text-[10px] text-stone-400 font-medium whitespace-nowrap">
                              <Clock size={10} strokeWidth={2.5} /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </span>
                            {!n.isRead && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(n._id);
                                }}
                                className="text-[9px] font-black text-stone-400 hover:text-amber-600 transition-colors uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 py-1 px-2 bg-white border border-stone-100 rounded shadow-sm"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 opacity-30">
                  <Bell size={40} className="stroke-[1px]" />
                  <p className="text-sm font-medium tracking-wide">No notifications yet</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-stone-50 bg-stone-50/30">
                <button className="w-full text-center text-[10px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest transition-colors py-1">
                  View archive
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
