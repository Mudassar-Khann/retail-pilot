import { Badge } from "@/components/ui/badge";

interface FeaturedCategoriesProps {
  onSelectStyle?: (styleName: string) => void;
}

export default function FeaturedCategories({ onSelectStyle }: FeaturedCategoriesProps) {
  const categories = [
    {
      name: "Old Money",
      desc: "Intricate tapestry knits and refined wools. Tailored for heritage silhouettes, luxury textiles, and quiet elegance.",
      colors: ["Camel", "Navy", "Cream"],
      keywords: ["Tapestry", "Wool", "Tailored"],
      bgClass: "bg-amber-500/5 dark:bg-amber-950/10"
    },
    {
      name: "Streetwear",
      desc: "Heavyweight cotton fleece hoodies and relaxed wide trousers. Raw, deconstructed, and vintage-washed streetwear.",
      colors: ["Black", "Olive", "Grey"],
      keywords: ["Fleece", "Oversized", "Deconstructed"],
      bgClass: "bg-slate-500/5 dark:bg-slate-950/20"
    },
    {
      name: "Korean Fashion",
      desc: "Seoul-inspired dropped-shoulder drape cuts, linen popover tunics, and soft layering. Modern relaxed silhouettes.",
      colors: ["Beige", "Ecru", "Sage"],
      keywords: ["Drape", "Linen", "Layered"],
      bgClass: "bg-stone-500/5 dark:bg-stone-950/20"
    },
    {
      name: "Minimalist",
      desc: "Perfect-fit Pima cotton basics and raw indigo selvedge denim. Clean contours, organic drapes, and zero distractions.",
      colors: ["White", "Charcoal", "Indigo"],
      keywords: ["Selvedge", "Pima", "Monochrome"],
      bgClass: "bg-neutral-500/5 dark:bg-neutral-950/20"
    },
    {
      name: "Techwear",
      desc: "Weatherproof technical outerwear, multi-pocket modular utility pants, and structured high-performance combat fits.",
      colors: ["Matte Black", "Olive Drab"],
      keywords: ["Utility", "Tactical", "Weatherproof"],
      bgClass: "bg-zinc-500/5 dark:bg-zinc-950/20"
    }
  ];

  const handleCardClick = (name: string) => {
    if (onSelectStyle) {
      onSelectStyle(name);
    }
    // Smooth scroll down to the virtual mannequin configurator container
    const characterSection = document.getElementById("character");
    if (characterSection) {
      characterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="py-24 bg-[var(--background)] border-b border-[var(--border-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] uppercase">
              Curated Aesthetics
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[var(--text-primary)]">
              Explore Styles
            </h2>
          </div>
          <p className="text-xs font-light text-[var(--text-secondary)] max-w-xs md:text-right leading-relaxed font-sans">
            Select a style aesthetic to instantly filter and drape the virtual mannequin.
          </p>
        </div>

        {/* Cards Grid with rounded-md and premium layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCardClick(cat.name)}
              className="p-6 border border-[var(--border-soft)] bg-[var(--bg-secondary)]/40 rounded-md flex flex-col justify-between aspect-[3/4] group hover:border-[var(--accent-gold)]/50 transition-all duration-300 relative overflow-hidden shadow-none cursor-pointer"
            >
              {/* Subtle hover background transition */}
              <div className={`absolute inset-0 ${cat.bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className="space-y-4">
                <span className="text-[7px] text-[var(--accent-gold)]/60 font-mono tracking-widest uppercase block border-b border-[var(--border-soft)]/20 pb-2">
                  [ EDITORIAL STYLE ]
                </span>
                <h3 className="font-serif text-xl font-normal tracking-wide text-[var(--foreground)]">
                  {cat.name}
                </h3>
                <p className="text-xs font-light text-[var(--text-secondary)] leading-relaxed font-sans">
                  {cat.desc}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-[var(--border-soft)] mt-6">
                <div>
                  <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 font-mono">Palette</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.colors.map((c) => (
                      <span key={c} className="text-[10px] text-[var(--text-primary)] bg-[var(--bg-secondary)]/60 px-1.5 py-0.5 rounded-[2px] font-light font-mono border border-[var(--border-soft)]/20">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 font-mono">Descriptors</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.keywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-[8px] px-2 py-0 border-[var(--border-soft)] text-[var(--text-secondary)] rounded-[2px] font-normal font-sans hover:text-[var(--text-primary)] bg-[var(--background)]/30">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
