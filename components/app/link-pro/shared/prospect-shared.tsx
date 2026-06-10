"use client";

import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

// Types for internal lists
export interface CompetitorItem {
  domain: string;
  da: number;
  traffic: string;
  keywords: string;
  backlinks: string;
  sov: number; // Share of Voice %
}

export interface KeywordItem {
  keyword: string;
  volume: number;
  cpc: number;
  difficulty: number; // 1-100
  intent: "Informational" | "Commercial" | "Transactional" | "Navigtional";
}

export interface VettedSiteItem {
  domain: string;
  niche: string;
  dr: number;
  traffic: string;
  postPrice: number;
  contactEmail: string;
}

export interface CompOppsItem {
  referringDomain: string;
  competitorsLinked: string[];
  dr: number;
  trustScore: number;
  estimatedCost: string;
  nicheRating: "Very High" | "High" | "Medium";
}

export interface ProspectCRMItem {
  id: string;
  siteName: string;
  person: string;
  email: string;
  stage: "Planned" | "Contacted" | "Negotiating" | "Won" | "Rejected";
  lastContact: string;
  notes: string;
}

export interface OutreachCampaign {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  sent: number;
  opened: number;
  replied: number;
  won: number;
  creator: string;
}

export interface PitchTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  successRate: string;
  type: "Skyscraper" | "Broken Link" | "Guest Post";
}

export interface ConnectedEmail {
  id: string;
  address: string;
  provider: "Google" | "Microsoft" | "SMTP Custom";
  status: "Verified" | "Warming" | "Error";
  dailyLimit: number;
  sentToday: number;
  dkimSpf: boolean;
}

// Global hook to get current projects
export const getProjectsList = () => {
  const saved = localStorage.getItem("uprankly_projects");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return [
    { id: "proj-1", name: "Uprankly", domain: "uprankly.com" },
    { id: "proj-2", name: "CyberGuard", domain: "cyberguard.io" },
    { id: "proj-3", name: "Client A", domain: "clienta.com" },
    { id: "proj-4", name: "Client B", domain: "growthstack.co" },
    { id: "proj-5", name: "TechFlow", domain: "techflow.dev" }
  ];
};

// Global Toast utility
export interface ViewToastProps {
  message: string;
  onClose: () => void;
}
export const LocalToast = ({ message, onClose }: ViewToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 right-10 bg-teal-900 border border-teal-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50 text-xs font-semibold">
      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
