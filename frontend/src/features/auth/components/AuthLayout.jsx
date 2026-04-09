import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, visualImage = "/auth_bg.png" }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-inter">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 -z-10 bg-slate-950 overflow-hidden">
        <motion.div
           animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[50rem] h-[50rem] bg-indigo-600/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -50, 70, 0],
            y: [0, 80, -30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[55rem] h-[55rem] bg-violet-600/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Main Full-Screen Layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="w-full min-h-screen flex flex-col lg:flex-row"
      >
        {/* Visual/Marketing Panel (60% on desktop) */}
        <div className="hidden lg:flex lg:w-3/5 relative min-h-screen overflow-hidden items-center justify-center p-20 border-r border-white/5">
          <motion.img 
            initial={{ scale: 1.1, filter: "blur(5px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 3, ease: "easeOut" }}
            src={visualImage} 
            alt="Branding Experience" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-950/10 to-transparent" />
          
          <div className="relative z-10 space-y-8 max-w-xl">
            <motion.div 
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <ShoppingBag className="text-white" size={26} />
                </div>
                <span className="text-indigo-400 font-bold tracking-[0.4em] text-xs uppercase">Celestial Atelier</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter leading-none">
                The <br/> Sanctuary <br/> of Digital <br/> Craft.
              </h1>
              
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
              
              <p className="text-slate-400 text-xl leading-relaxed max-w-md font-medium italic">
                Join our elite collective for a premium trade experience where elegance meets commerce.
              </p>
            </motion.div>
          </div>
          
          {/* Subtle Ambient Light Source */}
          <div className="absolute top-[30%] left-[20%] w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        </div>

        {/* Interaction/Form Panel (40% on desktop) */}
        <div className="flex-1 min-h-screen flex flex-col items-center justify-center p-8 md:p-14 lg:p-20 relative z-10 bg-slate-950 lg:bg-transparent">
          {/* Mobile Logo Only */}
          <div className="lg:hidden w-full flex items-center justify-center gap-3 mb-12">
            <ShoppingBag className="text-indigo-500" size={28} />
            <h1 className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Celestial Atelier</h1>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-md space-y-12"
          >
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="relative group">
              {children}
            </div>

            <div className="pt-10 flex flex-col items-center gap-2">
              <span className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
                Elite Security Certified
              </span>
              <div className="flex gap-4 opacity-40">
                <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">SSL</div>
                <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">AES</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer / Permanent Branding Links */}
      <div className="fixed bottom-8 right-12 hidden lg:flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-300">
        <a href="#rules" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer">Charter</a>
        <a href="#privacy" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer">Protocols</a>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Est. Excellence 2026</span>
      </div>
    </div>
  );
};

export default AuthLayout;
