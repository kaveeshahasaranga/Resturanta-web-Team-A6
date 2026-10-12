import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PrivateDiningModal({ isOpen, onClose }) {
  const [accessCode, setAccessCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | verifying | granted | error

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setAccessCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!accessCode) return;
    setStatus('verifying');
    setTimeout(() => {
      if (accessCode.trim().toUpperCase() === 'VIP' || accessCode.trim().length >= 4) {
        setStatus('granted');
      } else {
        setStatus('error');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#141417] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-scale-in"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(230,98,0,0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e66200]/10 border border-[#e66200]/30 text-[#e66200] mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-white font-medium tracking-wide">
            Private Dining Access
          </h3>
          <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
            Reserved exclusively for our patrons with bespoke table invitations & tasting reservations.
          </p>
        </div>

        {status === 'granted' ? (
          <div className="text-center py-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-white font-serif text-lg">Concierge Access Confirmed</h4>
            <p className="text-neutral-400 text-xs mt-1">
              Welcome to the PRANEETHA Salon Privé. Your curated reservations are prioritized.
            </p>
            <div className="mt-5 p-3 rounded-lg bg-[#1a1a1e] border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e66200]" />
              <span>Table Privée 04 • Sommelier Pairing Active</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full praneetha-btn-primary text-sm font-semibold py-2.5"
            >
              Enter Private Salon
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
                  Patron Passkey / Secret Token
                </label>
                <span className="text-[10px] text-[#e66200] font-mono">TRY: VIP</span>
              </div>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="e.g. VIP-PRANEETHA-789"
                className="w-full praneetha-input font-mono tracking-wider uppercase"
                autoFocus
              />
              {status === 'error' && (
                <p className="text-xs text-rose-400 mt-1.5">
                  Invalid token. Please contact your private dining concierge.
                </p>
              )}
            </div>

            <div className="bg-[#1a1a1e]/60 rounded-xl p-3 border border-white/5 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e66200] shrink-0" />
                <span>256-bit encrypted reservation tunnel</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e66200] shrink-0" />
                <span>Immediate sommelier & head chef private seating</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'verifying'}
              className="w-full praneetha-btn-primary flex items-center justify-center gap-2 text-sm font-semibold py-3"
            >
              {status === 'verifying' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Passkey...</span>
                </>
              ) : (
                <span>Authenticate Concierge Link</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
