import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, Waves, Sun, Utensils } from 'lucide-react';

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const images = [
    { id: 1, category: 'Lake View', src: 'https://images.unsplash.com/photo-1544984243-75a6435c4128', title: 'Serene Lake Sunset' },
    { id: 2, category: 'Sunset', src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', title: 'Golden Hour' },
    { id: 3, category: 'Huts', src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de', title: 'Lakeside Dining Huts' },
    { id: 4, category: 'Food', src: 'https://images.unsplash.com/photo-1603133872878-08132f159942', title: 'Seafood Fried Rice' },
    { id: 5, category: 'Food', src: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b', title: 'Lemongrass Chicken' },
    { id: 6, category: 'Lake View', src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', title: 'Lush Lake Nature' },
    { id: 7, category: 'Food', src: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1', title: 'Grilled Frog' },
    { id: 8, category: 'Sunset', src: 'https://images.unsplash.com/photo-1518173946687-a4c8a98337ac', title: 'Evening Glow' },
  ];

  const categories = ['All', 'Lake View', 'Sunset', 'Huts', 'Food'];

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter(img => img.category === activeFilter);

  return (
    <div className="pt-24 min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 space-y-4">
        <span className="text-lake-600 font-bold tracking-widest uppercase text-xs">Visual Journey</span>
        <h1 className="text-5xl font-bold text-earth-900 tracking-tight">Gallery of Emotions</h1>
        <p className="text-earth-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Capture the essence of Leisure Lake. From breathtaking sunsets to our signature Khmer dishes, explore the visual magic of 우리의 restaurant.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
              activeFilter === cat
                ? 'bg-earth-900 text-white shadow-xl scale-105'
                : 'bg-earth-50 text-earth-500 hover:bg-earth-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer overflow-hidden rounded-3xl break-inside-avoid shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedImg(img)}
              >
                <img
                  src={`${img.src}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6">
                  <Maximize2 className="w-10 h-10 mb-4 text-lake-400 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-xl font-bold mb-1">{img.title}</h3>
                  <p className="text-xs uppercase tracking-widest font-semibold text-earth-300">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button
               className="absolute top-10 right-10 p-4 text-white hover:text-lake-400 transition-colors z-[70]"
               onClick={() => setSelectedImg(null)}
            >
               <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={`${selectedImg.src}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80`}
                alt={selectedImg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedImg.title}</h2>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-bold text-lake-400 uppercase tracking-widest">
                    {selectedImg.category === 'Food' ? <Utensils className="w-4 h-4" /> : selectedImg.category === 'Sunset' ? <Sun className="w-4 h-4" /> : <Waves className="w-4 h-4" />}
                    {selectedImg.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social CTA */}
      <section className="mt-24 py-16 bg-earth-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <Camera className="w-[1000px] h-[1000px] -rotate-12 absolute -top-40 -left-60" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
           <h2 className="text-3xl font-bold text-white tracking-tight leading-none">Capture your highlights</h2>
           <p className="text-earth-400 text-lg">Don't forget to tag us on your lakeside adventures!</p>
           <button className="btn-primary !bg-lake-600 hover:!bg-lake-700 shadow-lake-600/30 shadow-2xl">Use #LeisureLake</button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
