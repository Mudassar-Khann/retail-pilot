import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

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
    <div className="group border border-neutral-100 bg-white flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
      {/* Product Image Panel */}
      <div className="relative aspect-[4/5] bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-center p-6 overflow-hidden">
        {/* Placeholder Sketch/Outline */}
        <div className="text-neutral-200 group-hover:scale-105 transition-transform duration-500 flex flex-col items-center">
          <svg className="w-24 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6c0 5.25 3.4 10.2 8 11.5 4.6-1.3 8-6.25 8-11.5V5l-8-3zm0 9H6V7h6v4z" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase font-semibold text-neutral-400 mt-2 block">
            {product.category}
          </span>
        </div>

        {/* Season & Gender Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-[8px] border-neutral-100">
            {product.gender}
          </Badge>
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-[8px] border-neutral-100">
            {product.season}
          </Badge>
        </div>

        {/* Quick Add overlay button */}
        <button
          className="absolute bottom-3 right-3 bg-neutral-950 text-white p-2.5 rounded-full hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm cursor-pointer"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={14} />
        </button>
      </div>

      {/* Info panel */}
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">{product.brand}</p>
            <h3 className="text-xs font-medium text-neutral-900 tracking-wide mt-0.5 line-clamp-1">{product.name}</h3>
          </div>
          <span className="text-xs font-semibold text-neutral-950">${product.price.toFixed(2)}</span>
        </div>

        {/* Color & Sizes */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-light pt-2 border-t border-neutral-50">
          <span>Color: {product.color}</span>
          <span>Sizes: {product.size_options.join(", ")}</span>
        </div>

        {/* Style Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.style_tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-neutral-50 text-neutral-600 text-[8px] px-2 border-neutral-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
