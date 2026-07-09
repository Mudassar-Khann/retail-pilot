"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[0.25em] uppercase text-neutral-950 hover:opacity-85 transition-opacity"
              id="nav-logo"
            >
              RetailPilot
            </Link>
            <span className="inline-flex items-center gap-1.5 bg-neutral-950 text-white text-[8px] font-semibold tracking-[0.18em] uppercase px-2 py-0.5 rounded-[2px]">
              <Sparkles size={8} className="animate-pulse text-white" />
              Stylist Active
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#categories"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Explore Styles
            </Link>
            <Link
              href="#products"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Curated Selection
            </Link>
            <Link
              href="#stylist"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Personal Stylist
            </Link>
            <Link
              href="#character"
              className="text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Virtual Mannequin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 text-neutral-700">
            <Link href="#search" className="p-2 hover:text-neutral-950 transition-colors" aria-label="Search Style Catalog">
              <Search size={16} strokeWidth={1.5} />
            </Link>
            <button className="p-2 hover:text-neutral-950 transition-colors relative cursor-pointer" aria-label="Wardrobe Bag">
              <ShoppingBag size={16} strokeWidth={1.5} />
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
        <div className="md:hidden border-b border-neutral-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3">
          <Link
            href="#categories"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Explore Styles
          </Link>
          <Link
            href="#products"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Curated Selection
          </Link>
          <Link
            href="#stylist"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Personal Stylist
          </Link>
          <Link
            href="#character"
            className="block text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-950 py-2"
            onClick={() => setIsOpen(false)}
          >
            Virtual Mannequin
          </Link>
        </div>
      )}
    </header>
  );
}
