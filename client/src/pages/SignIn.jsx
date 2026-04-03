import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const easing = [0.16, 1, 0.3, 1];

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, googleLogin, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const result = await login(email, password);
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
          src="/images/HeroImage.jpg"
          alt="Lakeside"
          className="w-full h-full object-cover grayscale-[30%] brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-transparent to-stone-950/60" />
      </motion.div>

      {/* Glassmorphic Portal Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: easing }}
        className="relative z-10 w-full max-w-[480px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group"
      >
        {/* Decorative Internal Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-stone-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10">
          <div className="mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-3 block"
            >
              Member Portal
            </motion.span>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-light text-white tracking-tight">
              Welcome <br /><span className="italic text-stone-400">Back</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] group-focus-within:text-stone-300 transition-colors">Email</label>
              <div className="relative">
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
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
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-700"
                  placeholder="••••••••"
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
              className="group relative w-full bg-white text-stone-950 py-5 rounded-full uppercase tracking-[0.4em] text-[10px] font-black hover:bg-stone-100 transition-all duration-700 overflow-hidden active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? <Loader className="w-3 h-3 animate-spin" /> : <>Access Account <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></>}
              </div>
              <div className="absolute inset-0 bg-stone-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-12">
            <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em] text-stone-600 mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative bg-transparent px-4">Social Access</span>
            </div>

            <div className="flex justify-center social-custom-theme">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500">
              New to the lake?{' '}
              <Link to="/signup" className="text-white hover:text-stone-400 transition-colors font-bold border-b border-white/20 pb-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Background Micro-elements */}
      <div className="absolute bottom-12 right-12 text-white/5 text-[120px] font-serif italic select-none pointer-events-none">LL</div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .social-custom-theme iframe {
          filter: invert(1) brightness(2);
          opacity: 0.8;
          transition: opacity 0.5s ease;
        }
        .social-custom-theme:hover iframe {
          opacity: 1;
        }
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

export default SignIn;
