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
    <section id="search" className="py-20 bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            <Sparkles size={10} />
            Style Search Engine
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
            Ask the AI Assistant
          </h2>
          <p className="text-xs font-light text-neutral-500 max-w-md mx-auto">
            Describe what you are looking for in natural language. Try specifying styles, colors, categories, or price limits.
          </p>
        </div>

        {/* Input Box */}
        <div className="relative max-w-2xl mx-auto border border-neutral-300 bg-neutral-50/50 p-1.5 focus-within:border-neutral-800 transition-all duration-300 flex items-center shadow-sm">
          <div className="pl-3 text-neutral-400">
            <Search size={18} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Describe your style (e.g. 'Oversized black hoodies' or 'Old Money aesthetic')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm py-3 px-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
            aria-label="Describe your style"
          />
          <button
            className="bg-neutral-950 hover:bg-neutral-800 text-white p-3 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Send Search Request"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            Suggested Queries
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQuery(prompt)}
                className="border border-neutral-200 hover:border-neutral-900 bg-transparent text-xs font-light px-3 py-1.5 text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer"
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
