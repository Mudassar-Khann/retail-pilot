"use client";

import { useState } from "react";
import { Sparkles, Save, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VirtualModel,
  ClothingControls,
  OutfitSelection,
  MOCK_TOPS,
  MOCK_OUTERWEAR,
  MOCK_BOTTOMS,
  MOCK_SHOES
} from "@/components/character";

export default function VirtualCharacterConfigurator() {
  // Initial Selection: Seeded with one starter outfit for visual presentation
  const [selection, setSelection] = useState<OutfitSelection>({
    top: MOCK_TOPS[0], // Classic Heavyweight Cotton Tee
    outerwear: MOCK_OUTERWEAR[1], // Oversized Vintage Wash Hoodie
    bottom: MOCK_BOTTOMS[1], // Loose Fit Distressed Jeans
    shoes: MOCK_SHOES[1] // Minimalist White Leather Sneaker
  });

  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Helper lists map for sliding
  const itemLists: Record<string, any[]> = {
    top: MOCK_TOPS,
    outerwear: MOCK_OUTERWEAR,
    bottom: MOCK_BOTTOMS,
    shoes: MOCK_SHOES
  };

  const handlePrev = (slot: string) => {
    const list = itemLists[slot];
    const currentItem = selection[slot as keyof OutfitSelection];

    let nextIndex = 0;
    if (currentItem) {
      const idx = list.findIndex(item => item.id === currentItem.id);
      nextIndex = idx > 0 ? idx - 1 : list.length - 1;
    }

    setSelection(prev => ({
      ...prev,
      [slot]: list[nextIndex]
    }));
    setActiveSlot(slot);
  };

  const handleNext = (slot: string) => {
    const list = itemLists[slot];
    const currentItem = selection[slot as keyof OutfitSelection];

    let nextIndex = 0;
    if (currentItem) {
      const idx = list.findIndex(item => item.id === currentItem.id);
      nextIndex = idx < list.length - 1 ? idx + 1 : 0;
    }

    setSelection(prev => ({
      ...prev,
      [slot]: list[nextIndex]
    }));
    setActiveSlot(slot);
  };

  const handleClear = (slot: string) => {
    setSelection(prev => ({
      ...prev,
      [slot]: null
    }));
    setActiveSlot(null);
  };

  // Calculations
  const totalPrice = Object.values(selection).reduce((sum: number, item: any) => {
    return sum + (item ? item.price : 0);
  }, 0);

  // Calculate aesthetic match
  const calculateAesthetic = () => {
    const counts: Record<string, number> = {};
    Object.values(selection).forEach((item: any) => {
      if (item) {
        item.style_tags.forEach((tag: string) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });

    let maxTag = "Neutral";
    let maxVal = 0;
    Object.entries(counts).forEach(([tag, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxTag = tag;
      }
    });

    return maxVal > 0 ? `${maxTag} Alignment` : "Neutral Fit";
  };

  return (
    <section id="character" className="py-24 bg-white border-b border-neutral-100/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              <Sparkles size={10} className="text-neutral-400" />
              Interactive Exhibition
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
              Virtual Mannequin
            </h2>
          </div>
          <p className="text-xs font-light text-neutral-500 max-w-xs md:text-right leading-relaxed">
            Compose combinations using pieces from our style catalog. Preview garment overlays, fits, and aesthetic matches.
          </p>
        </div>

        {/* Gallery Box Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border border-neutral-200/60 p-6 sm:p-10 bg-neutral-50/10 rounded-md relative shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          {/* Subtle corner line highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-300" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neutral-300" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-neutral-300" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neutral-300" />

          {/* Left Column: Model rendering */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <VirtualModel selection={selection} activeSlot={activeSlot} />
          </div>

          {/* Right Column: Controls and composition summary */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-10 h-full">
            <ClothingControls
              selection={selection}
              onPrev={handlePrev}
              onNext={handleNext}
              onClear={handleClear}
              activeSlot={activeSlot}
              setActiveSlot={setActiveSlot}
            />

            {/* Composition details summary */}
            <div className="border-t border-neutral-100 pt-8 space-y-5">
              <div className="grid grid-cols-3 gap-6 bg-neutral-50/50 p-4 border border-neutral-100/60 rounded-sm">
                <div>
                  <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-mono">Total Price</p>
                  <p className="text-base font-semibold text-neutral-900 mt-1">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-mono">Composition</p>
                  <p className="text-xs font-semibold text-neutral-800 mt-1 uppercase tracking-wide">
                    {calculateAesthetic()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-mono">Fitted Slots</p>
                  <p className="text-[10px] text-neutral-500 mt-1.5 font-mono">
                    {Object.values(selection).filter(Boolean).length} of 4 filled
                  </p>
                </div>
              </div>

              {/* Composition actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-[8px] text-neutral-400 uppercase tracking-[0.18em] font-semibold font-mono">
                  (Configuration Saving under development)
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button disabled variant="outline" size="sm" className="flex items-center gap-1.5 rounded-[2px] w-1/2 sm:w-auto cursor-pointer">
                    <Heart size={12} />
                    Bookmark Look
                  </Button>
                  <Button disabled size="sm" className="flex items-center gap-1.5 rounded-[2px] w-1/2 sm:w-auto cursor-pointer">
                    <Save size={12} />
                    Save Composition
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
