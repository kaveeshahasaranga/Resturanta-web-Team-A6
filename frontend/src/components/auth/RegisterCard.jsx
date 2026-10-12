import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterCard({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('guest@praneetha.com');
  const [password, setPassword] = useState('dining2026');
  const [confirmPassword, setConfirmPassword] = useState('dining2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Requirement check: at least 8 chars with letters & numbers
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isRequirementMet = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRequirementMet) {
      setToast({
        type: 'error',
        message: 'Password must be at least 8 characters with letters and numbers.',
      });
      return;
    }
    if (!passwordsMatch) {
      setToast({
        type: 'error',
        message: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    setToast(null);

    setTimeout(() => {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Account created successfully! Welcome to PRANEETHA Patron Society.',
      });
    }, 900);
  };

  return (
    <div className="w-full praneetha-card-frame p-7 sm:p-9 animate-fade-in">
      {/* ─── Title & Subtitle ─── */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-white tracking-wide">
          Create an Account
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 font-sans leading-relaxed">
          Join PRANEETHA for a seamless dining and ordering experience.
        </p>
      </div>

      {/* ─── Notification Toast ─── */}
      {toast && (
        <div
          className={`mb-5 p-3 rounded-lg text-xs flex items-center gap-2 animate-slide-down ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            FULL NAME
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Eleanor Vance"
            required
            className="w-full praneetha-input"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@praneetha.com"
            required
            className="w-full praneetha-input"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            PASSWORD
          </label>
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

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full praneetha-input pr-10 font-sans tracking-wide"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Helper Requirement */}
        <div className="pt-0.5">
          <p
            className={`text-[11px] flex items-center gap-1.5 transition-colors duration-200 ${
              isRequirementMet ? 'text-emerald-400' : 'text-neutral-400'
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isRequirementMet ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-[#e66200]'
              }`}
            />
            <span>Must be at least 8 characters with letters and numbers.</span>
          </p>
        </div>

        {/* Newsletter Checkbox */}
        <div className="flex items-start gap-2.5 pt-1.5">
          <input
            type="checkbox"
            id="subscribeNewsletter"
            checked={subscribeNewsletter}
            onChange={(e) => setSubscribeNewsletter(e.target.checked)}
            className="praneetha-checkbox mt-0.5"
          />
          <label
            htmlFor="subscribeNewsletter"
            className="text-xs text-neutral-300 font-sans leading-relaxed select-none cursor-pointer"
          >
            Receive seasonal tasting menu previews and private table invitations
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full praneetha-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide py-3.5 mt-3"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Registering patron account...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>
      </form>

      {/* ─── Footer Link ─── */}
      <div className="mt-7 text-center text-xs text-neutral-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#e66200] hover:text-orange-400 font-medium transition-colors hover:underline cursor-pointer ml-1"
        >
          Login here
        </button>
      </div>
    </div>
  );
}
