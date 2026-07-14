/**
 * Shared spring presets.
 *
 * We abstract Framer Motion's internal configuration so the rest of the application
 * only references our semantic presets (e.g. `Physics.Soft`).
 */

export const Physics = {
  Soft: { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const,
  Natural: { type: "spring", stiffness: 200, damping: 20, mass: 1 } as const,
  Heavy: { type: "spring", stiffness: 150, damping: 30, mass: 2 } as const,
  Floating: { type: "spring", stiffness: 50, damping: 10, mass: 0.5 } as const,
  Magnetic: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const,
  Snap: { type: "spring", stiffness: 300, damping: 25, mass: 1 } as const,
};

export const Easing = {
  Standard: [0.16, 1, 0.3, 1],
  Accelerate: [0.3, 0, 1, 1],
  Decelerate: [0, 0, 0, 1],
  Cinematic: [0.32, 0.72, 0, 1],
};
