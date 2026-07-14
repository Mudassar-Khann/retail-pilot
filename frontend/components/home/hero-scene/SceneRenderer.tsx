"use client";

import React, { memo } from "react";
import { SceneLayer } from "@/design-system/scene/renderer";
import { ParticleEngine } from "@/design-system/scene/particles";
import { SceneLighting } from "@/design-system/scene/lighting";
import { Background } from "./Background";
import { Atmosphere } from "./Atmosphere";

interface SceneRendererProps {
  children: React.ReactNode;
}

export const SceneRenderer = memo(function SceneRenderer({ children }: SceneRendererProps) {
  return (
    <>
      <SceneLayer depth={0}>
        <Background />
      </SceneLayer>

      <SceneLayer depth={1}>
        {children} {/* HeroCharacter rendered here */}
      </SceneLayer>

      <SceneLayer depth={2}>
        <Atmosphere />
      </SceneLayer>

      <SceneLayer depth={3}>
        <ParticleEngine density={40} behavior="ambient" speed="drifting" />
      </SceneLayer>

      <SceneLayer depth={4}>
        <SceneLighting type="ambient" color="gold" intensity="low" />
      </SceneLayer>
    </>
  );
});
