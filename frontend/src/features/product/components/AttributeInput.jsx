import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AttributeInput = ({ attributes, setAttributes }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addAttribute = () => {
    if (newKey && newValue) {
      setAttributes({ ...attributes, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  const removeAttribute = (key) => {
    const newAttributes = { ...attributes };
    delete newAttributes[key];
    setAttributes(newAttributes);
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 block">
        Configuration Attributes
      </label>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Key (e.g. Color)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
        />
        <input
          type="text"
          placeholder="Value (e.g. Cobalt)"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
        />
        <button
          type="button"
          onClick={addAttribute}
          className="px-6 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-indigo-500/20 active:scale-95"
        >
          Add
        </button>
      </div>

      {/* List of attributes */}
      <div className="flex flex-wrap gap-2 pt-2">
        <AnimatePresence>
          {Object.entries(attributes).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 bg-slate-800 border border-white/10 px-3 py-1.5 rounded-lg group"
            >
              <span className="text-sm font-medium text-slate-300">
                <span className="text-indigo-400 font-bold">{key}:</span> {value}
              </span>
              <button
                type="button"
                onClick={() => removeAttribute(key)}
                className="text-slate-500 hover:text-rose-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttributeInput;
