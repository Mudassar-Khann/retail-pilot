"use client";

import React from "react";
import { SceneRenderer } from "./SceneRenderer";
import { HeroContent } from "./HeroContent";
import { CTA } from "./CTA";
import { HUD } from "./HUD";
import { HeroCharacter } from "./HeroCharacter";

import { useChatStore } from "@/store/chatStore";
import { useCatalogStore } from "@/store/catalogStore";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5;
    const y = ((e.clientY - rect.top) / rect.height) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Fetch state for HUD
  const messages = useChatStore((state) => state.messages);
  const status = useChatStore((state) => state.status);
  const loadingStep = useChatStore((state) => state.loadingStep);
  const searchQuery = useCatalogStore((state) => state.searchQuery);

  const memoizedCharacter = React.useMemo(() => <HeroCharacter />, []);

  return (
    <m.div
      className="relative w-full h-full min-h-screen bg-[var(--bg-void)] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--mouse-x": smoothX,
        "--mouse-y": smoothY,
      } as any}
    >
      <SceneRenderer>
        {memoizedCharacter}
      </SceneRenderer>

      <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-between pt-24 pb-6 px-6 lg:px-16 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full max-w-[90rem] mx-auto flex-1 pointer-events-auto">

          <div className="md:col-span-4 flex flex-col justify-between h-full space-y-12">
            <HeroContent />
            <CTA />
          </div>

          <div className="md:col-span-4 hidden md:block md:min-h-[300px] self-stretch pointer-events-none" />

          <div
            className="md:col-span-4 flex flex-col gap-6 justify-between h-full will-change-transform"
            style={{
              transform: "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 5px))"
            }}
          >
            {mounted && (
              <HUD
                status={status}
                loadingStep={loadingStep}
                searchQuery={searchQuery}
                messages={messages}
              />
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}
