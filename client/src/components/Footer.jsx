import React from 'react';
import { Facebook, MapPin, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 pt-12 pb-32 md:pb-16 selection:bg-stone-800 selection:text-stone-100 border-t border-stone-900 overflow-x-hidden">
      <div className="max-w-[85rem] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div className="space-y-4 col-span-1 border-b sm:border-b-0 border-stone-900 pb-8 sm:pb-0">
            <Link to="/" className="inline-block text-stone-100">
              <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-light mb-1 text-white">Leisure Lake</h4>
              <span className="text-[7px] text-stone-600 uppercase tracking-[0.4em] font-black block">Signature Sanctuary</span>
            </Link>
            <p className="text-stone-500 text-[11px] leading-relaxed max-w-[240px] font-medium tracking-tight">
              Lakeside dining redefined. Impeccable flavors meet serene horizons in the heart of Phnom Penh.
            </p>
            <div className="flex space-x-5">
              <a href="https://www.facebook.com/people/លំហែបាត់បឹង-Leisure-Lake/100064044191824/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-200 transition-colors duration-500">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://instagram.com" className="text-stone-600 hover:text-stone-200 transition-colors duration-500">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-base">Directory</h3>
            <ul className="space-y-2 text-[10px] uppercase tracking-[0.15em] font-bold">
              <li><Link to="/menu" className="hover:text-stone-100 transition-colors duration-500">Culinary Menu</Link></li>
              <li><Link to="/reservation" className="hover:text-stone-100 transition-colors duration-500">Reservations</Link></li>
              <li><Link to="/gallery" className="hover:text-stone-100 transition-colors duration-500">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-stone-100 transition-colors duration-500">Our Heritage</Link></li>
              <li><Link to="/impressions" className="hover:text-stone-100 transition-colors duration-500">Guest Impressions</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-base">Service Hours</h3>
            <ul className="space-y-2.5 text-[11px] font-medium">
              <li className="flex justify-between border-b border-white/[0.03] pb-1.5"><span className="text-stone-500 tracking-wider text-[9px] uppercase font-black">Mon - Thu</span> <span className="text-stone-300">10:00 - 22:00</span></li>
              <li className="flex justify-between border-b border-white/[0.03] pb-1.5"><span className="text-stone-500 tracking-wider text-[9px] uppercase font-black">Fri - Sun</span> <span className="text-stone-300">09:00 - 23:30</span></li>
              <li className="pt-1 text-stone-600 text-[10px] italic font-serif">Holiday availability confirmed</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-base">Inquiries</h3>
            <ul className="space-y-3.5 text-[11px] font-medium leading-normal">
              <li className="flex items-start space-x-3 w-full">
                <MapPin className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
                <span className="text-stone-500 break-words line-clamp-3">Por Senchey district, Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center space-x-3 group cursor-pointer w-full">
                <Phone className="w-3.5 h-3.5 text-stone-600 shrink-0 group-hover:text-stone-200 transition-colors" />
                <span className="text-stone-500 group-hover:text-stone-200 transition-colors break-words">+855 69 984 886</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center text-[9px] text-stone-600 font-black tracking-[0.2em] uppercase">
          <p>© {new Date().getFullYear()} Leisure Lake Portal. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link to="/legal?tab=privacy" className="hover:text-stone-400 transition-colors duration-500">Privacy</Link>
            <Link to="/legal?tab=terms" className="hover:text-stone-400 transition-colors duration-500">Terms</Link>
            <Link to="/policy" className="hover:text-stone-400 transition-colors duration-500">Policies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
