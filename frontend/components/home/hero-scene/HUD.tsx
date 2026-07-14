"use client";

import React, { memo, useState, useEffect } from "react";
import { MotionChoreography } from "@/design-system/motion/engine";
import { StyleAnalysisPanel } from "../hero/panels/StyleAnalysisPanel";
import { RecommendationPanel } from "../hero/panels/RecommendationPanel";
import { SystemFeedPanel } from "../hero/panels/SystemFeedPanel";

interface HUDProps {
  status: any;
  loadingStep: string;
  searchQuery: string;
  messages: any[];
}

export const HUD = memo(function HUD({ status, loadingStep, searchQuery, messages }: HUDProps) {
  const lastStylistMessageWithRecs = [...messages]
    .reverse()
    .find((msg) => msg.sender === "stylist" && msg.recommendations && msg.recommendations.length > 0);

  const latestRecommendation = lastStylistMessageWithRecs?.recommendations?.[0] || null;

  // Curated featured catalog fallback when no live recommendation exists
  const featuredProduct = {
    id: 2005,
    name: "Floral Lined Utility Jacket",
    price: 540.00,
    image_path: "/products/2005.png",
    thumbnail: "/products/2005.png",
    brand: "AURAA ARCHIVE",
    category: "Apparel",
    season: "FW26",
    color: "Charcoal, Ecru, Sage",
    description: "Floral Lined Utility Jacket crafted from durable cotton canvas featuring soft custom interior linings.",
    material: "Cotton Canvas",
    fit: "Relaxed Silhouette",
    origin: "Made in Portugal"
  };

  const activeProduct = latestRecommendation || featuredProduct;

  return (
    <MotionChoreography baseDelay={0.3} staggerOffset={0.12}>
      <div className="hud-editorial-group space-y-6 pointer-events-auto">
        <RecommendationPanel
          recommendation={activeProduct}
        />

        <StyleAnalysisPanel
          searchQuery={searchQuery}
          status={status}
          recommendation={activeProduct}
        />

        <SystemFeedPanel
          recommendation={activeProduct}
        />
      </div>
    </MotionChoreography>
  );
});
