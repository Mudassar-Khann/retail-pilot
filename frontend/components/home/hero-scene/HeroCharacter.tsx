"use client";

import React, { memo } from "react";
import { VideoRenderer } from "./VideoRenderer";

export const HeroCharacter = memo(function HeroCharacter() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
      style={{
        transform: "translate(calc(var(--mouse-x) * -3px), calc(var(--mouse-y) * -3px)) scale(1.015)"
      }}
    >
      <VideoRenderer
        src="/assets/video/hero_bg.mp4"
        onLoaded={() => {}}
        onError={() => {}}
        isVisible={true}
      />
    </div>
  );
});
