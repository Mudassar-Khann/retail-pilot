"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, FolderHeart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutfitSelection, ClothingItem } from "./OutfitState";

export interface SavedLook {
  id: number;
  session_id: string;
  name: string;
  top_id?: number | null;
  bottom_id?: number | null;
  outerwear_id?: number | null;
  shoes_id?: number | null;
  total_price: number;
  aesthetic_rating: string;
  created_at?: string;
}

interface LookSaverProps {
  selection: OutfitSelection;
  allProducts: ClothingItem[];
  totalPrice: number;
  aestheticRating: string;
  onLoadLook: (look: SavedLook) => void;
}

const COLOR_MAP: Record<string, string> = {
  Black: "#1a1a1a",
  "Matte Black": "#111111",
  White: "#f7f7f7",
  Navy: "#1a2c56",
  Camel: "#c58f59",
  Cream: "#faf6f0",
  Oatmeal: "#e0dacb",
  Charcoal: "#2b2b2b",
  Indigo: "#272a52",
  Olive: "#4a503d",
  "Olive Drab": "#3a3f30",
  Beige: "#ded2bc",
  Silver: "#c7cbd1",
  "Light Blue": "#a5d8f3",
  "Sage Green": "#c1e7cb",
  Tan: "#8c5638",
  Grey: "#6e7275",
  "Grey/White": "#cfd1d2",
  Ecru: "#f3eee3",
  Burgundy: "#5a1821",
  CharcoalGray: "#444444",
  "Slate Blue": "#45617f",
};

function getHexColor(colorName?: string) {
  if (!colorName) return "transparent";
  return COLOR_MAP[colorName] || "#d4d4d8";
}

export default function LookSaver({ selection, allProducts, totalPrice, aestheticRating, onLoadLook }: LookSaverProps) {
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lookName, setLookName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved looks from the SQLite backend database
  const loadLooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/looks?session_id=default_session");
      const data = await res.json();
      if (data.looks) {
        setSavedLooks(data.looks);
      }
    } catch (err) {
      console.warn("Failed to fetch saved looks from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLooks();
  }, []);

  const handleSaveLook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "default_session",
          name: lookName.trim(),
          top_id: selection.top?.id || null,
          bottom_id: selection.bottom?.id || null,
          outerwear_id: selection.outerwear?.id || null,
          shoes_id: selection.shoes?.id || null,
          total_price: totalPrice,
          aesthetic_rating: aestheticRating
        })
      });
      const data = await res.json();
      if (data.look) {
        await loadLooks();
        setShowPrompt(false);
        setLookName("");
      }
    } catch (err) {
      console.error("Failed to save look configuration:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadLookClick = (look: SavedLook) => {
    onLoadLook(look);
  };

  const handleDeleteLook = async (e: React.MouseEvent, lookId: number) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8000/api/looks/${lookId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadLooks();
      }
    } catch (err) {
      console.error("Failed to delete saved look:", err);
    }
  };

  return (
    <div className="w-full space-y-5 border-t border-[var(--border-soft)]/60 pt-4">
      {/* Save Button Link */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowPrompt(true)}
          className="inline-flex items-center gap-1.5 text-[8px] font-mono tracking-[0.18em] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors uppercase cursor-pointer"
        >
          <Plus size={10} />
          + SAVE CURRENT LOOK
        </button>
        <span className="text-[7px] font-mono text-[var(--text-secondary)] uppercase">
          {savedLooks.length} Saved Looks
        </span>
      </div>

      {/* Glassmorphic Naming Dialog Overlay */}
      {showPrompt && (
        <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-md z-45 flex flex-col justify-center p-6 border border-[var(--border-soft)] rounded-lg">
          <form onSubmit={handleSaveLook} className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono tracking-widest text-[var(--accent-gold)] uppercase">
                Name Outfit Look
              </span>
              <input
                type="text"
                value={lookName}
                onChange={(e) => setLookName(e.target.value)}
                placeholder="e.g. Minimalist Tech Coat..."
                required
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-soft)] focus:border-[var(--text-secondary)] text-xs px-3 py-2.5 rounded-sm text-[var(--foreground)] focus:outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
            
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-[8px] font-mono uppercase tracking-widest border-[var(--border-soft)] rounded-[2px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving || !lookName.trim()}
                className="bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--background)] font-bold text-[8px] font-mono uppercase tracking-widest rounded-[2px] cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save Look"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Looks horizontal tray list */}
      <div className="space-y-2">
        <span className="text-[7px] font-mono tracking-widest text-[var(--text-secondary)] uppercase block">
          SAVED_LOOKBOOKS
        </span>
        
        {isLoading ? (
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[8px] font-mono py-2">
            <Loader2 size={10} className="animate-spin" />
            LOADING LOOKBOOKS...
          </div>
        ) : savedLooks.length === 0 ? (
          <p className="text-[8px] font-mono text-[var(--text-muted)] italic py-2">
            No looks bookmarked. Custom looks will appear here.
          </p>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {savedLooks.map(look => (
              <div
                key={look.id}
                onClick={() => handleLoadLookClick(look)}
                className="flex-shrink-0 w-28 p-2.5 bg-[var(--bg-secondary)]/60 hover:bg-[var(--bg-secondary)] border border-[var(--border-soft)]/80 hover:border-[var(--text-muted)] rounded-sm cursor-pointer transition-all duration-300 group relative"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[6px] font-mono text-[var(--accent-gold)] uppercase truncate max-w-[70px]">
                    {look.aesthetic_rating}
                  </span>
                  <button
                    onClick={(e) => handleDeleteLook(e, look.id)}
                    className="text-[var(--text-secondary)] hover:text-red-400 transition-colors cursor-pointer p-0.5"
                    title="Delete look"
                  >
                    <Trash2 size={8} />
                  </button>
                </div>
                <p className="text-[8px] font-medium text-[var(--text-primary)] truncate w-full group-hover:text-[var(--foreground)] mt-1">
                  {look.name}
                </p>

                {/* Swatch Previews Thumbnail matrix */}
                <div className="flex gap-1.5 my-2 justify-center">
                  {(['top', 'outerwear', 'bottom', 'shoes'] as const).map(slot => {
                    const itemId = 
                      slot === 'top' ? look.top_id :
                      slot === 'outerwear' ? look.outerwear_id :
                      slot === 'bottom' ? look.bottom_id :
                      look.shoes_id;
                    const item = allProducts.find(p => p.id === itemId);
                    const colorHex = item ? getHexColor(item.color) : 'transparent';
                    
                    return (
                      <div 
                        key={slot} 
                        className={`w-3.5 h-3.5 rounded-full border border-[var(--border-soft)] flex items-center justify-center`}
                        style={{ backgroundColor: colorHex }}
                        title={item ? `${item.brand} ${item.name} (${item.color})` : `Empty ${slot}`}
                      >
                        {!item && <span className="text-[5px] text-[var(--text-muted)] font-mono">·</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-1 pt-1 border-t border-[var(--border-soft)]/40">
                  <span className="text-[7px] font-mono text-[var(--text-secondary)]">
                    ${look.total_price.toFixed(2)}
                  </span>
                  <FolderHeart size={8} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
