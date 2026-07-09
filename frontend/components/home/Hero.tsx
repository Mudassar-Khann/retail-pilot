import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-50/50 py-20 lg:py-28 border-b border-neutral-100">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Content */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 bg-neutral-900/5 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase text-neutral-800 rounded-full">
              <Sparkles size={10} className="text-neutral-700" />
              INTELLIGENT FASHION HUB
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-neutral-950 leading-[1.08]">
              Define your aesthetic. <br />
              <span className="font-normal italic text-neutral-800">Dress intelligent.</span>
            </h1>

            <p className="text-sm font-light text-neutral-600 max-w-xl leading-relaxed">
              RetailPilot merges clean fashion design with conversational AI. Describe your style, search curated lookbooks, and visualize outfits on a virtual character.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#search">
                <Button size="lg" className="group flex items-center gap-2">
                  Describe Your Style
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#products">
                <Button variant="outline" size="lg">
                  Explore Catalog
                </Button>
              </Link>
            </div>

            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-100 max-w-md">
              <div>
                <p className="font-serif text-xl text-neutral-900">30+</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Premium Items</p>
              </div>
              <div>
                <p className="font-serif text-xl text-neutral-900">5+</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Aesthetic Styles</p>
              </div>
              <div>
                <p className="font-serif text-xl text-neutral-900">AI</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Powered Tools</p>
              </div>
            </div>
          </div>

          {/* Mannequin / Character Placeholder Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-[4/5] border border-neutral-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-400" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-400" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-400" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-400" />

              <div className="flex justify-between items-center text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                <span>Viewport: 01</span>
                <span>Active Model</span>
              </div>

              {/* Silhouette Placeholder */}
              <div className="my-auto flex flex-col items-center justify-center space-y-4 py-8">
                <svg
                  className="w-48 h-72 text-neutral-100 hover:text-neutral-200 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2a3 3 0 100 6 3 3 0 000-6zm-4.7 9a1.5 1.5 0 00-1.3 1.7l1.5 6c.2.8.9 1.3 1.7 1.3h5.6c.8 0 1.5-.5 1.7-1.3l1.5-6a1.5 1.5 0 00-1.3-1.7H7.3zM8 21v1h2v-1H8zm6 0v1h2v-1h-2z" />
                </svg>
                <div className="text-center space-y-1">
                  <h3 className="font-serif text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                    Interactive Virtual Model
                  </h3>
                  <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-semibold">
                    (Coming Soon)
                  </p>
                </div>
              </div>

              <div className="text-center text-[9px] tracking-wider text-neutral-400 uppercase">
                Render System: Canvas v0.2.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
