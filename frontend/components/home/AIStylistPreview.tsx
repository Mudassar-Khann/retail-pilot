import { Sparkles, Layers, Heart, ShieldCheck } from "lucide-react";

export default function AIStylistPreview() {
  const capabilities = [
    {
      icon: <Layers size={20} strokeWidth={1.25} className="text-[var(--accent-gold)]" />,
      title: "Outfit Recommendations",
      desc: "Get personalized combination recommendations based on your selected aesthetic and the current weather."
    },
    {
      icon: <Heart size={20} strokeWidth={1.25} className="text-[var(--accent-gold)]" />,
      title: "Style Advice",
      desc: "Learn the core philosophy of styles like Old Money or Korean Fashion, including styling rules and typical fits."
    },
    {
      icon: <ShieldCheck size={20} strokeWidth={1.25} className="text-[var(--accent-gold)]" />,
      title: "Complete the Look",
      desc: "Select a single item from the catalog and the AI will suggest matching bottom, outerwear, and accessories."
    }
  ];

  return (
    <section id="stylist" className="py-24 bg-[var(--background)] border-b border-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-[var(--accent-gold)] uppercase">
            <Sparkles size={10} />
            AI Stylist Core Labs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[var(--text-primary)]">
            Stylist Capabilities
          </h2>
          <p className="text-xs font-light text-[var(--text-secondary)] leading-relaxed">
            Connect the power of Google Gemini directly to your wardrobe. Receive real-time aesthetic alignment scoring, outfit pairing recommendations, and cohesive visual guidance.
          </p>
        </div>

        {/* 3-Column Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <div 
              key={cap.title} 
              className="p-8 border border-[var(--bg-secondary)] bg-[var(--bg-secondary)]/40 hover:border-[var(--accent-gold)]/30 rounded-md transition-all duration-300 flex flex-col justify-between aspect-[4/3] glass-fluted"
            >
              <div className="space-y-4">
                <span className="text-[9px] text-[var(--text-secondary)] font-mono tracking-widest block">
                  CAPABILITY // 0{index + 1}
                </span>
                <h3 className="text-sm font-semibold tracking-wider text-[var(--text-primary)] uppercase font-mono">
                  {cap.title}
                </h3>
                <p className="text-xs font-light text-[var(--text-secondary)] leading-relaxed">
                  {cap.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-850 flex items-center justify-between">
                <span className="text-[8px] font-mono tracking-widest text-[var(--text-secondary)] uppercase">
                  ACTIVE_MODULE
                </span>
                <div className="p-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--background)]/50">
                  {cap.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
