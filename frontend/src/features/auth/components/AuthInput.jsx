import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = forwardRef(({ 
  label, 
  type = 'text', 
  icon: Icon, 
  error, 
  name, 
  required = false,
  placeholder = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full relative py-3">
      <div className="group relative">
        {/* Animated Icon */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-indigo-400 -translate-y-[2.8rem] scale-90' : 'text-slate-500'}`}>
          {Icon && <Icon size={18} strokeWidth={1.5} />}
        </div>
        
        {/* Floating Label */}
        <label className={`absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFocused || props.defaultValue ? '-translate-y-[2.8rem] text-xs text-indigo-400 font-bold uppercase tracking-widest' : 'text-slate-400'}`}>
          {label}
        </label>

        <input
          ref={ref}
          type={inputType}
          name={name}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(!!e.target.value);
          }}
          autoComplete="off"
          className={`w-full bg-transparent border-b-2 py-3 pl-7 pr-10 focus:outline-none transition-all duration-500 ease-out text-lg text-white font-medium ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800/50 focus:border-indigo-500/80 shadow-[0_1px_0_0_transparent] focus:shadow-[0_1px_20px_0_rgba(99,102,241,0.1)]'}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2 z-10"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        )}
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

export default AuthInput;
