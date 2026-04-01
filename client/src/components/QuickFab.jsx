import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickFab = () => {
    return (
        <div className="fixed bottom-10 right-10 z-[100] group">
            {/* Attention-grabbing Pulse Label */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                    opacity: [0.6, 1, 0.6], 
                    y: [0, -5, 0],
                    scale: [1, 1.05, 1] 
                }}
                transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="absolute -top-12 right-0 bg-stone-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl whitespace-nowrap flex items-center gap-2 pointer-events-none"
            >
                <div className="w-1 h-1 rounded-full bg-yellow-500 animate-ping" />
                Explore Menu
            </motion.div>

            {/* Main FAB Link */}
            <Link to="/menu">
                <motion.div
                    initial={{ y: 0 }}
                    animate={{
                        y: [0, -15, 0],
                        boxShadow: [
                            "0 15px 30px rgba(0,0,0,0.2)",
                            "0 30px 60px rgba(0,0,0,0.4)",
                            "0 15px 30px rgba(0,0,0,0.2)"
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex items-center justify-center w-20 h-20 rounded-full bg-stone-900 text-stone-100 shadow-2xl transition-colors duration-500 overflow-hidden border border-white/10 group-hover:bg-stone-800"
                >
                    {/* Visual Energy Rings */}
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full border-2 border-stone-400 pointer-events-none"
                    />
                    
                    <div className="flex flex-col items-center gap-1 z-10">
                        <UtensilsCrossed size={22} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform duration-500" />
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 text-stone-400 group-hover:text-white" />
                    </div>

                    {/* Subtle Gradient Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-stone-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </motion.div>
            </Link>

            {/* Extra Outer Ripple for maximum visibility */}
            <motion.div
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-stone-900/10 pointer-events-none -z-10"
            />
        </div>
    );
};

export default QuickFab;
