import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Activity,
  Leaf,
  Cpu,
  Mic,
  Heart,
  Trophy,
  X,
  ArrowRight,
  Film,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface PhoneCardData {
  id: string;
  name: string;
  category: string;
  hookText: string;
  highlightWord: string;
  hookSubtext: string;
  views: string;
  accentColor: string;
  videoUrl: string;
  logoName: string;
}

const brandsData: PhoneCardData[] = [
  {
    id: "simpletics",
    name: "simpletics",
    category: "SaaS Analytics Platform",
    hookText: "Stop guessing. Start scaling.",
    highlightWord: "Start scaling.",
    hookSubtext: "Stop guessing.",
    views: "125K",
    accentColor: "#00E5FF", // Cyan
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e33974d11da2e6b22b7b85c165d&profile_id=165&oauth2_token_id=57447761",
    logoName: "Activity"
  },
  {
    id: "tinynature",
    name: "TinyNature",
    category: "Sustainable Living",
    hookText: "Tiny habitats. Big impact.",
    highlightWord: "Big impact.",
    hookSubtext: "Tiny habitats.",
    views: "89K",
    accentColor: "#10B981", // Emerald/Green
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f397746fb4edeab25602d33454378f16183f064&profile_id=165&oauth2_token_id=57447761",
    logoName: "Leaf"
  },
  {
    id: "evolve",
    name: "Evolve",
    category: "AI Performance Coaching",
    hookText: "Unlock your potential. Evolve daily.",
    highlightWord: "Evolve daily.",
    hookSubtext: "Unlock your potential.",
    views: "185K",
    accentColor: "#F59E0B", // Amber / Golden Orange
    videoUrl: "https://player.vimeo.com/external/409051876.sd.mp4?s=0e219da0e0172e2cfc2323e1c9e83b8ff2ef4e87&profile_id=165&oauth2_token_id=57447761",
    logoName: "Sparkles"
  },
  {
    id: "cheetercatcher",
    name: "Cheeter Catcher",
    category: "Sports - Performance",
    hookText: "Catch every cheet.",
    highlightWord: "Catch every",
    hookSubtext: "cheet.",
    views: "44K",
    accentColor: "#3B82F6", // Blue
    videoUrl: "https://player.vimeo.com/external/384761655.sd.mp4?s=3c267b2d56a2f7c03c5163b46944d18ec25f9b4c&profile_id=165&oauth2_token_id=57447761",
    logoName: "Trophy"
  },
  {
    id: "brainrot",
    name: "Brainrot AI",
    category: "Viral Clip Generator",
    hookText: "Generate brainrot clips. Get viral.",
    highlightWord: "Get viral.",
    hookSubtext: "Generate brainrot clips.",
    views: "340K",
    accentColor: "#EF4444", // Red / Coral / Pink
    videoUrl: "https://player.vimeo.com/external/517616654.sd.mp4?s=2af1e57c603a118d04423403cd8f03767856b3e8&profile_id=165&oauth2_token_id=57447761",
    logoName: "Flame"
  }
];

const logoMap: Record<string, any> = {
  Activity,
  Leaf,
  Cpu,
  Mic,
  Heart,
  Trophy,
  Sparkles,
  Flame
};

export default function WorkWithBrands({ onPhoneActiveChange }: { onPhoneActiveChange?: (active: boolean) => void } = {}) {
  const [unmutedCardId, setUnmutedCardId] = useState<string | null>(null);
  const [pausedCardIds, setPausedCardIds] = useState<Record<string, boolean>>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Expanded overlay modal state
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);
  const [modalIsMuted, setModalIsMuted] = useState(false);
  const [modalIsPlaying, setModalIsPlaying] = useState(true);

  // Refs for preview videos
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  // Ref for modal video
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const activeExpandedBrand = brandsData.find(b => b.id === expandedBrandId);

  const handlePrevBrand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = brandsData.findIndex(b => b.id === expandedBrandId);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + brandsData.length) % brandsData.length;
    setExpandedBrandId(brandsData[prevIndex].id);
    setModalIsPlaying(true);
  };

  const handleNextBrand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = brandsData.findIndex(b => b.id === expandedBrandId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % brandsData.length;
    setExpandedBrandId(brandsData[nextIndex].id);
    setModalIsPlaying(true);
  };

  // Handle play/pause toggle for preview cards
  const togglePlayPause = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
    const video = videoRefs.current[id];
    if (!video) return;

    if (pausedCardIds[id]) {
      video.play().catch(() => { });
      setPausedCardIds(prev => ({ ...prev, [id]: false }));
    } else {
      video.pause();
      setPausedCardIds(prev => ({ ...prev, [id]: true }));
    }
  };

  // Handle sound toggle for preview cards (ensuring only one unmuted at a time)
  const toggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
    if (unmutedCardId === id) {
      setUnmutedCardId(null);
    } else {
      setUnmutedCardId(id);
    }
  };

  // Apply play/pause and mute/unmute to video tags based on state
  useEffect(() => {
    brandsData.forEach(brand => {
      const video = videoRefs.current[brand.id];
      if (!video) return;

      // Sync mute status
      video.muted = unmutedCardId !== brand.id;

      // Sync play/pause status
      const isPaused = pausedCardIds[brand.id];
      if (isPaused) {
        video.pause();
      } else {
        // Autoplay if not explicitly paused by user
        video.play().catch(() => { });
      }
    });
  }, [unmutedCardId, pausedCardIds]);

  // Synchronize modal video playback
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.muted = modalIsMuted;
    if (modalIsPlaying) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [expandedBrandId, modalIsMuted, modalIsPlaying]);

  // Prevent page scroll when modal is open
  useEffect(() => {
    if (expandedBrandId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    onPhoneActiveChange?.(!!expandedBrandId);
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedBrandId, onPhoneActiveChange]);

  return (
    <section id="brands" className="space-y-12 relative">
      {/* Background radial gradients for section glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-secondary/5 rounded-full filter blur-[140px] pointer-events-none -z-10" />

      {/* Header Block */}
      <div className="text-center space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-black tracking-tight text-white uppercase"
        >
          PARTNERSHIPS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm font-mono tracking-widest text-neutral-500 uppercase"
        >
          Videos I create. Results they get.
        </motion.p>
      </div>

      {/* 5 Phones Interactive Layout */}
      <div className="relative">
        {/* Mobile Swipe Container / Desktop 5-Column Grid */}
        <div
          className="flex overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-5 gap-6 px-4 md:px-0 pt-12 pb-12 snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {brandsData.map((brand, idx) => {
            const BrandLogo = logoMap[brand.logoName] || Activity;
            const isUnmuted = unmutedCardId === brand.id;
            const isPaused = pausedCardIds[brand.id] || false;
            const isHovered = hoveredCardId === brand.id;

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex-shrink-0 w-[270px] lg:w-auto snap-center flex flex-col items-center space-y-4 group cursor-pointer"
                onMouseEnter={() => setHoveredCardId(brand.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => {
                  setExpandedBrandId(brand.id);
                  setModalIsMuted(false); // Unmute by default on expand
                  setModalIsPlaying(true);
                }}
              >
                {/* 1. Phone Frame Mockup */}
                <div
                  className="relative w-full aspect-[9/19] rounded-[36px] bg-black border-[7px] border-neutral-900 ring-2 ring-neutral-800/40 overflow-hidden transition-all duration-500"
                  style={{
                    boxShadow: isHovered
                      ? `0 0 35px -5px ${brand.accentColor}40, inset 0 0 0 1.5px ${brand.accentColor}40`
                      : "0 15px 40px rgba(0, 0, 0, 0.6)",
                    borderColor: isHovered ? "#1C1C1E" : "#171717",
                  }}
                >
                  {/* Notch / Dynamic Island */}
                  <div className="absolute top-2.5 inset-x-0 mx-auto w-20 h-4 rounded-full bg-black z-30 flex items-center justify-end px-2 border border-white/5">
                    <span
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ backgroundColor: brand.accentColor }}
                    />
                  </div>

                  {/* Looping Preview Video */}
                  <div className="absolute inset-0 z-0 bg-neutral-950">
                    <video
                      ref={(el) => {
                        videoRefs.current[brand.id] = el;
                      }}
                      className="w-full h-full object-cover brightness-[0.8] saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                      src={brand.videoUrl}
                      loop
                      muted={!isUnmuted}
                      playsInline
                      autoPlay
                    />
                    {/* Shadow overlays for readability */}
                    <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
                  </div>

                  {/* Brand Header Overlay */}
                  <div className="absolute top-8 inset-x-0 px-4 flex items-center gap-2 z-20 select-none">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center border text-white transition-all duration-300"
                      style={{
                        borderColor: `${brand.accentColor}25`,
                        backgroundColor: `${brand.accentColor}10`,
                        boxShadow: `0 0 10px ${brand.accentColor}15`
                      }}
                    >
                      <BrandLogo size={12} style={{ color: brand.accentColor }} />
                    </div>
                    <span className="text-[10px] font-display font-black tracking-widest text-white uppercase">
                      {brand.name}
                    </span>
                  </div>

                  {/* Mid-Screen Play Overlay (only when paused) */}
                  {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white scale-100 transition-transform duration-300">
                        <Play fill="currentColor" size={16} className="ml-0.5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Kinetic Caption Overlay */}
                  <div className="absolute inset-x-3 bottom-14 z-20 text-left select-none space-y-1">
                    <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
                      <p className="text-[10px] font-display font-bold leading-normal text-white uppercase tracking-wide">
                        {brand.hookText.split(brand.highlightWord)[0]}
                        <span style={{ color: brand.accentColor }}>{brand.highlightWord}</span>
                        {brand.hookText.split(brand.highlightWord)[1]}
                      </p>
                    </div>
                  </div>

                  {/* Playback Controls & View Count */}
                  <div className="absolute bottom-3 inset-x-4 flex items-center justify-between z-20 select-none">
                    <div className="flex items-center gap-2">
                      {/* Play/Pause Button */}
                      <button
                        onClick={(e) => togglePlayPause(e, brand.id)}
                        className="text-neutral-400 hover:text-white transition-colors p-1 bg-black/30 backdrop-blur-sm rounded-md border border-white/5"
                        aria-label={isPaused ? "Play" : "Pause"}
                      >
                        {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} />}
                      </button>

                      {/* Mute/Unmute Button */}
                      <button
                        onClick={(e) => toggleMute(e, brand.id)}
                        className="text-neutral-400 hover:text-white transition-colors p-1 bg-black/30 backdrop-blur-sm rounded-md border border-white/5"
                        style={{ color: isUnmuted ? brand.accentColor : "" }}
                        aria-label={isUnmuted ? "Mute" : "Unmute"}
                      >
                        {isUnmuted ? <Volume2 size={10} /> : <VolumeX size={10} />}
                      </button>
                    </div>

                    {/* Equalizer animation when playing & unmuted */}
                    {isUnmuted && !isPaused && (
                      <div className="flex items-end gap-[1.5px] h-2.5 bg-black/35 px-1.5 py-0.5 rounded border border-white/5 select-none shrink-0">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className="w-[1.5px] bg-white rounded-full"
                            style={{
                              backgroundColor: brand.accentColor,
                              height: "2px",
                              animation: `pulseEqualizer 0.7s ease-in-out infinite`,
                              animationDelay: `${bar * 0.12}s`
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* View Count Overlay */}
                    <div className="px-2 py-0.5 rounded bg-black/45 backdrop-blur-sm border border-white/5 text-[9px] font-mono font-bold text-neutral-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                      <span>{brand.views} Views</span>
                    </div>
                  </div>
                </div>

                {/* 2. Text Details Underneath Phone */}
                <div className="text-center space-y-1 px-2">
                  <h4 className="text-sm font-display font-bold text-white uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all duration-300">
                    {brand.name}
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    {brand.category}
                  </p>

                  {/* Subtle Interactive Button Trigger */}
                  <div
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 mt-2 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900/40 text-neutral-400 group-hover:text-white group-hover:border-white/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    style={{
                      borderColor: isHovered ? `${brand.accentColor}30` : "",
                      color: isHovered ? brand.accentColor : ""
                    }}
                  >
                    <span>Watch Videos</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enlarged Modal Overlay (Enlarge Phone & Blur Background) */}
      <AnimatePresence>
        {expandedBrandId && activeExpandedBrand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 md:p-6 cursor-pointer"
            style={{ margin: 0 }}
            onClick={() => setExpandedBrandId(null)}
          >
            {/* Wrapper for phone + navigation arrows */}
            <div className="relative flex items-center justify-center w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
              {/* Left Navigation Arrow */}
              <button
                onClick={handlePrevBrand}
                className="absolute left-2 xs:left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-neutral-900 border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-400 hover:text-white backdrop-blur-md transition-all duration-200 z-50 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                aria-label="Previous Campaign"
                style={{
                  boxShadow: `0 0 15px ${activeExpandedBrand.accentColor}20`,
                }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Modal Body Wrapper (stops propagation) */}
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-[245px] xs:max-w-[285px] md:max-w-[340px] aspect-[9/19] cursor-default flex flex-col justify-between mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Symmetrical Floating Close Button */}
                <button
                  onClick={() => setExpandedBrandId(null)}
                  className="absolute -top-12 right-2 md:-right-12 md:top-2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 backdrop-blur-md transition-all duration-200 z-50"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Enlarged Phone Frame */}
                <div
                  className="relative w-full h-full rounded-[48px] bg-black border-[10px] border-neutral-900 ring-4 ring-neutral-800/40 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
                  style={{
                    boxShadow: `0 0 50px -5px ${activeExpandedBrand.accentColor}30`,
                  }}
                >
                  {/* Large Notch */}
                  <div className="absolute top-3.5 inset-x-0 mx-auto w-24 h-5 rounded-full bg-black z-30 border border-neutral-950 flex items-center justify-end px-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                      style={{ backgroundColor: activeExpandedBrand.accentColor }}
                    />
                  </div>

                  {/* Looping Video */}
                  <div className="absolute inset-0 z-0 bg-neutral-950">
                    <video
                      ref={modalVideoRef}
                      className="w-full h-full object-cover brightness-[0.85] saturate-[1.15]"
                      src={activeExpandedBrand.videoUrl}
                      loop
                      playsInline
                      autoPlay
                    />
                    {/* Visual Gradients */}
                    <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
                  </div>

                  {/* Brand Header */}
                  <div className="absolute top-12 inset-x-6 flex items-center gap-3 z-20 select-none">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center border text-white"
                      style={{
                        borderColor: `${activeExpandedBrand.accentColor}25`,
                        backgroundColor: `${activeExpandedBrand.accentColor}10`,
                        boxShadow: `0 0 15px ${activeExpandedBrand.accentColor}20`
                      }}
                    >
                      {(() => {
                        const LogoComponent = logoMap[activeExpandedBrand.logoName] || Activity;
                        return <LogoComponent size={16} style={{ color: activeExpandedBrand.accentColor }} />;
                      })()}
                    </div>
                    <div>
                      <span className="text-xs font-display font-black tracking-widest text-white uppercase block leading-none">
                        {activeExpandedBrand.name}
                      </span>
                      <span className="text-[8px] font-mono text-neutral-400 tracking-wider uppercase mt-1 block">
                        {activeExpandedBrand.category}
                      </span>
                    </div>
                  </div>

                  {/* Floating Metrics Badge */}
                  <div className="absolute top-12 right-6 z-20 select-none">
                    <div className="px-3 py-1.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest text-brand-primary font-bold uppercase flex items-center gap-1.5">
                      <Flame size={10} className="text-brand-primary animate-bounce" />
                      <span>{activeExpandedBrand.views} VIEWS</span>
                    </div>
                  </div>

                  {/* Big Center Play Overlay (when paused) */}
                  {!modalIsPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                      >
                        <Play fill="currentColor" size={24} className="ml-1 text-white" />
                      </motion.div>
                    </div>
                  )}

                  {/* Big Caption Hook */}
                  <div className="absolute inset-x-5 bottom-20 z-20 text-left select-none space-y-2">
                    <div className="p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 shadow-2xl">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                        UGC Campaign Hook
                      </span>
                      <p className="text-xs md:text-sm font-display font-bold leading-relaxed text-white uppercase tracking-wide">
                        "{activeExpandedBrand.hookText.split(activeExpandedBrand.highlightWord)[0]}
                        <span style={{ color: activeExpandedBrand.accentColor }}>{activeExpandedBrand.highlightWord}</span>
                        {activeExpandedBrand.hookText.split(activeExpandedBrand.highlightWord)[1]}"
                      </p>
                    </div>
                  </div>

                  {/* Controls Bar at Bottom */}
                  <div className="absolute bottom-5 inset-x-6 flex items-center justify-between z-20 select-none">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setModalIsPlaying(!modalIsPlaying)}
                        className="text-neutral-300 hover:text-white transition-colors p-2 bg-neutral-900/70 backdrop-blur-md rounded-lg border border-white/10 hover:scale-105"
                        aria-label={modalIsPlaying ? "Pause" : "Play"}
                      >
                        {modalIsPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                      </button>
                      <button
                        onClick={() => setModalIsMuted(!modalIsMuted)}
                        className="text-neutral-300 hover:text-white transition-colors p-2 bg-neutral-900/70 backdrop-blur-md rounded-lg border border-white/10 hover:scale-105"
                        style={{ color: !modalIsMuted ? activeExpandedBrand.accentColor : "" }}
                        aria-label={modalIsMuted ? "Unmute" : "Mute"}
                      >
                        {!modalIsMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
                      </button>
                    </div>

                    {/* Equalizer when playing */}
                    {!modalIsMuted && modalIsPlaying && (
                      <div className="flex items-end gap-[2px] h-4 bg-neutral-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 select-none shrink-0">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                          <div
                            key={bar}
                            className="w-[2px] rounded-full"
                            style={{
                              backgroundColor: activeExpandedBrand.accentColor,
                              height: "2px",
                              animation: `pulseEqualizer 0.8s ease-in-out infinite`,
                              animationDelay: `${bar * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Close Label */}
                    <button
                      onClick={() => setExpandedBrandId(null)}
                      className="px-3 py-2 bg-neutral-900/70 border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Navigation Arrow */}
              <button
                onClick={handleNextBrand}
                className="absolute right-2 xs:right-4 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-neutral-900 border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-400 hover:text-white backdrop-blur-md transition-all duration-200 z-50 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                aria-label="Next Campaign"
                style={{
                  boxShadow: `0 0 15px ${activeExpandedBrand.accentColor}20`,
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing Workflow Results Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-neutral-950 via-brand-secondary/10 to-neutral-950 backdrop-blur-md relative overflow-hidden text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
      >
        {/* Glow light running path */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/0 to-brand-primary/5 opacity-50 pointer-events-none" />
        <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-primary/20 via-brand-secondary/10 to-brand-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-center justify-center font-mono select-none">
          {/* Step 1: Creator input */}
          <div className="md:col-span-1 flex flex-col items-center space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(0,223,162,0.15)]">
              <Film size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block uppercase">I Create</span>
              <span className="text-[10px] text-neutral-500 uppercase mt-0.5 block leading-normal">
                High-quality UGC that connects.
              </span>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center text-neutral-700">
            <ArrowRight size={20} className="animate-pulse text-brand-secondary" />
          </div>

          {/* Step 2: Distribution channel */}
          <div className="md:col-span-1 flex flex-col items-center space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 border border-brand-secondary/25 flex items-center justify-center text-brand-secondary shadow-[0_0_15px_rgba(0,136,255,0.15)]">
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block uppercase">They Post</span>
              <span className="text-[10px] text-neutral-500 uppercase mt-0.5 block leading-normal">
                On their platforms & run ads.
              </span>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center text-neutral-700">
            <ArrowRight size={20} className="animate-pulse text-brand-secondary" />
          </div>

          {/* Step 3: Outcomes */}
          <div className="md:col-span-1 flex flex-col items-center space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(0,223,162,0.15)]">
              <Flame size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block uppercase">Results</span>
              <span className="text-[10px] text-neutral-500 uppercase mt-0.5 block leading-normal">
                More views, more clicks, more conversions.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Embedded CSS for custom keyframes (safeguard since Tailwind is v4) */}
      <style>{`
        @keyframes pulseEqualizer {
          0%, 100% { height: 2px; }
          50% { height: 12px; }
        }
      `}</style>
    </section>
  );
}
