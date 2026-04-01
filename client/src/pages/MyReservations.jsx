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
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }}>
          
          <div className="mb-16 border-b border-stone-200 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-stone-400 block mb-4">Guest Portal</span>
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">My Reservations</h1>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-medium pb-2">
              Recognized Guest: <span className="text-stone-800">{user?.name}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader className="w-6 h-6 animate-spin text-stone-300 stroke-1" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">Retrieving Records</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-6 border border-red-100 flex items-center gap-4 text-xs tracking-wide font-medium">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-32 bg-white border border-stone-200">
              <Calendar className="w-10 h-10 text-stone-200 mx-auto mb-6 stroke-1" />
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-500 text-2xl italic mb-6">You have no upcoming experiences.</p>
              <Link to="/reservation" className="inline-block border-b border-stone-800 text-stone-900 uppercase tracking-[0.2em] text-[10px] font-medium pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
                Request a Table
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map((r, i) => {
                const s = statusConfig[r.status] || statusConfig.pending;
                const StatusIcon = s.icon;
                return (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.8, ease: easing }}
                    className="bg-white border border-stone-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-stone-300 transition-colors duration-500"
                  >
                    <div className="flex-1 space-y-4">
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-light text-stone-900">{r.name}</span>
                        <span className={`inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-medium px-3 py-1.5 border ${s.bg} ${s.color} ${s.border}`}>
                          <StatusIcon className="w-3 h-3 stroke-2" /> {s.label}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 text-xs font-light tracking-wide text-stone-600">
                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 stroke-[1.5] text-stone-400" />{new Date(r.date || r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 stroke-[1.5] text-stone-400" />{r.time}</span>
                        <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 stroke-[1.5] text-stone-400" />{r.guests} Guest{r.guests > 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] uppercase font-medium tracking-widest text-stone-400 pt-4 border-t border-stone-100 mt-2">
                        <Tag className="w-3 h-3" />
                        <span>Ref: {r._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] uppercase font-medium tracking-widest text-stone-400 whitespace-nowrap self-start md:self-auto pt-2 md:pt-0 border-t md:border-none border-stone-100 w-full md:w-auto mt-4 md:mt-0">
                      Logged: {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
