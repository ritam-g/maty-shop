import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import AuthSelect from '../components/AuthSelect';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';
import AuthLayout from '../components/AuthLayout';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

/**
 * Registration page component for new user sign-up
 * Handles user registration with full name, email, password, contact, and role selection
 * Supports Google OAuth authentication
 * 
 * @component
 * @returns {JSX.Element} The registration page UI
 */
function Register() {
  const { handleRegister } = useAuth();
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Optimized useRef for zero-re-render form state management
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const contactRef = useRef(null);
  const roleRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const contact = contactRef.current.value;
    const role = roleRef.current.value;

    const errors = {};
    if (!name) errors.name = 'Full name required for entry';
    if (!/^[A-Za-z\s]+$/.test(name)) errors.name = 'Letters and spaces only';

    if (!email) errors.email = 'Email address is required';

    if (!password) errors.password = 'Security password required';
    if (password.length < 6) errors.password = 'Minimum 6 characters required';

    if (!contact) errors.contact = 'Protocol contact number required';
    if (!/^\d{10,15}$/.test(contact)) errors.contact = '10-15 digits only';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = { name, email, password, role, contact };
    const success = await handleRegister(formData);
    if (success) {
      navigate("/");
    }
  };

  const roleOptions = [
    { label: 'Buyer', value: 'buyer' },
    { label: 'Seller', value: 'seller' },
  ];

  return (

    <AuthLayout
      title="Join the Circle."
      subtitle="Craft your digital ID within the Celestial Atelier collective."
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <AuthInput
            ref={nameRef}
            label="Full Name"
            name="name"
            icon={User}
            error={formErrors.name}
            required
          />

          <AuthInput
            ref={emailRef}
            label="Internal Email"
            type="email"
            name="email"
            icon={Mail}
            error={formErrors.email}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <AuthInput
              ref={contactRef}
              label="Contact"
              name="contact"
              type="tel"
              icon={Phone}
              error={formErrors.contact}
              required
            />

            <AuthSelect
              ref={roleRef}
              label="Protocol Role"
              name="role"
              icon={UserCircle}
              options={roleOptions}
              defaultValue="buyer"
            />
          </div>

          <AuthInput
            ref={passwordRef}
            label="Security Passkey"
            type="password"
            name="password"
            icon={Lock}
            error={formErrors.password}
            required
          />
        </div>

        <div className="flex items-start gap-4 pl-1">
          <div className="relative mt-1">
            <input
              type="checkbox"
              id="terms"
              required
              className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-800 bg-slate-950 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <label htmlFor="terms" className="text-[10px] text-slate-500 uppercase tracking-widest leading-tight select-none cursor-pointer">
            I accept the <span className="text-indigo-400 font-bold hover:underline">Atelier Charter</span> and <span className="text-indigo-400 font-bold hover:underline">Privacy Protocols</span>.
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500/80 p-4 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          <AuthButton type="submit" isLoading={isLoading}>
            Create Account
          </AuthButton>

          <div className="text-center">
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Already a member?{' '}
              <Link
                to="/login"
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer ml-3"
              >
                Sign In
              </Link>
            </p>

            {/* Google Button */}
            <ContinueWithGoogle />
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
