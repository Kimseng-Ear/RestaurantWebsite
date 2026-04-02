import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios, { IMG_BASE_URL } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ArrowRight, Star, Search, X, Info, Utensils, GlassWater, Coffee, Cake, Minus, Plus, Heart } from 'lucide-react';
import { easing, fadeInUp, staggerContainer, fontPlayfair } from '../utils/theme';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [featuredDish, setFeaturedDish] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { name: 'All', icon: <Utensils size={14} /> },
    { name: 'Khmer Food', icon: <Utensils size={14} /> },
    { name: 'Drinks', icon: <GlassWater size={14} /> },
    { name: 'Appetizers', icon: <Info size={14} /> },
    { name: 'Desserts', icon: <Cake size={14} /> }
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [menuRes, featuredRes] = await Promise.all([
          axios.get('/menu'),
          axios.get('/menu/featured').catch(() => ({ data: null }))
        ]);
        setMenuItems(menuRes.data);
        if (featuredRes.data) setFeaturedDish(featuredRes.data);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.khmerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- SKELETON LOADER COMPONENT ---
  const SkeletonCard = () => (
    <div className="flex flex-col bg-stone-50 border border-stone-200 p-6 animate-pulse">
      <div className="aspect-[4/5] bg-stone-200 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-100/30 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
      </div>
      <div className="h-8 bg-stone-200 mb-4 w-3/4 mx-auto" />
      <div className="h-4 bg-stone-100 mb-6 w-1/4 mx-auto" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-stone-100 w-full" />
        <div className="h-3 bg-stone-100 w-5/6 mx-auto" />
      </div>
      <div className="h-2 bg-stone-100 w-1/4 mx-auto" />
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">

      {/* --- CINEMATIC MENU HERO HEADER (KOI-STYLE) --- */}
      <section className="bg-stone-900 pt-32 pb-24 relative overflow-hidden flex items-center justify-center min-h-[65vh] lg:min-h-[75vh]">

        {/* Layer 1: Parallax Background */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], y: [0, -20, 0] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 opacity-40 mix-blend-overlay"
        >
          <img src="https://images.unsplash.com/photo-1550966841-3ee7adac1af8?ixlib=rb-1.2.1" alt="Menu Background" className="w-full h-full object-cover" />
        </motion.div>

        {/* Layer 2: Sophisticated Overlays */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-stone-900/40 to-stone-900/90" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400/5 via-transparent to-transparent" />

        {/* KOI-STYLE MICRO ANIMATIONS (Floating Decor) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-stone-100/5 blur-[80px] rounded-full"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-stone-500/5 blur-[100px] rounded-full"
          />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/visual-noise.png')]" />
        </div>

        {/* Layer 3: Content UI */}
        <div className="relative z-10 text-center text-stone-50 px-6 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">

            {/* Minimal Accent */}
            <motion.div variants={fadeInUp} className="mb-8 flex items-center gap-6 overflow-hidden">
              <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="h-[1px] w-8 bg-stone-500/40" />
              <span className="text-[9px] uppercase tracking-[0.6em] font-semibold text-stone-400">Discover Our Story</span>
              <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="h-[1px] w-8 bg-stone-500/40" />
            </motion.div>

            {/* Split Reveal Title */}
            <h1 style={fontPlayfair} className="text-7xl md:text-[7rem] font-light mb-10 tracking-tight text-white flex flex-col md:flex-row items-center gap-x-8 leading-none">
              <motion.span
                initial={{ opacity: 0, y: 40, skewY: 5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ duration: 1, ease: easing }}
                className="inline-block"
              >
                Curated
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: easing }}
                className="italic text-stone-400 font-extralight"
              >
                Menu
              </motion.span>
            </h1>

            {/* Refined Subtitle */}
            <motion.div variants={fadeInUp} className="relative mt-2">
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 1 }} className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-stone-700/50" />
              <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base font-light tracking-[0.05em] leading-relaxed italic opacity-80 decoration-stone-800 underline underline-offset-8 decoration-1">
                "A celebration of authentic Khmer flavors and lakeside fresh ingredients, prepared with mindfulness and served with grace."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimal Scroll Hint */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: [0, 1, 0], y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-stone-500 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          <span className="text-[7px] uppercase tracking-[0.5em] text-stone-500 font-bold">Scroll</span>
        </motion.div>
      </section>

      {/* --- CATCH OF THE DAY (COMPACT + LIVELY) --- */}
      <section className="py-10 bg-stone-950 text-stone-50 overflow-hidden relative">

        {/* Subtle Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-500/20 via-transparent to-transparent animate-[pulse_8s_infinite]" />
        </div>

        {/* Floating Decoration (KOI-style small detail) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 right-20 w-16 h-16 bg-stone-400/10 blur-2xl rounded-full pointer-events-none"
        />

        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* LEFT CONTENT */}
            {featuredDish ? (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: easing }}
                className="flex-1 space-y-6 w-full"
              >

                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-stone-800/80 backdrop-blur-sm border border-stone-700/50 rounded-full">
                  <Star size={12} className="fill-stone-200 text-stone-200" />
                  <span className="text-[9px] text-stone-200 font-bold uppercase tracking-[0.2em]">
                    Chef’s Pick
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h2
                    style={fontPlayfair}
                    className="text-4xl lg:text-5xl font-light leading-tight text-white tracking-tight"
                  >
                    {featuredDish.name}
                  </h2>

                  {/* Small busy details */}
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-stone-500">
                    <span>🔥 Popular Today</span>
                    <span>•</span>
                    <span>⭐ 4.8 Rating</span>
                  </div>

                  <div className="h-[1px] w-16 bg-stone-700" />
                </div>

                {/* Description */}
                <p className="text-stone-400 text-lg font-light leading-relaxed max-w-xl italic">
                  "{featuredDish.description || "The chef's signature preparation of today's finest ingredients."}"
                </p>

                {/* Bottom Info */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-stone-800">

                  <div className="flex flex-col">
                    <span className="text-3xl font-light tracking-wide text-white">
                      {Number(featuredDish.price).toLocaleString()}៛
                    </span>
                    <span className="text-[9px] uppercase font-bold text-stone-500 tracking-[0.3em] mt-1">
                      Today’s Selection
                    </span>
                  </div>

                  {/* Button */}
                  <Link
                    to="/reservation"
                    className="group inline-flex items-center gap-3 text-[10px] tracking-widest uppercase font-bold text-stone-900 bg-stone-50 py-3 px-6 hover:bg-stone-300 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Secure a Table
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div className="flex-1 space-y-6 w-full">
                <div className="h-0.5 w-12 bg-stone-700" />
                <h2
                  style={fontPlayfair}
                  className="text-4xl font-light italic text-stone-600"
                >
                  The Catch Remains Undefined
                </h2>
                <p className="text-stone-500 text-lg font-light max-w-lg">
                  The chef is hand-selecting today's prime ingredient. Inquire upon arrival.
                </p>
              </motion.div>
            )}

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: easing }}
              className="flex-1 w-full relative group"
            >

              {/* Glow */}
              <div className="absolute -inset-6 bg-stone-100/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-stone-100/10 transition-colors duration-[2s]" />

              <div className="aspect-[3/3.5] overflow-hidden relative border border-stone-800 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/20 z-10" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-20 bg-stone-900 text-white text-[9px] px-2 py-1 uppercase tracking-widest">
                  Fresh Catch
                </div>

                {/* Image */}
                <img
                  src={
                    featuredDish?.image ||
                    "/images/default-dish.jpg"
                  }
                  alt={featuredDish?.name || "Daily Catch"}
                  className="w-full h-full object-cover transition-transform duration-[15s] ease-linear group-hover:scale-110"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- NAVIGATION & SEARCH --- */}
      <section className="sticky top-24 bg-white/80 backdrop-blur-2xl border-b border-stone-200 z-40 py-6">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 justify-between items-center">

          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-2 items-center hide-scrollbar w-full lg:w-auto snap-x snap-mandatory pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] tracking-[0.15em] font-bold uppercase transition-all duration-500 whitespace-nowrap snap-start border ${activeCategory === cat.name
                  ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-lg shadow-stone-900/20'
                  : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                  }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 transition-colors group-focus-within:text-stone-900" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-full py-3.5 pl-12 pr-6 text-xs font-light tracking-wide focus:bg-white focus:ring-1 focus:ring-stone-200 transition-all outline-none placeholder:text-stone-400 shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* --- MENU GRID --- */}
      <section className="py-24 max-w-[85rem] mx-auto px-6 lg:px-12 min-h-[60vh]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: easing }}
                  className="group flex flex-col h-full bg-white border border-stone-200 hover:border-stone-300 hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-700 p-7 relative overflow-hidden"
                >
                  {/* Image Container */}
                  <div
                    className="aspect-[4/5] relative overflow-hidden mb-8 bg-stone-100 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-700 z-10" />
                    <img
                      src={item.image ? (item.image.startsWith('http') ? item.image : `${IMG_BASE_URL}${item.image}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
                      <span className="bg-white/90 backdrop-blur-md text-stone-900 px-6 py-3 text-[10px] uppercase tracking-widest font-bold shadow-xl border border-stone-200">Quick View</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item._id); }}
                      className="absolute top-4 right-4 z-30 p-3 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/50 shadow-lg text-stone-400 hover:text-red-500 transition-all duration-300"
                    >
                      <Heart size={14} className={favorites.includes(item._id) ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow text-center">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">{item.category}</span>
                      <span className="text-sm font-semibold text-stone-900">{Number(item.price).toLocaleString()}៛</span>
                    </div>

                    <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-light text-stone-800 mb-1 group-hover:text-stone-600 transition-colors uppercase tracking-tight font-black">{item.name}</h3>
                    <p className="text-stone-500 text-base font-serif italic mb-4">{item.khmerName}</p>

                    <div className="h-[1px] w-12 bg-stone-200 mx-auto mb-6 transition-all duration-700 group-hover:w-24 group-hover:bg-stone-400" />

                    <p className="text-stone-500 text-[13px] leading-relaxed mb-6 flex-grow font-light line-clamp-3">
                      {item.description}
                    </p>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-[9px] font-bold text-stone-400 uppercase tracking-widest hover:text-stone-900 transition-colors flex items-center gap-2 mx-auto"
                    >
                      Explore Details <ArrowRight size={10} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-40 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-8">
                  <Search size={32} className="text-stone-300" />
                </div>
                <h3 style={fontPlayfair} className="text-3xl font-light text-stone-800 mb-4 italic">No offerings found.</h3>
                <p className="text-stone-400 font-light mb-10 max-w-sm">We couldn't find any results for "{searchQuery}". Try refining your keywords or choosing a different category.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="bg-stone-900 text-stone-50 px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors shadow-xl"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xl"
              onClick={() => setSelectedItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.8, ease: easing }}
              className="bg-white max-w-6xl w-full relative z-10 shadow-2xl flex flex-col lg:flex-row overflow-hidden"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full border border-stone-200 text-stone-500 hover:text-stone-900 hover:scale-110 transition-all"
              >
                <X size={20} />
              </button>

              {/* Modal Image */}
              <div className="lg:w-1/2 aspect-square lg:aspect-auto h-full relative group">
                <img
                  src={selectedItem.image ? (selectedItem.image.startsWith('http') ? selectedItem.image : `${IMG_BASE_URL}${selectedItem.image}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Details */}
              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-stone-50">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] mb-6 block border-b border-stone-200 pb-2">{selectedItem.category}</span>
                <h2 style={fontPlayfair} className="text-4xl lg:text-6xl font-light text-stone-900 mb-1 leading-tight">{selectedItem.name}</h2>
                <p className="text-stone-500 text-2xl font-serif mb-8 italic">{selectedItem.khmerName}</p>
                <div className="text-3xl font-light text-stone-800 mb-10 tracking-wide">{Number(selectedItem.price).toLocaleString()}៛</div>

                <p className="text-stone-500 text-lg leading-relaxed font-light mb-14 italic border-l-2 border-stone-900/10 pl-8">
                  {selectedItem.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-stone-200">
                  <Link
                    to="/reservation"
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 bg-stone-900 text-stone-50 py-5 text-center text-xs uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-colors shadow-xl"
                  >
                    Reserve this Dish
                  </Link>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 border border-stone-300 text-stone-800 py-5 text-center text-xs uppercase tracking-[0.3em] font-bold hover:bg-stone-100 transition-colors"
                  >
                    Close View
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}} />
    </div>
  );
};

export default Menu;
