"use client";

import React, { memo } from "react";

interface ImageRendererProps {
  src: string;
}

export const ImageRenderer = memo(function ImageRenderer({ src }: ImageRendererProps) {
  return (
    <img
      src={src}
      alt="AURA A Canonical Hero Model"
      className="absolute inset-0 w-full h-full object-cover contrast-[1.05] object-[center_22%]"
    />
  );
});
