import { motion } from "motion/react";
import { ReactNode, Key } from "react";

interface BentoCardProps {
  key?: Key;
  id: string;
  className?: string;
  delay?: number;
  children: ReactNode;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export default function BentoCard({
  id,
  className = "",
  delay = 0,
  children,
  onClick,
  hoverEffect = true,
}: BentoCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        hoverEffect && onClick
          ? { scale: 1.015, y: -2, zIndex: 10 }
          : hoverEffect
          ? { y: -2 }
          : {}
      }
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-2xl
        border border-white/[0.06] bg-black/[0.3] backdrop-blur-xl
        p-6 md:p-8 transition-all duration-300
        combine-glow-effects
        ${onClick ? "cursor-pointer active:scale-95" : ""}
        ${className}
      `}
    >
      {/* Dynamic Animated Perimeter Glow (DNA sequencing line overlay) */}
      {hoverEffect && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {/* Subtle neon corner glows overlay */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_top_left,rgba(255,142,122,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.15),transparent_60%)] pointer-events-none" />
          
          {/* Border tracer run overlays */}
          <div className="absolute inset-0 border border-transparent [mask-image:linear-gradient(90deg,white,transparent_40%)] before:absolute before:inset-0 before:border before:border-[rgba(255,142,122,0.3)] animate-border-trace" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-brand-secondary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
        </div>
      )}

      {/* Internal ambient glowing dot background mask */}
      <div className="absolute inset-0 bg-[radial-gradient(white/[0.015]_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card contents with relative position */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
