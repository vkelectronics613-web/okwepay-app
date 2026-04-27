import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/auth';
import { Activity, CreditCard, LayoutDashboard, Wallet, LogOut, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import PayoutForm from './PayoutForm';

export const dynamic = 'force-dynamic';

export default async function PayoutsPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: session.userId },
    include: {
      payouts: {
        orderBy: { created_at: 'desc' },
        take: 10
      },
      payments: {
        where: { status: 'success' }
      }
    }
  });

  if (!merchant) {
    redirect('/login');
  }

  // Calculate Balances
  const totalEarned = merchant.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidOut = merchant.payouts
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const availableBalance = totalEarned - totalPaidOut;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Activity className="text-white" size={18} />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">okwepay</span>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link href="/payouts" className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                    <Wallet size={16} /> Payouts
                </Link>
                <Link href="/docs" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Docs</Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-px bg-slate-100 mx-6"></div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest mr-4">{merchant.name}</span>
              <form action={async () => { 'use server'; await logout(); redirect('/login'); }}>
                <button type="submit" className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Payouts</h1>
            <p className="text-slate-500 font-medium">Withdraw your WBC earnings to your personal okwebank account.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available for Payout</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">₹{availableBalance.toFixed(2)}</h3>
            </div>
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <CheckCircle2 size={48} className="text-white" />
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Settled</p>
                <h3 className="text-4xl font-black text-white tracking-tight">₹{totalPaidOut.toFixed(2)}</h3>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Payout Form */}
            <div className="lg:col-span-3">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                        Request Payout
                    </h2>
                    <PayoutForm availableBalance={availableBalance} initialHandle={merchant.payout_upi} />
                </div>
            </div>

            {/* Recent Payouts */}
            <div className="lg:col-span-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Recent Payouts</h3>
                <div className="space-y-4">
                    {merchant.payouts.length === 0 ? (
                        <div className="bg-slate-100/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase">No payout history</p>
                        </div>
                    ) : (
                        merchant.payouts.map(payout => (
                            <div key={payout.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-50 p-2 rounded-xl text-green-600">
                                        <ArrowUpRight size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">₹{payout.amount.toFixed(2)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(payout.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Success</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
