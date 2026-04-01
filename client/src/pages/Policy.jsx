import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Clock, Users, PhoneCall, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const easing = [0.16, 1, 0.3, 1];

const Policy = () => {
    return (
        <div className="pt-40 min-h-screen bg-stone-50 pb-32 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
            <div className="max-w-[70rem] mx-auto px-6 lg:px-12">
                
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }} className="mb-24">
                    <Link to="/reservation" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 hover:text-stone-900 transition-colors mb-12">
                        <ArrowLeft size={14} /> Return to Reservation
                    </Link>
                    <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-6xl lg:text-8xl font-light text-stone-900 tracking-tighter leading-tight">
                        Cancellation <br/>Policy
                    </h1>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: easing, delay: 0.2 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        <div className="prose prose-stone prose-lg max-w-none">
                            <p className="text-xl text-stone-600 font-light leading-relaxed">
                                To ensures every guest enjoys the full serenity of Leisure Lake, we maintain a balanced cancellation policy that respects both our kitchen's preparation and the limited availability of our lakeside views.
                            </p>
                        </div>

                        {/* Standard Policy Card */}
                        <div className="bg-white p-10 lg:p-14 border border-stone-200/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)] rounded-[2rem] space-y-10 group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-700">
                                    <Clock size={24} strokeWidth={1.5} />
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light text-stone-900">Standard Bookings</h3>
                            </div>
                            
                            <div className="space-y-6 text-stone-500 font-light leading-relaxed text-lg tracking-wide">
                                <p>
                                    Reservations may be cancelled or modified **free of charge up to 3 hours** before your scheduled booking time.
                                </p>
                                <p className="p-6 bg-red-50/50 border border-red-100/50 text-red-900/80 rounded-2xl italic text-sm">
                                    "Cancellations made less than 3 hours before the reservation time, or failure to arrive (no-show), may result in limited priority for future bookings."
                                </p>
                            </div>
                        </div>

                        {/* Group Policy Card */}
                        <div className="bg-white p-10 lg:p-14 border border-stone-200/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)] rounded-[2rem] space-y-10 group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-700">
                                    <Users size={24} strokeWidth={1.5} />
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light text-stone-900">Group & Private Events</h3>
                            </div>
                            
                            <div className="space-y-6 text-stone-500 font-light leading-relaxed text-lg tracking-wide">
                                <p>
                                    For group reservations **(8+ guests)** or private events, a minimum notice of **24 hours** is required for any cancellations or significant changes to the guest count.
                                </p>
                                <p>
                                    We kindly ask guests to notify us as early as possible so we may accommodate other diners on our waiting list.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Support */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: easing, delay: 0.4 }} className="space-y-12">
                        <div className="bg-stone-200/40 p-10 rounded-[2rem] border border-stone-200/50 space-y-8">
                            <HelpCircle className="text-stone-400" size={32} strokeWidth={1} />
                            <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-light">Need Assistance?</h4>
                            <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-widest font-black">
                                Our concierge team is available 24/7 to help modify your reservation.
                            </p>
                            <Link to="/contact" className="inline-flex items-center gap-3 text-stone-900 font-bold text-xs uppercase tracking-widest bg-white px-8 py-4 rounded-full border border-stone-200 hover:bg-stone-900 hover:text-white transition-all shadow-sm">
                                <PhoneCall size={14} /> Direct Inquiry
                            </Link>
                        </div>

                        <div className="space-y-6 px-4">
                            <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 pb-2 border-b border-stone-200">Our Commitment</h5>
                            <p className="text-xs text-stone-500 font-light leading-relaxed italic">
                                "At Leisure Lake, we believe in a relationship of mutual respect with our guests. Our policies ensure that every seat remains available for those seeking the perfect lakeside moment."
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Policy;
