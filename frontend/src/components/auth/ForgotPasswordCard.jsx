import React, { useState, useEffect } from 'react';
import { Clock, Check, ArrowRight, Mail } from 'lucide-react';

export default function ForgotPasswordCard({ onSwitchToLogin, onSwitchToResetPassword }) {
  const [email, setEmail] = useState('guest@praneetha.com');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 mins

  // Countdown timer for 15 minutes token
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <div className="w-full praneetha-card-frame p-7 sm:p-9 animate-fade-in">
      {/* ─── Title & Subtitle ─── */}
      <div className="text-center mb-7">
        <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-white tracking-wide">
          Forgot Password?
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 font-sans leading-relaxed">
          Enter your registered patron email to receive an authenticated access link.
        </p>
      </div>

      {/* ─── Success Notification Banner ─── */}
      {sent && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-slide-down space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Authenticated reset link dispatched to {email}</span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Please inspect your inbox. For testing convenience, you can proceed directly to the Reset Password interface below.
          </p>
          <button
            type="button"
            onClick={onSwitchToResetPassword}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#e66200] hover:text-orange-400 font-semibold underline underline-offset-4"
          >
            <span>Proceed to Reset Password Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Address with REQUIRED badge */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
              EMAIL ADDRESS
            </label>
            <span className="text-[10px] font-mono tracking-wider text-neutral-400 font-semibold uppercase">
              REQUIRED
            </span>
          </div>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@praneetha.com"
              required
              className="w-full praneetha-input pr-10"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-sm select-none">
              @
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full praneetha-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Sending Encrypted Token...</span>
            </>
          ) : (
            <span>SEND RESET LINK</span>
          )}
        </button>

        {/* Token Expiry Pill */}
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181c] border border-white/5 text-[11px] text-neutral-400 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#e66200] shrink-0 animate-pulse" />
            <span className="tracking-wide">
              ENCRYPTED TOKEN • EXPIRES IN {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>
      </form>

      {/* ─── Bottom Box ─── */}
      <div className="mt-8 bg-[#18181b]/70 border border-white/5 rounded-xl py-3.5 px-4 text-center text-xs text-neutral-400">
        <span>Remember your credentials? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#e66200] hover:text-orange-400 font-semibold uppercase tracking-wider transition-colors ml-1"
        >
          BACK TO LOGIN
        </button>
      </div>
    </div>
  );
}
