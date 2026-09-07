import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalTab, 
    closeAuthModal, 
    login, 
    register, 
    loginAsDemoCustomer, 
    loginAsDemoAdmin 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(authModalTab);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync tab when opened from header
  React.useEffect(() => {
    setActiveTab(authModalTab);
    setError(null);
    setSuccessMsg(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else if (activeTab === 'register') {
        if (!name.trim()) throw new Error('Full Name is required');
        await register(name, email, password, phone);
      } else if (activeTab === 'forgot') {
        const res = await api.forgotPassword(email);
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-[#333333] max-w-md w-full rounded-lg shadow-2xl border border-[#E5E1D8] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#FDFCF8] border border-[#E5E1D8] hover:bg-[#FAF7F2] flex items-center justify-center text-sm font-bold text-[#555555]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-[#E5E1D8] bg-[#FDFCF8]">
          <h2 className="font-serif text-2xl font-bold text-[#8B0000]">
            {activeTab === 'login' && 'Welcome Back'}
            {activeTab === 'register' && 'Create Your Festive Account'}
            {activeTab === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            {activeTab === 'login' && 'Log in to track your festive orders & wishlist'}
            {activeTab === 'register' && 'Join Utsav Veda to receive special festive perks'}
            {activeTab === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>

          {/* Tab Switcher */}
          {activeTab !== 'forgot' && (
            <div className="flex rounded-md bg-[#FDFCF8] border border-[#E5E1D8] p-1 mt-4 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-sm transition-all ${
                  activeTab === 'login' ? 'bg-[#8B0000] text-white shadow-2xs' : 'text-[#555555] hover:text-[#333333]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-sm transition-all ${
                  activeTab === 'register' ? 'bg-[#8B0000] text-white shadow-2xs' : 'text-[#555555] hover:text-[#333333]'
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-md text-xs bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                />
                <UserIcon className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-md text-xs bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
              />
              <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 rounded-md text-xs bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                />
                <Phone className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {activeTab !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#333333]">Password</label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot'); setError(null); }}
                    className="text-[11px] font-semibold text-[#8B0000] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-md text-xs bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                />
                <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold tracking-wide transition-colors shadow-2xs mt-2 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Please wait...' : activeTab === 'login' ? 'Sign In to Account' : activeTab === 'register' ? 'Complete Registration' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {activeTab === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className="text-xs font-bold text-[#8B0000] hover:underline"
              >
                ← Return to Sign In
              </button>
            </div>
          )}
        </form>

        {/* 1-Click Demo Evaluation Box */}
        <div className="p-4 bg-[#FDFCF8] border-t border-[#E5E1D8] text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8B0000] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Demo Sign-In (For Reviewers)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                await loginAsDemoCustomer();
                setLoading(false);
              }}
              className="py-1.5 px-2 rounded-md bg-white border border-[#D4AF37]/50 text-[#8B0000] text-[11px] font-bold hover:bg-[#FDFCF8] transition-colors shadow-2xs"
            >
              👤 Demo Customer
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                await loginAsDemoAdmin();
                setLoading(false);
              }}
              className="py-1.5 px-2 rounded-md bg-[#8B0000] text-[#FFF9EE] text-[11px] font-bold hover:bg-[#700000] transition-colors shadow-2xs"
            >
              👑 Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
