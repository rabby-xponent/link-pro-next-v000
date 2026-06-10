"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  CheckCircle, 
  TrendingUp, 
  BarChart, 
  Sliders, 
  Trash2, 
  Calendar, 
  Shield, 
  Cpu, 
  RefreshCw, 
  Award, 
  Check, 
  X, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  Radio, 
  Globe,
  Copy,
  Mail,
  FileText
} from "lucide-react";

interface CompetitorData {
  domain: string;
  dr: number;
  traffic: string;
  keywords: string;
  backlinks: string;
  sov: number; // Share of voice %
  linksInCommon: number;
}

interface GapOpportunity {
  id: string;
  referringDomain: string;
  dr: number;
  competitorsLinking: string[];
  category: string;
  estTraffic: string;
  actionType: string;
  isAddedToCrm?: boolean;
}

interface MissedLink {
  id: string;
  sourceUrl: string;
  anchorText: string;
  dr: number;
  targetUrl: string;
  relevance: "Very High" | "High" | "Medium" | "Low";
  isReclaimQueued?: boolean;
}

interface RecommendedTarget {
  id: string;
  domain: string;
  dr: number;
  opportunityType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estValue: string;
  isContacted?: boolean;
}

interface ProjectCompetitorProfile {
  id: string;
  name: string;
  domain: string;
  competitorsCount: number;
  gapSitesCount: number;
  oppsCount: number;
  lastScan: string;
  dr: number;
  keywords: string;
  traffic: string;
  competitorsList: CompetitorData[];
  gapSitesList: GapOpportunity[];
  missedLinksList: MissedLink[];
  recommendedTargets: RecommendedTarget[];
}

export function CompetitorDashboardView() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Tab switcher inside active intelligence report
  const [activeReportTab, setActiveReportTab] = useState<"matrix" | "clusters" | "gaps" | "trends" | "missed" | "recommended">("matrix");
  
  // Simple toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search and sorting state
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "gaps" | "opps" | "recent">("recent");
  const [filterMinGapSites, setFilterMinGapSites] = useState<number>(0);

  // Active report interactive filters
  const [competitorFilter, setCompetitorFilter] = useState<string | null>(null);
  const [drMinFilter, setDrMinFilter] = useState<number>(0);
  const [drMaxFilter, setDrMaxFilter] = useState<number>(100);
  const [nicheFilter, setNicheFilter] = useState<string>("All");
  const [detailedSearch, setDetailedSearch] = useState<string>("");
  const [selectedGapIds, setSelectedGapIds] = useState<string[]>([]);

  // Detailed modal previews
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);

  // State of all profile records with robust mock intelligence
  const [projectsList, setProjectsList] = useState<ProjectCompetitorProfile[]>([
    {
      id: "pro-1",
      name: "Uprankly",
      domain: "uprankly.com",
      competitorsCount: 5,
      gapSitesCount: 147,
      oppsCount: 82,
      lastScan: "Today",
      dr: 54,
      keywords: "14.2K",
      traffic: "18.5K",
      competitorsList: [
        { domain: "semrush.com", dr: 91, traffic: "18.4M", keywords: "2.1M", backlinks: "84M", sov: 38, linksInCommon: 120 },
        { domain: "ahrefs.com", dr: 89, traffic: "12.8M", keywords: "1.6M", backlinks: "142M", sov: 29, linksInCommon: 98 },
        { domain: "moz.com", dr: 88, traffic: "6.2M", keywords: "950K", backlinks: "35M", sov: 18, linksInCommon: 45 },
        { domain: "ubersuggest.com", dr: 81, traffic: "3.1M", keywords: "520K", backlinks: "12M", sov: 10, linksInCommon: 32 },
        { domain: "serpstat.com", dr: 76, traffic: "1.4M", keywords: "210K", backlinks: "4.8M", sov: 5, linksInCommon: 18 }
      ],
      gapSitesList: [
        { id: "gap-1", referringDomain: "techcrunch.com", dr: 93, competitorsLinking: ["semrush.com", "ahrefs.com", "moz.com"], category: "Tech News", estTraffic: "15M", actionType: "Skyscraper" },
        { id: "gap-2", referringDomain: "github.com", dr: 95, competitorsLinking: ["semrush.com", "ahrefs.com"], category: "Developer Tools", estTraffic: "80M", actionType: "Integration" },
        { id: "gap-3", referringDomain: "producthunt.com", dr: 92, competitorsLinking: ["semrush.com", "ahrefs.com", "ubersuggest.com"], category: "Product Launch", estTraffic: "4.5M", actionType: "Launch PR" },
        { id: "gap-4", referringDomain: "medium.com", dr: 94, competitorsLinking: ["ahrefs.com", "serpstat.com"], category: "Blogging Platform", estTraffic: "120M", actionType: "Guest Post" },
        { id: "gap-5", referringDomain: "hackernews.com", dr: 91, competitorsLinking: ["semrush.com", "moz.com"], category: "Tech Forum", estTraffic: "3.8M", actionType: "Show HN" },
        { id: "gap-6", referringDomain: "smashingmagazine.com", dr: 88, competitorsLinking: ["ahrefs.com", "moz.com", "serpstat.com"], category: "Design Publication", estTraffic: "2.1M", actionType: "Resource Guide" },
        { id: "gap-7", referringDomain: "freecodecamp.org", dr: 90, competitorsLinking: ["semrush.com", "moz.com"], category: "Dev Academy", estTraffic: "5.4M", actionType: "Skyscraper" },
        { id: "gap-8", referringDomain: "sitepoint.com", dr: 83, competitorsLinking: ["ubersuggest.com", "serpstat.com"], category: "SaaS Publication", estTraffic: "1.2M", actionType: "Listicle Pitch" }
      ],
      missedLinksList: [
        { id: "m-1", sourceUrl: "https://techcrunch.com/2026/best-seo-tools-automation-suite", anchorText: "popular keyword gap crawler uprankly", dr: 93, targetUrl: "https://semrush.com", relevance: "Very High" },
        { id: "m-2", sourceUrl: "https://www.producthunt.com/posts/seo-indexer-agent/reviews", anchorText: "the alternative is our ahrefs setup", dr: 92, targetUrl: "https://ahrefs.com", relevance: "High" },
        { id: "m-3", sourceUrl: "https://medium.com/seo-hacks/building-scalable-saas-links", anchorText: "competitor analysis platforms", dr: 94, targetUrl: "https://moz.com", relevance: "Medium" },
        { id: "m-4", sourceUrl: "https://smashingmagazine.com/2025/11/design-optimization-link", anchorText: "semrush content index templates", dr: 88, targetUrl: "https://semrush.com", relevance: "Medium" }
      ],
      recommendedTargets: [
        { id: "rc-1", domain: "css-tricks.com", dr: 89, opportunityType: "Broken Link", difficulty: "Medium", estValue: "High-Equity Link", isContacted: false },
        { id: "rc-2", domain: "freecodecamp.org", dr: 90, opportunityType: "Resource Page", difficulty: "Hard", estValue: "Top Authority Citations", isContacted: false },
        { id: "rc-3", domain: "hashnode.dev", dr: 82, opportunityType: "Blogging Integration", difficulty: "Easy", estValue: "Highly Relevant UGC", isContacted: false },
        { id: "rc-4", domain: "codepen.io", dr: 91, opportunityType: "Active Profile", difficulty: "Medium", estValue: "High Domain Authority Link", isContacted: false }
      ]
    },
    {
      id: "pro-2",
      name: "CyberGuard",
      domain: "cyberguard.io",
      competitorsCount: 4,
      gapSitesCount: 94,
      oppsCount: 53,
      lastScan: "Yesterday",
      dr: 46,
      keywords: "8.1K",
      traffic: "11.2K",
      competitorsList: [
        { domain: "crowdstrike.com", dr: 82, traffic: "1.4M", keywords: "320K", backlinks: "14M", sov: 42, linksInCommon: 45 },
        { domain: "sentinelone.com", dr: 74, traffic: "810K", keywords: "180K", backlinks: "5.4M", sov: 26, linksInCommon: 38 },
        { domain: "mcafee.com", dr: 87, traffic: "10.2M", keywords: "1.1M", backlinks: "48M", sov: 15, linksInCommon: 22 },
        { domain: "trendmicro.com", dr: 84, traffic: "4.8M", keywords: "590K", backlinks: "19M", sov: 17, linksInCommon: 14 }
      ],
      gapSitesList: [
        { id: "gap-9", referringDomain: "wired.com", dr: 94, competitorsLinking: ["crowdstrike.com", "sentinelone.com"], category: "Tech Media", estTraffic: "32M", actionType: "Skyscraper" },
        { id: "gap-10", referringDomain: "darkreading.com", dr: 79, competitorsLinking: ["crowdstrike.com", "trendmicro.com"], category: "Cybersecurity Journal", estTraffic: "850K", actionType: "Expert Opinion" },
        { id: "gap-11", referringDomain: "infosecurity-magazine.com", dr: 81, competitorsLinking: ["mcafee.com", "sentinelone.com"], category: "Niche Publisher", estTraffic: "420K", actionType: "Guest Editorial" }
      ],
      missedLinksList: [
        { id: "m-5", sourceUrl: "https://wired.com/threat-level/best-practices-edr-protection", anchorText: "crowdstrike cloud sentinel nodes", dr: 94, targetUrl: "https://crowdstrike.com", relevance: "Very High" },
        { id: "m-6", sourceUrl: "https://darkreading.com/analytics/trend-cyberguard-comparative-index", anchorText: "trendmicro cybersecurity suite", dr: 79, targetUrl: "https://trendmicro.com", relevance: "High" }
      ],
      recommendedTargets: [
        { id: "rc-5", domain: "scmagazine.com", dr: 78, opportunityType: "Feature Pitch", difficulty: "Medium", estValue: "Highly Relevant Cybersecurity Traffic", isContacted: false },
        { id: "rc-6", domain: "reddit.com/r/cybersecurity", dr: 92, opportunityType: "AMA Launch", difficulty: "Easy", estValue: "UGC Referral Spike", isContacted: false }
      ]
    },
    {
      id: "pro-3",
      name: "TechFlow",
      domain: "techflow.dev",
      competitorsCount: 3,
      gapSitesCount: 42,
      oppsCount: 21,
      lastScan: "2 Days Ago",
      dr: 38,
      keywords: "3.4K",
      traffic: "4.7K",
      competitorsList: [
        { domain: "vercel.com", dr: 92, traffic: "14.5M", keywords: "850K", backlinks: "28M", sov: 51, linksInCommon: 15 },
        { domain: "netlify.com", dr: 89, traffic: "8.2M", keywords: "470K", backlinks: "18M", sov: 34, linksInCommon: 12 },
        { domain: "railway.app", dr: 75, traffic: "920K", keywords: "82K", backlinks: "2.1M", sov: 15, linksInCommon: 8 }
      ],
      gapSitesList: [
        { id: "gap-12", referringDomain: "dev.to", dr: 89, competitorsLinking: ["vercel.com", "netlify.com"], category: "Developer Community", estTraffic: "12M", actionType: "Interactive Post" },
        { id: "gap-13", referringDomain: "stackexchange.com", dr: 91, competitorsLinking: ["vercel.com", "railway.app"], category: "Engineers Q&A", estTraffic: "40M", actionType: "Curation Answer" }
      ],
      missedLinksList: [
        { id: "m-7", sourceUrl: "https://dev.to/vercel/optimizing-nextjs-rendering-pipelines", anchorText: "deploy on Vercel seamlessly", dr: 89, targetUrl: "https://vercel.com", relevance: "Very High" }
      ],
      recommendedTargets: [
        { id: "rc-7", domain: "news.ycombinator.com", dr: 91, opportunityType: "Show HN Thread", difficulty: "Hard", estValue: "Massive Growth & Referral Equity", isContacted: false }
      ]
    },
    {
      id: "pro-4",
      name: "Client A",
      domain: "clienta.com",
      competitorsCount: 7,
      gapSitesCount: 188,
      oppsCount: 124,
      lastScan: "Today",
      dr: 49,
      keywords: "9.8K",
      traffic: "13.4K",
      competitorsList: [
        { domain: "activecampaign.com", dr: 88, traffic: "9.4M", keywords: "1.2M", backlinks: "23M", sov: 32, linksInCommon: 110 },
        { domain: "hubspot.com", dr: 94, traffic: "38M", keywords: "4.8M", backlinks: "115M", sov: 44, linksInCommon: 145 },
        { domain: "mailchimp.com", dr: 92, traffic: "29M", keywords: "3.1M", backlinks: "82M", sov: 24, linksInCommon: 104 }
      ],
      gapSitesList: [
        { id: "gap-14", referringDomain: "forbes.com", dr: 94, competitorsLinking: ["hubspot.com", "mailchimp.com"], category: "Business Editorial", estTraffic: "65M", actionType: "Executive Profile" },
        { id: "gap-15", referringDomain: "entrepreneur.com", dr: 90, competitorsLinking: ["activecampaign.com", "hubspot.com"], category: "Niche Medium", estTraffic: "18M", actionType: "Skyscraper Pitch" }
      ],
      missedLinksList: [
        { id: "m-8", sourceUrl: "https://www.forbes.com/sites/marketing-automation-trends-2026", anchorText: "visit HubSpot inbound campaign logs", dr: 94, targetUrl: "https://hubspot.com", relevance: "Very High" }
      ],
      recommendedTargets: [
        { id: "rc-8", domain: "inc.com", dr: 91, opportunityType: "Brand Mention Pitch", difficulty: "Hard", estValue: "Supreme Authority Backlink", isContacted: false }
      ]
    }
  ]);

  // Form states for manual submission or new project quick creation
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newCompetitorsCount, setNewCompetitorsCount] = useState("3");

  // Telemetry log output simulator inside active project
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Trigger temporary popup alerts
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Find active project competitor profile
  const activeProject = useMemo(() => {
    return projectsList.find(p => p.id === selectedProjectId) || null;
  }, [projectsList, selectedProjectId]);

  // Filtered project list for directory view
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projectsList];

    // Search filter
    if (searchText.trim() !== "") {
      const q = searchText.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.domain.toLowerCase().includes(q)
      );
    }

    // Min gap sites filter
    if (filterMinGapSites > 0) {
      result = result.filter(p => p.gapSitesCount >= filterMinGapSites);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "gaps") {
        return b.gapSitesCount - a.gapSitesCount;
      } else if (sortBy === "opps") {
        return b.oppsCount - a.oppsCount;
      } else {
        // "recent" by default - projects are stacked but simulate scan recency
        const recencyOrder: Record<string, number> = { "Today": 3, "Yesterday": 2, "2 Days Ago": 1 };
        const scoreA = recencyOrder[a.lastScan] || 0;
        const scoreB = recencyOrder[b.lastScan] || 0;
        return scoreB - scoreA;
      }
    });

    return result;
  }, [projectsList, searchText, sortBy, filterMinGapSites]);

  // Global aggregate stats
  const totalProjectsCount = projectsList.length;
  const totalCompetitorsCount = useMemo(() => {
    return projectsList.reduce((acc, p) => acc + p.competitorsCount, 0);
  }, [projectsList]);
  const totalGapSitesCount = useMemo(() => {
    return projectsList.reduce((acc, p) => acc + p.gapSitesCount, 0);
  }, [projectsList]);
  const totalOpportunitiesCount = useMemo(() => {
    return projectsList.reduce((acc, p) => acc + p.oppsCount, 0);
  }, [projectsList]);

  // Simulate scanning trigger
  const runCompetitorScan = () => {
    if (isScanning || !activeProject) return;
    setIsScanning(true);
    setScanProgress(5);
    setScanLogs(["[INFO] Extracting live target metadata and DNS maps..."]);

    const steps = [
      { p: 25, l: `[CRAWLER] Mapping overlapping link intersections for ${activeProject.domain}...` },
      { p: 50, l: `[CRAWLER] Deep searching database of 14,200 indexed commercial referrers...` },
      { p: 75, l: `[CRAWLER] Computing backlink winners, traffic vectors, and authority gaps...` },
      { p: 90, l: `[CRAWLER] Parsing crawl latency and checking robots.txt directives...` },
      { p: 100, l: `[SUCCESS] Refreshed competitor overlap matrix. Discovered 4 new high-authority targets!` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep].p);
        setScanLogs(prev => [...prev, steps[currentStep].l]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setScanLogs([]);
          
          // Dynamically increase gap counts slightly to simulate a successful real scan update!
          setProjectsList(prev => prev.map(p => {
            if (p.id === activeProject.id) {
              const updatedGapOpportunities = [
                {
                  id: "gap-manual-" + Date.now(),
                  referringDomain: "smashingmagazine.com",
                  dr: 88,
                  competitorsLinking: [p.competitorsList[0]?.domain || "competitor.com"],
                  category: "Web Development",
                  estTraffic: "1.8M",
                  actionType: "Resource Guideline"
                },
                ...p.gapSitesList
              ];
              return {
                ...p,
                gapSitesCount: p.gapSitesCount + 2,
                oppsCount: p.oppsCount + 4,
                lastScan: "Today",
                gapSitesList: updatedGapOpportunities
              };
            }
            return p;
          }));

          showToast("Scan finished successfully! Project competitor database re-indexed.");
        }, 1000);
      }
    }, 1200);
  };

  // Switch state for manual project additions
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDomain.trim()) return;

    const formattedDomain = newProjectDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    const generatedId = "pro-" + Date.now();
    
    const newProfile: ProjectCompetitorProfile = {
      id: generatedId,
      name: newProjectName,
      domain: formattedDomain,
      competitorsCount: Number(newCompetitorsCount) || 3,
      gapSitesCount: Math.floor(Math.random() * 80) + 30,
      oppsCount: Math.floor(Math.random() * 40) + 15,
      lastScan: "Today",
      dr: 30 + Math.floor(Math.random() * 30),
      keywords: "1.2K",
      traffic: "1.8K",
      competitorsList: [
        { domain: "competitor-alpha.com", dr: 75, traffic: "180K", keywords: "45K", backlinks: "1.2M", sov: 45, linksInCommon: 12 },
        { domain: "competitor-beta.com", dr: 68, traffic: "90K", keywords: "21K", backlinks: "540K", sov: 30, linksInCommon: 8 },
        { domain: "competitor-gamma.com", dr: 60, traffic: "45K", keywords: "11K", backlinks: "240K", sov: 15, linksInCommon: 5 }
      ],
      gapSitesList: [
        { id: "gap-new-1", referringDomain: "sitepoint.com", dr: 83, competitorsLinking: ["competitor-alpha.com", "competitor-beta.com"], category: "Tech Guides", estTraffic: "1.1M", actionType: "Broken Link Pitch" },
        { id: "gap-new-2", referringDomain: "css-tricks.com", dr: 89, competitorsLinking: ["competitor-alpha.com"], category: "Styling Hub", estTraffic: "4.2M", actionType: "Guest Article" }
      ],
      missedLinksList: [
        { id: "m-new-1", sourceUrl: "https://sitepoint.com/resources-to-learn-link-building", anchorText: "competitor guides list", dr: 83, targetUrl: "competitor-alpha.com", relevance: "High" }
      ],
      recommendedTargets: [
        { id: "rc-new-1", domain: "codepen.io", dr: 91, opportunityType: "Active Profile", difficulty: "Medium", estValue: "Solid DR Profile Backlink", isContacted: false }
      ]
    };

    setProjectsList(prev => [...prev, newProfile]);
    
    // Reset form states
    setNewProjectName("");
    setNewProjectDomain("");
    setNewCompetitorsCount("3");
    setShowAddProjectModal(false);
    
    showToast(`Successfully registered ${newProjectName} for automated competitors tracking!`);
  };

  // Toggle quick CRM additions within gaps
  const handleAddToCRM = (gapId: string) => {
    let addedDomain = "";
    let addedNiche = "";
    let addedAction = "";
    
    setProjectsList(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        const updatedGaps = p.gapSitesList.map(g => {
          if (g.id === gapId) {
            addedDomain = g.referringDomain;
            addedNiche = g.category;
            addedAction = g.actionType;
            return { ...g, isAddedToCrm: true };
          }
          return g;
        });
        return {
          ...p,
          gapSitesList: updatedGaps
        };
      }
      return p;
    }));

    if (addedDomain) {
      // Propagation and direct synchronization to workspace master outreach CRM
      const saved = localStorage.getItem("uprankly_crm_prospects") || "[]";
      try {
        const parsed = JSON.parse(saved);
        const exists = parsed.some((p: any) => p.siteName.toLowerCase() === addedDomain.toLowerCase());
        if (!exists) {
          const newProspect = {
            id: `crm-gap-${Date.now()}`,
            siteName: addedDomain,
            person: "Editorial Liaison",
            email: `editorial@${addedDomain}`,
            stage: "Planned",
            lastContact: "Never",
            notes: `Queued from Competitor Referral Gaps. Recommended action: ${addedAction}. Target Niche: ${addedNiche}.`
          };
          parsed.push(newProspect);
          localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Local CRM write error:", e);
      }
    }
    showToast(`Added '${addedDomain}' directly into Active Outreach CRM queue!`);
  };

  // Toggle quick contact status in targets
  const handleToggleContacted = (targetId: string) => {
    let targetDomain = "";
    let targetOppType = "";
    let targetValue = "";
    let nextStatus = false;
    
    setProjectsList(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          recommendedTargets: p.recommendedTargets.map(rt => {
            if (rt.id === targetId) {
              const updatedStatus = !rt.isContacted;
              targetDomain = rt.domain;
              targetOppType = rt.opportunityType;
              targetValue = rt.estValue;
              nextStatus = updatedStatus;
              return { ...rt, isContacted: updatedStatus };
            }
            return rt;
          })
        };
      }
      return p;
    }));

    if (targetDomain && nextStatus) {
      // Pushing recommended targets into active workspace CRM
      const saved = localStorage.getItem("uprankly_crm_prospects") || "[]";
      try {
        const parsed = JSON.parse(saved);
        const exists = parsed.some((p: any) => p.siteName.toLowerCase() === targetDomain.toLowerCase());
        if (!exists) {
          const newProspect = {
            id: `crm-rec-${Date.now()}`,
            siteName: targetDomain,
            person: "Webmaster Outreach Coordinator",
            email: `contact@${targetDomain}`,
            stage: "Contacted",
            lastContact: "Today",
            notes: `Enrolled via Competitor recommendations. Opportunity Type: ${targetOppType}. Est impact: ${targetValue}`
          };
          parsed.push(newProspect);
          localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsed));
          showToast(`Active outreach campaign setup for ${targetDomain}! Synchronized to CRM.`);
        } else {
          showToast(`Marked ${targetDomain} as contacted.`);
        }
      } catch (e) {
        console.error("CRM sync error:", e);
      }
    } else {
      showToast("Target outreach status modified.");
    }
  };

  // Reclaim backlink references lost to competitors
  const handleQueueReclaim = (missId: string) => {
    let sourceUrl = "";
    let targetUrl = "";
    let anchorText = "";
    
    setProjectsList(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          missedLinksList: p.missedLinksList.map(m => {
            if (m.id === missId) {
              sourceUrl = m.sourceUrl;
              targetUrl = m.targetUrl;
              anchorText = m.anchorText;
              return { ...m, isQueued: true };
            }
            return m;
          })
        };
      }
      return p;
    }));

    if (sourceUrl) {
      let hostname = sourceUrl;
      try {
        hostname = new URL(sourceUrl).hostname || sourceUrl;
      } catch (e) {}

      const saved = localStorage.getItem("uprankly_crm_prospects") || "[]";
      try {
        const parsed = JSON.parse(saved);
        const exists = parsed.some((p: any) => p.notes.includes(sourceUrl));
        if (!exists) {
          const newProspect = {
            id: `crm-missed-${Date.now()}`,
            siteName: hostname,
            person: "Content Editor / Author",
            email: `editor@${hostname}`,
            stage: "Planned",
            lastContact: "Never",
            notes: `High priority backlink reclaim. Context mention anchor: "${anchorText}". Pointed to rival: ${targetUrl}. Source URL: ${sourceUrl}`
          };
          parsed.push(newProspect);
          localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("CRM write error:", e);
      }
      showToast(`Missed reference on ${hostname} queued for reclaim sequence!`);
    }
  };

  // Process batch of selected referrers
  const handleBatchQueueCRM = () => {
    if (selectedGapIds.length === 0 || !activeProject) return;

    let countAdded = 0;
    const updatedGapsList = activeProject.gapSitesList.map(g => {
      if (selectedGapIds.includes(g.id)) {
        if (!g.isAddedToCrm) {
          countAdded++;
          const saved = localStorage.getItem("uprankly_crm_prospects") || "[]";
          try {
            const parsed = JSON.parse(saved);
            const exists = parsed.some((p: any) => p.siteName.toLowerCase() === g.referringDomain.toLowerCase());
            if (!exists) {
              const newProspect = {
                id: `crm-gap-${Date.now()}-${Math.random()}`,
                siteName: g.referringDomain,
                person: "Editorial Liaison",
                email: `editorial@${g.referringDomain}`,
                stage: "Planned",
                lastContact: "Never",
                notes: `Queued in bulk from Competitor Overlap Matrix. Action: ${g.actionType}. Niche: ${g.category}.`
              };
              parsed.push(newProspect);
              localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsed));
            }
          } catch (e) {
            console.error("Local CRM write error:", e);
          }
        }
        return { ...g, isAddedToCrm: true };
      }
      return g;
    });

    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          gapSitesList: updatedGapsList
        };
      }
      return p;
    }));

    setSelectedGapIds([]);
    showToast(`Bulk Sync successful! Transferred ${countAdded} target pipelines into Outreach CRM.`);
  };

  // Navigation handlers clicking from clusters matrix
  const handleDRClusterClick = (min: number, max: number, label: string) => {
    setDrMinFilter(min);
    setDrMaxFilter(max);
    setActiveReportTab("gaps");
    showToast(`Filtering matrix to show ${label} (${min}-${max} DR) cluster bucket!`);
  };

  // Matrix actions focusing overlapping domains
  const handleFilterByCompetitor = (domain: string) => {
    setCompetitorFilter(domain);
    setActiveReportTab("gaps");
    showToast(`Analyzing performance gap: showing domains specifically linking to ${domain}`);
  };

  const handleOpenDetails = (item: any, type: "gap" | "missed" | "target") => {
    setSelectedDetailItem({ ...item, itemType: type });
    setShowDetailsModal(true);
  };

  // Filtered lists computations with reactivity support
  const filteredGaps = useMemo(() => {
    if (!activeProject) return [];
    let list = [...activeProject.gapSitesList];

    if (detailedSearch.trim() !== "") {
      const q = detailedSearch.toLowerCase();
      list = list.filter(g => g.referringDomain.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    }

    if (nicheFilter !== "All") {
      list = list.filter(g => g.category === nicheFilter);
    }

    if (competitorFilter) {
      list = list.filter(g => g.competitorsLinking.includes(competitorFilter));
    }

    if (drMinFilter > 0) {
      list = list.filter(g => g.dr >= drMinFilter);
    }
    
    if (drMaxFilter < 100) {
      list = list.filter(g => g.dr <= drMaxFilter);
    }

    return list;
  }, [activeProject, detailedSearch, nicheFilter, competitorFilter, drMinFilter, drMaxFilter]);

  const filteredMissedLinks = useMemo(() => {
    if (!activeProject) return [];
    let list = [...activeProject.missedLinksList];

    if (detailedSearch.trim() !== "") {
      const q = detailedSearch.toLowerCase();
      list = list.filter(m => m.sourceUrl.toLowerCase().includes(q) || m.anchorText.toLowerCase().includes(q));
    }

    if (drMinFilter > 0) {
      list = list.filter(m => m.dr >= drMinFilter);
    }
    if (drMaxFilter < 100) {
      list = list.filter(m => m.dr <= drMaxFilter);
    }

    return list;
  }, [activeProject, detailedSearch, drMinFilter, drMaxFilter]);

  const filteredRecommendedTargets = useMemo(() => {
    if (!activeProject) return [];
    let list = [...activeProject.recommendedTargets];

    if (detailedSearch.trim() !== "") {
      const q = detailedSearch.toLowerCase();
      list = list.filter(rt => rt.domain.toLowerCase().includes(q) || rt.opportunityType.toLowerCase().includes(q));
    }

    if (drMinFilter > 0) {
      list = list.filter(rt => rt.dr >= drMinFilter);
    }
    if (drMaxFilter < 100) {
      list = list.filter(rt => rt.dr <= drMaxFilter);
    }

    return list;
  }, [activeProject, detailedSearch, drMinFilter, drMaxFilter]);

  return (
    <div className="space-y-8 animate-fade-in" id="competitor-intelligence-dashboard">
      
      {/* Dynamic Toast Element */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 bg-teal-900 border border-teal-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-[300] text-xs font-bold" id="dashboard-toast">
          <CheckCircle className="w-5 h-5 text-teal-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER VIEW A: PROJECT NAV HUB DIRECTORY */}
      {!selectedProjectId ? (
        <div className="space-y-6" id="competitor-nav-hub">
          
          {/* Header Row Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="competitor-header-card">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-teal-700 uppercase" id="breadcrumbs">
                <span>Link Pro</span>
                <span className="text-slate-300">&rsaquo;</span>
                <span className="text-slate-500">Competitors</span>
              </div>
              <h1 className="text-xl font-bold font-sans text-slate-800 tracking-tight mt-1" id="hub-main-title">
                Competitor Intelligence Directory
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1 max-w-2xl leading-relaxed">
                Select a project to analyze competitor backlink strategies, authority gaps, link acquisition patterns, and missed opportunities. Establish comparative performance monitors.
              </p>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2.5 bg-[#006a61] hover:bg-[#00524b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0"
              id="btn-add-profile-project"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Core Stat Widgets Summary Row (4 high precision cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="aggregation-statistics-cards">
            
            {/* Widget 1: Projects */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all" id="stat-project-count-widget">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider uppercase font-mono">Projects Tracked</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{totalProjectsCount}</span>
                  <span className="text-[10px] text-teal-600 font-bold font-mono">Active</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Competitors */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all" id="stat-competitor-count-widget">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider uppercase font-mono">Competitors</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{totalCompetitorsCount}</span>
                  <span className="text-[10px] text-indigo-600 font-bold font-mono">Profiles</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Gap Sites */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all" id="stat-gaps-count-widget">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider uppercase font-mono">Gap Sites Linked</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{totalGapSitesCount.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-600 font-bold font-mono">Intersections</span>
                </div>
              </div>
            </div>

            {/* Widget 4: Opportunities */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all" id="stat-opportunities-count-widget">
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider uppercase font-mono">Total Opportunities</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{totalOpportunitiesCount.toLocaleString()}</span>
                  <span className="text-[10px] text-purple-600 font-bold font-mono">DR50+ Targets</span>
                </div>
              </div>
            </div>

          </div>

          {/* Search, Sort and Filter interactive taskbar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs" id="interactive-filter-panel">
            <div className="relative w-full md:w-80" id="search-input-box">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input 
                type="text"
                placeholder="Search projects by domain..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end" id="filter-sort-selection">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="recent">Last Scan Recency</option>
                  <option value="name">Alpha Name</option>
                  <option value="gaps">Gap Sites (High to Low)</option>
                  <option value="opps">Opportunities (High to Low)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Filter gaps:</span>
                <button
                  onClick={() => setFilterMinGapSites(prev => prev === 0 ? 100 : 0)}
                  className={`px-3 py-2 text-xs font-bold bg-slate-50 hover:bg-slate-100 rounded-lg border transition-all cursor-pointer ${filterMinGapSites > 0 ? "border-teal-500 text-teal-800 bg-teal-50/50" : "border-slate-200 text-slate-600"}`}
                >
                  {filterMinGapSites > 0 ? "Showing DR-intersection gaps ≥ 100" : "Show All"}
                </button>
              </div>
            </div>
          </div>

          {/* PROJECT DIRECTORY CARD GRID */}
          <div className="space-y-4" id="directory-listing-region">
            <div className="flex items-center justify-between" id="directory-indicator-ribbon">
              <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Project Directory</h2>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Page 1 of 1</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid-directory">
              {filteredAndSortedProjects.map(proj => (
                <div 
                  key={proj.id} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#006a61] hover:shadow-md transition-all flex flex-col justify-between" 
                  id={`proj-card-${proj.id}`}
                >
                  {/* Card top banner context */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{proj.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">DR {proj.dr}</span>
                    </div>
                    <p className="text-xs text-teal-700 font-mono mb-4 underline">{proj.domain}</p>

                    <div className="border-t border-slate-100 pt-4 space-y-2.5" id="stats-block">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Competitors Tracked</span>
                        <span className="font-bold text-slate-700">{proj.competitorsCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Verified Gap Sites</span>
                        <span className="font-extrabold text-indigo-600 font-mono">{proj.gapSitesCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Link Gaps/Opportunities</span>
                        <span className="font-extrabold text-[#006a61] font-mono">{proj.oppsCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Last Scan Execution</span>
                        <span className="font-mono text-slate-600 font-semibold">{proj.lastScan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Call-to-action button */}
                  <div className="pt-6 border-t border-dashed border-slate-100 mt-6 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setActiveReportTab("matrix");
                      }}
                      className="w-full py-2.5 bg-slate-50 group-hover:bg-[#006a61] group-hover:text-white text-slate-700 border border-slate-200 group-hover:border-[#006a61] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                      id={`btn-open-report-${proj.id}`}
                    >
                      <span>Open Competition Report</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              ))}

              {/* DYNAMIC "+ ADD PROJECT" CARD CONTAINER */}
              <div 
                onClick={() => setShowAddProjectModal(true)}
                className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#006a12] rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[290px] transition-colors group"
                id="btn-add-project-spot"
              >
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 group-hover:bg-teal-50 group-hover:border-teal-300 flex items-center justify-center text-slate-400 group-hover:text-[#006a61] transition-all mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider group-hover:text-[#006a61] transition-all">Add Project Instance</h4>
                <p className="text-[11px] text-slate-400 font-medium max-w-[200px] mx-auto mt-2 leading-relaxed">
                  Register a target website to start analyzing search competitors and authority gaps.
                </p>
              </div>

            </div>
          </div>

          {/* RECENT SCANS LOGS SECTION FEED */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs" id="recent-scans-logs-box">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
              Recent Scans Timeline Stream
            </h3>

            <div className="space-y-3" id="logs-rows">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-mono text-slate-400 select-none">Uprankly:</span>
                <span>23 new competitor opportunities identified from high authority referring domains.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="font-mono text-slate-400 select-none">CyberGuard:</span>
                <span>12 new DR70+ targets automatically queued for Outreach Campaign setup.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span className="font-mono text-slate-400 select-none">Client A:</span>
                <span>41 new gap sites mapped across competitor index intersections.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="font-mono text-slate-400 select-none">TechFlow:</span>
                <span>8 organic competitors verified with sudden backlinks velocity gains.</span>
              </div>
            </div>
          </div>

          {/* Pagination controls mimicking screenshot */}
          <div className="flex items-center justify-between text-xs py-4 text-slate-500 font-semibold" id="pagination-controls">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg cursor-not-allowed opacity-50 select-none">&lsaquo; Previous</button>
            <span>Page <strong className="text-slate-800">1</strong> of 3</span>
            <button className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors" onClick={() => showToast("Pagination list restricted to first page in target sandbox environment.")}>Next &rsaquo;</button>
          </div>

        </div>
      ) : (
        /* RENDER VIEW B: INDIVIDUAL PROJECT COMPETITION REPORT */
        <div className="space-y-6" id="competition-report-detail-panel">
          
          {/* Subheader Navigation control */}
          <button
            onClick={() => {
              setSelectedProjectId(null);
            }}
            className="group px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs select-none"
            id="btn-back-to-directory"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Project Directory</span>
          </button>

          {/* Quick Active Details Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6" id="active-report-meta">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#006a61]">
                <span>Competition Report</span>
                <span>&bull;</span>
                <span>DR {activeProject?.dr} Node</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">{activeProject?.name} Intelligence</h2>
              <p className="text-xs font-mono text-slate-400 underline mt-0.5">{activeProject?.domain}</p>
            </div>

            {/* Quick Metrics stats badge row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="report-mini-badges">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Domain Rating</span>
                <span className="text-base font-extrabold text-[#006a61] mt-0.5 block">{activeProject?.dr}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Competitors</span>
                <span className="text-base font-extrabold text-indigo-600 mt-0.5 block">{activeProject?.competitorsCount}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Gap Sites</span>
                <span className="text-base font-extrabold text-amber-600 mt-0.5 block">{activeProject?.gapSitesCount}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Opportunities</span>
                <span className="text-base font-extrabold text-purple-600 mt-0.5 block">{activeProject?.oppsCount}</span>
              </div>
            </div>
          </div>

          {/* Quick crawl agent simulator triggers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl text-white" id="scan-trigger-banner flex">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">Live Agent Scanner Diagnostics</p>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  Analyzing intersections. Last complete crawler ingestion performed: <strong className="text-white">{activeProject?.lastScan}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={runCompetitorScan}
              disabled={isScanning}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-teal-100 border border-teal-700 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40 transition-all select-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "RE-INDEXING GRAPH..." : "RUN LIVE COMPETITOR INDEX SCAN"}</span>
            </button>
          </div>

          {/* Telemetry output panel in active scan */}
          {isScanning && (
            <div className="w-full bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl p-4 font-mono text-xs text-left space-y-2 shadow-2xl relative overflow-hidden animate-slide-up" id="diagnostics-console">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-slate-400 mb-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Crawl telemetry diagnostics logs client</span>
                </div>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-teal-400 animate-pulse font-bold">{scanProgress}%</span>
              </div>

              {/* logs stream wrapper */}
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[11px]">
                {scanLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className="text-teal-500 select-none">&rsaquo;</span>
                    <p className="text-slate-200">{log}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORT DATA VIEWS TAB SELECTOR BAR */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-2xs" id="report-view-tabs">
            <button
              onClick={() => setActiveReportTab("matrix")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "matrix" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              📊 Competitor Matrix
            </button>
            <button
              onClick={() => setActiveReportTab("clusters")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "clusters" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              🏷️ DR Cluster Buckets
            </button>
            <button
              onClick={() => setActiveReportTab("gaps")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "gaps" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              🕸️ Gap Opportunities ({activeProject?.gapSitesList.length})
            </button>
            <button
              onClick={() => setActiveReportTab("trends")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "trends" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              📈 Acquisition Trends
            </button>
            <button
              onClick={() => setActiveReportTab("missed")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "missed" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              🔗 Missed High Value Links
            </button>
            <button
              onClick={() => setActiveReportTab("recommended")}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeReportTab === "recommended" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
            >
              🎯 Recommended Targets
            </button>
          </div>

          {/* RENDER DETAILED REPORT VIEW TABS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden" id="report-view-content-body">
            
            {/* Actionable Sub-tab Filter Toolbar */}
            {["gaps", "missed", "recommended"].includes(activeReportTab) && (
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold" id="mini-table-toolbar">
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Search keywords or domains..."
                    value={detailedSearch}
                    onChange={(e) => setDetailedSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                  {/* Category Filter Dropdown */}
                  {activeReportTab === "gaps" && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Niche:</span>
                      <select 
                        value={nicheFilter}
                        onChange={(e) => setNicheFilter(e.target.value)}
                        className="bg-white border rounded px-2 py-1 text-[11px] font-bold text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="All">All Niches</option>
                        <option value="Tech News">Tech News</option>
                        <option value="Developer Tools">Developer Tools</option>
                        <option value="Product Launch">Product Launch</option>
                        <option value="Blogging Platform">Blogging Platform</option>
                        <option value="Tech Forum">Tech Forum</option>
                        <option value="Design Publication">Design Publication</option>
                        <option value="Dev Academy">Dev Academy</option>
                        <option value="SaaS Publication">SaaS Publication</option>
                      </select>
                    </div>
                  )}

                  {/* DR slider control */}
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Min DR authority:</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={drMinFilter}
                      onChange={(e) => setDrMinFilter(Number(e.target.value))}
                      className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006a61]"
                    />
                    <span className="font-mono text-[10px] text-teal-800 font-bold select-none">{drMinFilter}+</span>
                  </div>

                  {/* Clear All active filters option */}
                  {(detailedSearch !== "" || nicheFilter !== "All" || competitorFilter !== null || drMinFilter > 0 || drMaxFilter < 100) && (
                    <button 
                      onClick={() => {
                        setDetailedSearch("");
                        setNicheFilter("All");
                        setCompetitorFilter(null);
                        setDrMinFilter(0);
                        setDrMaxFilter(100);
                      }}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer select-none border border-slate-300"
                    >
                      Clear Filters &times;
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW 1: COMPETITOR MATRIX */}
            {activeReportTab === "matrix" && (
              <div className="p-6" id="tab-competitor-matrix">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Referring Domain Matrix Overview</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cross-compare organic search metrics and overall Share of Voice parameters against primary monitors.</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 font-mono text-slate-500 px-2.5 py-1 rounded font-bold uppercase shrink-0">
                    Calculated: Live
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase font-mono text-[10px]">
                        <th className="p-4 pl-6">Domain Referrer</th>
                        <th className="p-4">Authority (DR)</th>
                        <th className="p-4">Est Monthly Traffic</th>
                        <th className="p-4">Keywords Index</th>
                        <th className="p-4">Total Backlinks</th>
                        <th className="p-4">Links In Common</th>
                        <th className="p-4 text-center">Share-of-Voice (SOV)</th>
                        <th className="p-4 pr-6 text-right">Outreach Intelligence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {/* Active Project Row */}
                      <tr className="bg-teal-50/50 text-slate-800">
                        <td className="p-4 pl-6 font-extrabold text-teal-800">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            {activeProject?.domain} <span className="text-[9.5px] bg-[#006a61] text-white px-1.5 py-0.5 rounded font-normal shrink-0">Active</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-teal-800">{activeProject?.dr}/100</td>
                        <td className="p-4 font-bold">{activeProject?.traffic}</td>
                        <td className="p-4 font-mono text-slate-600">{activeProject?.keywords}</td>
                        <td className="p-4 font-mono font-bold">147k</td>
                        <td className="p-4 text-slate-400 font-light">-</td>
                        <td className="p-4 text-center text-teal-800 font-black">100%</td>
                        <td className="p-4 pr-6 text-right font-bold text-slate-400 font-mono text-[10px]">Baseline (Target)</td>
                      </tr>

                      {/* Competitor Rows */}
                      {activeProject?.competitorsList.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                          <td className="p-4 pl-6 font-bold text-slate-800">{comp.domain}</td>
                          <td className="p-4 font-mono font-bold">{comp.dr}/100</td>
                          <td className="p-4 text-slate-600">{comp.traffic}</td>
                          <td className="p-4 font-mono text-slate-600">{comp.keywords}</td>
                          <td className="p-4 font-mono text-slate-600">{comp.backlinks}</td>
                          <td className="p-4 font-mono font-bold text-[#006a61]">{comp.linksInCommon}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[11px] font-mono font-bold">{comp.sov}%</span>
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
                                <div className="bg-[#006a61] h-full" style={{ width: `${comp.sov}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => handleFilterByCompetitor(comp.domain)}
                              className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white font-mono font-bold text-[10px] rounded-lg shadow-xs select-none cursor-pointer transition-all active:scale-95"
                            >
                              🔍 Show Gap Sites
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: DR CLUSTER COMPARISON */}
            {activeReportTab === "clusters" && (
              <div className="p-6" id="tab-dr-clusters">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">DR Cluster Buckets Comparison</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Understand how referring domains are distributed by domain authority classes. Identify where competitors outperform your target.</p>
                  </div>
                  <div className="text-[10px] bg-teal-50 border border-teal-100 text-teal-800 font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
                    <Info className="w-3.5 h-3.5 text-teal-600 animate-pulse-gentle" />
                    <span>Click any cluster row to immediately deep-dive filter targets!</span>
                  </div>
                </div>

                <div className="space-y-6 pt-2" id="dr-distribution-chart">
                  
                  {/* Category Index Card Row */}
                  <div className="space-y-4">
                    {/* Cluster Row A: DR 0-30 */}
                    <div 
                      onClick={() => handleDRClusterClick(0, 30, "Low Authority")}
                      className="bg-slate-50 hover:bg-teal-50/40 p-4 rounded-xl border border-slate-100 hover:border-teal-300 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-full md:w-44 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase group-hover:text-teal-700">Low Authority</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold font-mono group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">Examine</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">DR 0 - 30 Buckets</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">You: 15%</span>
                          <span className="text-[#006a61]">Competitor Core Avg: 28%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: "15%" }} />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-[#006a61] h-full rounded-full" style={{ width: "28%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cluster Row B: DR 31-50 */}
                    <div 
                      onClick={() => handleDRClusterClick(31, 50, "Medium Authority")}
                      className="bg-slate-50 hover:bg-teal-50/40 p-4 rounded-xl border border-slate-100 hover:border-teal-300 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-full md:w-44 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase group-hover:text-teal-700">Medium Authority</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold font-mono group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">Examine</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">DR 31 - 50 Buckets</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">You: 42%</span>
                          <span className="text-[#006a61]">Competitor Core Avg: 35%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: "42%" }} />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-[#006a61] h-full rounded-full" style={{ width: "35%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cluster Row C: DR 51-70 */}
                    <div 
                      onClick={() => handleDRClusterClick(51, 70, "Strong Authority")}
                      className="bg-slate-50 hover:bg-teal-50/40 p-4 rounded-xl border border-slate-100 hover:border-teal-300 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-full md:w-44 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase group-hover:text-teal-700">Strong Authority</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold font-mono group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">Examine</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">DR 51 - 70 Buckets</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">You: 30%</span>
                          <span className="text-[#006a61]">Competitor Core Avg: 22%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: "30%" }} />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-[#006a61] h-full rounded-full" style={{ width: "22%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cluster Row D: DR 71-90 */}
                    <div 
                      onClick={() => handleDRClusterClick(71, 90, "High Equity")}
                      className="bg-slate-50 hover:bg-teal-50/40 p-4 rounded-xl border border-slate-100 hover:border-teal-300 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-full md:w-44 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase group-hover:text-teal-700">High Equity</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold font-mono group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">Examine</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">DR 71 - 90 Buckets</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">You: 10%</span>
                          <span className="text-[#006a61]">Competitor Core Avg: 12%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: "10%" }} />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-[#006a61] h-full rounded-full" style={{ width: "12%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cluster Row E: DR 91-100 */}
                    <div 
                      onClick={() => handleDRClusterClick(91, 100, "Authority Elite")}
                      className="bg-slate-50 hover:bg-teal-50/40 p-4 rounded-xl border border-slate-100 hover:border-teal-300 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-full md:w-44 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase group-hover:text-teal-700">Authority Elite</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold font-mono group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">Examine</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800">DR 91 - 100 Buckets</span>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">You: 3%</span>
                          <span className="text-[#006a61]">Competitor Core Avg: 3%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: "3%" }} />
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="bg-[#006a61] h-full rounded-full" style={{ width: "3%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* SUB-VIEW 3: GAP OPPORTUNITIES */}
            {activeReportTab === "gaps" && (
              <div className="p-6" id="tab-gap-opportunities">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Verified Intersection Authority Gaps</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">These high equity referring domains currently link to two or more competitors, but do not provide static link equity to yours.</p>
                  </div>
                  <span className="text-[10px] bg-indigo-50 font-mono text-indigo-700 px-2.5 py-1 rounded font-bold uppercase shrink-0">
                    Matching: {filteredGaps.length} of {activeProject?.gapSitesList.length} Opportunities
                  </span>
                </div>

                {/* Batch Action Bulk Toolbar */}
                {selectedGapIds.length > 0 && (
                  <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center justify-between animate-fade-in text-xs font-bold text-indigo-900" id="gaps-batch-bar">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping shrink-0" />
                      <span>Selected {selectedGapIds.length} target sites for bulk CRM operations</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedGapIds([])}
                        className="px-3 py-1.5 border border-indigo-200 bg-white hover:bg-slate-50 rounded-lg text-slate-650 cursor-pointer select-none transition-colors"
                      >
                        Deselect
                      </button>
                      <button 
                        onClick={handleBatchQueueCRM}
                        className="px-3.5 py-1.5 bg-[#006a61] hover:bg-teal-800 text-white font-mono rounded-lg cursor-pointer select-none shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Force Batch Outreach Sync</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase font-mono text-[10px]">
                        <th className="p-4 pl-6 text-center w-10">
                          <input 
                            type="checkbox"
                            className="cursor-pointer accent-teal-600 rounded"
                            checked={filteredGaps.length > 0 && selectedGapIds.length === filteredGaps.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGapIds(filteredGaps.map(g => g.id));
                              } else {
                                setSelectedGapIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-4">Referring Website</th>
                        <th className="p-4">Authority Rating (DR)</th>
                        <th className="p-4">Niche Sector</th>
                        <th className="p-4">Est Monthly Traffic</th>
                        <th className="p-4">Competitors Linking</th>
                        <th className="p-4">Recommended Outreach Action</th>
                        <th className="p-4">Blueprint</th>
                        <th className="p-4 pr-6 text-right">Quick Task</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredGaps.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-10 text-center text-slate-400 font-semibold italic">
                            No gap opportunites match the active search filter parameters. Adjust min-DR or keyword terms.
                          </td>
                        </tr>
                      ) : (
                        filteredGaps.map((opp, idx) => {
                          const isSel = selectedGapIds.includes(opp.id);
                          return (
                            <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${isSel ? "bg-indigo-50/20" : "text-slate-700"}`}>
                              <td className="p-4 pl-6 text-center">
                                <input 
                                  type="checkbox"
                                  className="cursor-pointer accent-teal-600 rounded"
                                  checked={isSel}
                                  onChange={() => {
                                    if (isSel) {
                                      setSelectedGapIds(selectedGapIds.filter(id => id !== opp.id));
                                    } else {
                                      setSelectedGapIds([...selectedGapIds, opp.id]);
                                    }
                                  }}
                                />
                              </td>
                              <td className="p-4 font-bold text-slate-800 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                <span>{opp.referringDomain}</span>
                              </td>
                              <td className="p-4 font-mono font-bold text-teal-800">DR {opp.dr}</td>
                              <td className="p-4 text-slate-600">{opp.category}</td>
                              <td className="p-4 font-mono text-slate-550">{opp.estTraffic}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {opp.competitorsLinking.map((compDomain, compIdx) => (
                                    <span key={compIdx} className="bg-slate-100 border border-slate-200 font-mono text-[9px] text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                      {compDomain}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-[#006a61] bg-teal-50 font-bold text-[10px] px-2 py-0.5 rounded border border-teal-100 inline-block font-mono">
                                  {opp.actionType}
                                </span>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleOpenDetails(opp, "gap")}
                                  className="px-2 py-1 text-[10px] bg-slate-100 border border-slate-205 rounded text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer select-none inline-flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3 text-teal-800" />
                                  <span>Dynamic pitch</span>
                                </button>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                {opp.isAddedToCrm ? (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded inline-flex items-center gap-1 border border-emerald-250">
                                    <Check className="w-3 h-3" />
                                    <span>Queued CRM</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCRM(opp.id)}
                                    className="px-2.5 py-1 text-[10.5px] bg-[#006a61] text-white font-bold rounded-md hover:bg-teal-800 transition-colors cursor-pointer"
                                  >
                                    + Queue Outreach
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: LINK ACQUISITION TRENDS */}
            {activeReportTab === "trends" && (
              <div className="p-6" id="tab-trends">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Backlink Acquisition Historical Velocity</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Simulated comparison of backlinks growth count vectors over the previous 6-month indexing updates.</p>
                  </div>
                </div>

                {/* Simulated Chart visual using css grid */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-end h-[240px] relative font-mono" id="simulated-bar-chart">
                    
                    {/* Gridlines */}
                    <div className="absolute inset-x-6 top-8 bottom-12 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300 font-sans border-l">
                      <div className="border-t w-full text-right pr-2">120K backlinks</div>
                      <div className="border-t w-full text-right pr-2">90K backlinks</div>
                      <div className="border-t w-full text-right pr-2">60K backlinks</div>
                      <div className="border-t w-full text-right pr-2">30K backlinks</div>
                    </div>

                    <div className="flex justify-between items-end h-[160px] pb-2 relative z-10">
                      {/* Bars for month Jan */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "30%" }} title="You: 36k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "70%" }} title="Competitors: 84k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Jan</span>
                      </div>

                      {/* Feb */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "35%" }} title="You: 42k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "72%" }} title="Competitors: 86k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Feb</span>
                      </div>

                      {/* Mar */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "42%" }} title="You: 50k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "75%" }} title="Competitors: 90k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Mar</span>
                      </div>

                      {/* Apr */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "48%" }} title="You: 58k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "80%" }} title="Competitors: 96k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Apr</span>
                      </div>

                      {/* May */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "55%" }} title="You: 66k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "88%" }} title="Competitors: 105k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">May</span>
                      </div>

                      {/* Jun */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex gap-1.5 items-end justify-center w-full h-[120px]">
                          <div className="w-4 bg-teal-600 rounded-t-sm" style={{ height: "65%" }} title="You: 78k" />
                          <div className="w-4 bg-[#006a61] rounded-t-sm" style={{ height: "92%" }} title="Competitors: 110k" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Jun</span>
                      </div>

                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-center text-xs font-bold text-slate-600 py-2" id="legend">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-teal-600 rounded-sm" />
                      <span>Your Target Backlinks Velocity</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-[#006a61] rounded-sm" />
                      <span>Competitors Average Velocity</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-VIEW 5: MISSED LINKS */}
            {activeReportTab === "missed" && (
              <div className="p-6" id="tab-missed-links">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Missed Authority References Gained by Competitors</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Top performing backlink URLs where organic context mentions competitors but ignores your platform.</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 font-mono text-slate-500 px-2.5 py-1 rounded font-bold uppercase shrink-0">
                    Matching: {filteredMissedLinks.length} URLs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase font-mono text-[10px]">
                        <th className="p-4 pl-6">Source Article URL</th>
                        <th className="p-4">Context Mention Anchor</th>
                        <th className="p-4">DR Strength</th>
                        <th className="p-4">Target Competitor Reached</th>
                        <th className="p-4">Campaign Concept</th>
                        <th className="p-4 text-center">Acquisition Priority</th>
                        <th className="p-4 pr-6 text-right">Quick Task Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredMissedLinks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-slate-400 font-semibold italic">
                            No missed links match current filtering criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredMissedLinks.map((miss, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                            <td className="p-4 pl-6 font-bold text-slate-800 leading-relaxed max-w-sm truncate">
                              <a href={miss.sourceUrl} target="_blank" rel="noreferrer" className="text-[#006a61] hover:underline flex items-center gap-1">
                                <span className="truncate">{miss.sourceUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </td>
                            <td className="p-4 font-mono italic text-slate-600 leading-relaxed">
                              &ldquo;{miss.anchorText}&rdquo;
                            </td>
                            <td className="p-4 font-mono font-extrabold text-indigo-700">DR {miss.dr}</td>
                            <td className="p-4 font-semibold text-slate-600 underline font-mono">{miss.targetUrl}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleOpenDetails(miss, "missed")}
                                className="px-2.5 py-1 text-[10px] bg-slate-100 border border-slate-205 rounded text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer select-none inline-flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-emerald-800" />
                                <span>Reclamation draft</span>
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${miss.relevance === "Very High" ? "bg-rose-50 text-rose-800 border border-rose-100" : miss.relevance === "High" ? "bg-amber-50 text-amber-800 border border-amber-100" : "bg-slate-100 text-slate-600"}`}>
                                {miss.relevance}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              {miss.isReclaimQueued ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded inline-flex items-center gap-1 border border-emerald-250 font-mono">
                                  <Check className="w-3 h-3" />
                                  <span>Reclaim Queued</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleQueueReclaim(miss.id)}
                                  className="px-2.5 py-1 text-[10px] bg-indigo-900 text-white font-mono font-bold rounded-lg hover:bg-indigo-850 transition-colors cursor-pointer active:scale-95 shadow-xs"
                                >
                                  🛡️ Claim Point
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 6: RECOMMENDED TARGETS */}
            {activeReportTab === "recommended" && (
              <div className="p-6" id="tab-recommended-targets">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Prioritized Recommended Outreach Targets</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Authority sources matching high similarity overlap criteria mapped by difficulty algorithms.</p>
                  </div>
                  <span className="text-[10px] bg-teal-50 font-mono text-teal-850 px-2.5 py-1 rounded font-bold uppercase shrink-0">
                    Recommendations: {filteredRecommendedTargets.length} Classified
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase font-mono text-[10px]">
                        <th className="p-4 pl-6">Target Domain</th>
                        <th className="p-4">Auth Strength (DR)</th>
                        <th className="p-4">Opportunity Type</th>
                        <th className="p-4">Est Page Equity Impact</th>
                        <th className="p-4">Difficulty Level</th>
                        <th className="p-4">Blueprint</th>
                        <th className="p-4 pr-6 text-right">Campaign Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium font-sans">
                      {filteredRecommendedTargets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-slate-400 font-semibold italic">
                            No recommended targets match filter parameters. Lower min-DR index.
                          </td>
                        </tr>
                      ) : (
                        filteredRecommendedTargets.map((rec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                            <td className="p-4 pl-6 font-bold text-slate-800 font-mono underline">{rec.domain}</td>
                            <td className="p-4 font-mono font-bold text-teal-700">DR {rec.dr}</td>
                            <td className="p-4 text-slate-600 font-semibold">{rec.opportunityType}</td>
                            <td className="p-4 text-[#006a61] font-bold font-mono">{rec.estValue}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${rec.difficulty === "Easy" ? "bg-emerald-100 text-emerald-800" : rec.difficulty === "Medium" ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"}`}>
                                {rec.difficulty}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleOpenDetails(rec, "target")}
                                className="px-2 py-1 text-[10px] bg-slate-100 border border-slate-205 rounded text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer select-none inline-flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3 text-teal-800" />
                                <span>Copy Template</span>
                              </button>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleToggleContacted(rec.id)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${rec.isContacted ? "bg-slate-100 text-slate-500" : "bg-[#006a61] text-white hover:bg-[#004e47] transition-all"}`}
                              >
                                {rec.isContacted ? "✓ Contacted" : "📧 Setup Campaign"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* DYNAMIC FORM MODAL WINDOW FOR GENTLY PLACING ADDING NEW TARGET PROFILES */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 min-h-screen" id="modal-project-backdrop">
          <div 
            className="absolute inset-0 bg-[#0b1c30]/45 backdrop-blur-xs" 
            onClick={() => setShowAddProjectModal(false)}
          />
          
          <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm p-6 overflow-hidden animate-slide-up" id="modal-container">
            <div className="pb-3 border-b border-slate-100 mb-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-700" />
                  <span>Track Competitors</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Register domain instance maps for analytics.</p>
              </div>
              <button 
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-lg font-mono font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Project Identifier Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme SaaS"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Base Target Domain Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. acme.com"
                  value={newProjectDomain}
                  onChange={(e) => setNewProjectDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Competitors Count to Map</label>
                <select
                  value={newCompetitorsCount}
                  onChange={(e) => setNewCompetitorsCount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-[#006a61] text-slate-700 font-bold text-xs"
                >
                  <option value="3">3 Primary Competitors</option>
                  <option value="4">4 Core overlapping</option>
                  <option value="5">5 Advanced Overlap Matrix</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00524b] text-white cursor-pointer rounded-lg font-bold"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC PITCH BLUEPRINT POPUP MODAL */}
      {showDetailsModal && selectedDetailItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 min-h-screen" id="modal-details-backdrop">
          <div 
            className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-xs" 
            onClick={() => setShowDetailsModal(false)}
          />
          
          <div className="relative bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-lg p-6 overflow-hidden animate-slide-up" id="details-modal-container">
            <div className="pb-3 border-b border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded font-mono uppercase">
                  Pitch Plan Blueprint
                </span>
                <h3 className="font-extrabold text-slate-800 text-base mt-1 flex items-center gap-1.5">
                  <Mail className="w-5 h-5 text-indigo-700 shrink-0" />
                  <span>{selectedDetailItem.referringDomain || selectedDetailItem.domain || "Outreach Target Insights"}</span>
                </h3>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xl font-mono font-bold"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700 font-medium">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-0.5">Target Authority level</span>
                  <span className="font-extrabold text-[#006a61]">DR {selectedDetailItem.dr || 75}/100</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-0.5">Focus Sector / Niche</span>
                  <span className="font-bold text-slate-850">{selectedDetailItem.category || selectedDetailItem.opportunityType || "Relevant Overlap"}</span>
                </div>
              </div>

              {selectedDetailItem.anchorText && (
                <div className="bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 italic font-medium leading-relaxed my-2">
                  <span className="text-[9.5px] uppercase text-indigo-500 font-mono font-black not-italic block mb-1">Detected Mentions Placement</span>
                  &ldquo;{selectedDetailItem.anchorText}&rdquo; 
                  {selectedDetailItem.targetUrl && (
                    <span className="font-mono text-[10px] not-italic block text-[#006a61] font-bold mt-1.5">Currently linked to: {selectedDetailItem.targetUrl}</span>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-tight text-[11px] mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  Suggested Personalization Angles
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5 font-sans text-slate-650">
                  <li>Highlight how {activeProject?.domain} offers superior performance metrics on overlapping niches.</li>
                  <li>Propose context inclusion inside current listicle reference indexes.</li>
                  <li>Inquire on regular author guest opportunities for editorial content contribution mapping.</li>
                </ul>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase">Interactive copyable Pitch Draft</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Hi Editorial Team,\n\nI noticed you linked to competitor reference frameworks inside the post. ${activeProject?.domain} offers an advanced intersection analysis showing real-time updates. Would you consider adding this insight?`);
                      setToastMessage("Copied outreach email blueprint to clipboard!");
                    }}
                    className="text-[10.5px] text-[#006a61] hover:underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Draft to Clipboard</span>
                  </button>
                </div>
                <textarea 
                  readOnly
                  className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-mono text-[11px] leading-relaxed select-all resize-none text-slate-650"
                  defaultValue={`Hi Editorial Team,\n\nI was reading your excellent article on overlaps. I noticed you referenced similar solutions in the sector.\n\nWe recently launched dynamic metric integrations at ${activeProject?.domain} which might provide your readers with more functional value. Would love to know if you're open to a brief addition.\n\nThanks,\nOutreach Strategy Department`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold cursor-pointer transition-colors text-xs"
                >
                  Close Blueprint
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
