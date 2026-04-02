import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, Waves, Sun, Utensils, Edit2, Trash2, ChevronLeft, ChevronRight, UploadCloud, Loader2, Plus } from 'lucide-react';
import api from '../api/axios';
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
          src={currentImge.imageUrl} alt={currentImge.title}
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

// 2. Admin Upload Modal (Kept clean and minimal)
const AdminModal = ({ isOpen, close, currentEdit, onSave, loading }) => {
  const [formData, setFormData] = useState({ title: '', category: 'Lake View', description: '', image: null });
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (currentEdit) {
      setFormData({ title: currentEdit.title || '', category: currentEdit.category || 'Lake View', description: currentEdit.description || '', image: null });
      setPreview(currentEdit.imageUrl);
    } else {
      setFormData({ title: '', category: 'Lake View', description: '', image: null });
      setPreview('');
    }
  }, [currentEdit, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.8, ease: easing }} className="w-full max-w-2xl bg-stone-50 relative">
        <button onClick={close} className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors z-20"><X className="w-6 h-6 stroke-1" /></button>
        <div className="p-10 md:p-14">
           <h3 style={fontPlayfair} className="text-3xl font-light text-stone-900 mb-10 border-b border-stone-200 pb-4">
             {currentEdit ? 'Refine Impression' : 'Curate Impression'}
           </h3>
           <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-8">
             <div className="space-y-2">
               <label className="text-[9px] uppercase font-medium tracking-[0.3em] text-stone-400">Image Asset</label>
               <input type="file" accept="image/*" onChange={(e) => { 
                 const file = e.target.files[0];
                 setFormData({...formData, image: file}); 
                 if (file) setPreview(URL.createObjectURL(file));
               }} className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0" />
             </div>
             {preview && (
               <div className="w-full h-48 bg-stone-200 overflow-hidden">
                  <img src={preview} alt="preview" className="w-full h-full object-cover grayscale-[30%]" onError={(e) => { e.target.src = '' }} />
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[9px] uppercase font-medium tracking-[0.3em] text-stone-400">Nomenclature</label>
                 <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0" />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] uppercase font-medium tracking-[0.3em] text-stone-400">Classification</label>
                 <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 px-0 py-2 text-stone-900 focus:ring-0 pb-2">
                   {categories.filter(c => c.name !== 'All').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                 </select>
               </div>
             </div>
             <div className="flex justify-end gap-6 pt-10">
               <button type="button" onClick={close} className="text-[10px] uppercase font-medium tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors">Discard</button>
               <button type="submit" disabled={loading} className="text-[10px] uppercase font-medium tracking-[0.2em] text-stone-50 bg-stone-900 hover:bg-stone-800 px-8 py-4 transition-colors flex items-center gap-3">
                 {loading && <Loader2 className="w-3.5 h-3.5 animate-spin stroke-1" />}
                 {currentEdit ? 'Commit Changes' : 'Append'}
               </button>
             </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
const Gallery = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

  const handleAdminSave = async (data) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      if (data.image) formData.append('image', data.image);

      if (currentEdit) {
        await api.put(`/gallery/${currentEdit._id}`, formData);
        showToast('Archive Updated');
      } else {
        await api.post('/gallery', formData);
        showToast('Appended to Archive');
      }
      fetchGallery();
      setAdminModalOpen(false);
      setCurrentEdit(null);
    } catch (err) {
      showToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Remove this impression permanently?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setImages(images.filter(img => img._id !== id));
      showToast('Impression Removed');
    } catch (err) {
      showToast('Failed to remove.', 'error');
    }
  };

  const filteredImages = activeFilter === 'All' ? images : images.filter(img => img.category === activeFilter);

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
      <section className="relative h-[65vh] flex items-end justify-center pb-24 overflow-hidden bg-stone-950">
         <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }} className="absolute inset-0 z-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1544984243-75a6435c4128" alt="Lake" className="w-full h-full object-cover grayscale-[40%]" />
         </motion.div>
         <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent" />
         
         <div className="relative z-10 text-center space-y-8 px-6">
           <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing, delay: 0.2 }} className="text-[10px] uppercase font-medium tracking-[0.4em] text-stone-900 block">
             The Archive
           </motion.span>
           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }} style={{ fontFamily: "'Playfair Display', serif" }} className="text-6xl md:text-8xl font-light text-stone-900 tracking-tight leading-none mb-4">
             Curated <br className="hidden md:block"/> Visions
           </motion.h1>
         </div>
      </section>

      {/* --- FILTER TABS (Minimalist) --- */}
      <div className="py-16 sticky top-0 md:top-20 z-40 bg-stone-50/90 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-[100rem] mx-auto px-6 overflow-x-auto hide-scrollbar flex items-center justify-start md:justify-center gap-10 md:gap-16">
           {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className={`py-2 text-[10px] uppercase font-medium tracking-[0.3em] transition-all duration-[1s] whitespace-nowrap flex items-center gap-3 ${
                activeFilter === cat.name ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <span className={`transition-opacity duration-700 ${activeFilter === cat.name ? 'opacity-100' : 'opacity-0'}`}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- ADMIN TOOLS --- */}
      {isAdmin && (
        <div className="max-w-[100rem] mx-auto px-6 py-12 flex justify-end">
           <button 
              onClick={() => { setCurrentEdit(null); setAdminModalOpen(true); }}
              className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-stone-900 border-b border-stone-900 pb-2 hover:text-stone-500 hover:border-stone-500 transition-colors duration-700"
           >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" /> Append Exhibit
           </button>
        </div>
      )}

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
          <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-12 sm:gap-16 space-y-12 sm:space-y-16">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => {
                 const globalIndex = images.findIndex(i => i._id === img._id);
                 return (
                  <motion.div
                    key={img._id} layout initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 1.2, ease: easing }}
                    className="relative group cursor-pointer break-inside-avoid bg-stone-100 flex flex-col items-center group overflow-hidden"
                    onClick={() => setLightboxIndex(globalIndex)}
                  >
                    <div className="relative w-full overflow-hidden">
                       <img
                         src={img.imageUrl} alt={img.title} loading="lazy"
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

                    {/* Admin Actions Overlay */}
                    {isAdmin && (
                      <div className="absolute top-6 right-6 z-20 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <button onClick={(e) => { e.stopPropagation(); setCurrentEdit(img); setAdminModalOpen(true); }} className="w-12 h-12 bg-stone-50/90 backdrop-blur-sm text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-stone-50 transition-colors">
                           <Edit2 className="w-4 h-4 stroke-1" />
                        </button>
                        <button onClick={(e) => handleDelete(e, img._id)} className="w-12 h-12 bg-stone-50/90 backdrop-blur-sm text-red-700 flex items-center justify-center hover:bg-red-900 hover:text-stone-50 transition-colors">
                           <Trash2 className="w-4 h-4 stroke-1" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                 );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {/* --- MODALS --- */}
      <AnimatePresence>
         {lightboxIndex !== null && <LightboxModal images={images} activeIndex={lightboxIndex} setActiveIndex={setLightboxIndex} close={() => setLightboxIndex(null)} />}
      </AnimatePresence>

      <AnimatePresence>
         {adminModalOpen && <AdminModal isOpen={adminModalOpen} close={() => { setAdminModalOpen(false); setCurrentEdit(null); }} currentEdit={currentEdit} onSave={handleAdminSave} loading={actionLoading} />}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
