import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';// Note: keeping hooks in features/auth as requested
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLayout from '../components/AuthLayout';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

/**
 * Login page component for user authentication
 * Handles user login with email and password
 * Supports Google OAuth authentication
 * 
 * @component
 * @returns {JSX.Element} The login page UI
 */
function Login() {
  const { handleLogin } = useAuth();
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Optimized useRef for zero-re-render form state management
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Direct DOM validation for maximum performance
    const errors = {};
    if (!email) errors.email = 'Email required for entry';
    if (!password) errors.password = 'Authentication key missing';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const success = await handleLogin({ email, password });
    if (success) navigate("/");


  };

  return (
    <AuthLayout
      title="Welcome Back."
      subtitle="Authenticate your identity to reconnect with the Celestial Atelier collective."
    >
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <AuthInput
            ref={emailRef}
            label="Email Address"
            type="email"
            name="email"
            icon={Mail}
            error={formErrors.email}
            required
          />

          <div className="space-y-2">
            <AuthInput
              ref={passwordRef}
              label="Secret Key"
              type="password"
              name="password"
              icon={Lock}
              error={formErrors.password}
              required
            />
            <div className="flex justify-end pt-2">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/60 hover:text-indigo-400 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500/80 p-4 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          <AuthButton type="submit" isLoading={isLoading}>
            Authenticate Entry
          </AuthButton>

          <div className="text-center">
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              New Here?{' '}
              <Link
                to="/register"
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer ml-3"
              >
                Join the circle
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

export default Login;
