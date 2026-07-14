"use client";

import React, { memo } from "react";

export const Background = memo(function Background() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
      {/* Deep cinematic gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />
    </div>
  );
});
