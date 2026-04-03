import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageSquare, Facebook, Instagram, Share2, Compass, Waves } from 'lucide-react';

const easing = [0.16, 1, 0.3, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easing } }
};

const Contact = () => {
  return (
    <div className="pt-32 min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50 overflow-hidden">

      {/* --- HEADER --- */}
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 text-center mb-32 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easing }}>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium border-b border-stone-300 pb-2 mb-8 inline-block text-stone-400">
            Reach Out
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-7xl font-light text-stone-900 tracking-tight leading-none mb-6">
            Inquiries
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-base font-light tracking-wide leading-relaxed">
            Whether securing a private pavilion or discussing a bespoke dining event, our concierge is at your disposal.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* --- CONTACT DETAILS --- */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-20">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[
                { icon: <MapPin className="w-5 h-5 stroke-1" />, title: "Address", desc: "Leisure Lake, Kakab Village, Kakab Commune, Por Senchey district, Phnom Penh, Cambodia" },
                { icon: <Phone className="w-5 h-5 stroke-1" />, title: "Direct Line", desc: "+855 69 984 886" },
                {
                  icon: <Facebook className="w-5 h-5 stroke-1" />,
                  title: "Facebook",
                  desc: "Leisure Lake",
                  link: "https://www.facebook.com/people/លំហែបាត់បឹង-Leisure-Lake/100064044191824/"
                },
                { icon: <Compass className="w-5 h-5 stroke-1" />, title: "Coordinates", desc: "30 minutes from Wat Phnom center" },
              ].map((item, i) => {
                const Card = (
                  <motion.div
                    key={i} variants={fadeInUp}
                    className="bg-transparent border border-stone-200 p-8 flex shadow-sm hover:border-stone-400 transition-colors duration-500 h-full flex-col group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-stone-100/50 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
                    <div className="relative z-10 flex items-start gap-5">
                      <div className="text-stone-400 mt-1 shrink-0">{item.icon}</div>
                      <div className="space-y-2">
                        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="font-light text-stone-900 text-xl">{item.title}</h3>
                        <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );

                return item.link ? (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                    {Card}
                  </a>
                ) : Card;
              })}
            </div>

            {/* --- SOCIAL LINKS --- */}
            <motion.div variants={fadeInUp} className="bg-stone-900 border border-stone-800 p-12 text-stone-50 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                <div className="space-y-4 text-center md:text-left flex-1">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light tracking-wide text-white">Digital Archives</h3>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">Follow our narrative and journey through our daily preparations.</p>
                </div>
                <div className="flex gap-6 items-center flex-wrap justify-center md:justify-end">
                  <a href="https://www.facebook.com/people/លំហែបាត់បឹង-Leisure-Lake/100064044191824/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-stone-700 rounded-full flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition-colors duration-500">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" className="w-12 h-12 border border-stone-700 rounded-full flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition-colors duration-500">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-12 h-12 border border-stone-700 rounded-full flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition-colors duration-500">
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none -translate-y-1/2 translate-x-1/2">
                <Waves className="w-[600px] h-[600px] stroke-1" />
              </div>
            </motion.div>
          </motion.div>

          {/* --- MAP SECTION --- */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: easing, delay: 0.2 }} className="h-full min-h-[500px] lg:min-h-[700px] relative border border-stone-200">
            <div className="absolute inset-0 overflow-hidden bg-stone-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.2831206886!2d104.8271664!3d11.5712658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31094ff58e8738a1%3A0xb55f5a30d2a2fe01!2sLeisure%20Lake!5e0!3m2!1sen!2skh!4v1711812000000!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                title="Leisure Lake Map"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation"
                className="grayscale hover:grayscale-[20%] transition-all duration-[2s] scale-110 hover:scale-[1.12]"
              />
              <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-multiply" />
            </div>

            {/* Map Inset */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 bg-white border border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="shrink-0 w-12 h-12 bg-stone-100 flex items-center justify-center border border-stone-200 text-stone-400">
                  <MapPin className="w-5 h-5 stroke-1" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-light text-stone-900 text-xl tracking-wide mb-1">Leisure Lake</h4>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">Phnom Penh, KH</p>
                </div>
              </div>
              <div>
                <a
                  href="https://maps.app.goo.gl/yYvS7FqS8uS7qLwD7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest font-medium text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors"
                >
                  Route Directions
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
