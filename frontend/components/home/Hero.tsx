"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const // Luxury ease
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-24 lg:py-36 border-b border-[var(--border-soft)]">
      {/* Subtle mathematical grid background (inspired by reference image 2) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content */}
          <div className="space-y-8 lg:col-span-7">
            <motion.div
              className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-soft)] px-3 py-1 rounded-[2px]"
              variants={itemVariants}
            >
              <Sparkles size={10} className="text-[var(--accent-gold)]" />
              <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)]">
                Aesthetic Wardrobe Hub
              </span>
            </motion.div>

            <motion.h1
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[var(--text-primary)] leading-[1.08]"
              variants={itemVariants}
            >
              Define your aesthetic. <br />
              <span className="font-normal italic text-[var(--accent-gold)]">Dress intelligent.</span>
            </motion.h1>

            <motion.p
              className="text-sm font-light text-[var(--text-secondary)] max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              RetailPilot merges clean fashion design with conversational intelligence. Describe your style, explore curated lookbooks, and visualize outfits on a virtual mannequin.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-2"
              variants={itemVariants}
            >
              <Link href="#search">
                <Button size="md" className="group flex items-center gap-2 rounded-[2px] bg-[var(--accent-gold)] text-[var(--background)] font-bold text-xs tracking-wider uppercase px-6 hover:bg-[var(--accent-gold-hover)] cursor-pointer">
                  Discover Styles
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="#products">
                <Button variant="outline" size="md" className="rounded-[2px] border-[var(--border-soft)] text-[var(--text-primary)] font-medium text-xs tracking-wider uppercase px-6 hover:bg-[var(--bg-secondary)] hover:text-[var(--foreground)] cursor-pointer">
                  Curated Selection
                </Button>
              </Link>
            </motion.div>

            {/* Quiet Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border-soft)] max-w-md"
              variants={itemVariants}
            >
              <div>
                <p className="font-serif text-xl text-[var(--text-primary)] font-light">30+</p>
                <p className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-wider font-mono">Premium Items</p>
              </div>
              <div>
                <p className="font-serif text-xl text-[var(--text-primary)] font-light">5+</p>
                <p className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-wider font-mono">Core Aesthetics</p>
              </div>
              <div>
                <p className="font-serif text-xl text-[var(--text-primary)] font-light">Quiet</p>
                <p className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-wider font-mono">AI Integrations</p>
              </div>
            </motion.div>
          </div>

          {/* Mannequin Preview Card */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-[340px] aspect-[9/16] border border-[var(--border-soft)] bg-[var(--background)] p-5 overflow-hidden flex flex-col justify-between rounded-lg shadow-2xl glass-fluted transition-all duration-500 hover:border-[var(--accent-gold)]/20 group">
              {/* Atmos-tech ambient backglow */}
              <div 
                className="absolute -inset-10 pointer-events-none z-0 rounded-full animate-ambient"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  transition: "all 1.5s ease-in-out"
                }}
              />

              <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-[var(--accent-gold)] uppercase z-10">
                <span>Viewport: 01 // PREVIEW</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
                  ACTIVE_PREVIEW
                </span>
              </div>

              {/* Miniaturized Mannequin Body & Vector Silhouette Overlay */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden z-10 pointer-events-none">
                <img 
                  src="/assets/models/male_base.png" 
                  alt="Base model" 
                  className="absolute max-h-full object-contain opacity-40 mix-blend-luminosity grayscale group-hover:scale-102 transition-transform duration-1000"
                />
                
                {/* SVG Outline blueprint overlay representing try-on overlay */}
                <div className="absolute top-[20%] w-[56%] h-auto opacity-70 stroke-[var(--accent-gold)]/60 animate-pulse">
                  <svg viewBox="0 0 100 120" className="w-full h-auto fill-none stroke-current stroke-[1.2]">
                    <path d="M10 20 L90 20 L98 50 L83 54 L78 34 L74 102 L26 102 L22 34 L17 54 L2 50 Z" />
                    <path d="M34 18 Q50 36 66 18" />
                  </svg>
                </div>
                
                <div className="absolute top-[48%] w-[52%] h-auto opacity-50 stroke-[var(--accent-gold)]/40">
                  <svg viewBox="0 0 100 220" className="w-full h-auto fill-none stroke-current stroke-[1.2]">
                    <path d="M18 0 L82 0 L90 85 L92 218 L74 218 L52 92 L48 92 L26 218 L8 218 L10 85 Z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1 text-center z-10">
                <h3 className="font-mono text-[9px] font-bold tracking-widest text-[var(--text-primary)] uppercase">
                  [ ATMOS_SYSTEM_MANNEQUIN ]
                </h3>
                <p className="text-[7px] font-mono text-[var(--text-secondary)] tracking-wider uppercase">
                  Ready for interactive try-on below
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
