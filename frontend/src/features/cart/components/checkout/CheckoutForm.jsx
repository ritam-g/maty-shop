import React from "react";
import { motion as Motion } from "framer-motion";
import { CreditCard, MapPinHouse, Phone, User } from "lucide-react";

const paymentOptions = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "cod", label: "Cash on Delivery" },
];

const inputBaseClass = "w-full rounded-2xl border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition-all duration-300";

function CheckoutForm({
  values,
  errors,
  touched,
  isSubmitted,
  onChange,
  onBlur,
}) {
  const getFieldError = (fieldName) => {
    if (!isSubmitted && !touched[fieldName]) return "";
    return errors[fieldName] || "";
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">Shipping & Payment</h2>
        <p className="mt-2 text-sm text-slate-400">Enter delivery details and choose a payment method.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <User size={14} />
            Full Name
          </label>
          <input
            name="name"
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter your full name"
            className={`${inputBaseClass} ${
              getFieldError("name")
                ? "border-rose-400/40 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]"
                : "border-white/10 focus:border-indigo-400/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
            }`}
          />
          {getFieldError("name") && (
            <p className="mt-1.5 text-[11px] font-semibold text-rose-300">{getFieldError("name")}</p>
          )}
        </div>

        <div>
          <label className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Phone size={14} />
            Phone Number
          </label>
          <input
            name="phone"
            value={values.phone}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter your phone number"
            className={`${inputBaseClass} ${
              getFieldError("phone")
                ? "border-rose-400/40 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]"
                : "border-white/10 focus:border-indigo-400/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
            }`}
          />
          {getFieldError("phone") && (
            <p className="mt-1.5 text-[11px] font-semibold text-rose-300">{getFieldError("phone")}</p>
          )}
        </div>

        <div>
          <label className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <MapPinHouse size={14} />
            Delivery Address
          </label>
          <textarea
            name="address"
            value={values.address}
            onChange={onChange}
            onBlur={onBlur}
            rows={4}
            placeholder="House no, street, city, state, pin code"
            className={`${inputBaseClass} resize-none ${
              getFieldError("address")
                ? "border-rose-400/40 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]"
                : "border-white/10 focus:border-indigo-400/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
            }`}
          />
          {getFieldError("address") && (
            <p className="mt-1.5 text-[11px] font-semibold text-rose-300">{getFieldError("address")}</p>
          )}
        </div>

        <div>
          <label className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <CreditCard size={14} />
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paymentOptions.map((option) => {
              const checked = values.paymentMethod === option.id;
              return (
                <label
                  key={option.id}
                  className={`cursor-pointer rounded-2xl border px-3 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    checked
                      ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100 shadow-[0_10px_25px_rgba(99,102,241,0.2)]"
                      : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Motion.section>
  );
}

export default CheckoutForm;
