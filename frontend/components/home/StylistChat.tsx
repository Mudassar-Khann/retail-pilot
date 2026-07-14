"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClothingItem, MOCK_TOPS, MOCK_OUTERWEAR, MOCK_BOTTOMS, MOCK_SHOES } from "@/components/character";
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

let messageCounter = 0;
const generateMessageId = (sender: "user" | "stylist" | "error") => {
  messageCounter += 1;
  return `${sender}-${Date.now()}-${messageCounter}`;
};

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

  // Regular expression to find and parse [WEAR_OUTFIT: X, Y] globally
  const parseWearOutfitTag = (text: string) => {
    const regex = /\[WEAR_OUTFIT:\s*(\d+),\s*(\d+)\]/gi;
    let match;
    let drapeOutfit: { topId: number; bottomId: number } | undefined = undefined;

    // Find the last match if there are multiple, or the first
    while ((match = regex.exec(text)) !== null) {
      drapeOutfit = {
        topId: parseInt(match[1], 10),
        bottomId: parseInt(match[2], 10)
      };
    }

    const cleanedText = text.replace(regex, "").trim();
    return { cleanedText, drapeOutfit };
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-medium text-[var(--foreground)]">{part}</strong>;
      }
      return part;
    });
  };

  const renderMessageContent = (text: string) => {
    // Split by paragraph
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((para, pIdx) => {
      const trimmedPara = para.trim();
      if (!trimmedPara) return null;

      // Handle headers starting with ###
      if (trimmedPara.startsWith("###")) {
        return (
          <h4 key={pIdx} className="font-serif text-[11px] font-bold tracking-wider mt-4 mb-2 text-[var(--accent-gold)] uppercase border-b border-[var(--border-soft)]/20 pb-1">
            {trimmedPara.replace(/^###\s*/, "")}
          </h4>
        );
      }

      // Handle bullet points
      if (trimmedPara.includes("\n* ") || trimmedPara.startsWith("* ") || trimmedPara.includes("\n- ") || trimmedPara.startsWith("- ")) {
        const lines = trimmedPara.split("\n");
        const listItems = lines.filter(line => line.trim().startsWith("*") || line.trim().startsWith("-"));

        // If there's preceding text before the list, render it first
        const introText = lines.filter(line => !line.trim().startsWith("*") && !line.trim().startsWith("-")).join(" ");

        return (
          <div key={pIdx} className="space-y-2">
            {introText && <p className="text-xs font-light text-[var(--text-primary)] leading-relaxed">{parseBoldText(introText)}</p>}
            <ul className="list-disc pl-4 space-y-1.5 my-2">
              {listItems.map((line, lIdx) => {
                const cleanLine = line.trim().replace(/^[\*\-]\s*/, "");
                return (
                  <li key={lIdx} className="text-xs font-light text-[var(--text-secondary)]">
                    {parseBoldText(cleanLine)}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      return (
        <p key={pIdx} className="mb-2 text-xs font-light text-[var(--text-primary)] leading-relaxed">
          {parseBoldText(trimmedPara)}
        </p>
      );
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId("user"),
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

      const { cleanedText, drapeOutfit } = parseWearOutfitTag(data.response?.message || "");

      const stylistMessage: Message = {
        id: generateMessageId("stylist"),
        sender: "stylist",
        text: cleanedText || "I have processed your request, but could not draft a response.",
        drapeOutfit
      };

      setMessages(prev => [...prev, stylistMessage]);

      // Automatically execute drape action if recommended in tag
      if (drapeOutfit) {
        executeDrape(drapeOutfit.topId, drapeOutfit.bottomId);
      }

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
        id: generateMessageId("error"),
        sender: "stylist",
        text: "I apologize, but I encountered an error connecting to the styling service."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDrape = (topId: number, bottomId: number) => {
    // Robust catalog search falling back to local mocks if needed
    const catalog = products.length > 0 ? products : [
      ...MOCK_TOPS,
      ...MOCK_OUTERWEAR,
      ...MOCK_BOTTOMS,
      ...MOCK_SHOES
    ];

    const topItem = catalog.find((item) => item.id === topId && getProductSlot(item.category) === "top") || null;
    const bottomItem = catalog.find((item) => item.id === bottomId && getProductSlot(item.category) === "bottom") || null;

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
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          <span className="text-[9px] font-semibold tracking-[0.18em] text-[var(--text-secondary)] uppercase font-mono">
            STYLIST ACTIVE
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
              {msg.sender === "user" ? msg.text : renderMessageContent(msg.text)}
            </div>

            {/* Drape Action Card (high-contrast accessible button colors) */}
            {msg.drapeOutfit && (
              <button
                onClick={() => executeDrape(msg.drapeOutfit!.topId, msg.drapeOutfit!.bottomId)}
                className="mt-2 flex items-center gap-2 px-3.5 py-1.5 border border-lime-600/30 dark:border-lime-400/40 bg-lime-50/50 dark:bg-lime-950/20 text-lime-700 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-300 hover:bg-lime-100/50 dark:hover:bg-lime-950/40 text-[9px] font-mono tracking-widest uppercase rounded-[2px] transition-all duration-300 shadow-sm cursor-pointer"
              >
                <RefreshCw size={10} className="animate-spin-slow" />
                ↗ DRAPE CURATED OUTFIT
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-mono p-1">
            <Loader2 size={12} className="animate-spin text-[var(--text-secondary)]" />
            Composing style options...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suspended Lock Banner */}
      {isSuspended && (
        <div className="bg-amber-500/10 border-t border-b border-amber-500/25 px-4 py-2 flex items-center justify-between z-15 select-none">
          <span className="text-[8px] font-mono tracking-widest text-amber-400 uppercase">
            [ AWAITING RETURN REVIEW ]
          </span>
          <span className="text-[7px] font-mono text-amber-500/80">
            Locked
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
