import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageSquare, Facebook, Instagram, Share2, Compass, Waves } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-24 min-h-screen bg-earth-50 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 space-y-4">
        <span className="text-lake-600 font-bold tracking-widest uppercase text-xs">Reach Out</span>
        <h1 className="text-5xl font-bold text-earth-900 tracking-tight">Connect with Nature</h1>
        <p className="text-earth-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Need a special event setup? Or just a quiet corner for your laptop? We're here to help you find your perfect lakeside spot.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Contact Details */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <MapPin className="w-6 h-6" />, title: "Address", desc: "Phnom Penh Riverside, 12000 Cambodia", theme: "lake" },
                { icon: <Phone className="w-6 h-6" />, title: "Phone", desc: "069 984 886", theme: "earth" },
                { icon: <MessageSquare className="w-6 h-6" />, title: "Inquiry", desc: "booking@leisurelake.com", theme: "lake" },
                { icon: <Compass className="w-6 h-6" />, title: "Location", desc: "Located 15 mins from Wat Phnom", theme: "earth" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-earth-100/50"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.theme === 'lake' ? 'bg-lake-50 text-lake-600' : 'bg-earth-100 text-earth-800'}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-earth-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-earth-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Links Cards */}
            <div className="bg-earth-900 rounded-[3rem] p-10 lg:p-12 text-white relative overflow-hidden group">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 text-center md:text-left">
                     <h3 className="text-3xl font-bold">Follow Our Journey</h3>
                     <p className="text-earth-400 max-w-sm">Get real-time updates on our daily specials and sunset views.</p>
                  </div>
                  <div className="flex gap-4">
                     <a href="https://facebook.com" className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-lake-500 transition-all duration-300 group/link">
                        <Facebook className="w-8 h-8 group-hover/link:scale-110" />
                     </a>
                     <a href="https://instagram.com" className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 transition-all duration-300 group/link">
                        <Instagram className="w-8 h-8 group-hover/link:scale-110" />
                     </a>
                     <a href="#" className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-earth-800 transition-all duration-300 group/link">
                        <Share2 className="w-8 h-8 group-hover/link:scale-110" />
                     </a>
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150 rotate-12">
                  <Waves className="w-[1000px] h-[1000px]" />
               </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-full min-h-[500px] lg:min-h-0 relative">
             <div className="absolute inset-0 rounded-[4rem] overflow-hidden shadow-2xl bg-earth-200">
               {/* Embed Google Maps */}
               <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15634.698308434774!2d104.9174!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095138ed93003f%3A0xf639a04a5814e515!2sWat%20Phnom!5e0!3m2!1sen!2skh!4v1648000000000!5m2!1sen!2skh"
                 width="100%"
                 height="100%"
                 style={{ border: 0 }}
                 allowFullScreen=""
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Leisure Lake Map"
                 className="grayscale hover:grayscale-0 transition-all duration-700"
               />
             </div>
             {/* Floating Info */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] glass p-6 rounded-3xl flex items-center gap-6 shadow-2xl">
                <div className="shrink-0 w-12 h-12 bg-lake-100 rounded-full flex items-center justify-center text-lake-600">
                   <MapPin className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-earth-900 text-sm">Leisure Lake Restaurant</h4>
                   <p className="text-xs text-earth-500 font-medium">Phnom Penh Cambodia 12000</p>
                </div>
                <div className="ml-auto hidden sm:block">
                   <button className="text-xs font-bold text-lake-600 hover:underline">Get Directions</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
