import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Shield, User, CreditCard, Lock, Mail } from 'lucide-react';

export default async function OkwepayAdmin() {
  const session = await getSession();
  
  // Basic protection: You can add more complex logic here
  if (!session || !session.userId) {
    redirect('/login');
  }

  // Fetch all merchants with their data
  const merchants = await prisma.merchant.findMany({
    include: {
      payments: true,
      api_keys: true,
    },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-10 gap-3">
          <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
            <Shield className="text-white h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gateway Super Admin</h1>
            <p className="text-gray-500 font-medium">Monitoring all merchants and transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {merchants.map((merchant) => {
            const totalSuccess = merchant.payments
              .filter(p => p.status === 'success')
              .reduce((sum, p) => sum + p.amount, 0);

            return (
              <div key={merchant.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
                <div className="bg-zinc-900 p-6 flex flex-wrap items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-white/20">
                      {merchant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        {merchant.name}
                        {totalSuccess > 1000 && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full uppercase tracking-tighter">VIP</span>}
                      </h2>
                      <div className="flex items-center gap-4 mt-1 opacity-70">
                        <span className="flex items-center gap-1 text-xs"><Mail size={14} /> {merchant.email}</span>
                        <span className="flex items-center gap-1 text-xs"><User size={14} /> ID: {merchant.id.slice(0,8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Lifetime Revenue</span>
                    <span className="text-3xl font-black text-green-400">₹{totalSuccess.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Security Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Lock size={16} /> Security & Auth
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Hashed Password</p>
                            <code className="text-xs text-indigo-600 break-all bg-indigo-50 p-1.5 rounded-lg block mt-1">
                              {merchant.password_hash}
                            </code>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Webhook URL</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">
                              {merchant.webhook_url || 'Not configured'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CreditCard size={16} /> Active API Keys
                      </h3>
                      <div className="space-y-3">
                        {merchant.api_keys.map(key => (
                          <div key={key.id} className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Secret Key</p>
                            <code className="text-xs text-red-600 font-mono break-all">{key.secret_key}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Stats */}
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={16} /> Transaction Summary
                    </h3>
                    <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-inner">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-100">
                          {merchant.payments.slice(0, 5).map(pay => (
                            <tr key={pay.payment_id}>
                              <td className="px-4 py-3 font-mono text-gray-400">...{pay.payment_id.slice(-6)}</td>
                              <td className="px-4 py-3 font-bold text-gray-900">₹{pay.amount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase
                                  ${pay.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {pay.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {merchant.payments.length === 0 && (
                            <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400 font-medium">No transactions found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {merchant.payments.length > 5 && (
                      <p className="text-center text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                        +{merchant.payments.length - 5} more transactions
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Reuse Activity icon if not imported
import { Activity } from 'lucide-react';
