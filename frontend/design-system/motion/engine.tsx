"use client";

import React, { createContext, useContext } from "react";
import { m, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { Physics, Easing } from "./physics";

export type MotionIntent =
  | "assemble"
  | "scan"
  | "orbit"
  | "illuminate"
  | "inspect"
  | "focus"
  | "settle"
  | "none";

export type MotionPriority = "high" | "medium" | "low";

interface MotionEngineProps extends HTMLMotionProps<"div"> {
  intent?: MotionIntent;
  priority?: MotionPriority;
  delay?: number;
  children?: React.ReactNode;
}

const ChoreographyContext = createContext<{ staggerIndex: number; baseDelay: number }>({
  staggerIndex: 0,
  baseDelay: 0,
});

export function MotionChoreography({
  baseDelay = 0,
  staggerOffset = 0.1,
  children
}: {
  baseDelay?: number;
  staggerOffset?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="contents">
      {React.Children.map(children, (child, index) => (
        <ChoreographyContext.Provider value={{ staggerIndex: index, baseDelay: baseDelay + (index * staggerOffset) }}>
          {child}
        </ChoreographyContext.Provider>
      ))}
    </div>
  );
}

/**
 * The Motion Engine Abstraction.
 * Uses m.div (LazyMotion) under the hood.
 */
export function MotionPrimitive({
  intent = "none",
  priority = "medium",
  delay: explicitDelay,
  children,
  className,
  ...rest
}: MotionEngineProps) {

  const { baseDelay } = useContext(ChoreographyContext);
  const finalDelay = explicitDelay !== undefined ? explicitDelay : baseDelay;

  // Modify physics based on priority (high priority = slightly faster, heavier spring)
  const getPhysicsForPriority = (basePhysics: any) => {
    if (priority === "high") return { ...basePhysics, stiffness: basePhysics.stiffness * 1.2, mass: basePhysics.mass * 0.9 };
    if (priority === "low") return { ...basePhysics, stiffness: basePhysics.stiffness * 0.8, mass: basePhysics.mass * 1.1 };
    return basePhysics;
  };

  const getAnimationConfig = () => {
    switch (intent) {
      case "assemble":
        return {
          initial: { opacity: 0, y: 15, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { ...getPhysicsForPriority(Physics.Heavy), delay: finalDelay }
        };
      case "scan":
        return {
          initial: { opacity: 0, clipPath: "inset(0 100% 0 0)", filter: "brightness(2)" },
          animate: { opacity: 1, clipPath: "inset(0 0% 0 0)", filter: "brightness(1)" },
          transition: { ease: Easing.Cinematic, duration: 0.6, delay: finalDelay }
        };
      case "orbit":
        return {
          initial: { opacity: 0, rotate: -5, scale: 0.98 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          transition: { ...getPhysicsForPriority(Physics.Floating), delay: finalDelay }
        };
      case "illuminate":
        return {
          initial: { opacity: 0, filter: "brightness(0) blur(20px)" },
          animate: { opacity: 1, filter: "brightness(1) blur(0px)" },
          transition: { ...getPhysicsForPriority(Physics.Soft), delay: finalDelay }
        };
      case "focus":
        return {
          initial: { scale: 1, filter: "blur(0px)" },
          whileHover: { scale: 1.02, filter: "brightness(1.1)" },
          whileTap: { scale: 0.98 },
          transition: { ...Physics.Magnetic }
        };
      case "inspect":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { ...getPhysicsForPriority(Physics.Snap), delay: finalDelay }
        };
      case "settle":
        return {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          transition: { ...getPhysicsForPriority(Physics.Soft), delay: finalDelay }
        };
      default:
        return {};
    }
  };

  const config = getAnimationConfig();

  // For static layouts or elements that don't need initial/animate mounts
  if (intent === "none") {
    return (
      <m.div className={className} {...rest}>
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      className={className}
      initial={config.initial}
      animate={config.animate}
      whileHover={config.whileHover}
      whileTap={config.whileTap}
      transition={{ ...config.transition, ...rest.transition }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

// Export AnimatePresence to keep framer abstracted
export const MotionPresence = AnimatePresence;
