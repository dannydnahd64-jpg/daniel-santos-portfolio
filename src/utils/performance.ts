/**
 * Utility to detect low-performance situations based on hardware,
 * network conditions, and system preferences.
 */
export function isLowPerformanceDevice(): boolean {
  if (typeof window === "undefined") return false;

  // 0. Disable on mobile/portrait tablet screens (< 768px) to maximize scroll fluidness and battery life
  if (window.innerWidth < 768) return true;

  // 1. Check system reduced-motion preference
  if (window.matchMedia) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return true;
  }

  // 2. Check network information (weak internet)
  if (typeof navigator !== "undefined" && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData) return true;
    const effectiveType = conn.effectiveType;
    if (effectiveType === "2g" || effectiveType === "3g") return true;
  }

  // 3. Check device hardware (limited RAM or CPU cores)
  if (typeof navigator !== "undefined") {
    // Fewer than 4 CPU cores
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }
    // Fewer than 4 GB of RAM
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
      return true;
    }
  }

  return false;
}
