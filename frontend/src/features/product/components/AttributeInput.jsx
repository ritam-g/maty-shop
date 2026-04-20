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

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Spec Key (e.g. Size)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-bold"
          />
          <input
            type="text"
            placeholder="Val"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-20 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-bold text-center"
          />
          <button
            type="button"
            onClick={addAttribute}
            className="w-10 h-10 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" />
            </svg>
          </button>
        </div>

        {/* List of attributes */}
        <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
          <AnimatePresence>
            {Object.entries(attributes).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg group"
              >
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{key}:</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{value}</span>
                <button
                  type="button"
                  onClick={() => removeAttribute(key)}
                  className="text-slate-700 hover:text-rose-500 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AttributeInput;
