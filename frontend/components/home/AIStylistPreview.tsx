import { Sparkles, ArrowRight, ShieldCheck, Heart, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIStylistPreview() {
  const capabilities = [
    {
      icon: <Layers size={18} strokeWidth={1.5} />,
      title: "Outfit Recommendations",
      desc: "Get personalized combination recommendations based on your selected aesthetic and the current weather."
    },
    {
      icon: <Heart size={18} strokeWidth={1.5} />,
      title: "Style Advice",
      desc: "Learn the core philosophy of styles like Old Money or Korean Fashion, including styling rules and typical fits."
    },
    {
      icon: <ShieldCheck size={18} strokeWidth={1.5} />,
      title: "Complete the Look",
      desc: "Select a single item from the catalog and the AI will suggest matching bottom, outerwear, and accessories."
    }
  ];

  return (
    <section id="stylist" className="py-20 bg-neutral-50/50 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 bg-neutral-900/5 text-neutral-800 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full">
                <Sparkles size={10} className="text-neutral-700" />
                AI STYLIST LABS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
                AI Stylist & Personal Assistant
              </h2>
              <p className="text-sm font-light text-neutral-500 max-w-xl leading-relaxed">
                Connect the power of Google Gemini directly to your wardrobe. Receive real-time aesthetic alignment scoring, outfit pairing recommendations, and cohesive visual guidance.
              </p>
            </div>

            {/* Feature lists */}
            <div className="space-y-6">
              {capabilities.map((cap) => (
                <div key={cap.title} className="flex gap-4 items-start">
                  <div className="p-2 border border-neutral-200 bg-white text-neutral-900 shadow-sm">
                    {cap.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold tracking-wide text-neutral-900 uppercase">
                      {cap.title}
                    </h3>
                    <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-md">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[480px] border border-neutral-200 bg-white p-8 relative flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                  Service Panel: Stylist v0.1.0
                </span>
                <span className="text-[8px] bg-neutral-100 text-neutral-500 px-2 py-0.5 uppercase tracking-wider font-semibold">
                  Sandbox
                </span>
              </div>

              {/* Chat Simulation Area */}
              <div className="space-y-4 mb-8">
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-600">
                    U
                  </div>
                  <div className="bg-neutral-50 text-xs px-3.5 py-2.5 text-neutral-700 max-w-[85%] font-light">
                    "I want to build an outfit for a summer resort using the Old Money style. What do you recommend?"
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end">
                  <div className="bg-neutral-950 text-white text-xs px-3.5 py-2.5 max-w-[85%] font-light flex flex-col gap-2">
                    <p>
                      For an elegant Old Money Summer resort aesthetic, I recommend combining:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>Pique Cotton Polo Shirt ($75.0, Navy)</li>
                      <li>Pima Cotton Slim Chinos ($88.0, Navy/Beige)</li>
                      <li>Leather Chelsea Boots ($240.0, Tan)</li>
                    </ul>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-semibold text-white">
                    AI
                  </div>
                </div>
              </div>

              {/* Disabled CTA with Coming Soon indicator */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
                <span className="text-[10px] text-neutral-400 font-semibold tracking-widest uppercase">
                  (Coming Soon)
                </span>
                <Button disabled size="md" className="flex items-center gap-2">
                  Launch Assistant
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
