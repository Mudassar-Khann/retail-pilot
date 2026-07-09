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
  return (
    <div className="group border border-neutral-100/60 bg-white rounded-md flex flex-col justify-between hover:border-neutral-800 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-md overflow-hidden">
      {/* Product Image Panel with tall 2/3 ratio */}
      <div className="relative aspect-[2/3] bg-neutral-50/30 border-b border-neutral-100 flex items-center justify-center p-6 overflow-hidden">
        {/* Placeholder Sketch/Outline */}
        <div className="text-neutral-300/80 group-hover:scale-[1.03] transition-transform duration-700 flex flex-col items-center">
          <svg className="w-20 h-28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6c0 5.25 3.4 10.2 8 11.5 4.6-1.3 8-6.25 8-11.5V5l-8-3zm0 9H6V7h6v4z" />
          </svg>
          <span className="text-[8px] tracking-widest uppercase font-semibold text-neutral-400 mt-2 block">
            {product.category}
          </span>
        </div>

        {/* Season & Gender Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[8px] border-neutral-100/50 text-neutral-600 rounded-[2px]">
            {product.gender}
          </Badge>
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-[8px] border-neutral-100/50 text-neutral-500 rounded-[2px] font-normal">
            {product.season}
          </Badge>
        </div>

        {/* Sizing Details Slide-Up Panel on Hover (No circular bag button) */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm py-3.5 px-4 border-t border-neutral-100/60 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between z-15 shadow-sm">
          <span className="text-[8px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">Sizes</span>
          <span className="text-[10px] text-neutral-800 font-mono tracking-widest">{product.size_options.join("  ")}</span>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-[9px] text-neutral-400 uppercase tracking-[0.18em] font-semibold">{product.brand}</p>
            <h3 className="text-xs font-normal text-neutral-800 tracking-wide mt-1 line-clamp-1">{product.name}</h3>
          </div>
          <span className="text-xs font-semibold text-neutral-950 mt-1">${product.price.toFixed(2)}</span>
        </div>

        {/* Color details */}
        <div className="flex items-center text-[9px] text-neutral-400 uppercase tracking-widest pt-2 border-t border-neutral-100/60">
          <span>Color: {product.color}</span>
        </div>

        {/* Style Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.style_tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-neutral-50 text-neutral-500 text-[8px] px-2 border-neutral-200 rounded-[2px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
