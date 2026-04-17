import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import Container from './Container';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <Container>
        <div className="glass-dark rounded-3xl px-6 py-4 flex items-center justify-between border border-white/10 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">MATY<span className="text-indigo-500">SHOP</span></span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Collections', 'New Arrivals', 'Featured', 'About'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <User size={20} />
            </button>
            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
            <button className="md:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={20} />
            </button>
            <button className="relative p-2 text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-indigo-600 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-indigo-600">
                0
              </span>
            </button>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
