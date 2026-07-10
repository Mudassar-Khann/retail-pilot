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
              className="text-[15px] font-semibold tracking-[0.25em] uppercase text-[var(--accent-gold)] hover:opacity-85 transition-opacity"
              id="nav-logo"
            >
              RetailPilot
            </Link>
            <span className="inline-flex items-center gap-1.5 bg-[var(--bg-secondary)] text-[var(--accent-gold)] text-[8px] font-semibold tracking-[0.18em] uppercase px-2 py-0.5 rounded-[2px] border border-[var(--accent-gold)]/15">
              <Sparkles size={8} className="animate-pulse text-[var(--accent-gold)]" />
              Stylist Active
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
