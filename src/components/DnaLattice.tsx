import { useEffect, useRef } from "react";

interface Node3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  strand: number; // 0 or 1
  phase: number;
}

export default function DnaLattice() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    let brandPrimaryRGB = "0, 223, 162";
    let brandSecondaryRGB = "0, 136, 255";

    function updateColorsFromCSS() {
      if (typeof window === "undefined") return;
      const styles = getComputedStyle(document.documentElement);
      const primaryHex = styles.getPropertyValue("--color-brand-primary").trim();
      const secondaryHex = styles.getPropertyValue("--color-brand-secondary").trim();

      const parseToRGBString = (color: string, fallback: string) => {
        if (!color) return fallback;
        if (color.startsWith("#")) {
          const hex = color.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            return `${r}, ${g}, ${b}`;
          }
        } else if (color.startsWith("rgb")) {
          const matches = color.match(/\d+/g);
          if (matches && matches.length >= 3) {
            return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
          }
        }
        return fallback;
      };

      brandPrimaryRGB = parseToRGBString(primaryHex, "0, 223, 162");
      brandSecondaryRGB = parseToRGBString(secondaryHex, "0, 136, 255");
    }

    const nodes: Node3D[] = [];
    const helixRadius = 160; // Larger radius to take up more space
    const helixPitch = 0.07; // Slightly gentler pitch twist
    const spacing = 32; // Elongated vertical spacing between nodes

    // Initialize 3D Helix system
    function initHelix() {
      nodes.length = 0;
      
      // Calculate dynamic numPoints to extend off-screen top/bottom by at least 250px
      const numPoints = Math.ceil((height + 500) / spacing);
      
      for (let i = 0; i < numPoints; i++) {
        const yCoord = (i - numPoints / 2) * spacing;
        const angle = i * helixPitch * Math.PI;

        // Strand 1
        const x1 = Math.cos(angle) * helixRadius;
        const z1 = Math.sin(angle) * helixRadius;

        // Strand 2 (Offset by 180 degrees / Math.PI)
        const x2 = Math.cos(angle + Math.PI) * helixRadius;
        const z2 = Math.sin(angle + Math.PI) * helixRadius;

        nodes.push({
          baseX: x1,
          baseY: yCoord,
          baseZ: z1,
          strand: 0,
          phase: angle,
        });

        nodes.push({
          baseX: x2,
          baseY: yCoord,
          baseZ: z2,
          strand: 1,
          phase: angle + Math.PI,
        });
      }
    }

    // Set canvas dimensions fluidly using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;
        canvas.width = newWidth * window.devicePixelRatio;
        canvas.height = newHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        updateColorsFromCSS();
        initHelix();
      }
    });

    resizeObserver.observe(container);

    let lastTime = performance.now();
    let rotationAngle = 0;

    // Scroll evolution tracking states
    let scrollPercent = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let targetScrollVelocity = 0;
    let currentXOffset = 0;
    let currentDissolve = 0;

    const handleScrollEvent = () => {
      const currentScrollY = window.scrollY;
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        scrollPercent = currentScrollY / totalScrollable;
      }

      const deltaScroll = Math.abs(currentScrollY - lastScrollY);
      targetScrollVelocity = deltaScroll * 0.05; // temporary spike in speed
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScrollEvent, { passive: true });

    // Simulation loop
    const render = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      // Clear Canvas cleanly to preserve transparency
      ctx.clearRect(0, 0, width, height);

      // Smooth scroll velocity tracking & decay back to baseline speed
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.15;
      targetScrollVelocity *= 0.85; // decay the target spike
      rotationAngle += deltaTime * (0.12 + scrollVelocity);

      // Interpolate lateral X position shift based on scroll stages
      let targetXOffset = 0;
      if (scrollPercent < 0.2) {
        // Hero: Center
        targetXOffset = 0;
      } else if (scrollPercent >= 0.2 && scrollPercent < 0.55) {
        // Partnerships / Services: Shift left slightly to clear space for lists/cards
        const progress = (scrollPercent - 0.2) / 0.35;
        targetXOffset = -width * 0.22 * Math.sin(progress * Math.PI / 2);
      } else if (scrollPercent >= 0.55 && scrollPercent < 0.8) {
        // About Me: Shift right to clear left bio section
        const progress = (scrollPercent - 0.55) / 0.25;
        targetXOffset = -width * 0.22 + (width * 0.44) * Math.sin(progress * Math.PI / 2);
      } else {
        // Contact: Return to center
        const progress = (scrollPercent - 0.8) / 0.2;
        targetXOffset = (width * 0.22) * (1 - progress);
      }

      currentXOffset += (targetXOffset - currentXOffset) * 0.06;

      // Interpolate dissolve factor: turns double helix into starry background at contact form
      let targetDissolve = 0;
      if (scrollPercent > 0.72) {
        targetDissolve = (scrollPercent - 0.72) / 0.28;
      }
      currentDissolve += (targetDissolve - currentDissolve) * 0.04;

      // Camera parameters
      const cameraDepth = 500;
      const focalLength = 400;
      const centerX = width / 2 + currentXOffset;
      const centerY = height / 2;

      // Static Z-rotation angle to tilt the helix diagonally (-60 degrees)
      const diagonalTilt = -60 * Math.PI / 180;
      const cosZ = Math.cos(diagonalTilt);
      const sinZ = Math.sin(diagonalTilt);

      // Project 3D nodes to 2D
      const projectedNodes = nodes.map((node) => {
        // 3D rotation around Y
        const cosY = Math.cos(rotationAngle);
        const sinY = Math.sin(rotationAngle);

        // Calculate dispersion offsets when dissolved
        const seedX = Math.sin(node.phase * 5) * 280;
        const seedY = Math.cos(node.phase * 3) * 180;
        const seedZ = Math.sin(node.phase * 2) * 220;

        // Interpolate between clean spiral structure and dispersed field
        const rx2 = (node.baseX * cosY - node.baseZ * sinY) * (1 - currentDissolve) + seedX * currentDissolve;
        const rz2 = (node.baseX * sinY + node.baseZ * cosY) * (1 - currentDissolve) + seedZ * currentDissolve;
        const ry2 = node.baseY + seedY * currentDissolve;

        // Apply Z-rotation to rotate the entire helix diagonally
        const tx = rx2 * cosZ - ry2 * sinZ;
        const ty = rx2 * sinZ + ry2 * cosZ;
        const tz = rz2;

        // Perspective scaling
        const perspectiveScale = focalLength / (cameraDepth + tz);
        const screenX = centerX + tx * perspectiveScale;
        const screenY = centerY + ty * perspectiveScale;

        return {
          originalNode: node,
          sx: screenX,
          sy: screenY,
          sz: tz,
          scale: perspectiveScale,
        };
      });

      // Draw Connection Rungs & Spider Webbing before nodes
      for (let i = 0; i < projectedNodes.length; i += 2) {
        if (i + 1 >= projectedNodes.length) break;
        const p1 = projectedNodes[i];
        const p2 = projectedNodes[i + 1];

        // Draw connections only if within bounds and not dissolved
        if (
          p1.sx > -50 && p1.sx < width + 50 &&
          p1.sy > -50 && p1.sy < height + 50 &&
          p2.sx > -50 && p2.sx < width + 50 &&
          p2.sy > -50 && p2.sy < height + 50 &&
          currentDissolve < 0.95
        ) {
          const avgZ = (p1.sz + p2.sz) / 2;
          // Deeper nodes are dimmer, and connection rungs fade completely when dissolved
          const alphaFactor = Math.max(0.04, Math.min(0.2, (400 - avgZ) / 450)) * (1 - currentDissolve);
          
          if (alphaFactor > 0.005) {
            // 1. Draw primary horizontal rung
            ctx.lineWidth = 0.5;
            const gradient = ctx.createLinearGradient(p1.sx, p1.sy, p2.sx, p2.sy);
            gradient.addColorStop(0, `rgba(${brandPrimaryRGB}, ${alphaFactor})`);   // Brand Primary (Teal-Green)
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alphaFactor * 0.15})`); // Web silk color
            gradient.addColorStop(1, `rgba(${brandSecondaryRGB}, ${alphaFactor})`); // Brand Secondary (Blue)
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();

            // Draw micro connector web beads occasionally
            if (i % 8 === 0) {
              const mx = (p1.sx + p2.sx) / 2;
              const my = (p1.sy + p2.sy) / 2;
              ctx.fillStyle = `rgba(255, 255, 255, ${alphaFactor * 0.5})`;
              ctx.beginPath();
              ctx.arc(mx, my, 1.2 * p1.scale, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // 2. Draw diagonal webbing threads (crisscross threads between adjacent levels)
        if (i + 3 < projectedNodes.length && currentDissolve < 0.9) {
          const p1 = projectedNodes[i];
          const p4 = projectedNodes[i + 3];
          if (
            p1.sx > -50 && p1.sx < width + 50 &&
            p1.sy > -50 && p1.sy < height + 50 &&
            p4.sx > -50 && p4.sx < width + 50 &&
            p4.sy > -50 && p4.sy < height + 50
          ) {
            const avgZ = (p1.sz + p4.sz) / 2;
            const diagAlpha = Math.max(0.02, Math.min(0.12, (400 - avgZ) / 450)) * (1 - currentDissolve);
            if (diagAlpha > 0.005) {
              ctx.lineWidth = 0.35;
              const diagGradient = ctx.createLinearGradient(p1.sx, p1.sy, p4.sx, p4.sy);
              diagGradient.addColorStop(0, `rgba(${brandPrimaryRGB}, ${diagAlpha})`);
              diagGradient.addColorStop(0.5, `rgba(255, 255, 255, ${diagAlpha * 0.1})`);
              diagGradient.addColorStop(1, `rgba(${brandSecondaryRGB}, ${diagAlpha})`);
              ctx.strokeStyle = diagGradient;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p4.sx, p4.sy);
              ctx.stroke();
            }
          }

          const p2 = projectedNodes[i + 1];
          const p3 = projectedNodes[i + 2];
          if (
            p2.sx > -50 && p2.sx < width + 50 &&
            p2.sy > -50 && p2.sy < height + 50 &&
            p3.sx > -50 && p3.sx < width + 50 &&
            p3.sy > -50 && p3.sy < height + 50
          ) {
            const avgZ = (p2.sz + p3.sz) / 2;
            const diagAlpha = Math.max(0.02, Math.min(0.12, (400 - avgZ) / 450)) * (1 - currentDissolve);
            if (diagAlpha > 0.005) {
              ctx.lineWidth = 0.35;
              const diagGradient = ctx.createLinearGradient(p2.sx, p2.sy, p3.sx, p3.sy);
              diagGradient.addColorStop(0, `rgba(${brandSecondaryRGB}, ${diagAlpha})`);
              diagGradient.addColorStop(0.5, `rgba(255, 255, 255, ${diagAlpha * 0.1})`);
              diagGradient.addColorStop(1, `rgba(${brandPrimaryRGB}, ${diagAlpha})`);
              ctx.strokeStyle = diagGradient;
              ctx.beginPath();
              ctx.moveTo(p2.sx, p2.sy);
              ctx.lineTo(p3.sx, p3.sy);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Spiral Nodes
      projectedNodes.forEach((p) => {
        if (p.sx > -50 && p.sx < width + 50 && p.sy > -50 && p.sy < height + 50) {
          const size = Math.max(1.0, (2.8 - p.sz / 120) * p.scale); // Slightly smaller base sizes
          const alpha = Math.max(0.08, Math.min(0.4, (380 - p.sz) / 380)); // Lower opacity range

          // Base color depends on strand key
          const colorStrand = p.originalNode.strand === 0 
            ? brandPrimaryRGB  // Brand Primary (Teal-Green)
            : brandSecondaryRGB; // Brand Secondary (Blue)

          // Draw outer glow (subtle and tight)
          ctx.fillStyle = `rgba(${colorStrand}, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 2.0, 0, Math.PI * 2);
          ctx.fill();

          // Draw solid inner core (very clean white-blend)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  return (
    <div
      id="dna-lattice-container"
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0 bg-transparent"
      style={{ backgroundColor: "transparent" }}
    >
      <canvas
        id="dna-lattice-canvas"
        ref={canvasRef}
        className="block w-full h-full opacity-85 bg-transparent"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}
