import React, { useState, useEffect } from 'react';
import axios, { IMG_BASE_URL } from '../../api/axios';
import { Loader, Printer, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrintMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('/menu');
        setMenu(res.data);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const categories = [...new Set(menu.map(item => item.category))];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin text-stone-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 print:p-0 print:bg-white selection:bg-stone-800 selection:text-white">
      {/* Admin Controls - Aggressively Hidden in Print */}
      <div className="admin-controls-bar fixed top-8 left-8 right-8 flex justify-between items-center z-50 print:hidden">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border border-stone-100 text-stone-600 rounded-full hover:bg-stone-50 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()}
          className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-stone-200"
        >
          Print Physical Menu
        </button>
      </div>

      {/* ── PHYSICAL MENU CONTAINER & PRINT PAGINATION TABLE ── */}
      <table className="w-full print:table">
        {/* Invisible Header acting as top margin on EVERY printed page */}
        <thead className="hidden print:table-header-group">
          <tr><td><div className="h-[0.8cm]" /></td></tr>
        </thead>
        {/* Invisible Footer acting as bottom margin on EVERY printed page */}
        <tfoot className="hidden print:table-footer-group">
          <tr><td><div className="h-[1.5cm]" /></td></tr>
        </tfoot>
        <tbody className="print:table-row-group">
          <tr>
            <td className="p-0">
              <div className="max-w-4xl mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-8 md:p-12 print:shadow-none print:p-0">
        {/* Header Decor - Optimized for Zero Gap */}
        <div className="flex flex-col items-center mb-6 md:mb-8 text-center pt-0 print:pt-0">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-6xl md:text-7xl font-light tracking-tight text-stone-900 leading-tight mb-1">
            Leisure Lake
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.7em] text-stone-400">Signature Sanctuary</p>
          <div className="w-16 h-[0.5px] bg-stone-100 mt-6 md:mt-8" />
        </div>

        {/* Menu Items by Category */}
        <div className="space-y-16 md:space-y-20">
          {categories.map((category) => (
            <div key={category} className="space-y-8">
              {/* Category Title - Elegant & Centered */}
              <div className="flex flex-col items-center gap-3">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light italic text-stone-900">
                  {category}
                </h2>
                <div className="flex items-center gap-4 w-full max-w-sm">
                   <div className="h-[0.5px] flex-grow bg-stone-100" />
                   <div className="w-1 h-1 rounded-full border border-stone-200" />
                   <div className="h-[0.5px] flex-grow bg-stone-100" />
                </div>
              </div>

              {/* Items List - High Density Single Column for Perfect Alignment */}
              <div className="space-y-8">
                {menu
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item._id} className="flex gap-8 group items-start">
                      {/* Fixed Symmetrical Image Frame */}
                      <div className="w-24 h-24 md:w-28 md:h-28 bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                        <img 
                           src={item.image ? (item.image.startsWith('http') ? item.image : `${IMG_BASE_URL}${item.image}`) : "/images/default-dish.jpg"}
                           alt={item.name}
                           className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Textual Metadata - Perfectly Aligned */}
                      <div className="flex-grow min-w-0 pt-1">
                        <div className="flex justify-between items-baseline mb-2 gap-6">
                          <div className="flex flex-col">
                             <h3 className="text-base font-black uppercase tracking-[0.2em] text-stone-900 leading-none mb-2">
                                {item.name}
                             </h3>
                             <p className="text-sm font-serif italic text-stone-400 leading-none">
                                {item.khmerName}
                             </p>
                          </div>
                          <span className="text-base font-bold text-stone-900 shrink-0 border-b-2 border-stone-100 pb-1">
                             {Number(item.price).toLocaleString()}៛
                          </span>
                        </div>
                        
                        <p className="text-[12px] leading-relaxed text-stone-500 font-light max-w-2xl text-justify">
                          {item.description || "Expertly crafted using our signature lakeside ingredients to provide a balanced and harmonious dining experience unique to Leisure Lake."}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Detail */}
        <div className="mt-20 pt-12 border-t-[0.5px] border-stone-100 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 mb-6">Harmony in Every Bite</p>
          <div className="flex justify-center flex-wrap gap-x-12 gap-y-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            <span className="flex items-center gap-2 decoration-stone-200">PHNOM PENH, KH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-100 hidden sm:inline" />
            <span className="flex items-center gap-2">+855 69 984 886</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-100 hidden sm:inline" />
            <span className="flex items-center gap-2">LEISURELAKE.COM</span>
          </div>
          <div className="mt-12 opacity-[0.07]">
             <img src="/images/logo.png" alt="Leisure Lake" className="h-10 mx-auto grayscale" />
          </div>
        </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Targeted Suppression of Admin UI */
          .admin-controls-bar { 
            display: none !important; 
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 0 !important;
          }
          
          /* Force hide browser headers and footers (URL, Date, Page Numbers) */
          @page { 
            margin: 0; 
            size: portrait; 
          }
          body { 
            background: white !important; 
            margin: 0 !important; 
            /* Vertical margins are now dynamically handled by thead/tfoot on each page */
            padding-top: 0 !important; 
            padding-bottom: 0 !important; 
            padding-left: 1.5cm !important;
            padding-right: 1.5cm !important;
          }
          .print-hidden { display: none !important; }
          header, footer { display: none !important; }
          
          /* Ensure content doesn't break poorly across pages */
          .group { break-inside: avoid; }
          h2 { break-after: avoid; }
          .flex { display: flex !important; }
        }
      `}} />
    </div>
  );
};

export default PrintMenu;
