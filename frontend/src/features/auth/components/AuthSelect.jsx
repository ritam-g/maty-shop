import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const AuthSelect = ({ label, icon: Icon, options, value, onChange, name, error, ...props }) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-200 pointer-events-none">
          {Icon && <Icon size={20} />}
        </div>
        
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-slate-900/50 border border-slate-700/50 text-white rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 backdrop-blur-sm ${error ? 'border-red-500' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-500 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthSelect;
