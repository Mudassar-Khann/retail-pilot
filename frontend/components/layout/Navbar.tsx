"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.25em] uppercase text-neutral-900 hover:opacity-80 transition-opacity"
              id="nav-logo"
            >
              RetailPilot
            </Link>
            <span className="inline-flex items-center gap-1 bg-neutral-900 text-white text-[9px] font-semibold tracking-widest uppercase px-1.5 py-0.5">
              <Sparkles size={8} className="animate-pulse" />
              AI ACTIVE
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#categories"
              className="text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Styles
            </Link>
            <Link
              href="#products"
              className="text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="#stylist"
              className="text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              AI Stylist
            </Link>
            <Link
              href="#character"
              className="text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Virtual Character
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 text-neutral-700">
            <Link href="#search" className="p-2 hover:text-neutral-950 transition-colors" aria-label="Search Catalog">
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <button className="p-2 hover:text-neutral-950 transition-colors cursor-pointer" aria-label="Shopping Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
            <button
              className="md:hidden p-2 hover:text-neutral-950 transition-colors"
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
        <div className="md:hidden border-b border-neutral-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="#categories"
            className="block text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Styles
          </Link>
          <Link
            href="#products"
            className="block text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Catalog
          </Link>
          <Link
            href="#stylist"
            className="block text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            AI Stylist
          </Link>
          <Link
            href="#character"
            className="block text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Virtual Character
          </Link>
        </div>
      )}
    </header>
  );
}
