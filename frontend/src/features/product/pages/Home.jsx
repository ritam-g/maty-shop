import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { UseProduct } from '../hooks/useProduct';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';

function Home() {
  const { allProducts, isLoading, error } = useSelector((state) => state.product);
  const { getAllProductHandeller } = UseProduct();
  const products = useMemo(() => (Array.isArray(allProducts) ? allProducts : []), [allProducts]);

  const handleRetry = useCallback(() => {
    getAllProductHandeller({ force: true });
  }, [getAllProductHandeller]);

  useEffect(() => {
    getAllProductHandeller();
  }, [getAllProductHandeller]);

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <Navbar />

      <main className="relative pt-32 pb-20">
        {/* Hero Section */}
        <section className="py-20 overflow-hidden">
          <Container>
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                New Collection 2024
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
              >
                ELEVATE YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500">DIGITAL LIFESTYLE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-2xl text-slate-400 text-lg md:text-xl mb-12 font-medium"
              >
                Experience the next generation of premium tech and lifestyle products. 
                Curated for those who demand excellence in every detail.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <Button variant="primary" className="h-14 px-10 text-sm font-bold uppercase tracking-widest">
                  Shop Collection
                </Button>
                <Button variant="secondary" className="h-14 px-10 text-sm font-bold uppercase tracking-widest">
                  View Lookbook
                </Button>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Product Section */}
        <section className="py-20" id="products">
          <Container>
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
                  Featured Essentials
                </h2>
                <div className="h-1.5 w-24 bg-indigo-500 rounded-full mb-6" />
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className="text-white border-b-2 border-indigo-500 pb-1">All</span>
                <span className="hover:text-white transition-colors cursor-pointer pb-1">Tech</span>
                <span className="hover:text-white transition-colors cursor-pointer pb-1">Lifestyle</span>
                <span className="hover:text-white transition-colors cursor-pointer pb-1">Accessories</span>
              </div>
            </div>

            {error ? (
              <div className="glass-dark p-12 rounded-[2.5rem] border border-red-500/20 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-red-500">!</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">{error}</p>
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <ProductGrid products={products} isLoading={isLoading} />
            )}
          </Container>
        </section>

        {/* Footer Minimal */}
        <footer className="mt-40 py-12 border-t border-white/5">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tighter">MATY<span className="text-indigo-500">SHOP</span></span>
              </div>
              <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
              <p className="text-xs text-slate-600 font-medium">(c) 2024 MATYSHOP INC. ALL RIGHTS RESERVED.</p>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
}

export default Home;

