import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router';

const CreateProduct = () => {
    const { createProductHandeler } = UseProduct();
    const { isLoading, error } = useSelector((state) => state.product);
   const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'INR',
        quantity: '',
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed");
            return;
        }
        
        const newImages = [...images, ...files];
        setImages(newImages);
        
        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('currency', formData.currency);
        data.append('quantity', formData.quantity);
        
        images.forEach(image => {
            data.append('images', image);
        });

        await createProductHandeler(data);
        
        if (!error) {
            setSuccessMessage(true);
            setFormData({ name: '', description: '', price: '', currency: 'INR', quantity: '' });
            setImages([]);
            setImagePreviews([]);
            navigate('/products')
            setTimeout(() => setSuccessMessage(false), 3000);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-inter">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-violet-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-4xl relative z-10 glass-dark rounded-[24px] p-8 md:p-12"
            >
                <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                         <Package className="text-indigo-400" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Create Listing</h1>
                        <p className="text-slate-400 mt-1 uppercase tracking-widest text-xs font-bold">Add item to your atelier</p>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500/80 p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            {error}
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <CheckCircle size={16} />
                            Product successfully created
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name Input */}
                        <div className="relative group md:col-span-2">
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                required 
                                placeholder=" "
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-indigo-500/80 focus:bg-slate-800/50 transition-all peer"
                            />
                            <label className="absolute left-4 top-4 text-slate-500 text-xs uppercase tracking-widest font-bold pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-bold peer-valid:top-2 peer-valid:text-[10px] peer-valid:font-bold">
                                Product Name
                            </label>
                        </div>

                        {/* Description Input */}
                        <div className="relative group md:col-span-2">
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleInputChange} 
                                required 
                                rows={4}
                                placeholder=" "
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-indigo-500/80 focus:bg-slate-800/50 transition-all peer resize-none"
                            />
                            <label className="absolute left-4 top-4 text-slate-500 text-xs uppercase tracking-widest font-bold pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-bold peer-valid:top-2 peer-valid:text-[10px] peer-valid:font-bold">
                                Detailed Description
                            </label>
                        </div>

                        {/* Price Input */}
                        <div className="relative group">
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleInputChange} 
                                required 
                                placeholder=" "
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-indigo-500/80 focus:bg-slate-800/50 transition-all peer"
                            />
                            <label className="absolute left-4 top-4 text-slate-500 text-xs uppercase tracking-widest font-bold pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-bold peer-valid:top-2 peer-valid:text-[10px] peer-valid:font-bold">
                                Price
                            </label>
                        </div>

                        {/* Currency Dropdown */}
                        <div className="relative group">
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-indigo-500/80 focus:bg-slate-800/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                            <label className="absolute left-4 top-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest pointer-events-none">
                                Currency
                            </label>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                ▼
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div className="relative group md:col-span-2">
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity} 
                                onChange={handleInputChange} 
                                required 
                                placeholder=" "
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-indigo-500/80 focus:bg-slate-800/50 transition-all peer"
                            />
                            <label className="absolute left-4 top-4 text-slate-500 text-xs uppercase tracking-widest font-bold pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-bold peer-valid:top-2 peer-valid:text-[10px] peer-valid:font-bold">
                                Stock Quantity
                            </label>
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-400">Media Assets (Up to 5)</label>
                        <div 
                            className={`w-full relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-slate-700/50 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-600'}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { 
                                e.preventDefault(); 
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                    fileInputRef.current.files = e.dataTransfer.files;
                                    handleImageChange({ target: { files: e.dataTransfer.files } });
                                }
                            }}
                        >
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                multiple 
                                accept="image/jpeg, image/png, image/jpg" 
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <UploadCloud className={`mb-4 w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`} />
                            <p className="text-sm text-slate-400 text-center max-w-sm">
                                Drag & drop high-resolution images here, or <span className="text-indigo-400 font-medium">browse files</span>
                            </p>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mt-2">
                                JPEG, PNG · MAX 5MB EACH
                            </p>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                                <AnimatePresence>
                                    {imagePreviews.map((preview, idx) => (
                                        <motion.div 
                                            key={preview}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className="relative aspect-square rounded-xl overflow-hidden group shadow-lg"
                                        >
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl"
                                                >
                                                    <X size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="pt-8">
                        <motion.button
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative overflow-hidden py-4 px-8 rounded-xl font-bold tracking-widest uppercase transition-all duration-500 shadow-[0_12px_32px_-8px_rgba(99,102,241,0.5)] active:shadow-none bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 text-white disabled:grayscale disabled:opacity-50 text-sm group"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <motion.div 
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                            />
                            <span className="relative flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : "Initialize Listing"}
                            </span>
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateProduct;
