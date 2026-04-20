import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploader = ({ images, setImages }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const previews = images.map(img => typeof img === 'string' ? img : URL.createObjectURL(img));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] block text-center">
        Media Assets
      </label>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? 'scale-[0.98]' : ''}`}
      >
        <div className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 bg-slate-950 ${
          isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 group-hover:border-white/10'
        }`}>
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-white uppercase tracking-widest">Drop Product Media</p>
            <p className="text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-tight">SVG, PNG, JPG (MAX 5MB)</p>
          </div>
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      {/* Preview Area */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          <AnimatePresence>
            {previews.map((preview, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
              >
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-rose-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs leading-none">×</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
