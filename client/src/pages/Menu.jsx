import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Utensils, Wine, GlassWater, ArrowRight, Loader } from 'lucide-react';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Khmer Food', 'Drinks', 'Appetizers', 'Desserts'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get('/menu');
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-20 bg-earth-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-earth-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1" alt="Menu Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Our Menu</h1>
          <p className="text-earth-400 max-w-2xl mx-auto text-lg">
            A celebration of Khmer flavors and lakeside fresh ingredients.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 bg-white/80 backdrop-blur-md border-b z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-6 space-x-6 items-center hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-none px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-earth-900 text-white shadow-lg'
                    : 'bg-white text-earth-600 border border-earth-100 hover:bg-earth-100 hover:text-earth-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader className="w-12 h-12 text-earth-400 animate-spin" />
             <p className="text-earth-500 font-medium">Preparing the menu...</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-earth-100/50"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-earth-900 shadow-sm">
                      {item.price.toLocaleString()}៛
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-earth-900 group-hover:text-lake-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                    </div>
                    <p className="text-earth-500 text-sm leading-relaxed mb-6 flex-grow">{item.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-earth-50">
                      <span className="text-xs font-bold text-earth-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-full py-32 text-center space-y-4">
                 <p className="text-earth-500 italic text-lg">No dishes found in this category.</p>
                 <button onClick={() => setActiveCategory('All')} className="text-lake-600 font-bold hover:underline">Show all dishes</button>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* Online Catch CTA */}
      <section className="py-24 bg-lake-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden border border-lake-100">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-lake-50 rounded-full blur-3xl" />
             <div className="flex-1 space-y-6 relative z-10">
                <span className="text-lake-600 font-extrabold tracking-widest uppercase text-xs">Fresh Arrival</span>
                <h2 className="text-4xl font-bold text-earth-900">Today's Special Catch</h2>
                <p className="text-earth-600 text-lg leading-relaxed">
                  Every morning, our local fisherman bring the freshest catch from the lake. Ask our staff about the catch of the day!
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-earth-900">25,000៛</span>
                    <span className="text-xs font-bold text-earth-400 uppercase">Per Serving</span>
                  </div>
                  <Link to="/reservation" className="btn-primary !bg-lake-600 hover:!bg-lake-700">Reserve Now</Link>
                </div>
             </div>
             <div className="flex-1 w-full relative group">
                <div className="aspect-square rounded-full overflow-hidden border-8 border-lake-50 group-hover:scale-105 transition-transform duration-700">
                   <img
                     src="https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                     alt="Daily Catch"
                     className="w-full h-full object-cover"
                   />
                </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
