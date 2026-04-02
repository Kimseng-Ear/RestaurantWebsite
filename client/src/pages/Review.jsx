import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Quote, Zap, Fish, Sparkles, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const easing = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: easing } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const ReviewPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/reviews');
      setReviews(data.filter(r => r.isVisible !== false));
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await axios.post('/reviews', newReview);
      setSubmitted(true);
      setNewReview({ name: '', comment: '', rating: 5 });
      fetchReviews();
      navigate('/#impressions');
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
      
      {/* --- HERO HEADER --- */}
      <section className="bg-stone-900 pt-48 pb-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/visual-noise.png')]" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            <motion.span variants={fadeInUp} className="text-[10px] text-stone-400 uppercase tracking-[0.6em] font-bold block mb-6">—— Guest Chronicles ——</motion.span>
            <motion.h1 
              variants={fadeInUp} 
              style={{ fontFamily: "'Playfair Display', serif" }} 
              className="text-6xl md:text-8xl font-light text-white mb-8 tracking-tighter"
            >
              Lakeside <span className="italic text-stone-400 font-extralight">Impressions</span>
            </motion.h1>
            <motion.div variants={fadeInUp} className="w-16 h-[1px] bg-stone-700/50" />
          </motion.div>
        </div>
      </section>

      {/* --- REVIEW FEATURE SECTION --- */}
      <section className="py-24 relative -mt-16 z-20">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* LEFT: SUBMISSION FORM */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-stone-200/50 p-12 shadow-2xl relative sticky top-32"
              >
                <div className="relative z-10 text-center mb-10">
                  <MessageCircle className="w-8 h-8 mx-auto text-stone-200 mb-4" />
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light text-stone-800">Share Your Experience</h2>
                  <p className="text-stone-400 text-xs mt-4 uppercase tracking-widest font-bold opacity-60">Help us write our next chapter</p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="w-12 h-12 text-stone-800 mx-auto mb-6" />
                      <h3 className="text-xl font-bold uppercase tracking-widest text-stone-900 mb-2">Thank You</h3>
                      <p className="text-stone-400 text-xs tracking-widest">Your chronicle has been recorded.</p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleReviewSubmit} 
                      className="space-y-8"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="relative group">
                        <input 
                          type="text" required placeholder="Full Name" value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="w-full bg-transparent border-b border-stone-200 py-4 text-[11px] uppercase tracking-[0.2em] focus:border-stone-900 outline-none transition-all placeholder:text-stone-300 font-bold"
                        />
                      </div>

                      <div className="bg-stone-50/30 border border-stone-100 p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 to-transparent pointer-events-none" />
                        
                        <span className="relative z-10 text-[9px] uppercase tracking-[0.5em] text-stone-400 font-bold mb-6 block opacity-60">Experience Rating</span>
                        
                        <div className="relative z-10 flex justify-center gap-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{ scale: 1.2, rotate: 12 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="relative"
                            >
                              <Star 
                                size={32} 
                                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${newReview.rating >= star ? 'fill-stone-900 text-stone-900 drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]' : 'text-stone-100'}`} 
                              />
                              <AnimatePresence>
                                {newReview.rating === star && (
                                  <motion.div 
                                    layoutId="starHighlight"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute inset-0 bg-stone-900/5 blur-xl rounded-full"
                                  />
                                )}
                              </AnimatePresence>
                            </motion.button>
                          ))}
                        </div>

                        <motion.div 
                          key={newReview.rating}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 relative z-10"
                        >
                           <span className="text-[11px] font-black tracking-[0.3em] text-stone-900 uppercase">
                             {newReview.rating === 5 ? 'Perfect' : newReview.rating === 4 ? 'Great' : newReview.rating === 3 ? 'Average' : newReview.rating === 2 ? 'Poor' : 'Awful'}
                           </span>
                        </motion.div>
                      </div>

                      <div className="relative group">
                        <textarea 
                          required placeholder="Describe your lakeside memories..." rows={6} value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full bg-stone-50/50 border border-stone-100 p-6 text-[11px] tracking-widest focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300 resize-none font-medium leading-relaxed"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={reviewSubmitting}
                        className="w-full bg-stone-900 text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-stone-800 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                      >
                        {reviewSubmitting ? 'Recording...' : 'Publish Chronicle'}
                        {!reviewSubmitting && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* RIGHT: ALL REVIEWS LIST */}
            <div className="lg:col-span-7">
              <div className="space-y-8">
                {reviews.length > 0 ? reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-10 border border-stone-100 bg-white shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                      <Quote className="w-24 h-24" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'fill-stone-900 text-stone-900' : 'text-stone-100'}`} />
                          ))}
                        </div>
                        <span className="text-[8px] text-stone-300 uppercase tracking-widest font-black">Ref No. 00{i + 1}</span>
                      </div>

                      <p 
                        style={{ fontFamily: "'Playfair Display', serif" }} 
                        className="text-stone-700 text-2xl leading-relaxed italic mb-10 font-light"
                      >
                        "{review.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-stone-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                            {review.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-widest text-stone-800 uppercase">{review.name}</span>
                            <span className="text-[8px] text-stone-400 uppercase tracking-widest font-black flex items-center gap-2">
                              <Zap size={8} /> Verified Guest
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-32 border-2 border-dashed border-stone-100 rounded-xl">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold italic">The Chronicle is empty...</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewPage;
