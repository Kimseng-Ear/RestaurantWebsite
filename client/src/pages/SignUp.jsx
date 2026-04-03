import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const easing = [0.16, 1, 0.3, 1];

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, googleLogin, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const result = await register(formData.name, formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  const handleGoogleSuccess = async (response) => {
    setIsSubmitting(true);
    const result = await googleLogin(response.credential);
    if (!result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  if (loading) return null;

  return (
    <div className="relative min-h-screen w-full flex items-start justify-center p-6 overflow-y-auto bg-stone-950 pt-36 md:pt-40 pb-16">

      {/* Cinematic Background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: easing }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/LeisureLakeStory.jpg"
          alt="Lake Story"
          className="w-full h-full object-cover grayscale-[20%] brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-transparent to-stone-950/60" />
      </motion.div>

      {/* Glassmorphic Portal Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: easing }}
        className="relative z-10 w-full max-w-[520px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Decorative Internal Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-stone-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-3 block"
            >
              Establish Residency
            </motion.span>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-light text-white tracking-tight">
              Begin Your <br /><span className="italic text-stone-400">Journey</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] group-focus-within:text-stone-300 transition-colors">Full Name</label>
              <div className="relative">
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-700"
                  placeholder="Ex. Earl Grayson"
                />
                <User className="absolute right-0 top-3 w-4 h-4 text-stone-600 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] group-focus-within:text-stone-300 transition-colors">Email</label>
              <div className="relative">
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-700"
                  placeholder="email@example.com"
                />
                <Mail className="absolute right-0 top-3 w-4 h-4 text-stone-600 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] group-focus-within:text-stone-300 transition-colors">Password</label>
              <div className="relative">
                <input
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-700"
                  placeholder="Minimum 6 characters"
                />
                <Lock className="absolute right-0 top-3 w-4 h-4 text-stone-600 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-[10px] uppercase tracking-widest font-bold pt-2 border-t border-red-900/30"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit" disabled={isSubmitting}
              className="group relative w-full bg-white text-stone-950 py-5 rounded-full uppercase tracking-[0.4em] text-[10px] font-black hover:bg-stone-100 transition-all duration-700 overflow-hidden active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? <Loader className="w-3 h-3 animate-spin" /> : <>Create Account <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></>}
              </div>
              <div className="absolute inset-0 bg-stone-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em] text-stone-600 mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative bg-transparent px-4">Social Register</span>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                theme="filled_blue"
                size="large"
                shape="pill"
                text="signup_with"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-light">
              Returning guest?{' '}
              <Link to="/signin" className="text-white hover:text-stone-400 transition-colors font-bold border-b border-white/20 pb-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Background Micro-elements */}
      <div className="absolute top-12 right-12 text-white/5 text-[120px] font-serif italic select-none pointer-events-none">LL</div>

      <style dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f5f5f4;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: white;
        }
      `}} />
    </div>
  );
};

export default SignUp;
