"use client";

import { useState } from "react";
import { MotionPrimitive, MotionPresence } from "@/design-system/motion/engine";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import AIPromptSearch from "@/components/home/AIPromptSearch";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AIStylistPreview from "@/components/home/AIStylistPreview";
import VirtualCharacterConfigurator from "@/components/home/VirtualCharacterConfigurator";
import Footer from "@/components/layout/Footer";
import CurationDesk from "@/components/admin/CurationDesk";
import { useFeatureStore } from "@/store/featureStore";

export default function Home() {
  const [view, setView] = useState<"storefront" | "curation">("storefront");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const { flags } = useFeatureStore();



  return (
    <>
      {/* Utility Top Bar */}
      <div className="bg-[var(--bg-secondary)]/90 border-b border-[var(--border-soft)] text-[8px] font-mono tracking-widest text-[var(--text-secondary)] py-2 px-6 flex justify-between items-center z-50 relative select-none backdrop-blur-md">
        <span>ESTABLISHED 2026 // AUTUMN WINTER COLLECTION ACTIVE</span>
        <button
          onClick={() => setView(view === "storefront" ? "curation" : "storefront")}
          className="hover:text-[var(--foreground)] transition-colors cursor-pointer text-lime-400"
        >
          {view === "storefront" ? "[ SWITCH TO STAFF CURATION DESK ]" : "[ SWITCH TO SHOPPERS SHOWROOM ]"}
        </button>
      </div>

      {view === "curation" ? (
        <CurationDesk onExit={() => setView("storefront")} />
      ) : (
        <>
          <Navbar
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Active Search Drawer (absolute-positioned glass-fluted search bar overlay) */}
          <MotionPresence>
            {isSearchOpen && (
              <MotionPrimitive
                intent="none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 inset-x-0 h-16 bg-[var(--background)]/95 border-b border-[var(--border-soft)] z-[60] flex items-center glass-fluted"
              >
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-[9px] font-mono tracking-widest text-[var(--accent-gold)] select-none">
                      SEARCH_CATALOG //
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="TYPE STYLE QUERY (E.G. 'TAPESTRY', 'CORDUROY', 'STREETWEAR')..."
                      className="w-full bg-transparent border-none text-[var(--foreground)] text-xs font-mono tracking-widest placeholder:text-[var(--text-muted)] focus:outline-none uppercase"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-[8px] font-mono text-[var(--text-secondary)] hover:text-[var(--foreground)] uppercase tracking-widest cursor-pointer"
                      >
                        [ CLEAR ]
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="text-[8px] font-mono text-[var(--accent-gold)] hover:text-[var(--text-primary)] uppercase tracking-widest cursor-pointer font-bold"
                    >
                      [ CLOSE ]
                    </button>
                  </div>
                </div>
              </MotionPrimitive>
            )}
          </MotionPresence>

          <main className="flex-1">
            <Hero />
            <ProductShowcase />
            <AIPromptSearch />
            <FeaturedCategories onSelectStyle={setSelectedStyle} />
            <FeaturedProducts searchQuery={searchQuery} />
            <AIStylistPreview />
            <VirtualCharacterConfigurator defaultStyle={selectedStyle} />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
