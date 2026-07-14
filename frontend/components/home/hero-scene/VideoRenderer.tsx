"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";

interface VideoRendererProps {
  src: string;
  onLoaded: () => void;
  onError: () => void;
  isVisible: boolean;
}

export const VideoRenderer = memo(function VideoRenderer({ src, onLoaded, onError, isVisible }: VideoRendererProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      onLoaded();
    }
  }, [onLoaded]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={cn(
        "absolute inset-0 w-full h-full object-cover object-[center_22%] transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onLoadedData={onLoaded}
      onCanPlay={onLoaded}
      onError={onError}
    />
  );
});
