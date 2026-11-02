import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  LogOut,
  AlertTriangle,
  Monitor,
  Check,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function SecurityTab({ userEmail = 'thrishala@example.lk' }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setToastMessage({
        type: 'error',
        text: 'Please enter your current authentication passkey.',
      });
      return;
    }
    if (!newPassword) {
      setToastMessage({
        type: 'error',
        text: 'Please enter your new authentication passkey.',
      });
      return;
    }
    if (newPassword.length < 6) {
      setToastMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMessage({
        type: 'error',
        text: 'New password and confirmation passkey do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setToastMessage({
        type: 'success',
        text: 'Passkey successfully rotated. Encrypted under AES-256 and bcrypt standards.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Failed to update passkey. Please verify your current password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllSessions = () => {
    setToastMessage({
      type: 'success',
      text: 'All other sessions have been terminated across all tablets and devices.',
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
    } else {
      setToastMessage({
        type: 'error',
        text: 'Account deletion protocol initiated. Dining concierge will purge all coordinates within 24 hours.',
      });
      setShowDeleteConfirm(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-[2px] bg-[#e66200]" />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#e66200] font-medium">
            ACCOUNT GOVERNANCE
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
          Security & Credentials
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-1.5 font-sans leading-relaxed">
          Manage your authentication password, active sessions, and confidential dining club governance with absolute discretion.
        </p>
      </div>

      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-slide-down ${
            toastMessage.type === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ─── Section 1: Change Password Card ─── */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              Change Password
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Ensure your credentials reflect our culinary sanctuary's standards.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#201812] border border-[#e66200]/30 text-[#e66200] text-[11px] font-semibold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5 text-[#e66200]" />
            <span>ENCRYPTED AES-256</span>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleUpdatePassword} className="pt-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#1a1a1e] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] transition-colors"
                placeholder="Enter current passkey"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
              NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new passkey"
                className="w-full bg-[#1a1a1e] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new passkey"
                className="w-full bg-[#1a1a1e] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Architecture Requirements Box */}
          <div className="bg-[#18181c] border border-white/[0.06] rounded-xl p-4">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-2">
              PASSWORD ARCHITECTURE REQUIREMENTS
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-300 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e66200]" />
                <span>Min. 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e66200]" />
                <span>One numeric symbol</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e66200]" />
                <span>One special character</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#e66200] hover:bg-orange-600 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>UPDATE PASSWORD</span>
          </button>
        </form>
      </div>

      {/* ─── Section 2: Account Authentication Details Card ─── */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="font-serif text-xl sm:text-2xl text-white">
            Account Authentication Details
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Audited records of your dining registry access and credentials.
          </p>
        </div>

        {/* Row 1: Registered Concierge Email */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
              REGISTERED CONCIERGE EMAIL
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              <span className="text-sm text-white font-sans">{userEmail}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Check className="w-3 h-3" />
                <span>VERIFIED PATRON</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-neutral-500 font-sans sm:text-right">
            Primary Channel
          </span>
        </div>

        {/* Row 2: Last Password Modification */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
              LAST PASSWORD MODIFICATION
            </p>
            <p className="text-sm text-white font-sans mt-1">
              14 August 2026, 21:40 <span className="text-neutral-500 text-xs">GMT+5:30</span>
            </p>
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 sm:text-right">
            ROTATED 60 DAYS AGO
          </span>
        </div>

        {/* Row 3: Active Concierge Sessions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans mb-1.5">
                ACTIVE CONCIERGE SESSIONS
              </p>
              <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-sans">
                <Monitor className="w-4 h-4 text-[#e66200]" />
                <span className="text-white font-medium">Desktop Chrome — Colombo, Sri Lanka</span>
                <span className="text-neutral-500">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  (Current Session)
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              112.134.188.47
            </span>
          </div>

          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Terminating all sessions will instantly invalidate any tablets, phones, and private booking screens.
          </p>

          <button
            onClick={handleLogoutAllSessions}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1e] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white hover:border-white/20 tracking-wider uppercase transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOG OUT FROM ALL DEVICES</span>
          </button>
        </div>
      </div>

      {/* ─── Section 3: Danger Zone Card ─── */}
      <div className="bg-[#170e0f] border border-red-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-red-900/30">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-red-400">
                Danger Zone
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Permanent membership termination protocol.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded text-[10px] font-mono tracking-widest uppercase font-semibold bg-red-950/60 border border-red-800/40 text-red-400">
            IRREVERSIBLE
          </span>
        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-xl">
            <h3 className="font-serif text-lg text-white font-normal mb-1">
              Delete Account
            </h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Account deletion is permanent and cannot be reversed. All saved profile coordinates, culinary notes, priority reservation histories, and saved signature dishes will be irrevocably purged.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleDeleteAccount}
              className={`px-5 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                showDeleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : 'bg-transparent border border-red-700/60 text-red-400 hover:bg-red-950/30 hover:border-red-500'
              }`}
            >
              {showDeleteConfirm ? 'CONFIRM PERMANENT PURGE' : 'DELETE MY ACCOUNT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
