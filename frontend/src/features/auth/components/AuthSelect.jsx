import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle } from 'lucide-react';

const AuthSelect = forwardRef(({ 
  label, 
  name, 
  defaultValue = 'buyer',
  options = [], 
  icon: Icon = UserCircle, 
  error 
}, ref) => {
  const [selected, setSelected] = useState(defaultValue);

  // Expose the value via ref for uncontrolled form handling
  useImperativeHandle(ref, () => ({
    value: selected
  }));

  return (
    <div className="w-full relative py-3 mb-2">
      <div className="group relative">
        {/* Label and Icon */}
        <div className="absolute left-0 top-1/2 -translate-y-[2.8rem] text-indigo-400 flex items-center gap-2">
          {Icon && <Icon size={16} strokeWidth={1.5} />}
          <label className="text-[10px] uppercase tracking-widest font-bold">
            {label}
          </label>
        </div>

        {/* Selection Area */}
        <div className="flex gap-4 pt-4">
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(option.value)}
                className={`relative flex-1 py-4 px-6 rounded-2xl border transition-all duration-500 overflow-hidden ${isSelected ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_4px_20px_0_rgba(99,102,241,0.2)] text-white' : 'border-slate-800/50 bg-slate-900/10 text-slate-500 opacity-60 hover:opacity-100 hover:border-slate-700'}`}
              >
                {/* Active Indicator Glow */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      layoutId="active-select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="relative font-bold tracking-tight text-sm uppercase">
                  {option.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 -bottom-4 text-[10px] text-red-400 font-bold uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AuthSelect;
