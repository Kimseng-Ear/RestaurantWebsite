import React from 'react';
import { Facebook, MapPin, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-24 selection:bg-stone-800 selection:text-stone-100 border-t border-stone-900">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

          {/* Brand */}
          <div className="space-y-8 col-span-1 md:col-span-1 border-b md:border-b-0 border-stone-900 pb-10 md:pb-0">
            <Link to="/" className="inline-block text-stone-100">
              <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-light mb-1 text-white">Leisure Lake</h4>
              <span className="text-[8px] text-stone-500 uppercase tracking-[0.3em] font-medium block">A Signature Dining Experience</span>
            </Link>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm font-light">
              Experience the tranquility of lakeside dining in Phnom Penh. Impeccable flavors, curated ambiance, and timeless service.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.facebook.com/people/លំហែបាត់បឹង-Leisure-Lake/100064044191824/" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-200 transition-colors duration-500">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" className="text-stone-500 hover:text-stone-200 transition-colors duration-500">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8 pl-0 md:pl-10">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-xl">Directory</h3>
            <ul className="space-y-5 text-xs uppercase tracking-widest font-medium">
              <li><Link to="/menu" className="hover:text-stone-100 transition-colors duration-500">Culinary Menu</Link></li>
              <li><Link to="/reservation" className="hover:text-stone-100 transition-colors duration-500">Reservations</Link></li>
              <li><Link to="/gallery" className="hover:text-stone-100 transition-colors duration-500">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-stone-100 transition-colors duration-500">Our Heritage</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-8">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-xl">Service Hours</h3>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex justify-between border-b border-stone-900 pb-2"><span className="text-stone-500 tracking-wide text-xs uppercase">Mon - Thu</span> <span className="text-stone-300">10:00 - 22:00</span></li>
              <li className="flex justify-between border-b border-stone-900 pb-2"><span className="text-stone-500 tracking-wide text-xs uppercase">Fri - Sun</span> <span className="text-stone-300">09:00 - 23:30</span></li>
              <li className="pt-2 text-stone-600 text-xs italic font-serif">Available on Public Holidays</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-100 font-light text-xl">Inquiries</h3>
            <ul className="space-y-6 text-sm font-light">
              <li className="flex items-start space-x-4">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-1" />
                <span className="text-stone-400">Leisure Lake, Sangkat Prek Lieb, Khan Chroy Changvar, Phnom Penh</span>
              </li>
              <li className="flex items-center space-x-4 group cursor-pointer">
                <Phone className="w-4 h-4 text-stone-500 shrink-0 group-hover:text-stone-200 transition-colors" />
                <span className="text-stone-400 group-hover:text-stone-200 transition-colors">+855 69 984 886</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 font-light tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Leisure Lake. All rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="hover:text-stone-400 transition-colors duration-500">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400 transition-colors duration-500">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
