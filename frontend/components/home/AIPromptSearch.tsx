"use client";

import { Sparkles, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function AIPromptSearch() {
  const [query, setQuery] = useState("");

  const samplePrompts = [
    "Oversized black hoodies under $100",
    "Minimalist linen white shirts",
    "Old Money camel jackets",
    "Korean fashion cargo pants"
  ];

  return (
    <section id="search" className="py-24 bg-white border-b border-neutral-100/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            <Sparkles size={10} className="text-neutral-400" />
            Style Search Engine
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
            Search Style Catalog
          </h2>
          <p className="text-xs font-light text-neutral-500 max-w-md mx-auto leading-relaxed">
            Describe what you are looking for in natural language. Try specifying styles, colors, categories, or price limits.
          </p>
        </div>

        {/* Minimal Bottom-Border Input Box (Premium Minimalist reference) */}
        <div className="relative max-w-2xl mx-auto border-b border-neutral-200 bg-transparent py-2 focus-within:border-neutral-950 transition-all duration-300 flex items-center">
          <div className="pl-1 text-neutral-400">
            <Search size={16} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Describe your style (e.g. 'Oversized black hoodies' or 'Old Money aesthetic')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm py-2 px-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
            aria-label="Describe your style"
          />
          <button
            className="bg-transparent hover:text-neutral-950 text-neutral-400 p-2 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Send Search Request"
          >
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Suggestions */}
        <div className="space-y-3 pt-2">
          <p className="text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            Suggested Queries
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQuery(prompt)}
                className="border border-neutral-200 hover:border-neutral-950 bg-neutral-50 hover:bg-white text-xs font-light px-3.5 py-1.5 text-neutral-600 hover:text-neutral-900 transition-all duration-300 rounded-md cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
