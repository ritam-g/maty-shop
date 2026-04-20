import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import AttributeInput from './AttributeInput';
import ImageUploader from './ImageUploader';
import { UseProduct } from '../hooks/useProduct';

const VariantForm = ({ productId, onVariantAdded }) => {
  const { updateProductVarientHandeler } = UseProduct();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    currency: 'USD',
    attributes: {},
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setAttributes = (attributes) => {
    setFormData(prev => ({ ...prev, attributes }));
  };

  const setImages = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await updateProductVarientHandeler(formData, productId);
      if (res) {
        // Reset form
        setFormData({
          name: '',
          price: '',
          stock: '',
          currency: 'USD',
          attributes: {},
          images: []
        });
        if (onVariantAdded) onVariantAdded(res.updatedProduct);
      }
    } catch (error) {
      console.error("Failed to add variant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl h-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Add New Variant</h2>
        <p className="text-slate-500 mt-1">Configure options for your product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Variant Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Midnight Edition / 256GB"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none font-medium"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                {formData.currency === 'USD' ? '$' : formData.currency === 'INR' ? '₹' : '€'}
              </span>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              Stock Units
            </label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>
        </div>

        <AttributeInput 
          attributes={formData.attributes} 
          setAttributes={setAttributes} 
        />

        <ImageUploader 
          images={formData.images} 
          setImages={setImages} 
        />

        <Button
          type="submit"
          className="w-full py-4 text-lg font-bold"
          disabled={loading || formData.images.length === 0}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing Variant...
            </span>
          ) : 'Publish New Variant'}
        </Button>
      </form>
    </motion.div>
  );
};

export default VariantForm;
