import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/auth';
import ApiKeyManager from './ApiKeyManager';
import WebhookManager from './WebhookManager';
import { Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  const [merchant, stats] = await Promise.all([
    prisma.merchant.findUnique({
      where: { id: session.userId },
      include: {
        api_keys: {
          orderBy: { created_at: 'desc' }
        },
        payments: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        payouts: true
      }
    }),
    prisma.payment.aggregate({
      where: { 
        merchant_id: session.userId,
        status: 'success'
      },
      _sum: {
        amount: true
      },
      _count: {
        payment_id: true
      }
    })
  ]);

  if (!merchant) {
    redirect('/login');
  }

  const totalReceived = stats._sum.amount || 0;
  const totalTransactions = stats._count.payment_id || 0;
  
  const totalPaidOut = merchant.payouts
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = totalReceived - totalPaidOut;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">OkwePay Dashboard</span>
              </div>
              <Link href="/payouts" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Payouts</Link>
              <Link href="/docs" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Developers & Docs</Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{merchant.name}</span>
              <form action={async () => {
                'use server';
                await logout();
                redirect('/login');
              }}>
                <button type="submit" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-widest">Total Received (Success)</dt>
                <dd className="mt-1 text-4xl font-black text-slate-900 tracking-tighter">₹{totalReceived.toFixed(2)}</dd>
              </div>
              <Link href="/payouts" className="mt-6 bg-green-600 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95">
                Withdraw Money <ArrowUpRight size={18} />
              </Link>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6">
              <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-widest">Total Transactions</dt>
              <dd className="mt-1 text-4xl font-black text-slate-900 tracking-tighter">{totalTransactions}</dd>
            </div>

            <div className="bg-zinc-900 overflow-hidden shadow rounded-lg p-6">
              <dt className="text-sm font-medium text-zinc-400 truncate uppercase tracking-widest">Available Balance</dt>
              <dd className="mt-1 text-4xl font-black text-white tracking-tighter">₹{availableBalance.toFixed(2)}</dd>
            </div>
          </div>

          <div className="mt-8">
            <ApiKeyManager initialKeys={merchant.api_keys} />
          </div>

          <WebhookManager initialWebhookUrl={merchant.webhook_url} />

          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Payments</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {merchant.payments.length === 0 ? (
                  <li className="px-4 py-4 sm:px-6 text-gray-500 text-sm">No payments yet.</li>
                ) : (
                  merchant.payments.map((payment) => (
                    <li key={payment.payment_id}>
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="text-sm font-medium text-indigo-600 truncate">
                          {payment.payment_id}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${payment.status === 'success' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'failed' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex text-sm text-gray-500">
                          ₹{payment.amount.toFixed(2)}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex text-sm text-gray-500">
                          {payment.created_at.toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
