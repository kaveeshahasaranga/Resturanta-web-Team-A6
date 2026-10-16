import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInCustomerCard({ onSwitchToAdmin, onSwitchToRegister, onSwitchToForgotPassword }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setToast(null);

    // Save patron credentials to profile
    try {
      const existing = localStorage.getItem('praneetha_patron_profile');
      const profileObj = existing ? JSON.parse(existing) : {};
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      localStorage.setItem(
        'praneetha_patron_profile',
        JSON.stringify({
          ...profileObj,
          email: email,
          name: profileObj.name || derivedName || 'Patron Member',
        })
      );
    } catch (err) {
      // ignore
    }

    setTimeout(() => {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Welcome back to PRANEETHA. Curating your private dining table...',
      });
      setTimeout(() => {
        navigate('/profile');
      }, 700);
    }, 900);
  };

  return (
    <div className="w-full praneetha-card-frame p-7 sm:p-9 animate-fade-in">
      {/* ─── Segmented Role Toggle ─── */}
      <div className="bg-[#19191d] p-1 rounded-xl flex items-center mb-7 border border-white/5">
        <button
          type="button"
          className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 bg-[#e66200] text-white shadow-md cursor-default"
        >
          Customer
        </button>
        <button
          type="button"
          onClick={onSwitchToAdmin}
          className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5"
        >
          Admin
        </button>
      </div>

      {/* ─── Title & Subtitle ─── */}
      <div className="text-center mb-7">
        <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-white tracking-wide">
          Sign In
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 font-sans leading-relaxed">
          Sign in to continue your curated dining experience.
        </p>
      </div>

      {/* ─── Notification Toast ─── */}
      {toast && (
        <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-slide-down">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full praneetha-input"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
              PASSWORD
            </label>
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-xs text-[#e66200] hover:text-orange-400 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full praneetha-input pr-10 font-sans tracking-wide"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="praneetha-checkbox"
          />
          <label 
            htmlFor="rememberMe" 
            className="text-xs text-neutral-300 font-sans select-none cursor-pointer"
          >
            Keep me signed in on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full praneetha-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 mt-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <span>SIGN IN</span>
          )}
        </button>
      </form>

      {/* ─── Footer Link ─── */}
      <div className="mt-8 text-center text-xs text-neutral-400">
        <span>Don’t have an account? </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#e66200] hover:text-orange-400 font-medium transition-colors hover:underline cursor-pointer ml-1"
        >
          Register here
        </button>
      </div>
    </div>
  );
}
