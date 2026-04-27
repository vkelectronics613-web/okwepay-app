import Link from 'next/link';
import { Activity, ArrowRight, Code, ShieldCheck, Zap, Globe, CreditCard, Terminal, CheckCircle2, BarChart3, Lock, Rocket, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-2xl font-[1000] tracking-tighter text-slate-900">okwepay</span>
          </div>
          
          <div className="hidden items-center gap-10 md:flex">
            <Link href="/docs" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Documentation</Link>
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Login</Link>
            <Link href="/register" className="flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-black text-white transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-48">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
          
          <div className="relative mx-auto max-w-7xl px-8 text-center lg:text-left">
            <div className="grid items-center gap-20 lg:grid-cols-2">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 rounded-full border-2 border-indigo-100 bg-white px-5 py-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                  </span>
                  Accept WBC Payments Instantly
                </div>
                
                <h1 className="text-6xl font-[1000] leading-[0.95] tracking-tighter text-slate-900 lg:text-8xl">
                  The infrastructure for <span className="text-indigo-600 italic">modern commerce.</span>
                </h1>
                
                <p className="max-w-2xl text-xl leading-relaxed text-slate-500 font-medium lg:text-2xl">
                  Integration in minutes. Settlements in milliseconds. Join thousands of merchants accepting <span className="text-slate-900 font-bold underline decoration-indigo-300 underline-offset-8">WebCoin</span> globally.
                </p>
                
                <div className="flex flex-col gap-6 sm:flex-row justify-center lg:justify-start">
                  <Link href="/register" className="flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-10 py-6 text-xl font-black text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:-translate-y-1 active:scale-95">
                    Start Accepting Payments <ArrowRight size={24} />
                  </Link>
                  <Link href="/docs" className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-10 py-6 text-xl font-black text-slate-700 transition-all hover:border-indigo-100 hover:bg-slate-50 active:scale-95">
                    Explore API Docs
                  </Link>
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="relative mx-auto w-full max-w-lg lg:mx-0">
                <div className="relative rounded-[3rem] border-[12px] border-slate-900 bg-white p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                    <div className="mb-10 flex items-center justify-between">
                         <div className="h-2 w-16 rounded-full bg-slate-100"></div>
                         <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Activity size={16} className="text-white" />
                         </div>
                    </div>
                    
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Paying Merchant</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">₹1,250.00</h3>
                        <p className="text-xs font-bold text-indigo-600 mt-2 italic underline">WebCoin (WBC)</p>
                    </div>

                    <div className="space-y-6">
                        <div className="h-20 bg-slate-50 rounded-2xl border-2 border-indigo-600 flex items-center px-6 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Globe size={20} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-900 leading-none mb-1">kittu.owb</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Account</p>
                                </div>
                            </div>
                            <div className="h-5 w-5 rounded-full border-4 border-indigo-600 bg-white"></div>
                        </div>
                        <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 uppercase text-xs tracking-widest">Confirm & Settle</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Scale Section */}
        <section className="bg-slate-900 py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/10 opacity-30"></div>
            <div className="max-w-7xl mx-auto px-8 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-4xl md:text-6xl font-[1000] text-white tracking-tighter leading-none mb-8">Built for the <br/><span className="text-indigo-400">global economy.</span></h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">No borders. No bank holidays. OkwePay enables real-time WBC settlements across any platform, anywhere in the world.</p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="border-l-2 border-indigo-500 pl-6">
                            <p className="text-3xl font-black text-white mb-1">99.9%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime SLA</p>
                        </div>
                        <div className="border-l-2 border-indigo-500 pl-6">
                            <p className="text-3xl font-black text-white mb-1">&lt; 50ms</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Latency</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <FeatureBox icon={<Zap />} title="Instant" />
                    <FeatureBox icon={<ShieldCheck />} title="Verified" />
                    <FeatureBox icon={<Terminal />} title="Dev-First" />
                    <FeatureBox icon={<Globe />} title="Infinite" />
                </div>
            </div>
        </section>

        {/* Integration Demo */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-[1000] tracking-tighter mb-4 text-slate-900">3 lines of code. <br/>Unlimited growth.</h2>
            </div>
            
            <div className="bg-slate-900 rounded-[3rem] p-1 items-stretch flex flex-col lg:flex-row shadow-2xl">
                <div className="flex-1 p-8 md:p-12">
                    <div className="flex gap-2 mb-8">
                        <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                    </div>
                    <pre className="text-indigo-300 font-mono text-sm md:text-lg leading-relaxed overflow-x-auto">
                        <code>{`// Initialize checkout
Okwepay.checkout({
  payment_id: "pay_92k83l...",
  onSuccess: (res) => fulfillOrder(res),
  onClose: () => trackAbandonment()
});`}</code>
                    </pre>
                </div>
                <div className="bg-indigo-600 rounded-[2.8rem] lg:w-[400px] p-12 flex flex-col justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Terminal size={120} /></div>
                    <h4 className="text-2xl font-black mb-4 relative z-10">Developers First.</h4>
                    <p className="text-indigo-100 font-medium mb-8 relative z-10 opacity-80 text-sm leading-relaxed">Detailed SDKs for Node.js, Python, React, and Go. Our documentation is a playground, not a chore.</p>
                    <Link href="/docs" className="bg-white text-indigo-600 py-4 px-8 rounded-2xl font-black text-center relative z-10 hover:scale-105 transition-all">View Full Docs</Link>
                </div>
            </div>
        </section>

        {/* Core Value Grid */}
        <section className="bg-slate-50 py-32 px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                <Value icon={<Rocket className="text-orange-500" />} title="Scale without friction" desc="Our serverless architecture handles millions of requests without breaking a sweat." />
                <Value icon={<Lock className="text-indigo-600" />} title="Ledger-grade safety" desc="Every WBC transaction is cryptographically signed and permanent." />
                <Value icon={<BarChart3 className="text-green-500" />} title="Real-time analytics" desc="Detailed dashboards showing conversion rates, volume, and payouts." />
            </div>
        </section>

        {/* CTA Footer */}
        <section className="py-48 px-8 text-center bg-white relative">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-[1000] tracking-[calc(-0.04em)] mb-10 text-slate-900">Stop waiting for <br/><span className="text-indigo-600">settlements.</span></h2>
                <Link href="/register" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-7 rounded-full text-2xl font-black hover:bg-indigo-600 hover:scale-105 transition-all shadow-2xl shadow-indigo-100">
                    Open Merchant Account <ArrowRight size={32} />
                </Link>
            </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 py-20 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-10 opacity-30">
          <Activity className="text-indigo-600" size={24} />
          <span className="text-2xl font-[1000] tracking-tighter text-slate-900">okwepay</span>
        </div>
        <div className="flex justify-center gap-10 text-xs font-black text-slate-400 uppercase tracking-widest mb-10">
            <Link href="/docs" className="hover:text-indigo-600 transition-colors">Developer Portal</Link>
            <Link href="/login" className="hover:text-indigo-600 transition-colors">Merchant Login</Link>
            <Link href="/admin" className="hover:text-red-500 transition-colors">Super Admin</Link>
        </div>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.4em]">© 2026 OKWEPAY SYSTEMS INC. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

function FeatureBox({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 backdrop-blur-md group hover:bg-indigo-600 transition-all cursor-default">
            <div className="text-white group-hover:scale-110 transition-transform">{icon}</div>
            <p className="text-xs font-black text-white uppercase tracking-widest">{title}</p>
        </div>
    )
}

function Value({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">{icon}</div>
            <h4 className="text-2xl font-black text-slate-900 mb-4">{title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    )
}
