import { ServiceItem, PortfolioStats } from "./types";

export const portfolioStats: PortfolioStats = {
  views: "50M+",
  videos: "1000+",
  brands: "25+",
  campaigns: "100+",
};

export const services: ServiceItem[] = [
  {
    id: "creative-direction",
    title: "Creative & Art Direction",
    description: "Developing conceptual frameworks, visual styles, and narrative structures that elevate products into cultural talk-points.",
    iconName: "Compass",
    deliverables: [
      "Brand DNA & Aesthetics Mapping",
      "Visual Moodboards & Treatment Files",
      "Cinematic Storyboard Concepts",
      "Casting, Styling & Music Direction",
    ],
  },
  {
    id: "ugc-strategy",
    title: "High-Converting UGC Ads",
    description: "Performance-oriented user generated content meticulously sequenced to bypass organic ad blindness and maximize ROAS.",
    iconName: "TrendingUp",
    deliverables: [
      "High-Clarity Scriptwriting & Hook Creation",
      "Multi-Variant Direct Response Reels",
      "A/B Hook Testing Configurations",
      "TikTok, IG Reels & YT Shorts Deliverables",
    ],
  },
  {
    id: "cinematic-production",
    title: "End-to-End Video Production",
    description: "Ultra-high quality motion design, physical cinematography, and dynamic audio-first editing for premium distribution.",
    iconName: "Film",
    deliverables: [
      "4K Cinematography & Lighting Kits",
      "Sound Design & Bespoke Scoring Sync",
      "Fluid CGI & Text Layout Accents",
      "Color Grading / DaVinci Resolve Master Class Delivery",
    ],
  },
];
