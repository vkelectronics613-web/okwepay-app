import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CheckoutForm from './CheckoutForm';
import { Activity } from 'lucide-react';

export default async function PayPage({ params }: { params: Promise<{ payment_id: string }> }) {
  const { payment_id } = await params;
  
  const payment = await prisma.payment.findUnique({
    where: { payment_id },
    include: { merchant: true }
  });

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-[95%] sm:w-[90%] max-w-[450px] bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 animate-in zoom-in-95">
        {/* Top Branding Bar */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={16} />
            </div>
            <span className="text-white font-[1000] tracking-tighter text-lg uppercase">OkwePay</span>
          </div>
          <div className="bg-indigo-600/20 px-3 py-1.5 rounded-full relative z-10 border border-indigo-500/30">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Secure Checkout</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Paying Merchant</p>
            <h1 className="text-xl font-[1000] text-slate-900 tracking-tight mb-4">{payment.merchant.name}</h1>
            <div className="bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100 shadow-sm">
                <span className="text-2xl font-black text-indigo-600 tracking-tighter">₹{payment.amount.toFixed(2)}</span>
            </div>
          </div>
          
          <CheckoutForm paymentId={payment.payment_id} initialStatus={payment.status} amount={payment.amount} />
        </div>
      </div>
    </div>
  );
}
