"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[var(--background)]/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[15px] hover:opacity-85 transition-opacity flex items-center"
              id="nav-logo"
            >
              <span className="font-light tracking-[0.25em] text-[var(--text-muted)] uppercase">Retail</span>
              <span className="font-serif italic font-bold tracking-[0.1em] text-[var(--accent-gold)] uppercase ml-1">Pilot</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 bg-[var(--accent-gold)]/5 text-[var(--accent-gold)] text-[8px] font-medium tracking-[0.18em] uppercase px-2.5 py-0.5 rounded-full border border-[var(--accent-gold)]/25 backdrop-blur-sm shadow-[0_0_10px_rgba(197,168,128,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_rgba(163,230,53,0.6)]" />
              ed_graph // connected
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#categories"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Explore Styles
            </Link>
            <Link
              href="#products"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Curated Selection
            </Link>
            <Link
              href="#stylist"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Personal Stylist
            </Link>
            <Link
              href="#character"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Virtual Mannequin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-2 hover:text-[var(--foreground)] transition-colors cursor-pointer" 
              aria-label="Search Style Catalog"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:text-[var(--foreground)] transition-colors relative cursor-pointer" aria-label="Wardrobe Bag">
              <ShoppingBag size={16} strokeWidth={1.5} />
            </button>
            <ThemeToggle />
            <button
              className="md:hidden p-2 hover:text-[var(--foreground)] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[var(--border-soft)] bg-[var(--background)]/95 backdrop-blur-md px-4 py-4 space-y-3">
          <Link
            href="#categories"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] py-2"
            onClick={() => setIsOpen(false)}
          >
            Explore Styles
          </Link>
          <Link
            href="#products"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] py-2"
            onClick={() => setIsOpen(false)}
          >
            Curated Selection
          </Link>
          <Link
            href="#stylist"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] py-2"
            onClick={() => setIsOpen(false)}
          >
            Personal Stylist
          </Link>
          <Link
            href="#character"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--foreground)] py-2"
            onClick={() => setIsOpen(false)}
          >
            Virtual Mannequin
          </Link>
          <div className="pt-2 border-t border-[var(--border-soft)]">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
