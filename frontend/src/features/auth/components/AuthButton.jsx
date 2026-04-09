import React from 'react';
import { motion } from 'framer-motion';

const AuthButton = ({ children, isLoading, type = 'submit', className = '', onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={`relative w-full overflow-hidden group py-4 px-8 rounded-2xl font-bold tracking-widest uppercase transition-all duration-500 shadow-[0_12px_32px_-8px_rgba(99,102,241,0.5)] active:shadow-none bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 text-white disabled:grayscale disabled:opacity-50 text-sm ${className}`}
    >
      {/* Background Glow Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Animated Shine Effect */}
      <motion.div 
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
      />

      <span className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

export default AuthButton;
