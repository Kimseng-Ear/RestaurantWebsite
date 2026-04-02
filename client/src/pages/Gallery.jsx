import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, Waves, Sun, Utensils, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api, { IMG_BASE_URL } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { easing, fadeInUp, staggerContainer, fontPlayfair } from '../utils/theme';
const categories = [
  { name: 'All', icon: null },
  { name: 'Food', icon: <Utensils className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Drinks', icon: <Sun className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Interior', icon: <Maximize2 className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Lake View', icon: <Waves className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Events', icon: <Camera className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Sunset', icon: <Sun className="w-3.5 h-3.5 stroke-1" /> },
  { name: 'Dining Area', icon: <Utensils className="w-3.5 h-3.5 stroke-1" /> }
];

const defaultImages = [
  { _id: '1', category: 'Lake View', imageUrl: 'https://images.unsplash.com/photo-1544984243-75a6435c4128', title: 'Serene Lake' },
  { _id: '2', category: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', title: 'Golden Hour' },
  { _id: '3', category: 'Dining Area', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de', title: 'Lakeside Huts' },
  { _id: '4', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1603133872878-08132f159942', title: 'Seafood Selection' },
  { _id: '5', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b', title: 'Chef Special' },
  { _id: '6', category: 'Lake View', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', title: 'Tranquil Waters' }
];

// --- COMPONENTS ---

// 1. Lightbox Modal
const LightboxModal = ({ images, activeIndex, setActiveIndex, close }) => {
  const currentImge = images[activeIndex];

  const handleNext = useCallback(() => setActiveIndex((prev) => (prev + 1) % images.length), [images.length, setActiveIndex]);
  const handlePrev = useCallback(() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length), [images.length, setActiveIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, handleNext, handlePrev]);

  if (!currentImge) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: easing }}
      className="fixed inset-0 z-[100] bg-stone-950 flex justify-center p-4 md:p-12 items-center"
      onClick={close}
    >
      <button className="absolute top-8 right-8 p-4 text-stone-500 hover:text-stone-50 transition-colors z-[110]" onClick={close}>
        <X className="w-8 h-8 stroke-1" />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 text-stone-600 hover:text-stone-50 transition-colors z-[110]">
            <ChevronLeft className="w-10 h-10 stroke-1" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 text-stone-600 hover:text-stone-50 transition-colors z-[110]">
            <ChevronRight className="w-10 h-10 stroke-1" />
          </button>
        </>
      )}

      <motion.div
        key={currentImge._id}
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.8, ease: easing }}
        className="relative max-w-[100rem] w-full h-[90vh] flex flex-col items-center justify-center cursor-default"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={currentImge.imageUrl.startsWith('http') ? currentImge.imageUrl : `${IMG_BASE_URL}${currentImge.imageUrl}`}
          alt={currentImge.title}
          className="w-full h-full object-contain transition-transform duration-[15s] ease-linear scale-[1.01] hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col items-center text-center">
          <h2 style={fontPlayfair} className="text-4xl lg:text-5xl font-light text-stone-50 mb-6">{currentImge.title}</h2>
          <div className="flex items-center gap-6 justify-center">
            <span className="flex items-center gap-3 text-[10px] font-medium text-stone-400 uppercase tracking-[0.3em]">
              {categories.find(c => c.name === currentImge.category)?.icon || <Camera className="w-4 h-4 stroke-1" />}
              {currentImge.category}
            </span>
            {currentImge.description && <span className="text-stone-500 text-xs font-light">| {currentImge.description}</span>}
          </div>
          <div className="absolute bottom-8 right-8 text-[10px] uppercase font-medium tracking-[0.4em] text-stone-600">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await api.get('/gallery');
      setImages(data.length > 0 ? data : defaultImages);
    } catch (err) {
      setImages(defaultImages);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeFilter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredImages = activeFilter === 'All' ? images : images.filter(img => img.category === activeFilter);
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ duration: 0.8, ease: easing }} className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 shadow-2xl text-[10px] font-medium uppercase tracking-[0.3em] ${toast.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-stone-900 text-stone-50 flex items-center gap-4'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CINEMATIC HERO --- */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1544984243-75a6435c4128"
            alt="Lake"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-stone-50/5 z-[1]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: easing }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-stone-300 block animate-shimmer bg-shimmer bg-[length:200%_100%] bg-clip-text">
                The Archive
              </span>
              <div className="w-[1px] h-12 bg-white/20 mx-auto" />
            </div>

            <h1 style={fontPlayfair} className="text-7xl md:text-9xl font-light text-stone-100 tracking-tight leading-[0.85] mb-8 animate-shimmer bg-shimmer bg-[length:200%_100%] bg-clip-text">
              Visual <br /> Narratives
            </h1>

            <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-stone-400 max-w-md leading-relaxed mx-auto">
              A curated collection of lakeside moments, captures at the water's edge.
            </p>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-300 font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-stone-400 to-transparent" />
        </motion.div>
      </section>

      {/* --- FILTER TABS (Minimalist) --- */}
      <div className="py-8 sticky top-0 md:top-24 z-40 bg-stone-50/90 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-[100rem] mx-auto px-6 overflow-x-auto hide-scrollbar flex items-center justify-start md:justify-center gap-10 md:gap-16">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setActiveFilter(cat.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`py-2 text-[10px] uppercase font-medium tracking-[0.3em] transition-all duration-[1s] whitespace-nowrap flex items-center gap-3 ${activeFilter === cat.name ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              <span className={`transition-opacity duration-700 ${activeFilter === cat.name ? 'opacity-100' : 'opacity-0'}`}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>


      {/* --- MASONRY GRID (Borderless & Unforgiving Spacing) --- */}
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 pb-40 pt-10 min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-40 gap-6">
            <Loader2 className="w-8 h-8 animate-spin text-stone-300 stroke-1" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-40">
            <p style={fontPlayfair} className="text-3xl font-light text-stone-300 italic">The archive is empty.</p>
          </div>
        ) : (
          <motion.div
            key={currentPage}
            layout
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: easing }}
            className="columns-1 md:columns-2 lg:columns-3 gap-12 sm:gap-16 space-y-12 sm:space-y-16"
          >
            <AnimatePresence mode="popLayout">
              {paginatedImages.map((img, index) => {
                const globalIndex = images.findIndex(i => i._id === img._id);
                return (
                  <motion.div
                    key={img._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: easing }}
                    className="relative group cursor-pointer break-inside-avoid bg-stone-100 flex flex-col items-center group overflow-hidden"
                    onClick={() => setLightboxIndex(globalIndex)}
                  >
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={img.imageUrl.startsWith('http') ? img.imageUrl : `${IMG_BASE_URL}${img.imageUrl}`}
                        alt={img.title} loading="lazy"
                        className="w-full h-auto object-cover grayscale-[40%] transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:scale-[1.03]"
                      />
                      {/* Subtle Vignette Overlay */}
                      <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
                    </div>

                    {/* Hover Caption (Cinematic Reaveal below image) */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent flex flex-col items-center justify-end text-center opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
                      <h3 style={fontPlayfair} className="text-2xl sm:text-3xl font-light text-stone-50 mb-4">{img.title}</h3>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-stone-400">{img.category}</span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="mt-40 flex flex-col items-center gap-10">
            <div className="flex items-center gap-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.4em] transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'text-stone-900 hover:text-stone-400'}`}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div className="flex gap-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-stone-900 text-stone-50 border-stone-900' : 'text-stone-400 border-stone-200 hover:border-stone-900 hover:text-stone-900'}`}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={`flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.4em] transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'text-stone-900 hover:text-stone-400'}`}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
            <div className="h-[1px] w-24 bg-stone-200" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-stone-400">Page {currentPage} of {totalPages}</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .animate-shimmer {
          animation: shimmer 12s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .bg-shimmer {
          background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 55%,
            rgba(255, 255, 255, 0) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: rgba(255, 255, 255, 0.1); 
        }
      `}} />

      {/* --- MODALS --- */}
      <AnimatePresence>
        {lightboxIndex !== null && <LightboxModal images={images} activeIndex={lightboxIndex} setActiveIndex={setLightboxIndex} close={() => setLightboxIndex(null)} />}
      </AnimatePresence>


    </div>
  );
};

export default Gallery;
