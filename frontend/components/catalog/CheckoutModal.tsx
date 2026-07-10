"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutfitSelection } from "@/components/character";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: OutfitSelection;
  onPurchaseSuccess: (orderId: number) => void;
}

export default function CheckoutModal({ isOpen, onClose, selection, onPurchaseSuccess }: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"summary" | "processing" | "success">("summary");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset steps on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("summary");
      setOrderId(null);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const totalPrice = Object.values(selection).reduce((sum: number, item: any) => {
    return sum + (item ? item.price : 0);
  }, 0);

  const handlePurchase = async () => {
    setStep("processing");
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          top_product_id: selection.top?.id || null,
          bottom_product_id: selection.bottom?.id || null,
          outerwear_product_id: selection.outerwear?.id || null,
          shoes_product_id: selection.shoes?.id || null,
          total_price: totalPrice
        })
      });
      const data = await res.json();
      if (data.order && data.order.id) {
        setOrderId(data.order.id);
        setStep("success");
        onPurchaseSuccess(data.order.id);
      }
    } catch (err) {
      console.error("Failed to complete purchase order:", err);
      setStep("summary");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[var(--background)]/60 backdrop-blur-sm transition-opacity duration-300" 
      />

      {/* Main Card */}
      <div className="relative w-full max-w-sm bg-[var(--background)] border border-[var(--bg-secondary)] rounded-lg shadow-2xl p-6 overflow-hidden z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {/* Border highlights */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--border-soft)]" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[var(--border-soft)]" />
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--bg-secondary)] pb-3">
          <span className="text-[8px] font-mono tracking-[0.2em] text-[var(--text-secondary)] uppercase">
            SECURE_CHECKOUT
          </span>
          {step !== "processing" && (
            <button 
              onClick={onClose} 
              className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dynamic Steps */}
        {step === "summary" && (
          <div className="space-y-6 pt-6">
            {/* receipt summary */}
            <div className="space-y-3.5">
              <span className="text-[7px] font-mono text-[var(--text-secondary)] uppercase tracking-widest block">
                Order Items Summary
              </span>
              
              <div className="space-y-2 border-b border-[var(--bg-secondary)] pb-3">
                {selection.top && (
                  <div className="flex justify-between text-xs font-light text-[var(--text-primary)]">
                    <span className="truncate pr-4">{selection.top.brand} {selection.top.name}</span>
                    <span className="font-mono text-[10px]">${selection.top.price.toFixed(2)}</span>
                  </div>
                )}
                {selection.outerwear && (
                  <div className="flex justify-between text-xs font-light text-[var(--text-primary)]">
                    <span className="truncate pr-4">{selection.outerwear.brand} {selection.outerwear.name}</span>
                    <span className="font-mono text-[10px]">${selection.outerwear.price.toFixed(2)}</span>
                  </div>
                )}
                {selection.bottom && (
                  <div className="flex justify-between text-xs font-light text-[var(--text-primary)]">
                    <span className="truncate pr-4">{selection.bottom.brand} {selection.bottom.name}</span>
                    <span className="font-mono text-[10px]">${selection.bottom.price.toFixed(2)}</span>
                  </div>
                )}
                {selection.shoes && (
                  <div className="flex justify-between text-xs font-light text-[var(--text-primary)]">
                    <span className="truncate pr-4">{selection.shoes.brand} {selection.shoes.name}</span>
                    <span className="font-mono text-[10px]">${selection.shoes.price.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">Total Price</span>
                <span className="text-sm font-bold text-[var(--foreground)] font-mono">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={totalPrice === 0}
              className="w-full bg-lime-500 hover:bg-lime-400 text-[var(--background)] font-bold tracking-widest text-[8px] uppercase py-4 rounded-[2px] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CreditCard size={11} />
              [ AUTHORIZE TRANSACTION ]
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-lime-400" size={32} />
            <div className="text-center space-y-1">
              <p className="text-[9px] font-mono tracking-[0.2em] text-[var(--text-primary)] uppercase">
                PROCESSING_LEDGER...
              </p>
              <p className="text-[8px] font-mono text-[var(--text-muted)]">
                Please do not close this window
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 pt-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <CheckCircle2 className="text-lime-400" size={36} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-[var(--foreground)]">
                  TRANSACTION COMPLETED
                </h4>
                <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                  Order ID: #{orderId}
                </p>
              </div>
            </div>

            <p className="text-[10px] font-light text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
              Your virtual look has been logged into the SQLite ledger database. 
              Refer to Order #{orderId} for support or return inquiries.
            </p>

            <Button
              onClick={onClose}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--foreground)] hover:bg-[var(--border-soft)] font-bold tracking-widest text-[8px] uppercase py-3 rounded-[2px] cursor-pointer"
            >
              Close Drawer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
