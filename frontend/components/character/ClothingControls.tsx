"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "./OutfitState";

interface ControlRowProps {
  label: string;
  item: ClothingItem | null;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export function ControlRow({
  label,
  item,
  onPrev,
  onNext,
  onClear,
  isActive,
  onFocus
}: ControlRowProps) {
  return (
    <div
      className={`border-b border-neutral-100 py-5 transition-all duration-300 ${
        isActive
          ? "border-b-neutral-800 bg-neutral-50/30 px-3 -mx-3"
          : "hover:bg-neutral-50/10 hover:border-b-neutral-300"
      }`}
      onClick={onFocus}
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
          Slot: {label}
        </span>
        {item && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-[8px] text-neutral-400 hover:text-neutral-900 uppercase tracking-widest cursor-pointer transition-colors"
            aria-label={`Clear ${label} selection`}
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Previous Button - rounded-sm */}
        <Button
          variant="outline"
          size="sm"
          className="p-1 h-7 w-7 rounded-[2px] border-neutral-200 hover:border-neutral-800 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label={`Previous ${label}`}
        >
          <ChevronLeft size={12} />
        </Button>

        {/* Item Info Viewport */}
        <div className="flex-1 text-center min-h-[38px] flex flex-col justify-center px-2">
          {item ? (
            <div className="space-y-0.5">
              <p className="text-xs font-normal text-neutral-900 tracking-wide line-clamp-1">
                {item.name}
              </p>
              <p className="text-[9px] text-neutral-500 font-light uppercase tracking-wider">
                {item.brand} &middot; {item.color} &middot; ${item.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <span className="text-[10px] font-light text-neutral-300 uppercase tracking-widest">
              Not Selected
            </span>
          )}
        </div>

        {/* Next Button - rounded-sm */}
        <Button
          variant="outline"
          size="sm"
          className="p-1 h-7 w-7 rounded-[2px] border-neutral-200 hover:border-neutral-800 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label={`Next ${label}`}
        >
          <ChevronRight size={12} />
        </Button>
      </div>
    </div>
  );
}

interface ClothingControlsProps {
  selection: any;
  onPrev: (slot: string) => void;
  onNext: (slot: string) => void;
  onClear: (slot: string) => void;
  activeSlot: string | null;
  setActiveSlot: (slot: string | null) => void;
}

export default function ClothingControls({
  selection,
  onPrev,
  onNext,
  onClear,
  activeSlot,
  setActiveSlot
}: ClothingControlsProps) {
  const slots = [
    { key: "top", label: "Top (Shirt)" },
    { key: "outerwear", label: "Outerwear (Jacket)" },
    { key: "bottom", label: "Bottom (Pants)" },
    { key: "shoes", label: "Shoes" }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
          Outfit Configuration
        </h3>
        <span className="text-[8px] text-neutral-400 font-light uppercase tracking-widest">
          Tap slot to highlight
        </span>
      </div>

      <div className="flex flex-col">
        {slots.map((slot) => (
          <ControlRow
            key={slot.key}
            label={slot.label}
            item={selection[slot.key]}
            onPrev={() => onPrev(slot.key)}
            onNext={() => onNext(slot.key)}
            onClear={() => onClear(slot.key)}
            isActive={activeSlot === slot.key}
            onFocus={() => setActiveSlot(slot.key)}
          />
        ))}
      </div>
    </div>
  );
}
