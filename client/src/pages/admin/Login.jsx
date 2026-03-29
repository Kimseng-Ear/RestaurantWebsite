import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, Loader, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

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
    if (result.success) {
      // The useEffect will handle navigation
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10 space-y-4">
           <div className="w-20 h-20 bg-earth-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12 mb-6">
              <Waves className="w-12 h-12 text-lake-400" />
           </div>
           <h1 className="text-3xl font-bold text-earth-900 uppercase tracking-tight">Login</h1>
           <p className="text-earth-500 font-medium">Please sign in to continue</p>
        </div>

        <div className="glass p-10 rounded-[3rem] shadow-2xl border border-white/50 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-earth-600 block px-1 uppercase tracking-widest flex items-center gap-2">
                 <User className="w-3 h-3 text-lake-500" /> Email
               </label>
               <input
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="input-field !rounded-2xl py-4 bg-white/50"
                 placeholder="Enter email"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-earth-600 block px-1 uppercase tracking-widest flex items-center gap-2">
                 <Lock className="w-3 h-3 text-lake-500" /> Password
               </label>
               <input
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="input-field !rounded-2xl py-4 bg-white/50"
                 placeholder="Enter password"
               />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-3 shadow-xl hover:shadow-earth-900/10 group disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-earth-100 text-center">
             <button
               onClick={() => navigate('/')}
               className="text-xs font-bold text-earth-400 hover:text-lake-600 uppercase tracking-[0.2em] transition-colors"
             >
               Back to Public Site
             </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-earth-400 font-medium">
           System Version 1.0.4 • Secured with JWT
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
