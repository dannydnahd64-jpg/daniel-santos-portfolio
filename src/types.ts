export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  deliverables: string[];
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  details: string;
  status: "pending" | "reviewed" | "accepted" | "declined";
  createdAt: string;
}

export interface PortfolioStats {
  views: string;
  videos: string;
  brands: string;
  campaigns: string;
}
