"use client";

import { Sparkles, Search, ArrowRight, BookOpen, Layers, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AIPromptSearch() {
  const [query, setQuery] = useState("");

  const samplePrompts = [
    "Oversized black hoodies under $100",
    "Minimalist linen white shirts",
    "Old Money camel jackets",
    "Korean fashion cargo pants"
  ];

  const steps = [
    {
      num: "01",
      title: "Discover Styles",
      desc: "Explore curated collections and portals styled for Quiet Luxury, Techwear, or Streetwear."
    },
    {
      num: "02",
      title: "Virtual Try-On",
      desc: "Instantly layer garment assets on the interactive mannequin to preview outfit drapes."
    },
    {
      num: "03",
      title: "Aesthetic Scoring",
      desc: "Evaluate compatibility scores and read detailed critique reviews from our styling engine."
    },
    {
      num: "04",
      title: "Secure Checkout",
      desc: "Finalize transactions to write order entries directly to the SQLite ledger."
    }
  ];

  return (
    <>
      <section id="search" className="py-24 bg-[var(--background)] border-b border-[var(--border-soft)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-[var(--accent-gold)] uppercase">
              <Sparkles size={10} className="text-[var(--accent-gold)]" />
              Style Search Engine
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[var(--text-primary)]">
              Search Style Catalog
            </h2>
            <p className="text-xs font-light text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Describe what you are looking for in natural language. Try specifying styles, colors, categories, or price limits.
            </p>
          </div>

          {/* Minimal Bottom-Border Input Box */}
          <div className="relative max-w-2xl mx-auto border-b border-[var(--border-soft)] bg-transparent py-2 focus-within:border-[var(--accent-gold)] transition-all duration-300 flex items-center">
            <div className="pl-1 text-[var(--text-secondary)]">
              <Search size={16} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Describe your style (e.g. 'Oversized black hoodies' or 'Old Money aesthetic')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-sm py-2 px-3 text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-0"
              aria-label="Describe your style"
            />
            <button
              className="bg-transparent hover:text-[var(--foreground)] text-[var(--text-secondary)] p-2 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Send Search Request"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Suggestions */}
          <div className="space-y-3 pt-2">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] uppercase">
              Suggested Queries
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setQuery(prompt)}
                  className="border border-[var(--border-soft)] hover:border-[var(--accent-gold)]/50 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-xs font-light px-3.5 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 rounded-md cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-[var(--bg-secondary)]/40 border-b border-[var(--border-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-[var(--accent-gold)] uppercase">
              <BookOpen size={10} />
              SALON WORKFLOW
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[var(--text-primary)]">
              How It Works
            </h2>
            <p className="text-xs font-light text-[var(--text-secondary)] leading-relaxed">
              Composition of your signature aesthetic is distilled into a cohesive, structured pipeline.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="p-6 border border-[var(--border-soft)] bg-[var(--bg-card)]/50 backdrop-blur-md rounded-md flex flex-col justify-between aspect-[1.1] transition-all duration-300 hover:border-[var(--accent-gold)]/20"
              >
                <div className="space-y-3">
                  <span className="text-[14px] font-mono font-bold text-[var(--accent-gold)] block">
                    {step.num}
                  </span>
                  <h3 className="text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase font-mono">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-light text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
