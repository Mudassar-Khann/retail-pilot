import { ProductClient } from "./ProductClient";
import Link from "next/link";
import { findCuratedProduct, getSimilarCuratedProducts } from "@/lib/curated-products";

async function getProduct(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${apiUrl}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Product service unavailable");
    }
    return res.json();
  } catch {
    const product = findCuratedProduct(id);
    if (!product) return null;

    return {
      product,
      similar_products: getSimilarCuratedProducts(id),
      inventory: { source: "curated-fallback" },
      availability: "In Stock",
      isOffline: true,
    };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getProduct(resolvedParams.id);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-void)] text-white px-6 text-center">
        <p className="text-[10px] tracking-[0.24em] uppercase text-[var(--accent-gold)] mb-4">Unavailable Piece</p>
        <h1 className="text-3xl font-display font-light tracking-wide mb-4">This garment is no longer in the current edit.</h1>
        <p className="max-w-md text-sm text-[var(--text-secondary)] leading-7 mb-8">
          Return to the collection to continue exploring the available selection.
        </p>
        <Link href="/" className="min-h-11 inline-flex items-center justify-center rounded-full border border-white/15 px-6 text-[10px] tracking-[0.18em] uppercase text-[var(--accent-gold)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
          Back to collection
        </Link>
      </div>
    );
  }

  return (
    <ProductClient
      product={data.product}
      similar_products={data.similar_products}
      inventory={data.inventory}
      availability={data.availability}
      isOffline={data.isOffline}
    />
  );
}
