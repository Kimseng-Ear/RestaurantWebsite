import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Fish, Sailboat, Sun, Compass, Utensils, Award, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const easing = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easing } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const About = () => {
   const journey = [
      { year: 2010, title: "The First Pavilion", desc: "Leisure Lake began as a modest family endeavor with just four tables over the water." },
      { year: 2015, title: "Lakeside Expansion", desc: "Crafted signature wooden platforms stretching further onto the lake for uninterrupted sunset vistas." },
      { year: 2020, title: "Culinary Distinction", desc: "Recognized among the finest lakeside dining experiences in Phnom Penh." },
      { year: 2024, title: "Sustainable Future", desc: "Pioneering lake conservation programs to protect our natural aquatic heritage." }
   ];

   const features = [
      { icon: <Fish />, title: "Sustainable Sourcing", desc: "Supporting local fisherman through traditional, mindful harvesting methods." },
      { icon: <Sailboat />, title: "Lake Excursions", desc: "Discover the serene waters prior to dining with our wooden boat services." },
      { icon: <Sun />, title: "Golden Hour", desc: "Signature twilight moments complemented by curated evening libations." },
      { icon: <Compass />, title: "Nature Trails", desc: "Surrounded by tranquil, untouched walking paths." }
   ];

   return (
      <div className="pt-24 min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50">
         
         {/* --- HERO SECTION --- */}
         <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-stone-200">
            <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }} className="absolute inset-0 z-0">
               <img
                  src="/images/LeisureLakeStory.jpg"
                  className="w-full h-full object-cover grayscale-[20%]"
                  alt="Lake Story"
               />
               <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply" />
               <div className="absolute inset-0 bg-stone-900/20" />
            </motion.div>
            
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-6 text-stone-50 space-y-6">
               <motion.span variants={fadeInUp} className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-300 border-b border-stone-400/50 pb-2">Our Heritage</motion.span>
               <motion.h1 variants={fadeInUp} style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight">The Essence</motion.h1>
            </motion.div>
         </section>

         {/* --- CORE VALUES --- */}
         <section className="py-32 max-w-[85rem] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
               {features.map((f, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1.2, ease: easing }} key={i} className="group space-y-8 flex flex-col items-center">
                     <div className="text-stone-300 group-hover:text-stone-800 transition-colors duration-700">
                        {React.cloneElement(f.icon, { className: "w-8 h-8 stroke-1" })}
                     </div>
                     <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-light text-stone-900 tracking-tight mb-4">{f.title}</h3>
                        <p className="text-stone-500 font-light text-sm leading-relaxed max-w-xs">{f.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </section>

         {/* --- PHILOSOPHY --- */}
         <section className="py-32 bg-stone-900 text-stone-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-800/20 mix-blend-overlay pointer-events-none" />
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easing }} className="space-y-12 order-2 lg:order-1">
                     <div className="space-y-6">
                        <span className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.3em] block border-b border-stone-700/50 pb-2">Philosophy</span>
                        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">Beyond a meal,<br/><span className="italic text-stone-400">a breath of life.</span></h2>
                     </div>
                     <div className="space-y-8 text-stone-400 italic text-[1.35rem] leading-relaxed font-light">
                        <p style={{ fontFamily: "'Playfair Display', serif" }}>"We believe that nature possesses an intrinsic ability to heal the soul. At Leisure Lake, our pursuit is to offer more than exquisite culinary traditions; we curate an environment that invites reflection, connection, and absolute peace."</p>
                        <div className="flex items-center gap-6 mt-8">
                           <div className="w-16 h-[1px] bg-stone-600" />
                           <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-300 not-italic">Sokha Som, Founder</span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-stone-800">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 text-stone-200">
                              <Target className="w-5 h-5 stroke-1" />
                              <span className="font-light tracking-widest uppercase text-xs">Our Mission</span>
                           </div>
                           <p className="text-sm font-light text-stone-500 leading-relaxed max-w-xs">To fiercely preserve Cambodian lakeside culinary heritage while fostering a profound daily connection with nature.</p>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 text-stone-200">
                              <Award className="w-5 h-5 stroke-1" />
                              <span className="font-light tracking-widest uppercase text-xs">Uncompromising Quality</span>
                           </div>
                           <p className="text-sm font-light text-stone-500 leading-relaxed max-w-xs">Sourcing 90% of our ingredients from select local farmers and fisherman within a 50km radius.</p>
                        </div>
                     </div>
                  </motion.div>

                  {/* Collage */}
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: easing }} className="order-1 lg:order-2 grid grid-cols-2 gap-8 relative">
                     <div className="space-y-8 mt-16">
                        <div className="aspect-[3/4] overflow-hidden border border-stone-700">
                           <img src="/images/aboutimg1.jpg" alt="Lake Culture" className="w-full h-full object-cover grayscale-[20%]" />
                        </div>
                        <div className="aspect-square rounded-full overflow-hidden border border-stone-700 bg-stone-800">
                           <img src="/images/aboutimg2.jpg" alt="Lakeside" className="w-full h-full object-cover grayscale-[40%]" />
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="aspect-square border border-stone-700 bg-stone-900 p-8 flex flex-col justify-center items-center text-center">
                           <Waves className="w-10 h-10 text-stone-500 mb-6 stroke-1" />
                           <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-200 text-2xl font-light">Lakeside</p>
                           <p className="text-[9px] text-stone-500 uppercase font-medium tracking-widest mt-2 border-t border-stone-800 pt-2">Total Immersion</p>
                        </div>
                        <div className="aspect-[3/4] overflow-hidden border border-stone-700">
                           <img src="/images/aboutimg3.jpg" alt="Sunset Culture" className="w-full h-full object-cover grayscale-[20%]" />
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* --- TIMELINE --- */}
         <section className="py-32 max-w-[85rem] mx-auto px-6 lg:px-12 overflow-hidden border-b border-stone-200">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easing }} className="text-center mb-24 space-y-6">
               <span className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.3em] border-b border-stone-300 pb-2">Milestones</span>
               <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">The Journey</h2>
            </motion.div>
            
            <div className="relative">
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stone-200 hidden lg:block" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                  {journey.map((item, i) => (
                     <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1.2, ease: easing }} key={i} className="bg-stone-50 p-10 border border-stone-200 flex flex-col items-center text-center lg:pt-20 hover:border-stone-400 transition-colors duration-500">
                        <div className="lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-16 h-16 bg-stone-50 border border-stone-300 flex items-center justify-center font-light text-stone-800 mb-8 lg:mb-0 text-lg z-20">
                           {item.year.toString().slice(2)}'
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-light text-stone-900 mb-4">{item.title}</h4>
                        <p className="text-sm font-light text-stone-500 leading-relaxed">{item.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- CTA --- */}
         <section className="py-32 bg-stone-50 text-center relative overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easing }} className="max-w-4xl mx-auto relative z-10 px-6 space-y-10">
               <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight">Come Write Your Story</h2>
               <p className="text-stone-500 text-lg font-light max-w-lg mx-auto leading-relaxed">Every guest represents a distinguished chapter in our lakeside history. We await your presence.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <Link to="/menu" className="w-full sm:w-auto inline-block border border-stone-900 text-stone-900 bg-transparent px-10 py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-stone-900 hover:text-stone-50 transition-colors duration-700 font-medium">
                     Culinary Offerings
                  </Link>
                  <Link to="/reservation" className="w-full sm:w-auto inline-block border border-stone-300 text-stone-500 bg-transparent px-10 py-4 uppercase tracking-[0.2em] text-[10px] hover:border-stone-900 hover:text-stone-900 transition-colors duration-700 font-medium">
                     Secure a Table
                  </Link>
               </div>
            </motion.div>
         </section>
      </div>
   );
};

export default About;
