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
    <section className="relative overflow-hidden bg-white py-24 lg:py-36 border-b border-neutral-100/60">
      {/* Subtle mathematical grid background (inspired by reference image 2) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

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
              className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-[2px]"
              variants={itemVariants}
            >
              <Sparkles size={10} className="text-neutral-500" />
              <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-neutral-500">
                Aesthetic Wardrobe Hub
              </span>
            </motion.div>

            <motion.h1
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-neutral-950 leading-[1.08]"
              variants={itemVariants}
            >
              Define your aesthetic. <br />
              <span className="font-normal italic text-neutral-800">Dress intelligent.</span>
            </motion.h1>

            <motion.p
              className="text-sm font-light text-neutral-500 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              RetailPilot merges clean fashion design with conversational intelligence. Describe your style, explore curated lookbooks, and visualize outfits on a virtual mannequin.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-2"
              variants={itemVariants}
            >
              <Link href="#search">
                <Button size="md" className="group flex items-center gap-2 rounded-[2px] bg-neutral-950 text-white font-medium text-xs tracking-wider uppercase px-6">
                  Discover Styles
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="#products">
                <Button variant="outline" size="md" className="rounded-[2px] border-neutral-200 text-neutral-900 font-medium text-xs tracking-wider uppercase px-6 hover:bg-neutral-50">
                  Curated Selection
                </Button>
              </Link>
            </motion.div>

            {/* Quiet Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-100 max-w-md"
              variants={itemVariants}
            >
              <div>
                <p className="font-serif text-xl text-neutral-900 font-light">30+</p>
                <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">Premium Items</p>
              </div>
              <div>
                <p className="font-serif text-xl text-neutral-900 font-light">5+</p>
                <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">Core Aesthetics</p>
              </div>
              <div>
                <p className="font-serif text-xl text-neutral-900 font-light">Quiet</p>
                <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">AI Integrations</p>
              </div>
            </motion.div>
          </div>

          {/* Mannequin Preview Card */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-[340px] aspect-[4/5] border border-neutral-100 bg-neutral-50/20 p-6 overflow-hidden flex flex-col justify-between rounded-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-shadow duration-500 hover:shadow-md">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                <span>Viewport: 01</span>
                <span>Active Preview</span>
              </div>

              {/* Silhouette Placeholder */}
              <div className="my-auto flex flex-col items-center justify-center space-y-4 py-8">
                <svg
                  className="w-40 h-64 text-neutral-200/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2a3 3 0 100 6 3 3 0 000-6zm-4.7 9a1.5 1.5 0 00-1.3 1.7l1.5 6c.2.8.9 1.3 1.7 1.3h5.6c.8 0 1.5-.5 1.7-1.3l1.5-6a1.5 1.5 0 00-1.3-1.7H7.3zM8 21v1h2v-1H8zm6 0v1h2v-1h-2z" />
                </svg>
                <div className="text-center space-y-1">
                  <h3 className="font-serif text-sm font-normal tracking-wide text-neutral-900 uppercase">
                    Interactive Mannequin
                  </h3>
                  <p className="text-[9px] text-neutral-400 tracking-wider uppercase font-semibold">
                    (Ready Below)
                  </p>
                </div>
              </div>

              <div className="text-center text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                Render Engine v0.1
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
