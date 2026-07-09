import { Badge } from "@/components/ui/badge";

export default function FeaturedCategories() {
  const categories = [
    {
      name: "Old Money",
      desc: "Classic elegance and high-society preppy styles. Defined by tailoring, natural fabrics, and quiet luxury.",
      colors: ["Camel", "Navy", "Cream"],
      keywords: ["Classy", "Luxury", "Tailored"],
      bgClass: "bg-amber-50/40"
    },
    {
      name: "Streetwear",
      desc: "Heavyweight boxy cuts, custom vintage washes, and skate-culture influences. Comfort meets urban expression.",
      colors: ["Black", "Olive", "Grey"],
      keywords: ["Oversized", "Graphic", "Raw"],
      bgClass: "bg-slate-50"
    },
    {
      name: "Korean Fashion",
      desc: "Seoul-inspired minimalist drape and soft silhouettes. Pastel washes, dropped shoulders, and clean layers.",
      colors: ["Beige", "Ecru", "Sage"],
      keywords: ["Drape", "Soft", "Layered"],
      bgClass: "bg-stone-50"
    },
    {
      name: "Minimalist",
      desc: "Clean contours, simple essentials, and zero distraction. Focus on high-quality fabrics and perfect fits.",
      colors: ["White", "Charcoal", "Indigo"],
      keywords: ["Clean", "Basic", "Monochrome"],
      bgClass: "bg-neutral-50"
    },
    {
      name: "Techwear",
      desc: "High-performance functional apparel with utility-focused cargo pockets, GORE-TEX shells, and modular details.",
      colors: ["Matte Black", "Olive Drab"],
      keywords: ["Waterproof", "Tactical", "Nylon"],
      bgClass: "bg-zinc-50"
    }
  ];

  return (
    <section id="categories" className="py-20 bg-neutral-50/50 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
              Curated Aesthetics
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
              Browse by Style
            </h2>
          </div>
          <p className="text-xs font-light text-neutral-500 max-w-xs md:text-right">
            Explore the core aesthetic categories supported by the RetailPilot styling intelligence.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              className={`p-6 border border-neutral-200 bg-white flex flex-col justify-between aspect-[3/4] group hover:border-neutral-800 transition-all duration-300 relative overflow-hidden`}
            >
              {/* Subtle hover background transition */}
              <div className={`absolute inset-0 ${cat.bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className="space-y-4">
                <span className="text-[10px] text-neutral-400 font-mono">
                  STYLE_0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-normal tracking-wide text-neutral-950">
                  {cat.name}
                </h3>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-100 mt-6">
                <div>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-1.5">Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.colors.map((c) => (
                      <span key={c} className="text-[10px] text-neutral-700 bg-neutral-100 px-1.5 py-0.5 font-light">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-1.5">Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.keywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-[8px] px-1 py-0 border-neutral-200">
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
