"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
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
      className={`border p-4 transition-all duration-300 ${
        isActive
          ? "border-neutral-800 bg-neutral-900/5 shadow-sm"
          : "border-neutral-100 bg-white hover:border-neutral-300"
      }`}
      onClick={onFocus}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
          Slot: {label}
        </span>
        {item && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-[9px] text-neutral-400 hover:text-neutral-950 uppercase tracking-wider cursor-pointer"
            aria-label={`Clear ${label} selection`}
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          className="p-1 h-8 w-8 rounded-full border-neutral-200 hover:border-neutral-800"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label={`Previous ${label}`}
        >
          <ChevronLeft size={14} />
        </Button>

        {/* Item Info Viewport */}
        <div className="flex-1 text-center min-h-[36px] flex flex-col justify-center">
          {item ? (
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-neutral-900 tracking-wide line-clamp-1">
                {item.name}
              </p>
              <p className="text-[10px] text-neutral-500 font-light uppercase tracking-wider">
                {item.brand} &middot; {item.color} &middot; ${item.price}
              </p>
            </div>
          ) : (
            <span className="text-xs font-light text-neutral-300 uppercase tracking-widest">
              Not Selected
            </span>
          )}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          className="p-1 h-8 w-8 rounded-full border-neutral-200 hover:border-neutral-800"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label={`Next ${label}`}
        >
          <ChevronRight size={14} />
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
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
          Outfit Configuration
        </h3>
        <span className="text-[9px] text-neutral-400 font-light">
          Tap slot to highlight
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
