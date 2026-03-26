import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Fish, Sailboat, Sun, Compass, Utensils, Award, Target } from 'lucide-react';

const About = () => {
   const journey = [
      { year: 2010, title: "The First Hut", desc: "Leisure Lake began as a small family lakeside hut with just 4 tables." },
      { year: 2015, title: "Lakeside Expansion", desc: "We added our signature wooden platforms over the water for the best sunset views." },
      { year: 2020, title: "Culinary Award", desc: "Recognized as the best lakeside dining experience in Phnom Penh." },
      { year: 2024, title: "Sustainable Future", desc: "Implementing lake conservation programs to protect our natural resource." }
   ];

   const features = [
      { icon: <Fish />, title: "Sustainable Fishing", desc: "We support local fisherman and use traditional sustainable methods." },
      { icon: <Sailboat />, title: "Boat Rentals", desc: "Explore the lake before your dinner with our wooden boat rentals." },
      { icon: <Sun />, title: "Sunset Rituals", desc: "Daily sunset countdown with special lakeside cocktails." },
      { icon: <Compass />, title: "Nature Trail", desc: "Surrounding the restaurant are beautiful nature walks." }
   ];

   return (
      <div className="pt-24 min-h-screen bg-white">
         {/* Hero Section */}
         <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
               <img
                  src="/images/LeisureLakeStory.jpg"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative text-center px-4 text-white space-y-4">
               <span className="text-lake-400 font-bold uppercase tracking-widest text-sm">Leisure Lake Story</span>
               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">Our Essence</h1>
            </div>
         </section>

         {/* Core Values / Features */}
         <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
               {features.map((f, i) => (
                  <div key={i} className="group space-y-6">
                     <div className="w-16 h-16 bg-lake-50 text-lake-600 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-lake-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                        {React.cloneElement(f.icon, { className: "w-8 h-8" })}
                     </div>
                     <h3 className="text-xl font-bold text-earth-900 uppercase tracking-tight">{f.title}</h3>
                     <p className="text-earth-500 text-sm leading-relaxed px-4">{f.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Philosophy Section */}
         <section className="py-24 bg-earth-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-10 order-2 lg:order-1">
                     <div className="space-y-4">
                        <span className="text-lake-600 font-bold uppercase tracking-[0.2em] text-xs">Philosophy</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-earth-900 tracking-tight leading-tight">Beyond just a meal, it's a breath of life.</h2>
                     </div>
                     <div className="space-y-6 text-earth-600 italic text-lg leading-relaxed">
                        <p>"We believe that nature has a way of healing the soul. At Leisure Lake, our goal is to provide more than just delicious Khmer food; we provide an environment that invites reflection, connection, and peace."</p>
                        <div className="flex items-center gap-4 text-earth-900 not-italic">
                           <div className="w-12 h-0.5 bg-lake-400" />
                           <span className="font-bold uppercase tracking-widest text-sm">— Founder, Sokha Som</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-8 pt-8 border-t border-earth-100">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-lake-600 font-bold">
                              <Target className="w-6 h-6" />
                              <span>Our Mission</span>
                           </div>
                           <p className="text-sm text-earth-500 leading-relaxed">To preserve Cambodian lakeside culinary traditions while fostering a deep connection with nature.</p>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-earth-800 font-bold">
                              <Award className="w-6 h-6" />
                              <span>Quality</span>
                           </div>
                           <p className="text-sm text-earth-500 leading-relaxed">We source 90% of our ingredients from local farmers and fisherman within 50km.</p>
                        </div>
                     </div>
                  </div>
                  <div className="order-1 lg:order-2 grid grid-cols-2 gap-6 relative">
                     <div className="space-y-6 mt-12">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                           <img src="https://scontent.fpnh7-2.fna.fbcdn.net/v/t39.30808-6/655463137_1383069800504480_6253432151272706718_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=6WXpIMaWa-QQ7kNvwHxBxxO&_nc_oc=Adp_qYZcNW3pcdW6TWwR-72Gr7_ZPtUV6DLuwCsIX0_GK6Pipg6XnWD0YQsKyyHSa5s&_nc_zt=23&_nc_ht=scontent.fpnh7-2.fna&_nc_gid=nO29xGckT4nryJs615BuUQ&_nc_ss=7a32e&oh=00_Afw5XaMTpWTT9dONis_kXdlQnYAe7SWzNMNF77LOJRKxGw&oe=69C9CF7A" alt="Lake Culture" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl">
                           <img src="https://scontent.fpnh7-2.fna.fbcdn.net/v/t39.30808-6/531133434_1194842962660499_7236155244680737208_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=7b2446&_nc_ohc=lWnXfXv-WbEQ7kNvwEUDd-b&_nc_oc=Adq7yOVFEB_nELFmoGuwxTNopM0fQG3QlYYrcY3QPuuO2oKfkIEaMubvBkeQh0vGae4&_nc_zt=23&_nc_ht=scontent.fpnh7-2.fna&_nc_gid=TROWiMa-PquZcXEhQcUVLw&_nc_ss=7a32e&oh=00_AfwB5gvbMmZaGNJvfGasY7xncoDEPj9ZzW3Il75fbDtGxA&oe=69C9DF97" alt="Lakeside" className="w-full h-full object-cover" />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-lake-100 p-8 flex flex-col justify-center items-center text-center">
                           <Waves className="w-12 h-12 text-lake-600 mb-4 animate-pulse" />
                           <p className="text-earth-900 font-bold text-xl">100% Lakeside</p>
                           <p className="text-xs text-earth-500 uppercase font-medium mt-1">Authentic Experience</p>
                        </div>
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                           <img src="https://scontent.fpnh7-2.fna.fbcdn.net/v/t39.30808-6/602897195_1308527704625357_1873471432280912648_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=nfeUC1UlQTsQ7kNvwHQCj0R&_nc_oc=AdpmPa1tqB7Hg8LFxzpnlzT2aXPe3wYqaVIT5YVUMDV6VYZFRdsuSPyDouw-3rinaT8&_nc_zt=23&_nc_ht=scontent.fpnh7-2.fna&_nc_gid=8jjScRPeMK0XvrrD010OIA&_nc_ss=7a32e&oh=00_Afz16ZbKlz7QJjcv882-2kfgNjBvLDanlwqkl-qu1V3iOg&oe=69C9B490" alt="Sunset Culture" className="w-full h-full object-cover" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Timeline Section */}
         <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="text-center mb-16 space-y-4">
               <span className="text-earth-400 font-bold uppercase tracking-widest text-xs">Milestones</span>
               <h2 className="text-4xl font-bold text-earth-900">The Journey of Leisure</h2>
            </div>
            <div className="relative">
               {/* Timeline Line */}
               <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-earth-100 hidden lg:block" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                  {journey.map((item, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-earth-100 flex flex-col items-center text-center lg:pt-16">
                        <div className="lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-16 h-16 bg-white border-2 border-lake-400 rounded-full flex items-center justify-center font-bold text-lake-600 mb-6 lg:mb-0 text-xl z-20">
                           {item.year.toString().slice(2)}'
                        </div>
                        <h4 className="text-xl font-bold text-earth-900 mb-3">{item.title}</h4>
                        <p className="text-sm text-earth-500 leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-24 bg-earth-900 text-white text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 px-4 space-y-8">
               <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Come Write Your Story With Us</h2>
               <p className="text-earth-400 text-lg">Every guest is a chapter in our lakeside history. We look forward to seeing you soon.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="btn-primary !bg-lake-500 hover:!bg-lake-600 shadow-2xl">Browse Our Menu</button>
                  <button className="btn-secondary !bg-transparent !text-white !border-white/40 hover:!bg-white/10">Read Guest Reviews</button>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none rotate-12 scale-150">
               <Waves className="w-[1000px] h-[1000px]" />
            </div>
         </section>
      </div>
   );
};

export default About;
