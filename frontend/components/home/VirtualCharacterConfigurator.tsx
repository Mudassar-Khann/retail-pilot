import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VirtualCharacterConfigurator() {
  return (
    <section id="character" className="py-20 bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
              Configurator Suite
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
              Virtual Outfit Configurator
            </h2>
          </div>
          <p className="text-xs font-light text-neutral-500 max-w-xs md:text-right">
            Customize and visualize fits on our interactive virtual mannequin (under development).
          </p>
        </div>

        {/* Configurator Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-neutral-200 bg-neutral-50/20 p-6 sm:p-8 relative">
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neutral-400" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neutral-400" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-neutral-400" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neutral-400" />

          {/* Left Control Column (Shirts, Outerwear) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            {/* Top Selector */}
            <div className="border border-neutral-200 bg-white p-4 space-y-3">
              <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase block">
                Slot: Top (Shirt)
              </span>
              <div className="flex items-center justify-between gap-2">
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-light text-neutral-400 uppercase tracking-widest">
                  Not Selected
                </span>
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>

            {/* Outerwear Selector */}
            <div className="border border-neutral-200 bg-white p-4 space-y-3">
              <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase block">
                Slot: Outerwear (Jacket)
              </span>
              <div className="flex items-center justify-between gap-2">
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-light text-neutral-400 uppercase tracking-widest">
                  Not Selected
                </span>
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Center Silhouette Screen */}
          <div className="lg:col-span-6 bg-white border border-neutral-200 aspect-[4/5] max-w-[380px] mx-auto w-full p-6 flex flex-col justify-between items-center relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center w-full text-[9px] font-mono text-neutral-400">
              <span>SCAN_NODE: 01</span>
              <span>RENDER: STATIC</span>
            </div>

            {/* Mannequin Silhouette */}
            <div className="flex flex-col items-center py-6">
              <svg
                className="w-40 h-64 text-neutral-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a3 3 0 100 6 3 3 0 000-6zm-4.7 9a1.5 1.5 0 00-1.3 1.7l1.5 6c.2.8.9 1.3 1.7 1.3h5.6c.8 0 1.5-.5 1.7-1.3l1.5-6a1.5 1.5 0 00-1.3-1.7H7.3zM8 21v1h2v-1H8zm6 0v1h2v-1h-2z" />
              </svg>
              <div className="text-center mt-4">
                <span className="inline-flex items-center gap-1 bg-neutral-900 text-white text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5">
                  <Sparkles size={8} className="animate-pulse" />
                  STYLING ENGINE OFFLINE
                </span>
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-400 tracking-wider">
              RETAILPILOT RENDER ENGINE v0.1.0
            </div>
          </div>

          {/* Right Control Column (Bottoms, Shoes) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            {/* Bottoms Selector */}
            <div className="border border-neutral-200 bg-white p-4 space-y-3">
              <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase block">
                Slot: Bottom (Pants)
              </span>
              <div className="flex items-center justify-between gap-2">
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-light text-neutral-400 uppercase tracking-widest">
                  Not Selected
                </span>
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>

            {/* Shoes Selector */}
            <div className="border border-neutral-200 bg-white p-4 space-y-3">
              <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase block">
                Slot: Shoes
              </span>
              <div className="flex items-center justify-between gap-2">
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-light text-neutral-400 uppercase tracking-widest">
                  Not Selected
                </span>
                <Button disabled variant="outline" size="sm" className="p-2 h-8 w-8">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
