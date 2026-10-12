import React, { useState } from 'react';
import { Eye, EyeOff, Check, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordCard({ onSwitchToLogin }) {
  const [newPassword, setNewPassword] = useState('dining2026!');
  const [confirmPassword, setConfirmPassword] = useState('dining2026!');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(newPassword);
  const hasNumbers = /[0-9]/.test(newPassword);
  const hasSymbols = /[^a-zA-Z0-9]/.test(newPassword);
  const hasAllTypes = hasLetters && hasNumbers && hasSymbols;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const allCriteriaMet = hasMinLength && hasAllTypes && passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allCriteriaMet) {
      setToast({
        type: 'error',
        message: 'Please meet all password requirements before proceeding.',
      });
      return;
    }

    setLoading(true);
    setToast(null);

    setTimeout(() => {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Password reset successfully! Redirecting to secure login...',
      });
      setTimeout(() => {
        onSwitchToLogin();
      }, 1400);
    }, 900);
  };

  return (
    <div className="w-full praneetha-card-frame p-7 sm:p-9 animate-fade-in">
      {/* ─── Title & Subtitle ─── */}
      <div className="text-center mb-7">
        <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-white tracking-wide">
          Reset Password
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 font-sans leading-relaxed">
          Create a new strong password to secure your patron account.
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
        {/* New Password */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full praneetha-input pr-10 font-sans tracking-wide"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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

        {/* ─── Criteria Checklist Box ─── */}
        <div className="bg-[#18181b]/80 border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
          {/* Rule 1 */}
          <div className="flex items-center gap-2 transition-colors duration-200">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                hasMinLength ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
              }`}
            />
            <span className={hasMinLength ? 'text-neutral-200' : 'text-neutral-400'}>
              At least 8 characters in length
            </span>
          </div>

          {/* Rule 2 */}
          <div className="flex items-center gap-2 transition-colors duration-200">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                hasAllTypes ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
              }`}
            />
            <span className={hasAllTypes ? 'text-neutral-200' : 'text-neutral-400'}>
              Includes letters, numbers, and symbols
            </span>
          </div>

          {/* Rule 3 */}
          <div className="flex items-center gap-2 transition-colors duration-200">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                passwordsMatch ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
              }`}
            />
            <span className={passwordsMatch ? 'text-neutral-200' : 'text-neutral-400'}>
              Passwords match seamlessly
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="group w-full praneetha-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 mt-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Updating Patron Credentials...</span>
            </>
          ) : (
            <>
              <span>RESET PASSWORD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>

      {/* ─── Footer Link ─── */}
      <div className="mt-8 text-center text-xs text-neutral-400">
        <span>Remember your credentials? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#e66200] hover:text-orange-400 font-medium transition-colors hover:underline cursor-pointer ml-1"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
