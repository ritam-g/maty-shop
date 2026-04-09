import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthButton = ({ children, isLoading, disabled, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || disabled}
      className={`relative w-full overflow-hidden rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        <span>{children}</span>
      </div>
      
      {/* Animated Shine Effect */}
      <motion.div
        initial={{ left: "-100%" }}
        animate={{ left: "100%" }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute top-0 h-full w-1/3 skew-x-12 bg-white/10"
      />
    </motion.button>
  );
};

export default AuthButton;
