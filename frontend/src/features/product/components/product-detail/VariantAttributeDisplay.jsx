import React from "react";

const COLOR_MAP = {
  black: "#111827",
  white: "#f8fafc",
  gray: "#6b7280",
  grey: "#6b7280",
  silver: "#cbd5e1",
  blue: "#60a5fa",
  navy: "#1e3a8a",
  red: "#f87171",
  green: "#4ade80",
  olive: "#4d7c0f",
  yellow: "#facc15",
  gold: "#d4af37",
  pink: "#f9a8d4",
  purple: "#a78bfa",
  brown: "#92400e",
  beige: "#d6d3c9",
  cream: "#f5f5dc",
  orange: "#fb923c",
};

const SIZE_KEYS = ["size", "waist", "fit", "length"];
const COLOR_KEYS = ["color", "colour", "finish", "shade"];

const normalizeLabel = (value) => String(value || "").trim().toLowerCase();

const isColorAttribute = (name) => COLOR_KEYS.some((key) => normalizeLabel(name).includes(key));

const isSizeAttribute = (name) => SIZE_KEYS.some((key) => normalizeLabel(name).includes(key));

const resolveColorValue = (value) => {
  const raw = String(value || "").trim();
  const normalized = raw.toLowerCase();

  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
  return COLOR_MAP[normalized] || null;
};

function VariantAttributeDisplay({ name, value, emphasized = false }) {
  const label = String(name || "");
  const displayValue = String(value || "");
  const isColor = isColorAttribute(label);
  const isSize = isSizeAttribute(label);
  const swatchColor = isColor ? resolveColorValue(displayValue) : null;

  if (isColor) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
        <span
          className="h-4 w-4 rounded-full border border-white/20 shadow-inner"
          style={{ backgroundColor: swatchColor || "#94a3b8" }}
          aria-hidden
        />
        <span className="uppercase tracking-[0.16em] text-slate-400">{label}</span>
        <span className={emphasized ? "text-white" : ""}>{displayValue}</span>
      </div>
    );
  }

  if (isSize) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-100">
        <span className="uppercase tracking-[0.16em] text-indigo-200/70">{label}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-black tracking-[0.18em] text-white">
          {displayValue}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
      <span className="uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className={emphasized ? "text-white" : ""}>{displayValue}</span>
    </div>
  );
}

export default VariantAttributeDisplay;
