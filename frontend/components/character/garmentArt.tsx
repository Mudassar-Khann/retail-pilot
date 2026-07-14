import { useState } from "react";
import { ClothingItem, OutfitSelection } from "./OutfitState";

type ProductPreview = Pick<
  ClothingItem,
  | "id"
  | "category"
  | "color"
  | "name"
  | "overlay_top_percent"
  | "overlay_left_percent"
  | "overlay_width_percent"
>;
type Slot = keyof OutfitSelection;

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
  if (!colorName) return "#d4d4d8";
  return COLOR_MAP[colorName] || "#d4d4d8";
}

export function getProductSlot(category: string): Slot | null {
  if (["Tops", "T-Shirts", "Shirts"].includes(category)) return "top";
  if (["Outerwear", "Hoodies", "Jackets"].includes(category)) return "outerwear";
  if (["Bottoms", "Jeans", "Cargo Pants", "Chinos"].includes(category)) return "bottom";
  if (category === "Shoes") return "shoes";
  return null;
}

function renderCuratedGarment(product: ProductPreview, mode: "silhouette" | "overlay") {
  const stroke = "#C5A880";
  const strokeWidth = 1;
  const strokeDasharray = "3,3";
  const fillNone = "none";
  const scenic = "none";
  const accent = "#C5A880";
  const muted = "rgba(255, 255, 255, 0.25)";

  switch (product.id) {
    case 2001:
      return (
        <svg viewBox="0 0 100 120" className="w-full h-auto">
          <path d="M10 20 L90 20 L98 50 L83 54 L78 34 L74 102 L26 102 L22 34 L17 54 L2 50 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M34 18 Q50 36 66 18" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M23 48 Q36 40 50 46 T77 48 L77 86 Q65 78 51 80 T23 84 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M28 61 Q40 57 49 61 T72 62" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <circle cx="67" cy="73" r="4" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2002:
      return (
        <svg viewBox="0 0 100 122" className="w-full h-auto">
          <path d="M16 18 L84 18 L96 54 L83 57 L78 38 L74 104 L26 104 L22 38 L17 57 L4 54 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M33 18 Q50 0 67 18" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          {[24, 38, 52, 66].map((x, index) => (
            <g key={x}>
              <path d={`M${x} 28 Q50 ${38 + index * 8} ${100 - x} 28`} fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
              <ellipse cx={x} cy={46 + index * 12} rx="6" ry="4" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
            </g>
          ))}
        </svg>
      );
    case 2003:
      return (
        <svg viewBox="0 0 100 120" className="w-full h-auto">
          <path d="M12 22 L88 22 L98 52 L84 55 L79 36 L75 103 L25 103 L21 36 L16 55 L2 52 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M42 22 L50 30 L58 22" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M50 36 L54 52 L69 48 L58 60 L71 72 L54 69 L50 86 L46 69 L29 72 L42 60 L31 48 L46 52 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2004:
      return (
        <svg viewBox="0 0 100 220" className="w-full h-auto">
          <path d="M18 0 L82 0 L90 85 L92 218 L74 218 L52 92 L48 92 L26 218 L8 218 L10 85 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M21 58 L31 58 L35 210 L26 210 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M69 58 L79 58 L74 210 L65 210 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2005:
      return (
        <svg viewBox="0 0 110 140" className="w-full h-auto">
          <path d="M6 14 L104 14 L108 92 L96 95 L90 34 L80 126 L30 126 L20 34 L14 95 L2 92 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M54 16 L54 124" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          {[28, 42, 56, 70].map((y) => (
            <rect key={y} x="10" y={y} width="12" height="8" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          ))}
          <path d="M57 28 Q74 18 88 28 L84 92 Q73 80 59 86 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2006:
      return (
        <svg viewBox="0 0 100 128" className="w-full h-auto">
          <path d="M14 12 L86 12 L95 42 L84 45 L80 24 L78 112 L22 112 L20 24 L16 45 L5 42 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M38 14 L62 14 L60 44 L40 44 Z" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M50 14 L50 52" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M20 32 L34 36 L28 90" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M80 32 L66 36 L72 90" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2007:
      return (
        <svg viewBox="0 0 100 120" className="w-full h-auto">
          <path d="M10 20 L90 20 L99 50 L84 53 L79 34 L75 101 L25 101 L21 34 L16 53 L1 50 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M14 36 Q22 28 30 36 T46 36 T62 36 T78 36" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} strokeLinecap="round" />
          <path d="M24 78 Q36 70 49 78 T77 80" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} strokeLinecap="round" />
        </svg>
      );
    case 2008:
      return (
        <svg viewBox="0 0 110 145" className="w-full h-auto">
          <path d="M6 14 L104 14 L108 94 L95 97 L90 34 L82 128 L28 128 L20 34 L15 97 L2 94 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M55 14 L55 126" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M24 26 Q36 18 48 28 L50 88 Q38 80 24 86 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M62 28 Q74 18 86 26 L86 86 Q73 80 60 88 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <circle cx="38" cy="46" r="4" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <circle cx="72" cy="48" r="4" fill="none" stroke={accent} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    case 2009:
      return (
        <svg viewBox="0 0 100 120" className="w-full h-auto">
          <path d="M10 20 L90 20 L100 50 L85 53 L80 35 L75 102 L25 102 L20 35 L15 53 L0 50 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M0 74 Q18 56 36 52 T72 58 T100 46 L100 102 L0 102 Z" fill="none" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M14 68 L28 64 L22 80 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          <path d="M58 66 L74 62 L68 80 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        </svg>
      );
    default:
      return null;
  }
}

function renderGenericSilhouette(category: string) {
  const stroke = "#C5A880";
  const strokeWidth = 1;
  const strokeDasharray = "3,3";

  if (["Tops", "T-Shirts", "Shirts"].includes(category)) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray}>
        <path d="M20 20 L80 20 L95 40 L82 42 L78 30 L75 90 L25 90 L22 30 L18 42 L5 40 Z" />
      </svg>
    );
  }
  if (["Outerwear", "Hoodies", "Jackets"].includes(category)) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray}>
        <path d="M15 15 L85 15 L95 80 L85 82 L80 30 L76 95 L24 95 L20 30 L15 82 L5 80 Z" />
        <path d="M40 15 L50 28 L60 15" />
      </svg>
    );
  }
  if (["Bottoms", "Jeans", "Cargo Pants", "Chinos"].includes(category)) {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray}>
        <path d="M20 0 L80 0 L90 60 L92 118 L72 118 L50 55 L28 118 L8 118 L10 60 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 50" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray}>
      <path d="M10 20 L40 20 L45 42 L5 42 Z" />
      <path d="M60 20 L90 20 L95 42 L55 42 Z" />
    </svg>
  );
}

function renderGenericOverlay(product: ProductPreview, slot: Slot) {
  const stroke = "#C5A880";
  const strokeWidth = 1;
  const strokeDasharray = "3,3";
  const fillNone = "none";
  const muted = "rgba(255, 255, 255, 0.25)";

  if (slot === "bottom") {
    return (
      <svg viewBox="0 0 100 240" className="w-full h-auto">
        <path d="M15 0 L85 0 L95 120 L96 238 L76 238 L50 110 L24 238 L4 238 L5 120 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        {product.category === "Cargo Pants" && (
          <>
            <rect x="5" y="100" width="12" height="20" rx="1" fill={fillNone} stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
            <rect x="83" y="100" width="12" height="20" rx="1" fill={fillNone} stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          </>
        )}
        {product.category === "Jeans" && <path d="M50 10 L50 90" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />}
      </svg>
    );
  }

  if (slot === "outerwear") {
    return (
      <svg viewBox="0 0 110 150" className="w-full h-auto">
        <path d="M5 12 Q55 25 105 12 L110 95 L98 97 L92 35 L80 135 L30 135 L18 35 L12 97 L0 95 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      </svg>
    );
  }

  if (slot === "shoes") {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-auto">
        <path d="M5 10 L35 10 L40 35 L2 35 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
        <path d="M65 10 L95 10 L98 35 L60 35 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      </svg>
    );
  }

  return product.category.includes("Shirt") || product.category === "Tops" ? (
    <svg viewBox="0 0 100 140" className="w-full h-auto">
      <path d="M10 15 L90 15 L100 90 L88 92 L82 35 L78 120 L22 120 L18 35 L12 92 L0 90 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="50" y1="20" x2="50" y2="120" stroke={muted} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </svg>
  ) : (
    <svg viewBox="0 0 100 120" className="w-full h-auto">
      <path d="M10 20 L90 20 L100 50 L85 53 L80 35 L75 100 L25 100 L20 35 L15 53 L0 50 Z" fill={fillNone} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </svg>
  );
}

export function ProductSilhouette({
  product,
  category,
  className = "w-32 h-32",
}: {
  product?: ProductPreview | null;
  category?: string;
  className?: string;
}) {
  const resolvedCategory = product?.category || category || "Accessories";
  const curated = product ? renderCuratedGarment(product, "silhouette") : null;

  return (
    <div className={`${className} text-neutral-800`}>
      {curated || renderGenericSilhouette(resolvedCategory)}
    </div>
  );
}

export function GarmentOverlayArt({
  product,
  slot,
  className,
}: {
  product: ClothingItem;
  slot: Slot;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  // Default coordinate fallbacks matching original layout structures
  const top = product.overlay_top_percent !== undefined && product.overlay_top_percent !== null
    ? product.overlay_top_percent
    : (slot === "bottom" ? 48 : slot === "outerwear" ? 18 : slot === "shoes" ? 86 : 20);

  const left = product.overlay_left_percent !== undefined && product.overlay_left_percent !== null
    ? product.overlay_left_percent
    : (slot === "bottom" ? 24 : slot === "outerwear" ? 20 : slot === "shoes" ? 26 : 22);

  const width = product.overlay_width_percent !== undefined && product.overlay_width_percent !== null
    ? product.overlay_width_percent
    : (slot === "bottom" ? 52 : slot === "outerwear" ? 60 : slot === "shoes" ? 48 : 56);

  const style = {
    position: "absolute" as const,
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    height: "auto",
    objectFit: "contain" as const,
  };

  const src = product.image_path;

  if (hasError || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={product.name}
      onError={() => {
        console.warn(`Garment image failed to load: ${src}. Falling back to SVG silhouette.`);
        setHasError(true);
      }}
      className={`pointer-events-none ${className || ""}`}
      style={style}
    />
  );
}
