import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export interface ProductType {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: string;
  style_tags: string[];
  color: string;
  size_options: string[];
  price: number;
  gender: string;
  season: string;
}

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [transformStyle, setTransformStyle] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rotateX = (-mouseY / (height / 2)) * 5;
    const rotateY = (mouseX / (width / 2)) * 5;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const getShadowColor = (tags: string[] = []) => {
    const tagStr = tags.join(" ").toLowerCase();
    if (tagStr.includes("old money") || tagStr.includes("quiet luxury")) return "rgba(197, 168, 128, 0.22)";
    if (tagStr.includes("techwear")) return "rgba(217, 119, 6, 0.15)";
    if (tagStr.includes("streetwear")) return "rgba(139, 30, 45, 0.15)";
    return "rgba(197, 168, 128, 0.12)";
  };

  const shadowColor = getShadowColor(product.style_tags);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group border border-[var(--border-soft)]/80 hover:border-[var(--accent-gold)]/40 bg-[var(--bg-secondary)] rounded-md flex flex-col justify-between will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
      style={{
        transform: transformStyle,
        boxShadow: isHovered ? `0 16px 40px ${shadowColor}` : "none",
      }}
    >
      {/* Product Image Panel with tall 2/3 ratio */}
      <div className="relative aspect-[2/3] bg-[var(--background)]/40 border-b border-[var(--bg-secondary)] flex items-center justify-center p-6 overflow-hidden">
        {/* Placeholder Sketch/Outline */}
        <div className="text-[var(--text-muted)] group-hover:scale-[1.03] transition-transform duration-700 flex flex-col items-center">
          <svg className="w-20 h-28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6c0 5.25 3.4 10.2 8 11.5 4.6-1.3 8-6.25 8-11.5V5l-8-3zm0 9H6V7h6v4z" />
          </svg>
          <span className="text-[8px] tracking-widest uppercase font-semibold text-[var(--text-secondary)] mt-2 block">
            {product.category}
          </span>
        </div>

        {/* Season & Gender Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <Badge variant="secondary" className="bg-[var(--background)]/90 backdrop-blur-sm text-[8px] border-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[2px]">
            {product.gender}
          </Badge>
          <Badge variant="outline" className="bg-[var(--background)]/90 backdrop-blur-sm text-[8px] border-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[2px] font-normal">
            {product.season}
          </Badge>
        </div>

        {/* Sizing Details Slide-Up Panel on Hover (No circular bag button) */}
        <div className="absolute inset-x-0 bottom-0 bg-[var(--background)]/95 backdrop-blur-sm py-3.5 px-4 border-t border-[var(--bg-secondary)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between z-15 shadow-sm">
          <span className="text-[8px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] uppercase">Sizes</span>
          <span className="text-[10px] text-[var(--text-primary)] font-mono tracking-widest">{product.size_options.join("  ")}</span>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-[0.18em] font-semibold">{product.brand}</p>
            <h3 className="text-xs font-normal text-[var(--text-primary)] tracking-wide mt-1 line-clamp-1 group-hover:text-[#F4EFE6] transition-colors">{product.name}</h3>
          </div>
          <span className="text-xs font-semibold text-[var(--accent-gold)] mt-1">${product.price.toFixed(2)}</span>
        </div>

        {/* Color details */}
        <div className="flex items-center text-[9px] text-[var(--text-secondary)] uppercase tracking-widest pt-2 border-t border-[var(--bg-secondary)]">
          <span>Color: {product.color}</span>
        </div>

        {/* Style Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.style_tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[8px] px-2 border-[var(--border-soft)] rounded-[2px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
