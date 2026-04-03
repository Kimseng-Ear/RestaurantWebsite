import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Loader, Tag } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:   { icon: AlertCircle, color: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Pending Confirmation' },
  confirmed: { icon: CheckCircle, color: 'text-stone-800',  bg: 'bg-stone-100',  border: 'border-stone-300',  label: 'Confirmed' },
  cancelled: { icon: XCircle,     color: 'text-red-800',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'Cancelled' },
};

const easing = [0.16, 1, 0.3, 1];

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/reservations/my');
        setReservations(data);
      } catch (err) {
        setError('Failed to load your reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 md:pt-36 pb-20 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }}>
          
          <div className="mb-6 md:mb-10 border-b border-stone-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-1">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black text-stone-400 block">Guest Portal</span>
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl md:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight leading-none">
                My <span className="italic text-stone-500">Reservations</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                Guest: <span className="text-stone-900 font-black">{user?.name}</span>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader className="w-5 h-5 animate-spin text-stone-300 stroke-1" />
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 animate-pulse">Syncing Vault</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 border border-red-100 rounded-xl flex items-center gap-3 text-[10px] tracking-wide font-bold">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-24 bg-white border border-stone-200 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100">
                <Calendar className="w-5 h-5 text-stone-200 stroke-1" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-400 text-xl italic mb-6">No upcoming experiences.</p>
              <Link to="/reservation" className="inline-block bg-stone-900 text-white px-8 py-3.5 rounded-full uppercase tracking-[0.25em] text-[8px] md:text-[9px] font-black hover:bg-stone-800 transition-all duration-500 shadow-lg active:scale-95">
                Secure a Table
              </Link>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {reservations.map((r, i) => {
                const s = statusConfig[r.status] || statusConfig.pending;
                const StatusIcon = s.icon;
                return (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05, duration: 0.8, ease: easing }}
                    className="group bg-white border border-stone-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-stone-900 transition-all duration-700 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl relative overflow-hidden"
                  >
                    {/* Visual Accent */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${s.bg === 'bg-yellow-50' ? 'bg-amber-400' : s.bg === 'bg-red-50' ? 'bg-red-400' : 'bg-stone-900'} opacity-30`} />

                    <div className="flex-1 space-y-4 md:space-y-5">
                      <div className="flex items-center justify-between md:justify-start gap-4 flex-wrap">
                        <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl md:text-2xl font-light text-stone-900 group-hover:text-stone-950 transition-colors">{r.name}</span>
                        <span className={`inline-flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em] font-black px-3 py-1.5 border rounded-lg ${s.bg} ${s.color} ${s.border} shadow-sm`}>
                          <StatusIcon className="w-3 h-3" /> {s.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-8 border-y border-stone-50 py-4 md:py-0 md:border-none">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-white transition-colors"><Calendar size={12} className="text-stone-400" /></div>
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Date</span>
                            <span className="text-[11px] md:text-xs font-bold text-stone-600">{new Date(r.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-white transition-colors"><Clock size={12} className="text-stone-400" /></div>
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Time</span>
                            <span className="text-[11px] md:text-xs font-bold text-stone-600">{r.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-white transition-colors"><Users size={12} className="text-stone-400" /></div>
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Party</span>
                            <span className="text-[11px] md:text-xs font-bold text-stone-600">{r.guests} Guest{r.guests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[9px] uppercase font-black tracking-widest text-stone-300 pt-2 group-hover:text-stone-400 transition-colors">
                        <Tag size={10} className="opacity-50" />
                        <span>Identifier: <span className="text-stone-400">{r._id.slice(-8).toUpperCase()}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-none border-stone-100 pt-4 md:pt-0">
                       <div className="text-right">
                          <span className="text-[8px] uppercase tracking-[0.2em] text-stone-300 font-bold block mb-0.5">Logged Record</span>
                          <span className="text-[10px] font-bold text-stone-400">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyReservations;
