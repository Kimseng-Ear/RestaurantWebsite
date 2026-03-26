import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote, Waves, Utensils, Camera, Fish } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('/reviews');
        setReviews(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, []);

  const features = [
    { icon: <Utensils className="w-8 h-8" />, title: "Exquisite Cuisine", desc: "Authentic Khmer food prepared with fresh lakeside ingredients." },
    { icon: <Waves className="w-8 h-8" />, title: "Stunning Views", desc: "Dine as the sun sets over the serene lake waters." },
    { icon: <Fish className="w-8 h-8" />, title: "Fresh Catch", desc: "Daily specials from the lake and local fisherman." },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/HeroImage.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative text-center px-4 max-w-4xl mx-auto text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-lake-400 font-semibold tracking-widest uppercase mb-4 block text-sm text-white">Welcome to Leisure Lake</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">Tranquil Dining by the Lake</h1>
            <p className="text-lg md:text-xl text-earth-200 mb-10 max-w-2xl mx-auto">
              Escape the city noise and immerse yourself in the natural beauty of Phnom Penh's lakeside.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reservation" className="btn-primary flex items-center gap-2 group">
                Reserve a Table <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/menu" className="btn-secondary flex items-center gap-2 !bg-transparent !text-white !border-white/40 hover:!bg-white/10">
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll Discover</span>
          <div className="w-0.5 h-10 bg-white/20 relative">
            <div className="w-full h-1/2 bg-white absolute top-0" />
          </div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-earth-600 font-bold tracking-widest uppercase text-xs inline-block bg-earth-100 px-3 py-1 rounded-full">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-bold text-earth-900 tracking-tight leading-tight">
                A Peaceful Escape in the Heart of Cambodia
              </h2>
              <p className="text-earth-600 text-lg leading-relaxed">
                Founded with a passion for Khmer culinary traditions and nature, Leisure Lake offers a unique dining experience. Located away from the hustle of central Phnom Penh, we provide a relaxing environment where nature and food harmoniously blend.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-lake-600 shrink-0">{f.icon}</div>
                    <div>
                      <h4 className="font-bold text-earth-900">{f.title}</h4>
                      <p className="text-sm text-earth-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://scontent.fpnh7-2.fna.fbcdn.net/v/t39.30808-6/508560281_1148914090586720_7636441366177789559_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=mREe4PbKiZwQ7kNvwES61zc&_nc_oc=Adr2iJd3Xvh-X3JS4xEQ4pwsZg71xdXC3kRKjXfN45A8yWSWFVc3FfDaRWVhUQYSej8&_nc_zt=23&_nc_ht=scontent.fpnh7-2.fna&_nc_gid=SmlbTUviMc3TZooaqXIdXw&_nc_ss=7a32e&oh=00_AfxtspF7mAiodGRnf2bpqd_VZTBxhqLDpFK5PmfGNN1HcQ&oe=69C9F546"
                  alt="Restaurant Environment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 glass rounded-3xl p-8 flex flex-col justify-center items-center text-center hidden xl:flex">
                <span className="text-4xl font-bold text-lake-600 mb-2">15+</span>
                <span className="text-sm font-semibold text-earth-600 uppercase tracking-widest">Years of Tradition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="text-lake-600 font-bold tracking-widest uppercase text-xs">Chef's Recommendations</span>
          <h2 className="text-4xl font-bold text-earth-900 mt-2">Signature Dishes</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Seafood Fried Rice", price: "12,000៛", img: "https://images.unsplash.com/photo-1603133872878-08132f159942?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
              { name: "Lemongrass Chicken", price: "15,000៛", img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
              { name: "Grilled Frog", price: "10,000៛", img: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
            ].map((dish, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden">
                  <img src={dish.img} alt={dish.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-earth-900 mb-2">{dish.name}</h3>
                  <p className="text-lake-600 font-bold mb-4">{dish.price}</p>
                  <Link to="/menu" className="text-sm font-semibold flex items-center gap-1 text-earth-600 hover:text-lake-600 group">
                    View details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lake-50 rounded-full blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-earth-600 font-bold tracking-widest uppercase text-xs">Testimonials</span>
            <h2 className="text-4xl font-bold text-earth-900 mt-2">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length > 0 ? reviews.map((review, i) => (
              <div key={i} className="glass p-8 rounded-3xl space-y-4">
                <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-earth-700 italic leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-earth-100">
                  <div className="w-10 h-10 bg-earth-200 rounded-full flex items-center justify-center font-bold text-earth-600 uppercase">{review.name[0]}</div>
                  <span className="font-bold text-earth-900">{review.name}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-earth-500">No reviews yet. Be the first to leave one!</div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-earth-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready for a lakeside adventure?</h2>
          <p className="text-earth-400 mb-10 max-w-2xl mx-auto">
            Book your table today and enjoy the most peaceful dining experience in Phnom Penh.
          </p>
          <Link to="/reservation" className="btn-primary !bg-lake-500 hover:!bg-lake-600 shadow-lake-500/20 shadow-2xl">Book a Table Now</Link>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Waves className="w-[800px] h-[800px] text-white rotate-12" />
        </div>
      </section>
    </div>
  );
};

export default Home;
