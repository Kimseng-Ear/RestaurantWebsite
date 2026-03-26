import React from 'react';
import { Facebook, MapPin, Phone, Instagram, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-earth-900 text-earth-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Waves className="w-8 h-8 text-lake-400" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none uppercase">LEISURE LAKE</span>
                <span className="text-[9px] font-semibold text-earth-300 uppercase tracking-[0.2em] mt-1">Lakeside Dining</span>
              </div>
            </Link>
            <p className="text-earth-400 text-sm leading-relaxed max-w-xs">
              Experience the tranquility of lakeside dining in Phnom Penh. Fresh food, stunning sunsets, and the sound of waves.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="p-2 bg-earth-800 rounded-full hover:bg-lake-600 transition-all">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="https://instagram.com" className="p-2 bg-earth-800 rounded-full hover:bg-pink-600 transition-all">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/menu" className="hover:text-lake-400 transition-colors">Menu</Link></li>
              <li><Link to="/reservation" className="hover:text-lake-400 transition-colors">Reservation</Link></li>
              <li><Link to="/gallery" className="hover:text-lake-400 transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-lake-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Opening Hours</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between"><span>Mon - Thu:</span> <span>10:00 AM - 10:00 PM</span></li>
              <li className="flex justify-between"><span>Fri - Sun:</span> <span>09:00 AM - 11:30 PM</span></li>
              <li className="pt-4 border-t border-earth-800 italic text-earth-500 text-xs text-center">Open on Public Holidays</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-lake-400 shrink-0" />
                <span className="text-earth-400">Phnom Penh Riverside, Cambodia 12000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-lake-400 shrink-0" />
                <span className="text-earth-400">069 984 886</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-earth-800 text-center text-earth-500 text-xs">
          <p>© {new Date().getFullYear()} Leisure Lake Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
