export interface BacklinkItem {
  id: string;
  targetUrl: string;
  anchorText: string;
  category: string;
  dr: number; // Domain Rating
  status: "Indexed" | "Pending" | "Deindexed";
  dateAdded: string;
}

export interface MonitorItem {
  id: string;
  url: string;
  anchorText: string;
  status: "Up" | "Down" | "Crawl Error" | "No-follow Alert";
  crawlTimeMs: number;
  lastChecked: string;
  uptimeHistory: number[]; // 10 status codes or indices
}

export interface ClientRecord {
  id: string;
  name: string;
  domain: string;
  activeCampaigns: number;
  linkQuote: number;
  completedLinks: number;
}

export interface CodeAuditResult {
  score: number;
  explanation: string;
  details: string[];
  correctedCode: string;
}
