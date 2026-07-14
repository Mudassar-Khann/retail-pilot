import React, { useState, useEffect } from "react";

export default function Footer() {
  const [ms, setMs] = useState("000");

  useEffect(() => {
    setMs(String(new Date().getMilliseconds()).padStart(3, '0'));
  }, []);

  return (
    <footer className="w-full relative overflow-hidden bg-black text-white pt-32 pb-12 border-t border-white/5 mt-auto">
      {/* Background grid effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--accent-gold)]">
                <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                <path d="M12 10l-4 8h8l-4-8z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
              </svg>
              <span className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-white">
                RETAIL<span className="text-[var(--accent-gold)]">PILOT</span>
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/40 max-w-sm leading-relaxed tracking-wider uppercase">
              An intelligent, design-first fashion catalog platform powered by computational curation. Discover your aesthetic, build curated looks, and express your style statement.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[9px] font-mono font-bold tracking-[0.25em] text-white/80 uppercase">
              Explore
            </h4>
            <ul className="space-y-4 text-[10px] font-mono tracking-widest text-white/50 uppercase">
              <li>
                <a href="#categories" className="hover:text-[var(--accent-gold)] transition-colors">Styles</a>
              </li>
              <li>
                <a href="#products" className="hover:text-[var(--accent-gold)] transition-colors">Catalog</a>
              </li>
              <li>
                <a href="#stylist" className="hover:text-[var(--accent-gold)] transition-colors">AI Stylist</a>
              </li>
              <li>
                <a href="#character" className="hover:text-[var(--accent-gold)] transition-colors">Virtual Model</a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[9px] font-mono font-bold tracking-[0.25em] text-white/80 uppercase">
              Company
            </h4>
            <ul className="space-y-4 text-[10px] font-mono tracking-widest text-white/50 uppercase">
              <li>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Terms of Use</a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Architecture</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[9px] font-mono font-bold tracking-[0.25em] text-white/80 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
              Subscribe
            </h4>
            <p className="text-[9px] font-mono text-white/40 tracking-wider uppercase leading-relaxed">
              Subscribe to updates on new collections and curated styling releases.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-[9px] px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-mono tracking-widest uppercase rounded-sm"
              />
              <button className="absolute right-1 top-1 bottom-1 px-4 bg-white/10 hover:bg-[var(--accent-gold)] hover:text-black transition-colors text-[9px] font-mono tracking-widest uppercase rounded-sm">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[8px] font-mono tracking-[0.25em] text-white/30 uppercase gap-6">
          <div className="flex items-center gap-4">
            <p>&copy; {new Date().getFullYear()} RETAILPILOT. ALL RIGHTS RESERVED.</p>
            <span className="hidden md:inline-block w-px h-3 bg-white/10" />
            <span className="hidden md:inline-block text-[var(--accent-gold)]">SERVICE ACTIVE // {ms}</span>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
