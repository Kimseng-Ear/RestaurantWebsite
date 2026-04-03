import React, { useState, useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Users, Phone, User, CheckCircle2,
    Loader, ArrowRight, ShieldCheck, Zap, Info,
    MessageSquare, CalendarPlus, Download, AlertCircle, CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { easing, fadeInUp, fontPlayfair } from '../utils/theme';

const Reservation = () => {
    const { user } = useContext(AuthContext);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null); // { type: 'validation'|'availability'|'server', message: '' }
    const [isShaking, setIsShaking] = useState(false);

    // Availability State
    const [availability, setAvailability] = useState(null); // { status: 'available'|'limited'|'none', message: '' }
    const [isValidating, setIsValidating] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        notes: ''
    });

    // Preferences Logic
    const [usePreferences, setUsePreferences] = useState(() => {
        return localStorage.getItem('ll_save_prefs') === 'true';
    });

    useEffect(() => {
        if (usePreferences) {
            const saved = localStorage.getItem('ll_res_prefs');
            if (saved) {
                const parsed = JSON.parse(saved);
                setFormData(prev => ({ ...prev, guests: parsed.guests, time: parsed.time }));
            }
        }
    }, [usePreferences]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    // Check Availability (Debounced-ish via useEffect)
    const checkStatus = useCallback(async () => {
        if (!formData.date || !formData.time) return;

        setIsValidating(true);
        try {
            const res = await axios.get('/reservations/check-availability', {
                params: { date: formData.date, time: formData.time, guests: formData.guests }
            });
            setAvailability(res.data);
            if (!res.data.available) {
                setError({ type: 'availability', message: res.data.message });
            }
        } catch (err) {
            console.error("Availability check failed");
        } finally {
            setIsValidating(false);
        }
    }, [formData.date, formData.time, formData.guests]);

    useEffect(() => {
        const timer = setTimeout(() => {
            checkStatus();
        }, 800);
        return () => clearTimeout(timer);
    }, [formData.date, formData.time, formData.guests, checkStatus]);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final front-end hour check
        const [h] = formData.time.split(':').map(Number);
        if (h < 10 || h > 22) {
            triggerShake();
            setError({ type: 'validation', message: 'Reservations are only available between 10:00 AM and 10:30 PM.' });
            return;
        }

        if (availability && !availability.available) {
            triggerShake();
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await axios.post('/reservations', formData);
            if (usePreferences) {
                localStorage.setItem('ll_res_prefs', JSON.stringify({ guests: formData.guests, time: formData.time }));
            }
            setIsSuccess(true);
        } catch (err) {
            triggerShake();
            setError({
                type: 'server',
                message: err.response?.data?.message || 'The server is momentarily unavailable. Please attempt your booking again shortly.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    // Get Today's Date for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="pt-32 min-h-screen bg-stone-50 pb-32 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50 overflow-x-hidden">
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Perspective Side */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: easing }} className="space-y-16 lg:sticky lg:top-40">
                        <div className="space-y-8">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] text-stone-400 uppercase tracking-[0.4em] font-bold border-stone-200"
                            >
                                Bespoke Dining
                            </motion.span>
                            <h1 style={fontPlayfair} className="text-6xl lg:text-[7rem] font-light text-stone-900 tracking-tighter leading-[0.85] mb-8">
                                Secure Your <br />Moment
                            </h1>
                            <p className="text-stone-500 text-xl leading-relaxed font-light max-w-md">
                                From intimate lakeside alcoves to grand celebration tables, every reservation is a promise of culinary excellence and curated serenity.
                            </p>
                        </div>

                        {/* Trust Booster Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors">
                                    <Zap size={18} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-widest">Instant Confirmation</p>
                                    <p className="text-xs text-stone-400 font-light">Verified within 2 minutes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors">
                                    <ShieldCheck size={18} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-widest">No Deposit Needed</p>
                                    <p className="text-xs text-stone-400 font-light">Pay only after dining</p>
                                </div>
                            </div>
                        </div>

                        {/* Culinary Notice */}
                        <div className="p-8 bg-stone-100 border border-stone-200/50 relative overflow-hidden group">
                            <div className="flex gap-6 items-start relative z-10">
                                <Info className="text-stone-400 mt-1 shrink-0" size={18} />
                                <p className="text-sm text-stone-600 font-light leading-relaxed italic">
                                    "Our kitchen ensures the highest quality by preparing last orders at 10:30 PM nightly. For the full multi-course experience, we recommend arriving by 8:30 PM."
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Booking Engine Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: easing, delay: 0.1 }}
                        className={`${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''} bg-white p-8 lg:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-stone-100 rounded-[2rem] lg:rounded-[3rem] relative ring-1 ring-stone-900/5`}
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: easing }}
                                    className="text-center py-16 space-y-10"
                                >
                                    <div className="relative inline-block">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 0.15 }}
                                            className="absolute inset-0 bg-stone-900 rounded-full"
                                        />
                                        <CheckCircle2 className="w-20 h-20 text-stone-900 relative z-10 stroke-[1.2]" />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 style={fontPlayfair} className="text-4xl font-light text-stone-900">Experience Confirmed</h2>
                                        <p className="text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                                            Prepare for a curated journey on <span className="font-bold text-stone-800">{new Date(formData.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span> at <span className="font-bold text-stone-800">{formData.time}</span>.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pt-10 border-t border-stone-100">
                                        <Link to="/my-reservations" className="bg-stone-900 text-stone-50 px-10 py-5 uppercase tracking-[0.2em] font-bold text-[10px] hover:bg-stone-800 transition-all flex items-center justify-center gap-3">
                                            Manage Reservation <ArrowRight size={14} />
                                        </Link>
                                        <button className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 transition-colors py-4 group">
                                            <CalendarPlus size={14} className="group-hover:rotate-12 transition-transform" /> Add to Apple / Google Calendar
                                        </button>
                                        <button
                                            onClick={() => { setIsSuccess(false); setFormData(prev => ({ ...prev, date: '', time: '' })); }}
                                            className="text-stone-300 uppercase tracking-[0.2em] font-medium text-[9px] hover:text-stone-900 transition-colors pt-4"
                                        >
                                            Request Another Booking
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h2 style={fontPlayfair} className="text-3xl font-light text-stone-800 tracking-tight">Booking Details</h2>
                                        <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-stone-400">Save Prefs</span>
                                            <button
                                                onClick={() => {
                                                    const newVal = !usePreferences;
                                                    setUsePreferences(newVal);
                                                    localStorage.setItem('ll_save_prefs', newVal.toString());
                                                }}
                                                className={`w-8 h-4 rounded-full relative transition-colors ${usePreferences ? 'bg-stone-900' : 'bg-stone-200'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: usePreferences ? 16 : 2 }}
                                                    className="w-3 h-3 bg-white rounded-full absolute top-0.5"
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-10">

                                        {/* Name Input */}
                                        <div className="group space-y-4">
                                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] flex items-center gap-3 group-focus-within:text-stone-900 transition-colors">
                                                <User className="w-4 h-4 stroke-[1.5]" /> Guest Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text" name="name" required
                                                    value={formData.name} onChange={handleChange}
                                                    className="w-full bg-transparent border-b border-stone-200 focus:border-stone-900 px-0 py-3 text-stone-900 focus:outline-none transition-all font-light placeholder-stone-300 placeholder:italic"
                                                    placeholder="e.g. Alexander Hamilton"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Input */}
                                        <div className="group space-y-4">
                                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] flex items-center gap-3">
                                                <Phone className="w-4 h-4 stroke-[1.5]" /> Contact
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel" name="phone" required
                                                    value={formData.phone} onChange={handleChange}
                                                    className="w-full bg-transparent border-b border-stone-200 focus:border-stone-900 px-0 py-3 text-stone-900 focus:outline-none transition-all font-light"
                                                    placeholder="+855 ..."
                                                />
                                                <span className="text-[9px] text-stone-400 mt-2 block font-light">We'll only use this for arrival confirmation.</span>
                                            </div>
                                        </div>

                                        {/* Date & Time Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                            <div className="group space-y-4">
                                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 stroke-[1.5]" /> Selecting Date
                                                </label>
                                                <input
                                                    type="date" name="date" required min={today}
                                                    value={formData.date} onChange={handleChange}
                                                    className="w-full bg-transparent border-b border-stone-200 focus:border-stone-900 px-0 py-3 text-stone-900 focus:outline-none transition-all date-input-luxury"
                                                />
                                                <span className="text-[9px] text-stone-400 block font-light italic">Weekends typically fill 48h in advance.</span>
                                            </div>
                                            <div className="group space-y-4">
                                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] flex items-center gap-3">
                                                    <Clock className="w-4 h-4 stroke-[1.5]" /> Preference Time
                                                </label>
                                                <input
                                                    type="time" name="time" required
                                                    value={formData.time} onChange={handleChange}
                                                    className="w-full bg-transparent border-b border-stone-200 focus:border-stone-900 px-0 py-3 text-stone-900 focus:outline-none transition-all cursor-pointer"
                                                />
                                                <span className="text-[9px] text-stone-400 block font-light">Sunset hour (5:45 PM) is most popular.</span>
                                            </div>
                                        </div>

                                        {/* Party Size & Logic */}
                                        <div className="group space-y-4">
                                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] flex items-center gap-3">
                                                <Users className="w-4 h-4 stroke-[1.5]" /> Party Size
                                            </label>
                                            <select
                                                name="guests" value={formData.guests} onChange={handleChange}
                                                className="w-full bg-transparent border-b border-stone-200 focus:border-stone-900 px-0 py-3 text-stone-900 focus:outline-none transition-all cursor-pointer appearance-none outline-none font-medium"
                                            >
                                                {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map(num => (
                                                    <option key={num} value={num} className="bg-white">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                                <option value="20" className="bg-white">20+ Guests (Private Event)</option>
                                            </select>

                                            {/* Smart Helper for Large Events */}
                                            <AnimatePresence>
                                                {parseInt(formData.guests) >= 8 && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                                                        <div className="p-4 bg-orange-50/50 border border-orange-100 flex gap-3">
                                                            <MessageSquare size={14} className="text-orange-400 shrink-0 mt-0.5" />
                                                            <p className="text-[10px] text-orange-800 font-medium leading-relaxed">
                                                                Large party size selected. We recommend a fixed curated menu for groups over 8 to ensure seamless lakeside service.
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Notes for large groups */}
                                        {parseInt(formData.guests) >= 12 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group space-y-4">
                                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Special Handling Requirements</label>
                                                <textarea
                                                    name="notes" value={formData.notes} onChange={handleChange}
                                                    placeholder="Birthday setup, dietary requirements, or specific pavilion preference..."
                                                    className="w-full bg-stone-50 border border-stone-100 p-4 min-h-[100px] text-sm focus:outline-none focus:border-stone-900 transition-colors resize-none rounded-xl"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Global Availability Feedback */}
                                        <AnimatePresence>
                                            {(availability || isValidating) && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-stone-100">
                                                    <div className={`p-4 rounded-2xl flex items-center justify-between transition-colors ${isValidating ? 'bg-stone-50' : availability?.available ? (availability?.status === 'limited' ? 'bg-amber-50 text-amber-900' : 'bg-green-50 text-green-900') : 'bg-red-50 text-red-900'}`}>
                                                        <div className="flex items-center gap-3">
                                                            {isValidating ? (
                                                                <Loader size={14} className="animate-spin text-stone-400" />
                                                            ) : availability?.available ? (
                                                                <CheckCircle2 size={16} className={availability.status === 'limited' ? 'text-amber-500' : 'text-green-500'} />
                                                            ) : (
                                                                <AlertCircle size={16} />
                                                            )}
                                                            <span className="text-[10px] uppercase tracking-widest font-black">
                                                                {isValidating ? 'Validating Seating...' : availability?.message}
                                                            </span>
                                                        </div>
                                                        {!isValidating && availability?.available && (
                                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-current opacity-30" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Error Summary */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-4 p-5 bg-red-50/50 border border-red-100 text-red-800">
                                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Booking Restricted</p>
                                                        <p className="text-[11px] leading-relaxed font-medium">{error.message}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            type="submit" disabled={isSubmitting || (availability && !availability.available)}
                                            className="group relative w-full bg-stone-900 text-white overflow-hidden py-6 rounded-2xl transition-all duration-700 hover:bg-stone-950 disabled:bg-stone-200 disabled:text-stone-400 hover:shadow-2xl hover:shadow-stone-900/20 active:scale-[0.98]"
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-4">
                                                <AnimatePresence mode="wait">
                                                    {isSubmitting ? (
                                                        <motion.div key="loader" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="flex items-center gap-4">
                                                            <Loader className="w-5 h-5 animate-spin" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Finalizing...</span>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="text" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-4">
                                                            <CalendarCheck size={18} strokeWidth={1} />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{availability?.available === false ? 'Time Unavailable' : 'Request Reservation'}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </button>
                                    </form>

                                    <div className="pt-8 border-t border-stone-50 text-center">
                                        <Link to="/policy" className="text-[9px] uppercase tracking-[0.3em] text-stone-300 hover:text-stone-600 transition-colors font-bold">
                                            Review Cancellation Policy
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Custom Styles for Inputs */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .date-input-luxury::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                    cursor: pointer;
                }
            ` }} />
        </div>
    );
};

export default Reservation;
