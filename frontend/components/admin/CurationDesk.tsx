"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, AlertTriangle, ShieldCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: number;
  top_product_id?: number | null;
  bottom_product_id?: number | null;
  total_price: number;
  order_status: string;
  created_at: string;
}

interface CurationDeskProps {
  onExit: () => void;
}

export default function CurationDesk({ onExit }: CurationDeskProps) {
  const [pendingReturns, setPendingReturns] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingReturns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/returns/pending");
      const data = await res.json();
      if (data.returns) {
        setPendingReturns(data.returns);
      }
    } catch (err) {
      console.error("Failed to fetch pending returns:", err);
      setError("Failed to fetch pending return requests from uvicorn server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReturns();
  }, []);

  const handleAction = async (orderId: number, action: "approve" | "reject") => {
    try {
      const endpoint = `http://localhost:8000/api/orders/${orderId}/${action}-return`;
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.order) {
        // Refresh list
        await fetchPendingReturns();
      }
    } catch (err) {
      console.error(`Failed to execute ${action} on order #${orderId}:`, err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-8 relative flex flex-col justify-between glass-fluted">
      {/* Background fabric mesh visualization (Image 4 mesh styling) */}
      <img 
        src="/assets/backgrounds/mesh_flow.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-screen z-0"
      />

      {/* Ambient glow accents */}
      <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-[var(--accent-gold)]/8 blur-[120px] pointer-events-none z-0 animate-ambient" />
      <div className="absolute bottom-40 -right-32 w-80 h-80 rounded-full bg-lime-500/6 blur-[100px] pointer-events-none z-0 animate-ambient" />

      <div className="flex-1 space-y-8 z-10 max-w-5xl mx-auto w-full">
        {/* Header / switch back */}
        <div className="flex justify-between items-center border-b border-[var(--border-soft)] pb-5">
          <div className="space-y-1">
            <span className="text-[8px] font-mono tracking-[0.25em] text-lime-400 uppercase">
              RETAILPILOT // OPERATIONAL COMMAND
            </span>
            <h2 className="text-xl font-mono tracking-wider font-light text-[var(--foreground)] uppercase">
              Curator Curation Desk
            </h2>
          </div>
          <button
            onClick={onExit}
            className="px-3.5 py-1.5 text-[8px] font-mono tracking-[0.18em] uppercase border border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:border-[var(--text-secondary)] rounded-sm cursor-pointer transition-colors"
          >
            [ EXIT CURATION DESK ]
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--bg-secondary)]/40 p-4 border border-[var(--border-soft)] rounded-sm backdrop-blur-sm">
            <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)]">
              PENDING RETURN VERIFICATION LEDGER
            </span>
            <button
              onClick={fetchPendingReturns}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-[9px] font-mono text-[var(--text-secondary)] hover:text-[var(--foreground)] cursor-pointer transition-colors"
            >
              <RefreshCw size={10} className={isLoading ? "animate-spin" : ""} />
              Force Sync
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 border border-red-500/20 bg-red-500/5 p-4 rounded-sm text-red-400 text-xs font-mono">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-[var(--text-secondary)]" size={24} />
              <p className="text-[9px] font-mono tracking-widest text-[var(--text-secondary)]">
                FETCHING LEDGER STATE...
              </p>
            </div>
          ) : pendingReturns.length === 0 ? (
            <div className="py-20 border border-dashed border-[var(--border-soft)] rounded-md text-center space-y-2">
              <ShieldCheck className="mx-auto text-[var(--text-muted)]" size={28} />
              <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
                Ledger Clean // No Returns Pending Review
              </p>
            </div>
          ) : (
            <div className="border border-[var(--border-soft)] rounded-md overflow-hidden bg-[var(--bg-card)] backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse font-mono text-[9px] tracking-wider">
                <thead>
                  <tr className="border-b border-[var(--border-soft)] bg-[var(--bg-secondary)]/30 text-[var(--text-secondary)]">
                    <th className="p-4 uppercase font-semibold">Order ID</th>
                    <th className="p-4 uppercase font-semibold">Created At</th>
                    <th className="p-4 uppercase font-semibold">Top ID</th>
                    <th className="p-4 uppercase font-semibold">Bottom ID</th>
                    <th className="p-4 uppercase font-semibold">Total Price</th>
                    <th className="p-4 uppercase font-semibold text-right">Curation Decisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-soft)]">
                  {pendingReturns.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--bg-secondary)]/20 transition-colors">
                      <td className="p-4 text-[var(--foreground)] font-bold">#{order.id}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{order.created_at}</td>
                      <td className="p-4 text-[var(--text-primary)]">{order.top_product_id || "—"}</td>
                      <td className="p-4 text-[var(--text-primary)]">{order.bottom_product_id || "—"}</td>
                      <td className="p-4 text-[var(--foreground)] font-semibold">${order.total_price.toFixed(2)}</td>
                      <td className="p-4 text-right flex justify-end gap-2.5">
                        <button
                          onClick={() => handleAction(order.id, "reject")}
                          className="flex items-center gap-1 px-2.5 py-1 border border-[var(--border-soft)] hover:border-red-500/50 text-[var(--text-secondary)] hover:text-red-400 rounded-sm cursor-pointer transition-all duration-300 text-[8px] uppercase"
                        >
                          <X size={8} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(order.id, "approve")}
                          className="flex items-center gap-1 px-2.5 py-1 border border-[var(--border-soft)] hover:border-lime-500 hover:bg-lime-500/5 text-[var(--text-secondary)] hover:text-lime-400 rounded-sm cursor-pointer transition-all duration-300 text-[8px] uppercase shadow-[0_0_6px_rgba(132,204,22,0.05)]"
                        >
                          <Check size={8} />
                          Approve Refund
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer metadata details */}
      <div className="border-t border-[var(--border-soft)] pt-5 mt-10 text-center text-[7px] font-mono tracking-widest text-[var(--text-muted)] uppercase z-10">
        <span>Curator Terminal v1.5 // Secure Ledger Session</span>
      </div>
    </div>
  );
}
