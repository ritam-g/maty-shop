import React, { useEffect } from "react";
import { useRevenue } from "../hooks/useRevenue";
import { Activity, AlertCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const RevenueCard = () => {
  const { revenue, isLoading, error, fetchRevenue } = useRevenue();

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden group hover:bg-slate-800/40 transition-colors duration-300 shadow-xl"
    >
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-400/20 transition-all duration-500" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
            Global Earnings
          </span>
          <h2 className="text-sm font-medium text-slate-300">Total Revenue</h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
          <Activity size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="animate-pulse flex items-center space-x-2">
            <div className="h-8 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-400 gap-2 text-xs font-medium">
            <AlertCircle size={14} />
            <span className="line-clamp-1">{error}</span>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl font-bold text-white tracking-tight"
            >
              ${Number(revenue || 0).toLocaleString()}
            </motion.span>
            <span className="text-emerald-400 text-xs font-semibold mb-1 flex items-center gap-1">
              <ArrowUpRight size={12} />
              +YTD
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RevenueCard;
