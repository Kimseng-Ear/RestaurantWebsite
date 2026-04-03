import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, Loader, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const easing = [0.16, 1, 0.3, 1];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, loading } = useContext(AuthContext);
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

  if (loading) return null;

  return (
    <div className="relative min-h-screen w-full flex items-start justify-center p-6 overflow-y-auto bg-stone-950 pt-28 md:pt-40 pb-16">
      
      {/* Cinematic Deep Background */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: easing }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/history4.jpg"
          alt="Admin Sanctuary"
          className="w-full h-full object-cover grayscale-[50%] brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-transparent to-stone-950/80" />
      </motion.div>

      {/* Admin Glass Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: easing }}
        className="relative z-10 w-full max-w-[480px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        <div className="relative z-10">
          <div className="mb-14">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-12 h-12 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center mb-6"
            >
              <ShieldCheck className="w-6 h-6 text-stone-400" />
            </motion.div>
            
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-500 mb-4 block"
            >
              Secure Authority
            </motion.span>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
              Portal <br/><span className="italic text-stone-500">Gateway</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em] group-focus-within:text-stone-300 transition-colors">Access Identifier</label>
              <div className="relative">
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-4 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-800"
                  placeholder="admin@leisurelake.com"
                />
                <User className="absolute right-0 top-4 w-4 h-4 text-stone-700 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em] group-focus-within:text-stone-300 transition-colors">Credential Key</label>
              <div className="relative">
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-4 text-stone-100 focus:outline-none transition-all font-light placeholder:text-stone-800"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-0 top-4 w-4 h-4 text-stone-700 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 text-red-500 text-[10px] uppercase tracking-widest font-bold pt-4 border-t border-red-900/40"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit" disabled={isSubmitting}
              className="group relative w-full bg-stone-100 text-stone-950 py-5 rounded-full uppercase tracking-[0.4em] text-[10px] font-black hover:bg-white transition-all duration-700 overflow-hidden active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin stroke-1" /> : <>Initialize Session <LogIn className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></>}
              </div>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-14 pt-8 border-t border-white/5 text-center flex flex-col gap-6">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-stone-200 transition-colors font-bold"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Exit to Sanctuary
            </button>
            <p className="text-[8px] uppercase tracking-widest text-stone-700 font-medium">Node Terminal v1.0.4 • Secure Shard</p>
          </div>
        </div>
      </motion.div>

      {/* Binary Decoration */}
      <div className="absolute bottom-12 right-12 text-white/5 text-[10px] font-mono leading-relaxed select-none pointer-events-none hidden lg:block">
        AUTHENTICATED<br/>ENCRYPTED<br/>RESTRICTED
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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

export default Login;
