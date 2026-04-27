'use client';

import { useState } from 'react';
import { Landmark, ArrowRight, Loader2, Link as LinkIcon, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PayoutManager({ 
  currentHandle, 
  availableBalance 
}: { 
  currentHandle: string | null, 
  availableBalance: number 
}) {
  const [payoutUpi, setPayoutUpi] = useState(currentHandle || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/merchant/link-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_upi: payoutUpi }),
      });
      if (res.ok) {
        setMessage('Bank handle linked successfully');
        router.refresh();
      } else {
        setError('Failed to link account');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) > availableBalance) {
        setError('Invalid amount');
        return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(withdrawAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Payout of ₹${withdrawAmount} successful!`);
        setWithdrawAmount('');
        router.refresh();
      } else {
        setError(data.error || 'Payout failed');
      }
    } catch (err) {
      setError('An error occurred during withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* 1. LINK ACCOUNT */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                <Landmark size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Settlement Account</h3>
        </div>

        <form onSubmit={handleLink} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your .owb handle</label>
                <input
                    type="text"
                    required
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    placeholder="username.owb"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-200 focus:outline-none focus:border-indigo-600 transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><LinkIcon size={16} /> Link Account</>}
            </button>
        </form>
      </div>

      {/* 2. WITHDRAW FUNDS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                Available: ₹{availableBalance.toFixed(2)}
            </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 p-2 rounded-xl text-green-600">
                <Download size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Withdraw WBC</h3>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount to withdraw</label>
                <input
                    type="number"
                    required
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-200 focus:outline-none focus:border-green-600 transition-all text-xl"
                />
            </div>
            <button
                type="submit"
                disabled={loading || availableBalance <= 0 || !currentHandle}
                className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-20"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><ArrowRight size={16} /> Payout Now</>}
            </button>
        </form>

        {message && <p className="mt-4 text-center text-xs font-bold text-green-600 uppercase tracking-tight">{message}</p>}
        {error && <p className="mt-4 text-center text-xs font-bold text-red-600 uppercase tracking-tight">{error}</p>}
      </div>
    </div>
  );
}
