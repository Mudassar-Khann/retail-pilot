"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/components/character";
import { getProductSlot } from "@/components/character/garmentArt";

interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  drapeOutfit?: {
    topId: number;
    bottomId: number;
  };
}

interface StylistChatProps {
  onDrapeOutfit: (top: ClothingItem | null, bottom: ClothingItem | null) => void;
  onExternalDrape: (productId: number) => void;
  activeOrderId: number | null;
  products: ClothingItem[];
}

export default function StylistChat({ onDrapeOutfit, onExternalDrape, activeOrderId, products }: StylistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "stylist",
      text: "Welcome to the RetailPilot Editorial Salon. I am your Personal Stylist. Tell me what aesthetic you wish to compose today: Old Money luxury, modern Streetwear, or minimalist Techwear?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Poll order status to toggle suspend block
  useEffect(() => {
    if (!activeOrderId) {
      setIsSuspended(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/orders/${activeOrderId}`);
        const data = await res.json();
        if (data.order) {
          const status = data.order.order_status;
          setIsSuspended(status === "awaiting_return_approval");
        }
      } catch (err) {
        console.warn("Failed to check order status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [activeOrderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Regular expression to find and parse [WEAR_OUTFIT: X, Y]
  const parseWearOutfitTag = (text: string) => {
    const regex = /\[WEAR_OUTFIT:\s*(\d+),\s*(\d+)\]/i;
    const match = text.match(regex);
    if (match) {
      const topId = parseInt(match[1], 10);
      const bottomId = parseInt(match[2], 10);
      const cleanedText = text.replace(regex, "").trim();
      return { cleanedText, drapeOutfit: { topId, bottomId } };
    }
    return { cleanedText: text, drapeOutfit: undefined };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query })
      });
      
      const data = await res.json();
      
      const { cleanedText, drapeOutfit } = parseWearOutfitTag(data.response || "");
      
      const stylistMessage: Message = {
        id: `stylist-${Date.now()}`,
        sender: "stylist",
        text: cleanedText || "I have processed your request, but could not draft a response.",
        drapeOutfit
      };
      
      setMessages(prev => [...prev, stylistMessage]);

      // Handle execute_tryon actions from agent response
      if (data.actions && Array.isArray(data.actions)) {
        data.actions.forEach((action: any) => {
          if (action.type === "DRAPE" && typeof action.product_id === "number") {
            onExternalDrape(action.product_id);
          }
        });
      }
    } catch (err) {
      console.error("Error communicating with stylist backend:", err);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: "stylist",
        text: "I apologize, but I encountered an error connecting to the styling agent workflow."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDrape = (topId: number, bottomId: number) => {
    const topItem = products.find((item) => item.id === topId && getProductSlot(item.category) === "top") || null;
    const bottomItem = products.find((item) => item.id === bottomId && getProductSlot(item.category) === "bottom") || null;
    
    onDrapeOutfit(topItem, bottomItem);
  };

  return (
    <div className="relative border border-[var(--border-soft)] hover:border-[var(--accent-gold)]/20 glass-fluted text-[var(--foreground)] rounded-lg flex flex-col h-[400px] overflow-hidden shadow-2xl transition-all duration-500">
      {/* Background fabric mesh visualization (Image 4 reference) */}
      <img 
        src="/assets/backgrounds/mesh_flow.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none mix-blend-screen z-0"
      />

      {/* Header */}
      <div className="border-b border-[var(--border-soft)]/80 bg-[var(--background)]/80 backdrop-blur-md px-4 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-[9px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] uppercase font-mono">
            STYLING_GRAPH_ACTIVE
          </span>
        </div>
        <span className="text-[9px] font-serif italic text-[var(--text-secondary)]">
          Personal Stylist
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {/* Message Bubble - Glassmorphic Stack (Image 3 reference) */}
            <div 
              className={`p-3.5 text-xs font-light leading-relaxed rounded-md border backdrop-blur-md transition-all duration-300 ${
                msg.sender === "user"
                  ? "bg-[var(--foreground)]/10 border-[var(--foreground)]/10 text-[var(--foreground)] rounded-tr-none"
                  : "bg-[var(--bg-secondary)]/80 border-[var(--border-soft)]/80 text-[var(--text-primary)] rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>

            {/* Drape Action Card (Image 6 typography & neon outline border glow) */}
            {msg.drapeOutfit && (
              <button
                onClick={() => executeDrape(msg.drapeOutfit!.topId, msg.drapeOutfit!.bottomId)}
                className="mt-2.5 flex items-center gap-2 px-3 py-1.5 border border-lime-400/60 hover:border-lime-400 hover:bg-lime-400/5 text-lime-400 hover:text-lime-300 text-[9px] font-mono tracking-widest uppercase rounded-[2px] transition-all duration-300 shadow-[0_0_8px_rgba(132,204,22,0.1)] cursor-pointer"
              >
                <RefreshCw size={10} className="animate-spin-slow" />
                ↗ DRAPE SYSTEM OUTFIT
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-mono p-1">
            <Loader2 size={12} className="animate-spin text-[var(--text-secondary)]" />
            STYLIST WORKFLOW THINKING...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suspended Lock Banner */}
      {isSuspended && (
        <div className="bg-amber-500/10 border-t border-b border-amber-500/25 px-4 py-2 flex items-center justify-between z-15 select-none">
          <span className="text-[8px] font-mono tracking-widest text-amber-400 uppercase animate-pulse">
            [ STATE: SUSPENDED // AWAITING STAFF APPROVAL ]
          </span>
          <span className="text-[7px] font-mono text-amber-500/80">
            SECURE_LOCK
          </span>
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={handleSendMessage}
        className="border-t border-[var(--border-soft)]/80 bg-[var(--background)]/80 backdrop-blur-md p-3 flex gap-2 items-center z-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || isSuspended}
          placeholder={
            isSuspended 
              ? "Support chat locked pending return review..." 
              : "Ask stylist for outfit ideas or return support..."
          }
          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-soft)] focus:border-[var(--text-secondary)] text-xs px-3 py-2 rounded-sm text-[var(--foreground)] placeholder:text-[var(--text-secondary)] focus:outline-none disabled:opacity-50"
          aria-label="Ask the stylist"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim() || isSuspended}
          size="sm"
          className="bg-lime-500 hover:bg-lime-400 text-[var(--background)] font-bold px-3 rounded-sm cursor-pointer disabled:opacity-50"
        >
          <Send size={12} />
        </Button>
      </form>
    </div>
  );
}
