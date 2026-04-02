import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, Quote, X, CalendarCheck, LayoutDashboard,
  CheckCircle, Play, Leaf, Waves, Minus,
  Fish, Flame, Wine, Handshake, Zap, Clock, MapPin, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { fadeInUp, staggerContainer, fontPlayfair, getRandomPastel } from '../utils/theme';

// --- KOI-STYLE ANIMATED COMPONENTS ---
const FloatingDeco = ({ children, delay = 0, duration = 4, className = "" }) => (
  <motion.div
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute pointer-events-none z-[5] ${className}`}
  >
    {children}
  </motion.div>
);


const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.group')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-stone-900 rounded-full z-[9999] pointer-events-none mix-blend-difference hidden lg:block"
      animate={{
        x: position.x - 8, y: position.y - 8,
        scale: isHovering ? 2.5 : 1,
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
    />
  );
};

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setWidth((scrolled / total) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] bg-stone-200/20 pointer-events-none">
      <motion.div className="h-full bg-stone-400 origin-left shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${width}%` }} />
    </div>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Carousel State
  const carouselRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Story State
  const [showVideo, setShowVideo] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const storyImages = Array.from({ length: 6 }, (_, i) => `/images/history${i + 1}.jpg`);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/reviews');
      setReviews(data.filter(r => r.isVisible !== false).slice(0, 6));
    } catch (err) { console.error('Failed to fetch reviews', err); }
  };

  const fetchMenu = async () => {
    try {
      const { data } = await axios.get('/menu');
      setMenuItems(data);
    } catch (err) { console.error('Failed to fetch menu', err); }
  };

  useEffect(() => {
    fetchReviews();
    fetchMenu();
  }, []);

  // Story Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => setGalleryIndex((prev) => (prev + 1) % storyImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // Review Carousel Auto-scroll logic
  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const nextTarget = scrollLeft + clientWidth >= scrollWidth - 5 ? 0 : scrollLeft + 400;
        carouselRef.current.scrollTo({ left: nextTarget, behavior: 'smooth' });
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    setScrollProgress((scrollLeft / (scrollWidth - clientWidth)) * 100);
  };

  const loopedItems = [...menuItems, ...menuItems, ...menuItems];

  const Counter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const started = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime;
          const step = (t) => {
            if (!startTime) startTime = t;
            const progress = Math.min((t - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      }, { threshold: 0.5 });
      if (nodeRef.current) observer.observe(nodeRef.current);
      return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
  };

  const PriceCounter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
      const end = parseInt(value);
      if (isNaN(end)) return;
      let start = 0;
      const timer = setInterval(() => {
        start += Math.ceil(end / 40);
        if (start >= end) { setDisplayValue(end); clearInterval(timer); }
        else setDisplayValue(start);
      }, 40);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{displayValue.toLocaleString()}៛</span>;
  };

  return (
    <div className="flex flex-col bg-stone-50 overflow-x-hidden text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50 relative cursor-none">
      <CustomCursor />
      <ScrollProgress />

      {/* --- GLOBAL VISUAL NOISE --- */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-900 border-b border-stone-200 z-10">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 45, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <img src="/images/HeroImage.jpg" alt="Lake view" loading="eager" fetchPriority="high" className="w-full h-full object-cover" />
        </motion.div>

        <div className="absolute inset-0 z-0 bg-stone-900/65 transition-all duration-1000" />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center">

            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
              <div className="w-8 h-[1px] bg-stone-500" />
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-[0.4em] font-bold">
                Luxury Dining & Nature
              </span>
              <div className="w-8 h-[1px] bg-stone-500" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 text-white leading-tight"
              style={fontPlayfair}
            >
              Leisure Lake
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-base text-stone-300 font-light max-w-[550px] mb-8 leading-normal tracking-wide opacity-90"
            >
              Discover the art of fine dining where nature’s tranquility meets culinary excellence in the heart of Phnom Penh.
            </motion.p>

            {/* Trusted by Avatars */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-10 group cursor-default">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-stone-800 bg-stone-700 overflow-hidden ring-2 ring-white/5">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="guest" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Trusted by 2k+ guests</span>
                  <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[8px] text-stone-300 font-bold uppercase tracking-tighter">Live from Lakeside</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Overlay */}
            <motion.div variants={fadeInUp} className="hidden md:flex gap-12 mb-12 border-y border-white/10 py-6 px-12 backdrop-blur-sm bg-white/5 rounded-full">
              {[
                { icon: Clock, label: "5 Years", sub: "Experience" },
                { icon: MapPin, label: "Phnom Penh", sub: "Location" },
                { icon: Wine, label: "15 Signature", sub: "Dishes" }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <s.icon className="w-4 h-4 text-stone-400" />
                  <div className="flex flex-col items-start translate-y-0.5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{s.label}</span>
                    <span className="text-[8px] text-stone-400 uppercase tracking-tighter">{s.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {user?.role === 'admin' ? (
                <Link to="/admin" className="group flex items-center gap-3 px-10 py-4 bg-stone-100 text-stone-900 font-bold text-[10px] tracking-widest uppercase hover:bg-stone-200 transition-all duration-500 hover:scale-105 shadow-xl">
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </Link>
              ) : (
                <Link to="/reservation" className="group flex items-center gap-3 px-10 py-4 bg-stone-100 text-stone-900 font-bold text-[10px] tracking-widest uppercase hover:bg-stone-200 transition-all duration-500 hover:scale-105 shadow-xl">
                  Reserve Table
                </Link>
              )}
              <Link to="/menu" className="group flex items-center gap-2 px-10 py-4 bg-transparent border border-white/20 text-stone-100 font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-stone-900 transition-all duration-500 relative overflow-hidden">
                <span className="relative z-10">Explore Menu</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <FloatingDeco className="top-1/4 left-[5%] opacity-20"><Waves className="w-12 h-12 text-white" /></FloatingDeco>
        <FloatingDeco delay={2} className="top-1/3 right-[8%] opacity-20"><Leaf className="w-8 h-8 text-white" /></FloatingDeco>
        <FloatingDeco delay={1} className="bottom-1/4 left-[10%] opacity-10"><Fish className="w-10 h-10 text-white" /></FloatingDeco>

        {/* Minimal Scroll Indicator */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          whileHover={{ scale: 1.1, y: 5 }}
        >
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-full h-1/2 bg-stone-300 absolute top-0" />
          </div>
          <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-stone-400 group-hover:text-white transition-colors">Discover More</span>
        </motion.div>
      </section>

      {/* --- 2. BRAND PILLARS (CLEAN DISPLAY) --- */}
      <section className="py-20 bg-white relative overflow-hidden z-10 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 relative"
          >
            {[
              { icon: Fish, title: "Fresh Catch", desc: "Daily sourced from local waters.", badge: "Organic" },
              { icon: Flame, title: "Open Kitchen", desc: "Witness the artistry of flame.", badge: "Visual" },
              { icon: Wine, title: "Curated Wine", desc: "A sophisticated vintage selection.", badge: "Premium" },
              { icon: Handshake, title: "Warm Service", desc: "Genuine Cambodian hospitality.", badge: "Authentic" }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group flex flex-col items-center text-center p-6 rounded-xl border border-transparent hover:border-stone-100 transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200/30"
              >
                <div className="mb-6 relative">
                  <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center border border-stone-100 shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                    <pillar.icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute -top-1 -right-4 px-2 py-0.5 bg-stone-900 text-white text-[7px] uppercase tracking-tighter font-bold rounded-sm shadow-lg shadow-stone-900/10"
                  >
                    {pillar.badge}
                  </motion.span>
                </div>
                <h3 style={fontPlayfair} className="text-lg font-bold text-stone-800 mb-2 tracking-tight group-hover:text-stone-900 transition-colors uppercase">{pillar.title}</h3>
                <p className="text-stone-500 font-light text-[11px] leading-normal max-w-[140px] opacity-80 group-hover:opacity-100 transition-opacity">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 3. THE STORY (TIGHTER & DETAILED) --- */}
      <section className="py-24 bg-stone-50 relative border-b border-stone-200 overflow-hidden z-10">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Image (Top on Mobile) */}
            <div className="w-full max-w-[460px] mx-auto lg:ml-0 py-16">
              <motion.div
                className="group relative"
                initial={{ rotate: -3 }}
                whileInView={{ rotate: -6 }}
                whileHover={{ rotate: 0, y: -10, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* BOTTOM LAYER (Layer 3) */}
                <motion.div
                  className="absolute inset-0 bg-stone-50 rounded-2xl border border-stone-100 shadow-[-20px_20px_40px_rgba(28,25,23,0.1)] z-0"
                  animate={{ x: -30, y: 30 }}
                  variants={{ hover: { x: -10, y: 10 } }}
                  transition={{ duration: 0.7 }}
                />

                {/* MIDDLE LAYER (Layer 2) */}
                <motion.div
                  className="absolute inset-0 bg-stone-50 rounded-2xl border border-stone-100 shadow-[-15px_15px_30px_rgba(120,53,15,0.08)] z-10 flex items-end justify-end overflow-hidden"
                  animate={{ x: -15, y: 15 }}
                  variants={{ hover: { x: -5, y: 5 } }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="p-5 opacity-40 text-right">
                    <span className="text-[7px] uppercase tracking-[0.4em] font-black text-stone-900 block mb-1">Come and experience the Heritage & Soul</span>
                    <div className="flex gap-1 justify-end">
                      <div className="w-4 h-[1px] bg-stone-900" />
                      <div className="w-1 h-[1px] bg-stone-900" />
                    </div>
                  </div>
                </motion.div>

                {/* FRONT LAYER (Image) */}
                <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden z-20 shadow-[-10px_10px_25px_rgba(0,0,0,0.12)] border border-white/50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={galleryIndex}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                      <motion.img
                        src={storyImages[galleryIndex]}
                        alt="Restoration story"
                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-end gap-4 mt-16 mr-8">
                  {storyImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`h-0.5 transition-all duration-700 ${galleryIndex === i ? 'bg-stone-900 w-12' : 'bg-stone-200 w-4 hover:bg-stone-400'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Text (Bottom on Mobile) */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="relative z-10 lg:pl-12">

              <motion.div variants={fadeInUp} className="mb-8 flex items-center gap-3">
                <span className="text-[9px] text-stone-400 uppercase tracking-[0.4em] font-bold">—— Our History ——</span>
              </motion.div>

              <motion.h2
                style={fontPlayfair}
                className="text-4xl md:text-5xl font-light text-stone-800 leading-tight mb-8"
              >
                A Symphony of <span className="italic text-stone-500">Nature & Flavor</span>
              </motion.h2>

              <div className="mb-10 relative">
                <p className="text-stone-500 leading-normal font-light text-base lg:text-lg max-w-xl">
                  Rooted in authentic Cambodian heritage, Leisure Lake is a sanctuary where we craft each dish with mindfulness—embracing the simplicity of fresh, local ingredients caught daily from the serene waters surrounding us.
                </p>
                <div className="w-12 h-[1px] bg-stone-300 mt-6" />
              </div>

              {/* Tighter Stats Row */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 py-8 border-y border-stone-200/80 mb-10">
                {[
                  { label: "Market Fresh", val: "100%", icon: Leaf },
                  { label: "Daily Guests", val: "200+", icon: Handshake },
                  { label: "Signature", val: "15+", icon: Zap }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-start gap-1 border-r border-stone-200/50 last:border-0 pl-2">
                    <div className="flex items-center gap-2">
                      <s.icon className="w-3 h-3 text-stone-400" />
                      <span className="text-xl font-bold text-stone-900 tracking-tighter">{s.val}</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">{s.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Link to="/menu" className="group inline-flex items-center gap-4 text-[9px] tracking-[0.4em] uppercase font-bold text-stone-900 transition-all">
                  <span className="border-b border-stone-900 pb-1">Discover Story</span>
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>

        <FloatingDeco className="top-10 left-1/2 opacity-20"><Zap className="w-10 h-10 text-stone-300" /></FloatingDeco>
        <FloatingDeco delay={1.5} className="bottom-20 right-20 opacity-20 rotate-45"><Leaf className="w-6 h-6 text-stone-200" /></FloatingDeco>

        {/* Video Player Overlay */}
        <AnimatePresence>
          {showVideo && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-stone-950/95 backdrop-blur-sm" onClick={() => setShowVideo(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-5xl aspect-video relative z-10 bg-black">
                <div className="absolute inset-0 flex items-center justify-center text-stone-700 uppercase tracking-widest text-[10px]">
                  Video Stream Payload
                </div>
                <iframe className="w-full h-full relative z-20" src="" frameBorder="0" allowFullScreen title="Background Cinema" />
                <button onClick={() => setShowVideo(false)} className="absolute -top-12 right-0 text-white flex items-center gap-3 uppercase tracking-tighter text-xs">
                  Close <X className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* --- 4. CURATIONS / DISHES (PURE DISPLAY) --- */}
      <section className="py-24 bg-stone-100 z-10 relative overflow-hidden">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
          {/* Centered Modern Header */}
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col items-center">
              <motion.span variants={fadeInUp} className="text-[9px] text-stone-400 uppercase tracking-[0.6em] font-bold block mb-4">—— Culinary Choice ——</motion.span>
              <motion.h2 variants={fadeInUp} style={fontPlayfair} className="text-5xl md:text-6xl font-light text-stone-800 tracking-tight leading-none">Curation of Taste</motion.h2>
              <motion.div variants={fadeInUp} className="w-12 h-[1px] bg-stone-300 mt-8" />
            </motion.div>
          </div>

          <div className="relative">
            {/* Decorative Glow Blobs */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-stone-200/50 rounded-full blur-[60px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-stone-200/30 rounded-full blur-[80px] animate-pulse delay-1000" />

            <div className="overflow-hidden relative -mx-6 px-6 sm:mx-0 sm:px-0 scroll-reveal">
              <motion.div
                animate={{ x: [0, "-33.333%"] }}
                transition={{ repeat: Infinity, duration: (menuItems.length || 1) * 12, ease: "linear" }}
                className="flex w-max gap-6 py-4"
              >
                {loopedItems.length > 0 ? loopedItems.map((dish, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group shrink-0 w-[260px] sm:w-[320px] relative bg-white p-3 border border-stone-200/60 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200/50"
                  >
                    <div className="overflow-hidden relative aspect-[4/5] bg-stone-50 border border-stone-100">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" />

                      {/* Header Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {i % 4 === 0 && <span className="px-2 py-0.5 bg-stone-900 text-white text-[7px] font-bold uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-1"><Flame size={8} /> Chef's Pick</span>}
                        {i % 3 === 0 && <span className="px-2 py-0.5 bg-stone-100 text-stone-900 text-[7px] font-bold uppercase tracking-widest rounded-sm border border-stone-200 shadow-xl">Signature Selection</span>}
                        {i % 5 === 0 && <span className="px-2 py-0.5 bg-yellow-500 text-white text-[7px] font-bold uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-1"><Star size={8} className="fill-white" /> Popular</span>}
                      </div>

                      {/* Floating Decorative Glow on Cards */}
                      <div className="absolute -inset-10 bg-gradient-to-tr from-transparent via-stone-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
                    </div>

                    <div className="pt-5 px-3">
                      <div className="flex items-center gap-0.5 mb-2 scale-75 origin-left opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-2.5 h-2.5 fill-stone-900 text-stone-900" />)}
                      </div>
                      <h3 style={fontPlayfair} className="text-xl font-bold text-stone-800 uppercase tracking-tight mb-1 group-hover:text-stone-900 transition-colors">{dish.name}</h3>
                      <p className="text-stone-400 text-[11px] font-serif italic mb-3 leading-tight opacity-70 group-hover:opacity-100 transition-opacity">{dish.khmerName}</p>
                      <p className="text-[10px] text-stone-400 font-light mb-5 line-clamp-1 opacity-50 italic">Experience traditional lakeside preparation.</p>

                      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                        <span className="text-xs font-bold text-stone-900 uppercase tracking-widest"><PriceCounter value={dish.price} /></span>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] uppercase tracking-widest text-stone-300 font-bold group-hover:text-stone-500 transition-colors">Reserved Only</span>
                          <motion.div className="w-1 h-1 rounded-full bg-stone-200 group-hover:bg-yellow-500 group-hover:animate-ping" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : [1, 2, 3].map((_, i) => <div key={i} className="shrink-0 w-[300px] h-[400px] bg-stone-200 animate-pulse rounded-xl" />)}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. IMPRESSIONS (CLEAN CHRONICLE) --- */}
      <section id="impressions" className="py-24 bg-stone-50 border-t border-stone-200 z-10 relative overflow-hidden">

        {/* Subtle Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-stone-200/20 pointer-events-none select-none italic font-thin opacity-10">
          Chrono
        </div>

        <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
          {/* Centered Modern Header */}
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col items-center">
              <motion.span variants={fadeInUp} className="text-[9px] text-stone-400 uppercase tracking-[0.6em] font-bold block mb-4">—— From Our Guests ——</motion.span>
              <motion.h2 variants={fadeInUp} style={fontPlayfair} className="text-5xl md:text-6xl font-light text-stone-800 tracking-tight leading-none">Impressions</motion.h2>
              <motion.div variants={fadeInUp} className="w-12 h-[1px] bg-stone-300 mt-8" />
            </motion.div>
          </div>

          {/* Full-width Carousel for Historical Chronicles */}
          <div className="relative">
            <motion.div
              ref={carouselRef} onScroll={handleScroll}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="flex overflow-x-auto pb-20 gap-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              {reviews.length > 0 ? reviews.map((review, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="group snap-center shrink-0 w-[85vw] md:w-[500px] p-12 border border-stone-100 bg-white relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200/50"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700"><Quote className="w-24 h-24 group-hover:rotate-6 transition-transform duration-700" /></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'fill-stone-900 text-stone-900' : 'text-stone-100'}`} />
                        ))}
                      </div>
                      <span className="text-[8px] text-stone-300 uppercase tracking-widest font-black">Memory 0{i + 1}</span>
                    </div>
                    <p style={fontPlayfair} className="text-stone-700 text-2xl lg:text-3xl leading-snug italic mb-12 font-light line-clamp-3 group-hover:text-stone-900 transition-colors">"{review.comment}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-stone-100">
                    <div className="flex items-center gap-5">
                      <div style={{ backgroundColor: getRandomPastel(review.name) }} className="w-12 h-12 rounded-full flex items-center justify-center text-stone-600 font-serif text-sm border-2 border-white shadow-xl ring-1 ring-stone-100">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest text-stone-800 uppercase leading-none mb-1">{review.name}</span>
                        <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-1.5"><Zap size={8} /> Verified Guest</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : <div className="p-32 text-center w-full uppercase tracking-widest text-stone-300 text-[10px] italic">Awaiting chronicles...</div>}
            </motion.div>

            {/* Progress Track & Page Navigator */}
            <div className="flex flex-col items-center gap-12">
              <div className="h-[1px] bg-stone-100 w-48 relative overflow-hidden">
                <motion.div className="absolute inset-0 bg-stone-900 origin-left" style={{ width: `${scrollProgress}%` }} />
              </div>

              <Link to="/impressions" className="group flex flex-col items-center gap-4">
                <span className="text-[12px] uppercase tracking-[0.6em] font-bold text-stone-400 group-hover:text-stone-900 transition-colors">Leave Your Impression Here</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[1px] h-12 bg-stone-200 group-hover:bg-stone-900 transition-colors relative"
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-stone-200 group-hover:border-stone-900 transition-colors flex items-center justify-center bg-white">
                    <ArrowRight size={8} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. INVITATION (COMPACT) --- */}
      <section className="py-24 bg-stone-900 text-stone-50 text-center relative border-y border-stone-800 z-10">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <CalendarCheck className="w-6 h-6 mx-auto text-stone-500 mb-6 stroke-1" />
            <h2 style={fontPlayfair} className="text-3xl md:text-4xl font-light mb-6 text-white uppercase tracking-tight">An Invitation to Dine</h2>
            <p className="text-stone-400 mb-10 font-light text-sm max-w-md mx-auto leading-normal opacity-70">Secure your evening of curated flavors and unrivaled ambiance by the lake.</p>
            <Link to="/reservation" className="group inline-flex items-center gap-4 bg-stone-100 text-stone-900 px-10 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white transition-all shadow-xl">
              Request Table <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3"); }
      `}} />
    </div>
  );
};

export default Home;
