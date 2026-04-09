import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserCircle, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import AuthInput from '../components/AuthInput';
import AuthSelect from '../components/AuthSelect';
import AuthButton from '../components/AuthButton';

function Register() {
  const { handleRegister } = useAuth();
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    contact: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;


    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!formData.name) errors.name = 'Full name is required';
    if (!formData.email) errors.email = 'Email address is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.contact) errors.contact = 'Contact number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    console.log(formData);

    await handleRegister(formData);
    navigate("/")
  };

  const roleOptions = [
    { label: 'Enter as Buyer', value: 'buyer' },
    { label: 'Join as Seller', value: 'seller' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4 py-12 relative overflow-hidden font-inter selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-pink-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-5"
            >
              <ShoppingBag className="text-white" size={28} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-400 font-medium text-sm">Join our elite circle of shoppers and sellers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <AuthInput
                label="Full Name"
                name="name"
                placeholder="John Doe"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
              />

              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="john@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AuthInput
                  label="Contact Number"
                  name="contact"
                  placeholder="+1 234 567 890"
                  icon={Phone}
                  value={formData.contact}
                  onChange={handleChange}
                  error={formErrors.contact}
                />

                <AuthSelect
                  label="Join As"
                  name="role"
                  icon={UserCircle}
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>

              <AuthInput
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
              />
            </div>

            <div className="flex items-start gap-2 pt-2 ml-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-tight">
                I agree to the <span className="text-indigo-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <AuthButton type="submit" isLoading={isLoading}>
                Get Started
              </AuthButton>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
