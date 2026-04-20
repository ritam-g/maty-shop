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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8 lg:sticky lg:top-8"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Add New Variant</h2>
        <p className="text-slate-500 text-xs font-medium">Instantly expand your product catalogue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              Identity
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cobalt Edition"
              className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-xs">
                  {formData.currency === 'USD' ? '$' : '₹'}
                </span>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                Units
              </label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <AttributeInput 
          attributes={formData.attributes} 
          setAttributes={setAttributes} 
        />

        <div className="pt-2">
          <ImageUploader 
            images={formData.images} 
            setImages={setImages} 
          />
        </div>

        <Button
          type="submit"
          className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-indigo-500/20 shadow-xl"
          disabled={loading || formData.images.length === 0}
        >
          {loading ? 'Processing...' : 'Deploy Variant'}
        </Button>
      </form>
    </motion.div>
  );
};

export default VariantForm;
