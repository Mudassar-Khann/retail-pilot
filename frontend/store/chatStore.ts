import { create } from "zustand";
import { persist } from "zustand/middleware";
export type IntentType = "KNOWLEDGE" | "PRODUCT_SEARCH" | "OUTFIT" | "COMPARE_PRODUCTS" | "PRODUCT_DETAILS" | "COLLECTION" | "FOLLOW_UP" | "STYLE_GUIDE";

export interface ProductSummary {
  product_id: number;
  name: string;
  thumbnail?: string;
  price: number;
  availability: string;
  reason?: string;
  match_label?: string;
}

export interface EnrichedOutfitItem {
  type: string;
  product_id: number;
  name: string;
  thumbnail?: string;
  price: number;
}

export interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  intent?: IntentType;
  recommendations?: ProductSummary[];
  outfit?: EnrichedOutfitItem[];
}

interface ChatState {
  messages: Message[];
  isChatOpen: boolean;
  status: "idle" | "loading" | "error" | "offline";
  loadingStep: string;
  originatingContext: "showroom" | "chat" | "collection" | null;
  addMessage: (msg: Message) => void;
  sendMessage: (text: string) => Promise<void>;
  setChatOpen: (open: boolean) => void;
  setStatus: (status: "idle" | "loading" | "error" | "offline") => void;
  setOriginatingContext: (ctx: "showroom" | "chat" | "collection" | null) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "welcome",
          sender: "stylist",
          text: "Welcome to the RetailPilot Editorial Salon. I am your Personal Stylist. Tell me what aesthetic you wish to compose today: Old Money luxury, modern Streetwear, or minimalist Techwear?",
          intent: "KNOWLEDGE"
        }
      ],
      isChatOpen: false,
      status: "idle",
      loadingStep: "",
      originatingContext: null,
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

      sendMessage: async (text: string) => {
        const userMsg: Message = {
          id: Date.now().toString(),
          sender: "user",
          text,
          intent: "FOLLOW_UP"
        };

        // 1. Instantly append user message, lock input, set loading
        set((state) => ({
          messages: [...state.messages, userMsg],
          status: "loading",
          loadingStep: "Initializing style parser..."
        }));

        console.log(`[Chat Send] User: "${text}"`);

        // Timers for progressive loading messages
        const steps = [
          { delay: 1000, text: "Scanning global inventory..." },
          { delay: 2500, text: "Analyzing aesthetic compatibility..." },
          { delay: 4500, text: "Composing luxury coordinates..." },
          { delay: 7000, text: "Drafting styling critique..." }
        ];

        const timers = steps.map(step =>
          setTimeout(() => {
            if (useChatStore.getState().status === "loading") {
              set({ loadingStep: step.text });
              console.log(`[Chat Progress] -> ${step.text}`);
            }
          }, step.delay)
        );

        const cleanupTimers = () => timers.forEach(clearTimeout);

        // Abort controller for a 15-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          console.log(`[HTTP Request] POST ${apiUrl}/api/chat/stylist`);
          const response = await fetch(`${apiUrl}/api/chat/stylist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          cleanupTimers();

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("[Frontend Received] API Response:", data);

          if (!data.response) {
            throw new Error("Invalid response format: missing response node");
          }

          const stylistResponse = data.response;

          // Flatten recommendations so product items carry their specific match reason/label directly
          const flatRecs = stylistResponse.recommendations?.map((rec: any) => ({
            product_id: rec.product.product_id,
            name: rec.product.name,
            thumbnail: rec.product.thumbnail || rec.product.image_path,
            price: rec.product.price,
            availability: rec.product.availability,
            reason: rec.reason,
            match_label: rec.match_label,
            short_metadata: rec.product.short_metadata
          })) || [];

          const flatOutfit = stylistResponse.outfit?.map((item: any) => ({
            type: item.type,
            product_id: item.product.product_id,
            name: item.product.name,
            thumbnail: item.product.thumbnail || item.product.image_path,
            price: item.product.price
          })) || [];

          const stylistMsg: Message = {
            id: "stylist-" + Date.now().toString(),
            sender: "stylist",
            text: stylistResponse.message || "I have completed your styling request.",
            intent: stylistResponse.intent || "KNOWLEDGE",
            recommendations: flatRecs.length > 0 ? flatRecs : undefined,
            outfit: flatOutfit.length > 0 ? flatOutfit : undefined
          };

          set((state) => ({
            messages: [...state.messages, stylistMsg],
            status: "idle",
            loadingStep: ""
          }));

          console.log("[React Rendered] Assistant response appended to thread.");

        } catch (err: any) {
          clearTimeout(timeoutId);
          cleanupTimers();
          console.error("[Chat Error] Stylist kernel failed:", err);

          let errorText = "I couldn't connect to our styling service. Please try again in a moment.";
          if (err.name === "AbortError") {
            errorText = "The styling service is taking longer than expected to respond. Please try again.";
          }

          const errorMsg: Message = {
            id: "error-" + Date.now().toString(),
            sender: "stylist",
            text: errorText,
            intent: "KNOWLEDGE"
          };

          set((state) => ({
            messages: [...state.messages, errorMsg],
            status: "error",
            loadingStep: ""
          }));
        }
      },

      setChatOpen: (open) => set({ isChatOpen: open }),
      setStatus: (status) => set({ status }),
      setOriginatingContext: (ctx) => set({ originatingContext: ctx }),
      clearHistory: () => set({ messages: [] })
    }),
    { name: "retailpilot-chat-storage" }
  )
);
