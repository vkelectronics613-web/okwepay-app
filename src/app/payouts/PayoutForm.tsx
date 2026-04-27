'use client';

import { useState } from 'react';
import { Loader2, ArrowRight, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PayoutForm({ 
    availableBalance, 
    initialHandle 
}: { 
    availableBalance: number, 
    initialHandle: string | null 
}) {
  const [payoutUpi, setPayoutUpi] = useState(initialHandle || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const upiSuffix = ".owb";

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (!payoutUpi.endsWith(upiSuffix)) {
        setError(`Please use a valid ${upiSuffix} handle`);
        return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. First ensure account is linked (sync with DB)
      if (payoutUpi !== initialHandle) {
        await fetch('/api/merchant/link-bank', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payout_upi: payoutUpi }),
        });
      }

      // 2. Perform the actual payout
      const res = await fetch('/api/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Successfully settled ₹${amount} to ${payoutUpi}`);
        setAmount('');
        router.refresh();
      } else {
        setError(data.error || 'Withdrawal failed');
      }
    } catch (err) {
      setError('A connection error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayout} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Withdrawal Amount</label>
            <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₹</span>
                <input
                    type="number"
                    step="0.01"
                    required
                    min="1"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-6 pl-12 pr-6 text-3xl font-[900] text-slate-900 placeholder-slate-200 focus:outline-none focus:border-indigo-600 transition-all"
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Recipient .owb Handle</label>
            <div className="relative">
                <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    required
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    placeholder={`username${upiSuffix}`}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-lg font-black text-slate-900 placeholder-slate-200 focus:outline-none focus:border-indigo-600 transition-all font-mono"
                />
            </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in duration-300">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-xs font-black text-red-600 uppercase tracking-tight">{error}</p>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100 animate-in fade-in duration-300">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-xs font-black text-green-700 uppercase tracking-tight">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || availableBalance <= 0 || !amount}
        className="w-full bg-green-600 text-white font-black py-8 rounded-[2rem] text-xl uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-green-700 active:scale-95 transition-all shadow-[0_20px_50px_rgba(22,163,74,0.3)] disabled:opacity-20 border-b-8 border-green-800"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            PROCESSING...
          </>
        ) : (
          <>
            PAYOUT NOW <ArrowRight size={24} strokeWidth={3} />
          </>
        )}
      </button>
    </form>
  );
}
