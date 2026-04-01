import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen flex text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
      
      {/* Left side: Cinematic Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-stone-900 border-r border-stone-200">
        <div className="absolute inset-0 bg-stone-900/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80" 
          alt="Lakeside Morning" 
          className="w-full h-full object-cover grayscale-[20%]"
        />
        <div className="absolute bottom-16 left-16 z-20">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-light text-stone-50 leading-tight">
            Join the <br/>Lake Experience
          </h2>
        </div>
      </div>

      {/* Right side: Form side */}
      <div className="w-full lg:w-1/2 bg-stone-50 flex items-center justify-center p-8 sm:p-16 pt-32 lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }} className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-light text-stone-900 mb-4">Request Access</h1>
            <p className="text-stone-500 font-light tracking-wide text-sm">Experience lakeside dining at its purest form.</p>
          </div>

          {/* Social Login First */}
          <div className="flex justify-center mb-8">
            <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => setError('Google Registration Failed')}
               theme="outline"
               size="large"
               width="384"
               text="signup_with"
               shape="square"
             />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-stone-400">
              <span className="bg-stone-50 px-4 whitespace-nowrap">Or use email to register</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em]">Full Name</label>
              <input
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0 transition-colors font-light placeholder-stone-300"
                placeholder="Ex. Earl Grayson"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em]">Email Address</label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0 transition-colors font-light placeholder-stone-300"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em]">Password</label>
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0 transition-colors font-light placeholder-stone-300"
                placeholder="Minimum 6 characters"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-800 p-4 text-xs tracking-wide border border-red-100 font-medium">
                {error}
              </motion.div>
            )}

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-stone-900 text-stone-50 py-5 mt-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin stroke-1" /> : 'Register'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-200 text-center">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-light">
              Already have an account?{' '}
              <Link to="/signin" className="text-stone-900 hover:text-stone-500 transition-colors font-medium border-b border-stone-900 pb-1 hover:border-stone-500">
                Sign In
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default SignUp;
