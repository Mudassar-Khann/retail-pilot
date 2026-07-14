"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MotionPrimitive, MotionPresence } from "@/design-system/motion/engine";

interface NavbarProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 inset-x-0 z-50 w-full bg-transparent border-none transition-all duration-300">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo - A U R A A */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[14px] hover:opacity-85 transition-opacity"
              id="nav-logo"
            >
              <span className="font-display font-light tracking-[0.4em] text-[var(--text-primary)] uppercase">
                A U R A A
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/5 text-[9px] font-mono tracking-[0.18em] uppercase px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="w-1 h-1 rounded-full bg-[var(--accent-gold)]" />
              ACTIVE
            </span>
          </div>

          {/* Desktop Navigation - Pill Shaped Glass Container */}
          <nav className="hidden md:flex items-center bg-black/40 border border-white/5 backdrop-blur-xl rounded-full px-6 py-2 shadow-2xl">
            <div className="flex items-center space-x-8">
              <Link
                href="#"
                className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <Link
                href="#categories"
                className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Collection
              </Link>
              <Link
                href="#products"
                className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                AI Stylist
              </Link>
              <Link
                href="#character"
                className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Technology
              </Link>
              <Link
                href="#search"
                className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                About
              </Link>
            </div>
          </nav>

          {/* Right Actions: Search, Shopping Bag, Theme Toggle, SIGN IN, AI STYLIST */}
          <div className="flex items-center space-x-5 text-[var(--text-secondary)]">

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Search Style Catalog"
            >
              <Search size={14} strokeWidth={1.5} />
            </button>

            {/* Shopping Bag */}
            <button className="p-1.5 hover:text-[var(--text-primary)] transition-colors relative cursor-pointer" aria-label="Wardrobe Bag">
              <ShoppingBag size={14} strokeWidth={1.5} />
            </button>

            {/* Theme Toggle (Preserves functionality) */}
            <ThemeToggle />

            {/* Sign In text link */}
            <button className="hidden sm:inline-block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              SIGN IN
            </button>

            {/* Styled AI STYLIST action button */}
            <Link href="#products">
              <button className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-[var(--accent-gold)]/40 hover:bg-white/[0.08] text-[9px] font-semibold tracking-[0.15em] uppercase text-white px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(197,168,128,0.15)]">
                AI Stylist
                <Sparkles size={8} className="text-[var(--accent-gold)]" />
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              <Menu size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with Motion Animation */}
      <MotionPresence>
        {isOpen && (
          <MotionPrimitive
            intent="settle"
            className="md:hidden border-b border-[var(--border-soft)] bg-black/95 backdrop-blur-xl px-6 py-5 space-y-4"
          >
            <Link
              href="#"
              className="block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#categories"
              className="block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
              onClick={() => setIsOpen(false)}
            >
              Collection
            </Link>
            <Link
              href="#products"
              className="block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
              onClick={() => setIsOpen(false)}
            >
              AI Stylist
            </Link>
            <Link
              href="#character"
              className="block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
              onClick={() => setIsOpen(false)}
            >
              Technology
            </Link>
            <Link
              href="#search"
              className="block text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <button className="text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">
                SIGN IN
              </button>
              <div className="scale-90">
                <ThemeToggle />
              </div>
            </div>
          </MotionPrimitive>
        )}
      </MotionPresence>
    </header>
  );
}
