'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2, Shield, Lock, ArrowRight, User, Info, Smartphone, QrCode } from 'lucide-react';

type State = 'IDLE' | 'PROCESSING' | 'PAYMENT_INFO' | 'SUCCESS';

export default function CheckoutForm({ paymentId, initialStatus, amount }: { paymentId: string, initialStatus: string, amount: number }) {
  const [state, setState] = useState<State>('IDLE');
  const [fullName, setFullName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [progress, setProgress] = useState(100);

  const upiSuffix = String.fromCharCode(46) + "owb";

  useEffect(() => {
    if (initialStatus === 'success') setState('SUCCESS');
  }, [initialStatus]);

  // Handle auto-redirect countdown
  useEffect(() => {
    if (state === 'SUCCESS') {
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleInitialPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.length < 3) {
      setError('Please enter your full name');
      return;
    }
    setError('');
    setState('PROCESSING');
    setTimeout(() => setState('PAYMENT_INFO'), 1200);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.endsWith(upiSuffix)) {
      setError(`Use a valid ${upiSuffix} handle`);
      return;
    }

    setState('PROCESSING');
    setError('');

    try {
      const res = await fetch('/api/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upi_id: upiId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUserName(data.user.username);
        setIsVerified(true);
        setState('PAYMENT_INFO');
      } else {
        setError(data.error || 'User not found');
        setState('PAYMENT_INFO');
      }
    } catch (err) {
      setError('Connection error');
      setState('PAYMENT_INFO');
    }
  };

  const handleFinalConfirm = async () => {
    setState('PROCESSING');
    setError('');

    try {
      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, upi_id: upiId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTimeout(() => {
            setState('SUCCESS');
            if (window.parent !== window) {
              window.parent.postMessage(JSON.stringify({
                type: 'OKWEPAY_SUCCESS',
                payment_id: paymentId,
                amount: amount,
                status: 'success'
              }), '*');
            }
        }, 1500);
      } else {
        setError(data.error || 'Payment failed');
        setState('PAYMENT_INFO');
      }
    } catch (err) {
      setError('Payment failed');
      setState('PAYMENT_INFO');
    }
  };

  // 1. INITIAL STATE (Name Input)
  if (state === 'IDLE') {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <form onSubmit={handleInitialPay} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
            <input
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 transition-all font-medium"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-tight">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100"
          >
            Proceed to Pay <ArrowRight size={18} />
          </button>
        </form>
        <Footer />
      </div>
    );
  }

  // 2. PROCESSING STATE
  if (state === 'PROCESSING') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          <Loader2 size={48} className="text-indigo-600 animate-spin" strokeWidth={3} />
        </div>
        <p className="mt-6 text-sm font-black text-slate-900 uppercase tracking-widest animate-pulse">Processing...</p>
      </div>
    );
  }

  // 3. OKWEBANK INTERFACE
  if (state === 'PAYMENT_INFO') {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
           {/* High Contrast QR Code Placeholder */}
           <div className="bg-white p-3 rounded-2xl border-4 border-slate-900 shadow-2xl mb-4 group hover:scale-105 transition-transform">
              <div className="bg-slate-900 p-1 rounded-lg">
                <QrCode size={160} className="text-white" />
              </div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan with OKWEBANK App</p>
        </div>

        <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OR USE HANDLE</span>
            <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="space-y-4">
            {!isVerified ? (
                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder={`username${upiSuffix}`}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-slate-900 font-black font-mono placeholder-slate-200 focus:outline-none focus:border-[#002B5B] transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#002B5B] text-[#FFD700] font-black py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest"
                    >
                        Verify My ID
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-[#002B5B] p-2 rounded-xl">
                            <User className="text-[#FFD700]" size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-indigo-400 uppercase">Linked Account</p>
                            <p className="font-black text-[#002B5B] truncate">{userName}</p>
                        </div>
                        <button onClick={() => setIsVerified(false)} className="text-[10px] font-black text-indigo-600 uppercase underline">Change</button>
                    </div>
                    <button
                        onClick={handleFinalConfirm}
                        className="w-full bg-[#002B5B] text-[#FFD700] font-black py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase text-sm tracking-[0.2em]"
                    >
                        Confirm ₹{amount.toFixed(2)}
                    </button>
                </div>
            )}
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase">{error}</p>}
        </div>
        <Footer />
      </div>
    );
  }

  // 4. SUCCESS SEQUENCE
  if (state === 'SUCCESS') {
    return (
      <div className="fixed inset-0 bg-[#21C179] z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
        {/* Confetti Particles (Simplified) */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute bg-white rounded-full animate-confetti"
                    style={{
                        width: Math.random() * 8 + 4 + 'px',
                        height: Math.random() * 8 + 4 + 'px',
                        left: '50%',
                        top: '50%',
                        '--x': (Math.random() - 0.5) * 400 + 'px',
                        '--y': (Math.random() - 0.5) * 400 + 'px',
                        animationDelay: Math.random() * 200 + 'ms'
                    } as any}
                ></div>
            ))}
        </div>

        {/* Animated Checkmark */}
        <div className="bg-white/20 p-6 rounded-full mb-8 backdrop-blur-sm animate-in zoom-in-50 duration-700 delay-200">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path className="animate-checkmark" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tighter mb-12 animate-in slide-in-from-bottom-2 duration-500 delay-300">Payment Successful</h2>

        {/* Receipt Card */}
        <div className="bg-white w-full rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-500 relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-3xl overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-[5000ms] linear" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant</span>
                    <span className="text-sm font-black text-slate-900">Paris Dream</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                    <span className="text-sm font-black text-slate-900">₹{amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <div className="flex items-center gap-1.5 text-[#21C179]">
                        <Check size={14} strokeWidth={4} />
                        <span className="text-xs font-black uppercase">Verified</span>
                    </div>
                </div>
            </div>
        </div>

        <p className="mt-8 text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Returning to merchant...</p>

        <style jsx global>{`
          @keyframes checkmark {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
          }
          .animate-checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: checkmark 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.5s;
          }
          @keyframes confetti {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
          }
          .animate-confetti {
            animation: confetti 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

function Footer() {
    return (
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
          <Lock size={12} className="text-slate-300" />
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Secure payment powered by OKWEBANK</p>
      </div>
    );
}
