import { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { isLowPerformanceDevice } from "./utils/performance";
import {
  Compass,
  Film,
  TrendingUp,
  Linkedin,
  GraduationCap,
  ArrowLeftRight,
  Mail
} from "lucide-react";

import DnaLattice from "./components/DnaLattice";
import BentoCard from "./components/BentoCard";
import ClientInquirySystem from "./components/ClientInquirySystem";
import WorkWithBrands from "./components/WorkWithBrands";

import { portfolioStats, services } from "./data";
import dnaPfp from "../assets/dna-pfp.webp";
import dnaLogo from "../assets/dna-logo.webp";

export default function App() {
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (isLowPerformanceDevice()) {
      setReducedMotion(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIcon(false);
        setIsScrolled(true);
      } else {
        setShowScrollIcon(true);
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <div className="relative min-h-screen bg-[#07080a] text-neutral-100 selection:bg-brand-primary selection:text-white">

      {/* Dynamic 3D DNA Particle Lattice background */}
      <DnaLattice />

      {/* Background glow filters */}
      <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-brand-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[5%] w-[35rem] h-[35rem] bg-brand-secondary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* 2. Symmetrical Brand Header */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
        hideNavbar
          ? "opacity-0 -translate-y-full pointer-events-none"
          : isScrolled
            ? "bg-[#07080a]/80 backdrop-blur-md border-b border-brand-primary/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] h-14"
            : "bg-[#07080a]/30 backdrop-blur-sm border-b border-white/[0.02] h-20"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group select-none">
            <div className={`relative flex items-center justify-center transition-all duration-300 ${isScrolled ? "h-12" : "h-16"
              }`}>
              <img src={dnaLogo} alt="Daniel Santos (DNA) Logo - Creative Director & UGC Creator" className="h-full w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,223,162,0.15)] group-hover:drop-shadow-[0_0_12px_rgba(0,223,162,0.35)] transition-all duration-300" />
            </div>
          </a>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest uppercase">
            <a href="#services" className="text-neutral-400 hover:text-white hover:underline decoration-brand-primary decoration-2 underline-offset-4 transition-colors font-medium">My Services</a>
            <a href="#brands" className="text-neutral-400 hover:text-white hover:underline decoration-brand-primary decoration-2 underline-offset-4 transition-colors font-medium">Partnerships</a>
            <a href="#about" className="text-neutral-400 hover:text-white hover:underline decoration-brand-primary decoration-2 underline-offset-4 transition-colors font-medium">About</a>
            <a href="#briefs" className="text-neutral-400 hover:text-white hover:underline decoration-brand-primary decoration-2 underline-offset-4 transition-colors font-medium">Contact Me</a>
          </nav>

          {/* Symmetrical Action Badge */}
          <div className="flex items-center gap-3">
            <a
              href="#briefs"
              className={`rounded-lg bg-white text-black hover:bg-brand-primary hover:text-white hover:shadow-[0_0_15px_rgba(0,223,162,0.3)] text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300 ${isScrolled ? "px-3.5 py-1.5" : "px-4 py-2"
                }`}
            >
              Contact Me
            </a>
          </div>
        </div>
      </header>

      {/* 3. Main Frame layout wrapper */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20 space-y-16 md:space-y-20">

        {/* HERO INTRO */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-4 pb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left w-full z-10">
            {/* Left side: CTA & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl xs:text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"
                >
                  DANIEL "DNA" SANTOS
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-sm md:text-lg font-mono tracking-wide text-neutral-400 max-w-2xl"
                >
                  Creative Director &middot; UGC Creator &middot; Filmmaker
                </motion.p>
              </div>

              {/* Action Buttons for CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#briefs"
                  className="px-6 py-3 rounded-lg bg-white text-black hover:bg-brand-primary hover:text-white hover:shadow-[0_0_15px_rgba(0,223,162,0.3)] text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300"
                >
                  Contact Me
                </a>
                <a
                  href="#brands"
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300"
                >
                  View Campaigns
                </a>
              </div>

              {/* Symmetrical Hero Stats Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] w-full">
                <div className="text-left space-y-1">
                  <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-white block">
                    {portfolioStats.views}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block leading-tight">
                    Views Generated
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-white block">
                    {portfolioStats.videos}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block leading-tight">
                    Videos Created
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-white block">
                    {portfolioStats.brands}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block leading-tight">
                    Brands Worked With
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-white block">
                    {portfolioStats.campaigns}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block leading-tight">
                    Campaigns Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Creator Profile Picture Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-5 flex flex-col justify-center items-center relative py-6"
            >
              {/* Styled Profile Image Asset */}
              <div className="relative w-full max-w-[320px] aspect-[3/4] group -mt-8 md:-mt-32">
                <img
                  src={dnaPfp}
                  alt="Daniel Santos - Creative Director, UGC Creator & Filmmaker"
                  className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom gradient overlay to blend into dark background seamlessly */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#07080a] via-[#07080a]/50 to-transparent pointer-events-none" />
              </div>

              {/* Glassmorphic Profile Info Card sitting on page background (DNA lattice flows behind it) */}
              <div className="w-full max-w-[320px] mt-4 p-4 rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.08] text-center space-y-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-xs font-display font-bold text-white uppercase block tracking-widest">DANIEL SANTOS</span>
                  <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 border-t border-white/[0.04] pt-2 w-full justify-center whitespace-nowrap">
                    <GraduationCap size={12} className="text-brand-primary shrink-0" />
                    <span>BA in Digital Media Innovations &middot; Business Minor</span>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 pt-2.5 border-t border-white/[0.04]">
                  <a 
                    href="https://www.linkedin.com/in/daniel-santos-34a044302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-brand-secondary transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@thisisdna_?_r=1&_t=ZP-96rklGYowBz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-brand-primary transition-colors duration-200"
                    aria-label="TikTok"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                  <a 
                    href="https://app.sideshift.app/portfolio/xpaYaXIx6YdKXHFpLgXWPDTf30E3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                    aria-label="SideShift"
                  >
                    <ArrowLeftRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <AnimatePresence>
            {showScrollIcon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-none select-none"
              >
                <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase">Scroll</span>
                <div className="w-5 h-8 rounded-full border border-neutral-800 flex justify-center p-1">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="w-1 h-2 rounded-full bg-brand-primary"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="space-y-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-primary/5 rounded-full filter blur-[140px] pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
              MY SERVICES
            </h2>
            <p className="text-xs md:text-sm font-mono tracking-widest text-neutral-500 uppercase">
              Sector Specialties & Production Deliverables
            </p>
          </div>

          {/* Render individual services in a spacious grid of BentoCards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <BentoCard
                key={svc.id}
                id={`service-${svc.id}`}
                className="h-full flex flex-col justify-between space-y-8 min-h-[420px]"
                hoverEffect={false}
              >
                <div className="space-y-4">
                  {/* Glowing Icon Wrapper */}
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(0,223,162,0.1)]">
                    {svc.id === "creative-direction" ? (
                      <Compass size={20} />
                    ) : svc.id === "ugc-strategy" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <Film size={20} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-display font-bold text-white tracking-tight uppercase">
                      {svc.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                      {svc.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-5 border-t border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold block mb-1">
                    Production Assets:
                  </span>
                  <ul className="text-xs text-neutral-400 font-mono space-y-2 text-left">
                    {svc.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-primary select-none shrink-0 font-bold">&bull;</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BentoCard>
            ))}
          </div>


        </section>

        {/* WORK WITH BRANDS SECTION */}
        <WorkWithBrands onPhoneActiveChange={setHideNavbar} />

        {/* ABOUT ME SECTION */}
        <section id="about" className="space-y-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-secondary/5 rounded-full filter blur-[140px] pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
              ABOUT
            </h2>
            <p className="text-xs md:text-sm font-mono tracking-widest text-neutral-500 uppercase">
              Creative Directing &bull; UGC Ads &bull; Filmmaking
            </p>
          </div>

          {/* Restructured About Card Layout */}
          <BentoCard
            id="about-bento-card"
            className="w-full py-12 md:py-16"
            hoverEffect={false}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              {/* Left Column: Avatar & Symmetrical Nameplate */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-brand-primary/30 shadow-[0_0_40px_rgba(0,223,162,0.15)] group transition-all duration-500 hover:border-brand-secondary/40 hover:shadow-[0_0_40px_rgba(0,136,255,0.15)]">
                  <img
                    src={dnaPfp}
                    alt="Daniel Santos"
                    className="w-full h-full object-cover opacity-90 contrast-[1.05] transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/85 to-transparent pointer-events-none" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-display font-black text-white uppercase tracking-wider">
                    Daniel Santos
                  </h4>
                  <p className="text-xs font-mono text-brand-primary tracking-widest uppercase">
                    AKA "DNA"
                  </p>
                </div>
              </div>

              {/* Right Column: Bio details and Skill Capsules */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight leading-snug">
                  CRAFTING HIGH-RETENTION CONTENT THAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">BUILDS BRANDS AND DRIVES CONVERSIONS.</span>
                </h3>

                <div className="space-y-4 text-xs md:text-sm text-neutral-300 leading-relaxed font-sans font-light">
                  <p>
                    I’m a professional content creator, filmmaker, and entrepreneur with a strong focus on creating engaging digital content that feels authentic, high-quality, and built to connect with people. My background in photography and videography gave me a strong creative foundation, but over time my focus has shifted into content creation—especially direct-to-camera videos, brand storytelling, and performance-driven content made for today’s digital platforms.
                  </p>
                  <p>
                    Creating content is something I genuinely enjoy. I love the process of turning an idea into a finished video that feels natural, captures attention, and delivers a message in a way that connects with people. I work quickly, stay organized, and take pride in creating content efficiently without sacrificing quality. With experience producing over 50 videos a month, I’ve built a fast-paced workflow that allows me to stay consistent, adaptable, and creative while delivering strong results.
                  </p>
                  <p>
                    Alongside content creation, I also have experience as an entrepreneur and co-founder in the tech space, which has helped me develop a strong business mindset, leadership skills, and a strategic approach to creative work. I enjoy building ideas from the ground up, solving problems creatively, and bringing both vision and execution together in everything I work on.
                  </p>
                </div>

                {/* Skill badges */}
                <div className="pt-5 border-t border-white/[0.04] space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block">
                    Core Skills:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "UGC Content",
                      "Talking-Head Videos",
                      "Creative Strategy",
                      "Entrepreneurship",
                      "Content Creation"
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[10px] font-mono text-neutral-400 uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </section>

        {/* 6. WORK WITH ME & ADMIN INBOX PORTAL */}
        <section id="briefs" className="space-y-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-brand-secondary/5 rounded-full filter blur-[140px] pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
              CONTACT ME
            </h2>
            <p className="text-xs md:text-sm font-mono tracking-widest text-neutral-500 uppercase">
              Let's build high-converting content together
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Brief info card (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest block font-bold">
                  [ WORK WITH ME ]
                </span>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                  LET'S SCALE YOUR BRAND
                </h3>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Looking to elevate your brand with high-performing UGC ads, premium art direction, or high-retention video editing? Drop your project details below and let's craft a campaign that captures attention and drives conversions.
              </p>

              <div className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest block font-bold">
                  Direct Contact
                </span>
                
                <div className="space-y-3.5 text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-brand-secondary shrink-0">
                      <Mail size={14} />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-wider font-semibold">Email</span>
                      <a href="mailto:contactdnahq@gmail.com" className="text-white hover:underline hover:text-brand-secondary transition-colors">
                        contactdnahq@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saying */}
              <div className="pt-4 border-t border-white/[0.04] select-none text-left">
                <p className="text-xs font-mono italic text-brand-primary tracking-wide animate-pulse">
                  &ldquo;Take the risk or lose the chance.&rdquo;
                </p>
              </div>
            </div>

            {/* Inquiry Form System Card (7 cols) */}
            <BentoCard
              id="brief-submission-bento"
              className="lg:col-span-7"
              hoverEffect={false}
            >
              <ClientInquirySystem />
            </BentoCard>

          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <footer className="border-t border-white/[0.04] bg-black/40 backdrop-blur-md py-12 text-center text-xs text-neutral-600 font-mono uppercase tracking-widest relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px]">
            &copy; {new Date().getFullYear()} DANIEL SANTOS (DNA). ALL RIGHTS RESERVED.
          </p>
          
          {/* Plain Text Social Links */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-neutral-500">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">INSTAGRAM</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">TIKTOK</a>
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">VIMEO</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">LINKEDIN</a>
          </div>

          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
            Designed &amp; Developed by <a href="https://jacobjjmungai.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-brand-primary transition-colors duration-200 font-bold">jacs.ai</a>
          </p>
        </div>
      </footer>
      </div>
    </MotionConfig>
  );
}
