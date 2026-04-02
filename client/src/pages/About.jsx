import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Waves, Fish, Sailboat, Sun, Compass, Utensils, Award, Target, ArrowRight, Droplet, Leaf, Wind, Heart, Star } from 'lucide-react';
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
   const containerRef = useRef(null);
   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end start"]
   });
   const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

   const journey = [
      { year: 2010, title: "The First Pavilion", desc: "Leisure Lake began as a modest family endeavor with just four tables over the water." },
      { year: 2015, title: "Lakeside Expansion", desc: "Crafted signature wooden platforms stretching further onto the lake for uninterrupted sunset vistas." },
      { year: 2020, title: "Culinary Distinction", desc: "Recognized among the finest lakeside dining experiences in Phnom Penh." },
      { year: 2024, title: "Sustainable Future", desc: "Pioneering lake conservation programs to protect our natural aquatic heritage." }
   ];

   const features = [
      { num: "01", icon: <Droplet />, title: "Sustainable Sourcing", desc: "Supporting local fisherman through traditional, mindful harvesting methods. • Direct trade partnerships\n• Seasonal-only catches\n• Zero-waste initiatives" },
      { num: "02", icon: <Sailboat />, title: "Lake Excursions", desc: "Discover the serene waters prior to dining with our wooden boat services. • Hand-crafted wooden boats\n• Guided tours\n• Twilight photography" },
      { num: "03", icon: <Sun />, title: "Golden Hour", desc: "Signature twilight moments complemented by curated evening libations. • Curated wine pairings\n• Distinctive lake reflections\n• Acoustic ambiance" },
      { num: "04", icon: <Leaf />, title: "Nature Trails", desc: "Surrounded by tranquil, untouched walking paths. • Native flora preservation\n• Bird-watching spots\n• Guided botanical walks" }
   ];

   return (
      <div className="pt-24 min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-800 selection:text-stone-50" ref={containerRef}>

         {/* --- HERO SECTION --- */}
         <section className="relative h-[75vh] flex items-center justify-center overflow-hidden border-b border-stone-200 group">
            <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 origin-top">
               <img
                  src="/images/LeisureLakeStory.jpg"
                  className="w-full h-full object-cover grayscale-[10%]"
                  alt="Lake Story"
               />
               <div className="absolute inset-0 bg-stone-900/30" />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[3000ms] mix-blend-overlay ease-in-out" />
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-6 text-stone-50 space-y-6">
               <motion.span variants={fadeInUp} className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-300 border-b border-stone-400/50 pb-2">Our Heritage</motion.span>
               <motion.h1 variants={fadeInUp} style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight max-w-5xl mx-auto leading-tight text-white">Where Waters Whisper Stories</motion.h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }} className="absolute bottom-8 right-8 z-10 border border-stone-50/20 backdrop-blur-sm bg-stone-900/40 px-6 py-3 rounded-full hidden md:block">
               <span className="text-xs font-black uppercase tracking-widest text-stone-200">Est. 2010</span>
            </motion.div>
         </section>

         {/* --- CORE VALUES --- */}
         <section className="py-32 max-w-[85rem] mx-auto px-6 lg:px-12 bg-white rounded-t-[4rem] -translate-y-12 relative z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
            <div className="text-center mb-24 max-w-2xl mx-auto space-y-6">
               <span className="text-[10px] uppercase tracking-widest text-stone-400 font-black border-b border-stone-300 pb-2">Our Commitments</span>
               <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-stone-900">Elevating Lakeside Living</h2>
            </div>

            <div className="space-y-32">
               {features.map((f, i) => (
                  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: easing }} key={i} className={`flex flex-col lg:flex-row gap-16 items-center group cursor-pointer ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>

                     <div className="lg:w-1/2 flex justify-center relative">
                        <div className="absolute inset-0 bg-stone-100 rounded-full scale-50 opacity-0 group-hover:scale-120 group-hover:opacity-100 transition-all duration-1000 ease-out" />
                        <div className="relative text-stone-300 group-hover:text-emerald-700 transition-colors duration-700 bg-white p-12 rounded-full border border-stone-100 shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-900/5 group-hover:border-emerald-900/10 z-10">
                           {React.cloneElement(f.icon, { className: "w-16 h-16 stroke-1" })}
                        </div>
                     </div>

                     <div className="lg:w-1/2 space-y-8 relative">
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-stone-200 to-transparent scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-1000 hidden lg:block" style={{ left: i % 2 !== 0 ? 'auto' : '-2rem', right: i % 2 !== 0 ? '-2rem' : 'auto' }} />

                        <div>
                           <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-4">Phase {f.num}</span>
                           <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-light text-stone-900 tracking-tight transition-colors group-hover:text-emerald-800">{f.title}</h3>
                        </div>

                        <div className="text-stone-500 font-light text-sm leading-relaxed space-y-2">
                           {f.desc.split('•').map((line, idx) => {
                              if (idx === 0) return <p key={idx} className="mb-6 text-base">{line.trim()}</p>;
                              return <p key={idx} className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-stone-200 group-hover:bg-emerald-300 transition-colors" /> {line.trim()}</p>;
                           })}
                        </div>

                        <div className="pt-4 flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-stone-400 group-hover:text-emerald-800 transition-colors">
                           <span>Explore Process</span>
                           <ArrowRight className="w-4 h-4 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                        </div>
                     </div>

                  </motion.div>
               ))}
            </div>
         </section>

         {/* --- PHILOSOPHY --- */}
         <section className="py-32 bg-stone-800 text-stone-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-700/20 mix-blend-overlay pointer-events-none" />
            <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easing }} className="space-y-12 order-2 lg:order-1 relative">
                     <div className="absolute left-[-2rem] top-0 bottom-0 w-[1px] bg-gradient-to-b from-stone-700 via-stone-600 to-stone-800 hidden lg:block" />

                     <div className="space-y-6">
                        <span className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.3em] block border-b border-stone-600/50 pb-2">Philosophy</span>
                        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">Beyond a meal,<br /><span className="italic text-stone-400">a breath of life.</span></h2>
                     </div>
                     <div className="space-y-8 text-stone-400 italic text-[1.75rem] leading-relaxed font-light">
                        <p style={{ fontFamily: "'Playfair Display', serif" }}>
                           <span className="float-left text-7xl mr-3 mt-[-12px] text-stone-300 font-normal">W</span>e believe that nature possesses an intrinsic ability to heal the soul. At Leisure Lake, our pursuit is to offer more than exquisite culinary traditions; we curate an environment that invites reflection, connection, and absolute peace.
                        </p>
                        <div className="flex items-center gap-6 mt-12 justify-end">
                           <div className="w-16 h-[1px] bg-stone-500" />
                           <span style={{ fontFamily: "'Dancing Script', 'Playfair Display', cursive" }} className="text-3xl text-stone-300">Sokha Som</span>
                           <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 not-italic border-l border-stone-600 pl-4">Founder</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-16 border-t border-stone-700">
                        <div className="space-y-5 lg:flex lg:flex-row lg:items-start lg:gap-5">
                           <Leaf className="w-8 h-8 text-stone-400 stroke-1 shrink-0" />
                           <div>
                              <span className="font-bold tracking-widest uppercase text-[10px] text-stone-200 block mb-3">Our Mission</span>
                              <p className="text-sm font-light text-stone-400 leading-relaxed">To fiercely preserve Cambodian lakeside culinary heritage while fostering a profound daily connection with nature.</p>
                           </div>
                        </div>
                        <div className="space-y-5 lg:flex lg:flex-row lg:items-start lg:gap-5">
                           <Star className="w-8 h-8 text-stone-400 stroke-1 shrink-0" />
                           <div>
                              <span className="font-bold tracking-widest uppercase text-[10px] text-stone-200 block mb-3">Uncompromising Quality</span>
                              <p className="text-sm font-light text-stone-400 leading-relaxed">Sourcing 90% of our ingredients from select local farmers and fisherman within a 50km radius.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Collage */}
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: easing }} className="order-1 lg:order-2 grid grid-cols-2 gap-8 relative group">
                     <div className="space-y-8 mt-16 relative">
                        <motion.div whileHover={{ scale: 1.02 }} className="aspect-[3/4] overflow-hidden border border-stone-600 relative">
                           <motion.img initial={{ scale: 1.2, filter: "blur(5px)" }} whileInView={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.5 }} src="/images/aboutimg1.jpg" alt="Lake Culture" className="w-full h-full object-cover grayscale-[20%]" />
                           <div className="absolute inset-0 bg-stone-800/20 group-hover:bg-transparent transition-colors duration-1000" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="aspect-square rounded-full overflow-hidden border border-stone-600 bg-stone-700 relative shadow-[0_0_50px_-20px_rgba(255,255,255,0.1)]">
                           <motion.img initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} transition={{ duration: 1.5 }} src="/images/aboutimg2.jpg" alt="Lakeside" className="w-full h-full object-cover grayscale-[40%]" />
                           <div className="absolute inset-0 bg-gradient-to-t from-stone-800/80 to-transparent" />
                           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay rounded-full" />
                           <div className="absolute inset-0 flex items-end justify-center pb-8 border-b-2 border-stone-500/30 rounded-full">
                              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-300 italic text-sm">"Still Waters"</p>
                           </div>
                        </motion.div>
                     </div>
                     <div className="space-y-8">
                        <div className="aspect-square border border-stone-600 bg-stone-700 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-stone-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                           <Waves className="w-10 h-10 text-stone-400 mb-6 stroke-1 relative z-10 group-hover:text-stone-300 transition-colors duration-700" />
                           <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-stone-200 text-2xl font-light relative z-10">Lakeside</p>
                           <p className="text-[9px] text-stone-400 uppercase font-bold tracking-widest mt-2 border-t border-stone-600 pt-2 relative z-10">Total Immersion</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} className="aspect-[3/4] overflow-hidden border border-stone-600 relative">
                           <motion.img initial={{ scale: 1.2, filter: "blur(5px)" }} whileInView={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.5 }} src="/images/aboutimg3.jpg" alt="Sunset Culture" className="w-full h-full object-cover grayscale-[20%]" />
                           <div className="absolute inset-0 bg-stone-800/20 group-hover:bg-transparent transition-colors duration-1000" />
                        </motion.div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* --- TIMELINE --- */}
         <section className="py-32 max-w-[85rem] mx-auto px-6 lg:px-12 bg-white border-b border-stone-200">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easing }} className="text-center mb-24 space-y-6">
               <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] border-b border-stone-300 pb-2">Milestones</span>
               <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">The Journey Unfolds</h2>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
               <div className="absolute top-0 bottom-0 left-[2rem] md:left-1/2 md:-translate-x-[0.5px] w-[1px] bg-gradient-to-b from-transparent via-stone-200 to-transparent" />

               <div className="space-y-16 lg:space-y-24 relative z-10">
                  {journey.map((item, i) => (
                     <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: easing }} key={i} className="relative flex flex-col md:flex-row items-start md:justify-between group cursor-pointer">

                        {/* Dot indicator */}
                        <div className="absolute left-[2rem] md:left-1/2 -translate-x-1/2 mt-2 w-4 h-4 rounded-full bg-white border-2 border-stone-300 group-hover:border-emerald-600 transition-colors duration-500 z-20 shadow-sm group-hover:scale-125" />

                        <div className={`pl-[5rem] md:pl-0 md:w-[45%] ${i % 2 === 0 ? 'md:text-right md:pr-20 md:ml-auto md:order-last' : 'md:text-left md:pl-20'}`}>
                           <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-light text-stone-900 mb-4 group-hover:text-emerald-800 transition-colors duration-500">{item.title}</h4>
                           <p className="text-base font-light text-stone-500 leading-relaxed max-w-sm inline-block">{item.desc}</p>
                        </div>

                        <div className={`absolute top-0 left-[5rem] md:static md:w-[45%] flex items-start mt-[-6px] ${i % 2 === 0 ? 'md:justify-start md:pl-20 md:order-first' : 'md:justify-end md:pr-20'}`}>
                           <p className="text-3xl lg:text-5xl font-black text-stone-200 group-hover:text-stone-300 transition-colors duration-500">{item.year}</p>
                        </div>

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
                  <Link to="/menu" className="w-full sm:w-auto inline-block border border-stone-900 text-stone-900 bg-transparent px-10 py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-stone-900 hover:text-stone-50 transition-colors duration-700 font-bold">
                     Culinary Offerings
                  </Link>
                  <Link to="/reservation" className="w-full sm:w-auto inline-block border border-stone-300 text-stone-500 bg-transparent px-10 py-4 uppercase tracking-[0.2em] text-[10px] hover:border-stone-900 hover:text-stone-900 transition-colors duration-700 font-bold">
                     Secure a Table
                  </Link>
               </div>
            </motion.div>
         </section>
      </div>
   );
};

export default About;
