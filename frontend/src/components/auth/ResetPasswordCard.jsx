import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Check, ArrowRight, AlertCircle, KeyRound, Shield } from 'lucide-react';
import { api } from '../../services/api.js';

export default function ResetPasswordCard({ onSwitchToLogin, isAdmin: propIsAdmin }) {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const tokenFromSession = sessionStorage.getItem('fuchsius_reset_token') || '';
  const savedRole = sessionStorage.getItem('fuchsius_reset_role') || '';
  const isAdmin = Boolean(propIsAdmin || searchParams.get('role') === 'admin' || savedRole === 'admin');

  const [token, setToken] = useState(tokenFromUrl || tokenFromSession);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(newPassword);
  const hasNumbers = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const allCriteriaMet = hasMinLength && hasLetters && hasNumbers && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setToast({
        type: 'error',
        message: 'A valid password reset token or link is required.',
      });
      return;
    }
    if (!allCriteriaMet) {
      setToast({
        type: 'error',
        message: 'Please meet all password requirements before proceeding.',
      });
      return;
    }

    setLoading(true);
    setToast(null);

    // Dedicated admin endpoint for administrators, unified endpoint for customers
    const endpoint = isAdmin ? '/auth/admin/reset-password' : '/auth/reset-password';

    try {
      await api.post(endpoint, {
        token: token.trim(),
        newPassword,
      });

      sessionStorage.removeItem('fuchsius_reset_token');
      sessionStorage.removeItem('fuchsius_reset_email');
      sessionStorage.removeItem('fuchsius_reset_role');

      setToast({
        type: 'success',
        message: `${isAdmin ? 'Admin password' : 'Password'} reset successfully! Redirecting to secure login...`,
      });
      setTimeout(() => {
        onSwitchToLogin(isAdmin);
      }, 1500);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to reset password. The link or token may be expired.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full praneetha-card-frame p-7 sm:p-9 animate-fade-in">
      {/* ─── Role Indicator Tag ─── */}
      {isAdmin && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e66200]/10 border border-[#e66200]/30 text-[#e66200] text-[11px] font-mono tracking-wider uppercase font-semibold">
            <Shield className="w-3 h-3" />
            ADMINISTRATOR CREDENTIAL ROTATION
          </span>
        </div>
      )}

      {/* ─── Title & Subtitle ─── */}
      <div className="text-center mb-7">
        <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-white tracking-wide">
          {isAdmin ? 'Admin Reset Password' : 'Reset Password'}
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 font-sans leading-relaxed">
          {isAdmin
            ? 'Set a new strong authentication passkey to secure the restaurant management panel.'
            : 'Create a new strong password to secure your patron account.'}
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
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Reset Token (if not pre-populated) */}
        {(!tokenFromUrl && !tokenFromSession) && (
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5">
              AUTHENTICATION RESET TOKEN
            </label>
            <div className="relative">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your 15-minute reset token"
                required
                className="w-full praneetha-input font-mono text-xs pr-10"
              />
              <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

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

        {/* Password Helper Requirement */}
        <div className="pt-0.5 space-y-1.5">
          <p
            className={`text-[11px] flex items-center gap-1.5 transition-colors duration-200 ${
              hasMinLength ? 'text-emerald-400' : 'text-neutral-400'
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                hasMinLength ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-[#e66200]'
              }`}
            />
            <span>At least 8 characters long</span>
          </p>

          <p
            className={`text-[11px] flex items-center gap-1.5 transition-colors duration-200 ${
              hasLetters && hasNumbers ? 'text-emerald-400' : 'text-neutral-400'
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                hasLetters && hasNumbers ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-[#e66200]'
              }`}
            />
            <span>Contains both letters and numbers</span>
          </p>

          {confirmPassword && (
            <p
              className={`text-[11px] flex items-center gap-1.5 transition-colors duration-200 ${
                passwordsMatch ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  passwordsMatch ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
                }`}
              />
              <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !allCriteriaMet}
          className="w-full praneetha-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide py-3.5 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Updating authentication passkey...</span>
            </>
          ) : (
            <span>RESET PASSWORD</span>
          )}
        </button>
      </form>

      {/* ─── Footer Link ─── */}
      <div className="mt-7 text-center text-xs text-neutral-400">
        <span>Back to sign in? </span>
        <button
          type="button"
          onClick={() => onSwitchToLogin(isAdmin)}
          className="text-[#e66200] hover:text-orange-400 font-medium transition-colors hover:underline cursor-pointer ml-1"
        >
          Login here
        </button>
      </div>
    </div>
  );
}
