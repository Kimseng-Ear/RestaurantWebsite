import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, User, CheckCircle2, ChevronRight, Loader, ArrowRight } from 'lucide-react';
import axios from '../api/axios';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post('/reservations', formData);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', date: '', time: '', guests: 2 });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-earth-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Information Side */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-lake-600 font-bold tracking-widest uppercase text-xs">Book a Table</span>
              <h1 className="text-5xl font-bold text-earth-900 tracking-tight leading-none mb-6">Create Lasting Memories</h1>
              <p className="text-earth-600 text-lg leading-relaxed max-w-lg">
                Whether it's a romantic dinner at sunset or a family weekend lunch, we've got the perfect lakeside spot for you.
              </p>
            </div>

            <div className="space-y-6">
               <div className="glass p-8 rounded-3xl space-y-4 hover:shadow-xl transition-all">
                  <h3 className="font-bold text-earth-900 text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-lake-600" />
                    Why Dine with Us?
                  </h3>
                  <ul className="space-y-3 text-earth-600">
                    <li className="flex items-center gap-2 text-sm"><ChevronRight className="w-4 h-4 text-lake-400" /> Guaranteed sunset views</li>
                    <li className="flex items-center gap-2 text-sm"><ChevronRight className="w-4 h-4 text-lake-400" /> Private lakeside huts available</li>
                    <li className="flex items-center gap-2 text-sm"><ChevronRight className="w-4 h-4 text-lake-400" /> Fresh lake-to-table seafood</li>
                    <li className="flex items-center gap-2 text-sm"><ChevronRight className="w-4 h-4 text-lake-400" /> Family & kid-friendly environment</li>
                  </ul>
               </div>

               <div className="bg-earth-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                     <p className="text-earth-400 text-xs font-bold uppercase tracking-widest">Questions?</p>
                     <h4 className="text-2xl font-bold">Call Us Direct</h4>
                     <p className="text-lake-400 text-2xl font-bold">069 984 886</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                     <Phone className="w-40 h-40" />
                  </div>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="glass p-10 lg:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
             {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-6"
                >
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                   </div>
                   <h2 className="text-3xl font-bold text-earth-900">Reservation Sent!</h2>
                   <p className="text-earth-600">
                     Thank you for booking with Leisure Lake. We'll contact you shortly to confirm your table.
                   </p>
                   <button
                     onClick={() => setIsSuccess(false)}
                     className="btn-primary mt-8"
                   >
                     Make Another Booking
                   </button>
                </motion.div>
             ) : (
                <>
                  <h2 className="text-3xl font-bold text-earth-900 mb-8 tracking-tight">Reservation Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-earth-600 block px-1 flex items-center gap-2"><User className="w-4 h-4 text-lake-400" /> Full Name</label>
                       <input
                         type="text"
                         name="name"
                         required
                         placeholder="e.g. Sokha Som"
                         value={formData.name}
                         onChange={handleChange}
                         className="input-field"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-earth-600 block px-1 flex items-center gap-2"><Phone className="w-4 h-4 text-lake-400" /> Phone Number</label>
                       <input
                         type="tel"
                         name="phone"
                         required
                         placeholder="e.g. 069 984 886"
                         value={formData.phone}
                         onChange={handleChange}
                         className="input-field"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-earth-600 block px-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-lake-400" /> Date</label>
                         <input
                           type="date"
                           name="date"
                           required
                           value={formData.date}
                           onChange={handleChange}
                           className="input-field"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-earth-600 block px-1 flex items-center gap-2"><Clock className="w-4 h-4 text-lake-400" /> Time</label>
                         <input
                           type="time"
                           name="time"
                           required
                           value={formData.time}
                           onChange={handleChange}
                           className="input-field"
                         />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-earth-600 block px-1 flex items-center gap-2"><Users className="w-4 h-4 text-lake-400" /> Number of Guests</label>
                       <select
                         name="guests"
                         value={formData.guests}
                         onChange={handleChange}
                         className="input-field cursor-pointer"
                       >
                         {[1,2,3,4,5,6,7,8,10,12,15].map(num => (
                           <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                         ))}
                         <option value="20">20+ Guests (Event)</option>
                       </select>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-2 group shadow-xl hover:shadow-lake-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Confirm Reservation'}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                  <p className="mt-8 text-xs text-earth-500 text-center leading-relaxed italic">
                    By submitting this form, you agree to our reservation policy. We'll hold your table for 15 minutes past your booking time.
                  </p>
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
