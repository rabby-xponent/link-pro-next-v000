"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Grid,
  Filter,
  Sparkles,
  Award,
  Globe,
  Database,
  Megaphone,
  Rocket,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Mail,
  Loader2,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Check,
  Building,
  ArrowUpDown,
  BookOpen,
  Info,
  Calendar,
  Layers,
  FileText,
  Copy,
  ChevronLeft,
  CircleAlert,
  Inbox
} from "lucide-react";

// Types corresponding to rich Interactive Prospects
export interface ContactItem {
  id: string;
  name: string;
  email: string;
  isPrimary: boolean;
}

export interface ProspectItem {
  id: string;
  domain: string;
  dr: number;
  traffic: number;
  spam: string;
  category: string;
  status: "New" | "Enriched" | "Ready" | "In Campaign";
  enrichmentStatus: "None" | "SEO" | "Contacts" | "Full";
  listId: string; // matches list IDs from localstorage
  aiOpener: string;
  contacts: ContactItem[];
  primaryContact: ContactItem | null;
}

// Default realistic list tags, in case we sync with ProspectListView labels
const DEFAULT_STATIC_LISTS = [
  { id: "l-1", name: "SaaS Link Building Q2" },
  { id: "l-2", name: "Tech Blog Outreach" },
  { id: "l-3", name: "Competitor Gap Import" },
  { id: "l-4", name: "High DR Guest Posts" },
  { id: "l-5", name: "Resource Page Targets" },
  { id: "l-6", name: "Niche Edit Campaign" }
];

const DEFAULT_REALISTIC_PROSPECTS: ProspectItem[] = [
  {
    id: "p-1",
    domain: "techcrunch.com",
    dr: 92,
    traffic: 15500000,
    spam: "1%",
    category: "Technology",
    status: "Enriched",
    enrichmentStatus: "Full",
    listId: "l-1",
    aiOpener: "Hey Amanda, loved your latest analysis on generative AI SaaS funding trends! Let me know if you would keep tabs on custom benchmarks.",
    contacts: [
      { id: "c-1-1", name: "Amanda Ross", email: "amanda.ross@techcrunch.com", isPrimary: true },
      { id: "c-1-2", name: "Editor Desk", email: "news@techcrunch.com", isPrimary: false }
    ],
    primaryContact: { id: "c-1-1", name: "Amanda Ross", email: "amanda.ross@techcrunch.com", isPrimary: true }
  },
  {
    id: "p-2",
    domain: "github.com",
    dr: 97,
    traffic: 120000000,
    spam: "0%",
    category: "Technology",
    status: "In Campaign",
    enrichmentStatus: "Full",
    listId: "l-1",
    aiOpener: "Hi Robert, your TypeScript open-source ecosystem update was extremely well written! Would enjoy collaborating on a future developer guide.",
    contacts: [
      { id: "c-2-1", name: "Robert Chen", email: "r.chen@github.com", isPrimary: true },
      { id: "c-2-2", name: "Dev Relations", email: "devrel@github.com", isPrimary: false }
    ],
    primaryContact: { id: "c-2-1", name: "Robert Chen", email: "r.chen@github.com", isPrimary: true }
  },
  {
    id: "p-3",
    domain: "smashingmagazine.com",
    dr: 88,
    traffic: 2100000,
    spam: "2%",
    category: "Marketing",
    status: "Ready",
    enrichmentStatus: "Full",
    listId: "l-2",
    aiOpener: "Hello Vitaly, my latest responsive typography case-study aligns perfectly with Smashing Magazine's CSS layout standard specifications.",
    contacts: [
      { id: "c-3-1", name: "Vitaly Friedman", email: "vitaly@smashingmagazine.com", isPrimary: true },
      { id: "c-3-2", name: "Article Submissions", email: "ideas@smashingmagazine.com", isPrimary: false }
    ],
    primaryContact: { id: "c-3-1", name: "Vitaly Friedman", email: "vitaly@smashingmagazine.com", isPrimary: true }
  },
  {
    id: "p-4",
    domain: "searchenginejournal.com",
    dr: 82,
    traffic: 1800000,
    spam: "3%",
    category: "SEO & Ads",
    status: "New",
    enrichmentStatus: "SEO",
    listId: "l-3",
    aiOpener: "",
    contacts: [], // Empty to show "no contact, then a button to enrich it"
    primaryContact: null
  },
  {
    id: "p-5",
    domain: "hubspot.com",
    dr: 0, // Un-enriched initially (dr 0, traffic 0)
    traffic: 0,
    spam: "—",
    category: "Marketing",
    status: "New",
    enrichmentStatus: "None",
    listId: "unassigned",
    aiOpener: "",
    contacts: [], // empty contact
    primaryContact: null
  },
  {
    id: "p-6",
    domain: "backlinko.com",
    dr: 75,
    traffic: 890000,
    spam: "2%",
    category: "SEO & Ads",
    status: "Enriched",
    enrichmentStatus: "Contacts",
    listId: "l-2",
    aiOpener: "Hey Brian, your skyscraper backlink guide remains the absolute golden standard in SEO frameworks.",
    contacts: [
      { id: "c-6-1", name: "Brian Dean", email: "brian@backlinko.com", isPrimary: true }
    ],
    primaryContact: { id: "c-6-1", name: "Brian Dean", email: "brian@backlinko.com", isPrimary: true }
  },
  {
    id: "p-7",
    domain: "fastcompany.com",
    dr: 91,
    traffic: 11000000,
    spam: "1%",
    category: "Business",
    status: "Ready",
    enrichmentStatus: "Full",
    listId: "l-4",
    aiOpener: "Hi Alice, your piece on design innovation in remote-first startup systems is highly inspiring.",
    contacts: [
      { id: "c-7-1", name: "Alice Jenkins", email: "alice@fastcompany.com", isPrimary: true },
      { id: "c-7-2", name: "Pitches Inbox", email: "pitches@fastcompany.com", isPrimary: false }
    ],
    primaryContact: { id: "c-7-1", name: "Alice Jenkins", email: "alice@fastcompany.com", isPrimary: true }
  },
  {
    id: "p-8",
    domain: "notion.so",
    dr: 0, // Un-enriched
    traffic: 0,
    spam: "—",
    category: "Technology",
    status: "New",
    enrichmentStatus: "None",
    listId: "unassigned",
    aiOpener: "",
    contacts: [],
    primaryContact: null
  }
];

export function ClientsView() {
  // Main Prospects state
  const [prospects, setProspects] = useState<ProspectItem[]>([]);
  
  // Lists tags linked dynamically (from localStorage "link_pro_prospect_lists" or fallback)
  const [prospectLists, setProspectLists] = useState<any[]>(DEFAULT_STATIC_LISTS);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [listFilter, setListFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [enrichmentFilter, setEnrichmentFilter] = useState("All");
  const [contactFilter, setContactFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  
  // Detailed Drawer Modal Target
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // Interactive Adding State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [assignList, setAssignList] = useState("unassigned");

  // Local feedback mechanism
  const [toast, setToast] = useState<string | null>(null);

  // Loading animation trackers
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<"seo" | "contact" | null>(null);

  // Prompt based AI search mode state
  const [isAiSearchMode, setIsAiSearchMode] = useState(false);
  const [aiPromptQuery, setAiPromptQuery] = useState("");
  const [appliedAiPrompt, setAppliedAiPrompt] = useState("");

  // New Contact input states inside detail drawer
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  // Reset page position when filters are modified to prevent index out of bounds
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, listFilter, statusFilter, enrichmentFilter, contactFilter, appliedAiPrompt, isAiSearchMode]);

  // Load Initial Prospects Data
  useEffect(() => {
    // Prospects local storage
    const savedProspects = localStorage.getItem("link_pro_all_prospects");
    if (savedProspects) {
      try {
        setProspects(JSON.parse(savedProspects));
      } catch (e) {
        setProspects(DEFAULT_REALISTIC_PROSPECTS);
      }
    } else {
      setProspects(DEFAULT_REALISTIC_PROSPECTS);
      localStorage.setItem("link_pro_all_prospects", JSON.stringify(DEFAULT_REALISTIC_PROSPECTS));
    }

    // Attempt to load associated prospect lists so filters match available workspaces
    const savedLists = localStorage.getItem("link_pro_prospect_lists");
    if (savedLists) {
      try {
        const parsed = JSON.parse(savedLists);
        if (parsed && parsed.length > 0) {
          setProspectLists(parsed);
        }
      } catch (e) {
        setProspectLists(DEFAULT_STATIC_LISTS);
      }
    }
  }, []);

  // Helper persistence writer
  const persistProspects = (data: ProspectItem[]) => {
    setProspects(data);
    localStorage.setItem("link_pro_all_prospects", JSON.stringify(data));
  };

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Calculate dynamic statistics for the top cards
  const stats = useMemo(() => {
    const total = prospects.length;
    const enriched = prospects.filter(p => p.enrichmentStatus === "Full" || p.enrichmentStatus === "SEO").length;
    const contactsCount = prospects.filter(p => p.contacts.length > 0).length;
    const readyCount = prospects.filter(p => p.status === "Ready").length;
    const inCampaignCount = prospects.filter(p => p.status === "In Campaign").length;

    return { total, enriched, contactsCount, readyCount, inCampaignCount };
  }, [prospects]);

  // 2. Filter prospects based on Prompt AI search + standard filters
  const filteredProspects = useMemo(() => {
    let items = [...prospects];

    // Standard Name/Domain manual input Search
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      items = items.filter(p => p.domain.toLowerCase().includes(q));
    }

    // AI Semantic Prompt search processing (natural matching engine)
    if (isAiSearchMode && appliedAiPrompt.trim() !== "") {
      const pText = appliedAiPrompt.toLowerCase().trim();

      // Check DR conditions
      const drUpMatch = pText.match(/(?:dr|rating)\s*(?:above|>|greater than|>=|\+)\s*([0-9]+)/i);
      if (drUpMatch) {
         const drVal = parseInt(drUpMatch[1], 10);
         items = items.filter(item => item.dr >= drVal);
      } else {
         const drDownMatch = pText.match(/(?:dr|rating)\s*(?:below|<|less than)\s*([0-9]+)/i);
         if (drDownMatch) {
           const drVal = parseInt(drDownMatch[1], 10);
           items = items.filter(item => item.dr > 0 && item.dr <= drVal);
         }
      }

      // Check contact existence conditions
      if (pText.includes("no contact") || pText.includes("without contact") || pText.includes("missing email")) {
        items = items.filter(item => item.contacts.length === 0);
      } else if (pText.includes("has contact") || pText.includes("with email") || pText.includes("contacted")) {
        items = items.filter(item => item.contacts.length > 0);
      }

      // Check categories
      if (pText.includes("tech") || pText.includes("technology")) {
        items = items.filter(item => item.category.toLowerCase().includes("tech"));
      } else if (pText.includes("market") || pText.includes("marketing")) {
        items = items.filter(item => item.category.toLowerCase().includes("market"));
      } else if (pText.includes("seo") || pText.includes("ads")) {
        items = items.filter(item => item.category.toLowerCase().includes("seo"));
      } else if (pText.includes("business") || pText.includes("finance")) {
        items = items.filter(item => item.category.toLowerCase().includes("business") || item.category.toLowerCase().includes("finance"));
      }

      // Check status filters
      if (pText.includes("ready")) {
        items = items.filter(item => item.status === "Ready");
      } else if (pText.includes("campaign")) {
        items = items.filter(item => item.status === "In Campaign");
      } else if (pText.includes("enriched")) {
        items = items.filter(item => item.enrichmentStatus === "Full");
      } else if (pText.includes("new")) {
        items = items.filter(item => item.status === "New");
      }
    }

    // Dropdown: List Filter
    if (listFilter !== "All") {
      items = items.filter(p => p.listId === listFilter);
    }

    // Dropdown: Status Filter  
    if (statusFilter !== "All") {
      items = items.filter(p => p.status === statusFilter);
    }

    // Dropdown: Enrichment Type filter
    if (enrichmentFilter !== "All") {
      if (enrichmentFilter === "Full") {
        items = items.filter(p => p.enrichmentStatus === "Full");
      } else if (enrichmentFilter === "SEO") {
        items = items.filter(p => p.enrichmentStatus === "SEO");
      } else if (enrichmentFilter === "Contacts") {
        items = items.filter(p => p.enrichmentStatus === "Contacts");
      } else if (enrichmentFilter === "None") {
        items = items.filter(p => p.enrichmentStatus === "None");
      }
    }

    // Dropdown: Contact Filter
    if (contactFilter !== "All") {
      if (contactFilter === "With Contacts") {
        items = items.filter(p => p.contacts.length > 0);
      } else {
        items = items.filter(p => p.contacts.length === 0);
      }
    }

    return items;
  }, [prospects, searchTerm, appliedAiPrompt, isAiSearchMode, listFilter, statusFilter, enrichmentFilter, contactFilter]);

  // Paginated slice
  const paginatedProspects = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProspects.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProspects, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProspects.length / itemsPerPage) || 1;
  }, [filteredProspects.length, itemsPerPage]);

  // Dynamic page buttons renderer
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  // Bulk selector handlers
  const toggleAll = () => {
    const allActive = paginatedProspects.length > 0 && paginatedProspects.every(p => selectedIds[p.id]);
    
    const updated = { ...selectedIds };
    if (!allActive) {
      paginatedProspects.forEach(p => {
        updated[p.id] = true;
      });
    } else {
      paginatedProspects.forEach(p => {
        updated[p.id] = false;
      });
    }
    setSelectedIds(updated);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get active selected count
  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  // Find currently active detail profile
  const activeDetailRecord = useMemo(() => {
    return prospects.find(p => p.id === activeDetailId) || null;
  }, [prospects, activeDetailId]);

  // Action: Add manual new Domain prospect 
  const handleAddNewProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      showToastMsg("Domain Name is required.");
      return;
    }

    const cleanDomain = newDomain.trim().toLowerCase().replace(/https?:\/\//, "").split("/")[0];
    
    // Duplicate check
    if (prospects.some(p => p.domain.toLowerCase() === cleanDomain)) {
      showToastMsg(`Prospect with domain '${cleanDomain}' already exists!`);
      return;
    }

    const newItem: ProspectItem = {
      id: `p-custom-${Date.now()}`,
      domain: cleanDomain,
      dr: 0,
      traffic: 0,
      spam: "—",
      category: newCategory,
      status: "New",
      enrichmentStatus: "None",
      listId: assignList,
      aiOpener: "",
      contacts: [],
      primaryContact: null
    };

    persistProspects([newItem, ...prospects]);
    setNewDomain("");
    setShowAddModal(false);
    showToastMsg(`Registered new prospect: ${cleanDomain}!`);
  };

  // Action: Delete a single prospect out of list
  const handleDeleteProspect = (id: string, domain: string) => {
    const updated = prospects.filter(p => p.id !== id);
    persistProspects(updated);
    if (activeDetailId === id) {
      setActiveDetailId(null);
    }
    showToastMsg(`Removed prospect ${domain} from index.`);
  };

  // Action: Move Selected dynamic list changes
  const handleBatchAssignList = (listId: string) => {
    if (selectedCount === 0) return;
    const updated = prospects.map(p => {
      if (selectedIds[p.id]) {
        return { ...p, listId };
      }
      return p;
    });
    persistProspects(updated);
    setSelectedIds({});
    const listLabel = listId === "unassigned" ? "Unassigned Pool" : (prospectLists.find(l => l.id === listId)?.name || "Target List");
    showToastMsg(`Moved ${selectedCount} prospects into ${listLabel}.`);
  };

  // Action: SEO Enrich execution (Individual trigger with realistic 1s load timer)
  const runSeoEnrichment = (id: string) => {
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    setLoadingRowId(id);
    setLoadingType("seo");

    setTimeout(() => {
      const generatedDr = target.dr > 0 ? target.dr : Math.floor(Math.random() * 35) + 60; // 60-95 DR
      const generatedTraffic = target.traffic > 0 ? target.traffic : Math.floor(Math.random() * 150000) + 12000; // 12K-162K
      const generatedSpam = target.spam !== "—" ? target.spam : `${Math.floor(Math.random() * 4) + 1}%`;

      const updated = prospects.map(p => {
        if (p.id === id) {
          const nextEnrichment: ProspectItem["enrichmentStatus"] = p.enrichmentStatus === "Contacts" ? "Full" : "SEO";
          return {
            ...p,
            dr: generatedDr,
            traffic: generatedTraffic,
            spam: generatedSpam,
            status: p.status === "New" ? "Enriched" : p.status,
            enrichmentStatus: nextEnrichment
          };
        }
        return p;
      });

      persistProspects(updated);
      setLoadingRowId(null);
      setLoadingType(null);
      showToastMsg(`Successfully enriched SEO authority metrics for ${target.domain}!`);
    }, 1000);
  };

  // Action: Contact Enrich execution with automatic primary generation
  const runContactEnrichment = (id: string) => {
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    setLoadingRowId(id);
    setLoadingType("contact");

    setTimeout(() => {
      const domainNameClean = target.domain.replace(".com", "").replace(".org", "").replace(".io", "");
      const formattedName = domainNameClean.charAt(0).toUpperCase() + domainNameClean.slice(1);
      
      const emailHost = target.domain;
      const generatedContacts: ContactItem[] = [
        { id: `c-gen-${Date.now()}-1`, name: `Marcus Fletcher`, email: `m.fletcher@${emailHost}`, isPrimary: true },
        { id: `c-gen-${Date.now()}-2`, name: `Editorial Team`, email: `editor@${emailHost}`, isPrimary: false },
        { id: `c-gen-${Date.now()}-3`, name: `Press Outreach`, email: `press@${emailHost}`, isPrimary: false }
      ];

      const updated = prospects.map(p => {
        if (p.id === id) {
          const nextEnrichment: ProspectItem["enrichmentStatus"] = p.enrichmentStatus === "SEO" ? "Full" : "Contacts";
          return {
            ...p,
            contacts: generatedContacts,
            primaryContact: generatedContacts[0],
            status: p.status === "New" ? "Enriched" : p.status,
            enrichmentStatus: nextEnrichment,
            aiOpener: p.aiOpener || `Hi Marcus Fletcher, really loved the content focus of your team at ${formattedName}! Let's talk content collaboration.`
          };
        }
        return p;
      });

      persistProspects(updated);
      setLoadingRowId(null);
      setLoadingType(null);
      showToastMsg(`Found ${generatedContacts.length} verified email targets for ${target.domain}!`);
    }, 1000);
  };

  // Action: Run batch SEO and Contact enrichment on all selected items
  const runBatchEnrichment = () => {
    if (selectedCount === 0) return;
    
    showToastMsg(`Starting automated pipeline enrichment for ${selectedCount} target domains...`);
    
    // Simulate active queue processing
    const updated = prospects.map(p => {
      if (selectedIds[p.id]) {
        const hasSeo = p.dr > 0;
        const finalDr = hasSeo ? p.dr : Math.floor(Math.random() * 30) + 55;
        const finalTraffic = hasSeo ? p.traffic : Math.floor(Math.random() * 80000) + 5000;
        const finalSpam = p.spam !== "—" ? p.spam : "1%";
        
        const hasContacts = p.contacts.length > 0;
        let generatedConts = [...p.contacts];
        let primaryC = p.primaryContact;

        if (!hasContacts) {
          generatedConts = [
            { id: `c-batch-${p.id}-1`, name: `Alex Vance`, email: `editor@${p.domain}`, isPrimary: true }
          ];
          primaryC = generatedConts[0];
        }

        return {
          ...p,
          dr: finalDr,
          traffic: finalTraffic,
          spam: finalSpam,
          contacts: generatedConts,
          primaryContact: primaryC,
          enrichmentStatus: "Full" as const,
          status: p.status === "New" ? "Enriched" : p.status,
          aiOpener: p.aiOpener || `Hi Alex, loved your recent coverage on ${p.domain}! Quick question about your resource pages.`
        };
      }
      return p;
    });

    setTimeout(() => {
      persistProspects(updated);
      setSelectedIds({});
      showToastMsg(`Completed bulk diagnostic crawl! All selected domains fully enriched.`);
    }, 1500);
  };

  // Change primary contact inside detail panel
  const handleSelectPrimaryContact = (contactId: string) => {
    if (!activeDetailId || !activeDetailRecord) return;

    const updatedContacts = activeDetailRecord.contacts.map(c => ({
      ...c,
      isPrimary: c.id === contactId
    }));
    const newPrimary = updatedContacts.find(c => c.isPrimary) || null;

    const updated = prospects.map(p => {
      if (p.id === activeDetailId) {
        return {
          ...p,
          contacts: updatedContacts,
          primaryContact: newPrimary
        };
      }
      return p;
    });

    persistProspects(updated);
    showToastMsg(`Marked ${newPrimary?.name} as the primary outreach contact receiver.`);
  };

  // Add manually customized contact item
  const handleAddManualContactObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailId || !activeDetailRecord) return;
    if (!newContactName.trim() || !newContactEmail.trim()) {
      showToastMsg("Name and email are required to append a new contact record.");
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(newContactEmail.trim())) {
      showToastMsg("Please provide a valid structured email address.");
      return;
    }

    const isFirstContact = activeDetailRecord.contacts.length === 0;
    const newC: ContactItem = {
      id: `c-manual-added-${Date.now()}`,
      name: newContactName.trim(),
      email: newContactEmail.trim().toLowerCase(),
      isPrimary: isFirstContact // automatically primary if first the list
    };

    const updatedContacts = [...activeDetailRecord.contacts, newC];
    const updated = prospects.map(p => {
      if (p.id === activeDetailId) {
        return {
          ...p,
          contacts: updatedContacts,
          primaryContact: isFirstContact ? newC : p.primaryContact,
          enrichmentStatus: p.enrichmentStatus === "None" ? "Contacts" : (p.enrichmentStatus === "SEO" ? "Full" : p.enrichmentStatus)
        };
      }
      return p;
    });

    persistProspects(updated);
    setNewContactName("");
    setNewContactEmail("");
    showToastMsg(`Appended new contact: ${newC.name}!`);
  };

  // Delete specific contact from the drawer list
  const handleDeleteContactFromList = (contactId: string) => {
    if (!activeDetailId || !activeDetailRecord) return;

    const filtered = activeDetailRecord.contacts.filter(c => c.id !== contactId);
    let nextPrimary = activeDetailRecord.primaryContact;

    // Reset primary check if the deleted was primary
    if (activeDetailRecord.primaryContact?.id === contactId) {
      if (filtered.length > 0) {
        filtered[0].isPrimary = true;
        nextPrimary = filtered[0];
      } else {
        nextPrimary = null;
      }
    }

    const updated = prospects.map(p => {
      if (p.id === activeDetailId) {
        return {
          ...p,
          contacts: filtered,
          primaryContact: nextPrimary,
          enrichmentStatus: filtered.length === 0 ? (p.enrichmentStatus === "Full" ? "SEO" : "None") : p.enrichmentStatus
        };
      }
      return p;
    });

    persistProspects(updated);
    showToastMsg("Contact details card destroyed.");
  };

  // Modify opener prompt
  const handleUpdateOpenerText = (text: string) => {
    if (!activeDetailId) return;
    const updated = prospects.map(p => {
      if (p.id === activeDetailId) {
        return { ...p, aiOpener: text };
      }
      return p;
    });
    persistProspects(updated);
  };

  // Modify prospect status from the drawer
  const handleUpdateProspectStatus = (statusValue: ProspectItem["status"]) => {
    if (!activeDetailId) return;
    const updated = prospects.map(p => {
      if (p.id === activeDetailId) {
        return { ...p, status: statusValue };
      }
      return p;
    });
    persistProspects(updated);
    showToastMsg(`Updated status to ${statusValue}!`);
  };

  const executeAiPromptFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedAiPrompt(aiPromptQuery);
    showToastMsg(`Simulated AI semantic filter executed for prompt: "${aiPromptQuery}"`);
  };

  // Quick Action AI Templates helpers
  const handleSetQuickAiPrompt = (promptText: string) => {
    setAiPromptQuery(promptText);
    setAppliedAiPrompt(promptText);
    showToastMsg(`Applying smart filter: "${promptText}"`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12" id="all-prospects-view-root">
      
      {/* 1. Page Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs" id="prospects-main-header">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            <span>Link Pro</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-teal-600">Prospects</span>
          </div>
          <h1 className="text-2xl font-sans font-black text-[#0b1c30] tracking-tight mt-1 flex items-center gap-2">
            Prospects
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
            Review, enrich, qualify, and prepare prospects before adding them to outreach campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Add Prospect Action Trigger */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-4 py-2.5 bg-[#0d9488] hover:bg-[#008276] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect Domain</span>
          </button>
          
          <button
            onClick={() => {
              setProspects(DEFAULT_REALISTIC_PROSPECTS);
              localStorage.setItem("link_pro_all_prospects", JSON.stringify(DEFAULT_REALISTIC_PROSPECTS));
              setSelectedIds({});
              setAppliedAiPrompt("");
              setAiPromptQuery("");
              setSearchTerm("");
              setListFilter("All");
              setStatusFilter("All");
              setEnrichmentFilter("All");
              setContactFilter("All");
              showToastMsg("Database reset to pristine default prospects dataset.");
            }}
            className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            title="Restore default domains"
          >
            Restore Pool
          </button>
        </div>
      </div>

      {/* 2. Numerical Row of 5 Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="all-prospects-metrics-grid">
        {/* TOTAL PROSPECTS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center justify-between" id="metric-total-prospects">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans block">Total Prospects</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-550 flex items-center justify-center">
            <Globe className="w-5 h-5 text-slate-500" />
          </div>
        </div>

        {/* ENRICHED */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center justify-between" id="metric-enriched">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans block">Enriched SEO</span>
            <span className="text-3xl font-extrabold text-[#006056] mt-1 block">{stats.enriched}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50/70 text-teal-650 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-teal-500" />
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center justify-between" id="metric-contacts">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans block">Contacts Found</span>
            <span className="text-3xl font-extrabold text-indigo-700 mt-1 block">{stats.contactsCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50/65 text-indigo-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

        {/* READY */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center justify-between" id="metric-ready">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans block">Ready Status</span>
            <span className="text-3xl font-extrabold text-emerald-800 mt-1 block">{stats.readyCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* IN CAMPAIGN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs flex items-center justify-between col-span-2 md:col-span-1" id="metric-incampaign">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans block">In Campaign</span>
            <span className="text-3xl font-extrabold text-amber-700 mt-1 block">{stats.inCampaignCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-amber-550" />
          </div>
        </div>
      </div>

      {/* 3. Search Mode Selectors & Dynamic Prompt AI Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="search-filter-hub">
        
        {/* Toggle between Keyword search and AI Prompt search */}
        <div className="flex border-b border-slate-100 bg-slate-50/40 p-2 gap-2">
          <button
            onClick={() => {
              setIsAiSearchMode(false);
              setAppliedAiPrompt("");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              !isAiSearchMode ? "bg-white text-slate-800 shadow-xs border border-slate-200" : "text-slate-450 hover:text-slate-700"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Standard Domain Filter</span>
          </button>
          
          <button
            onClick={() => setIsAiSearchMode(true)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              isAiSearchMode ? "bg-teal-500 text-white shadow-md" : "text-[#008276] bg-teal-50/50 hover:bg-teal-50 hover:text-[#005049]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Search Copilot</span>
          </button>
        </div>

        {/* Search & AI Inputs Body */}
        <div className="p-5 space-y-4">
          {!isAiSearchMode ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by typing domain name (e.g. techcrunch.com)..."
                  className="w-full bg-slate-50 border border-slate-250/70 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-medium"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs font-bold transition-all"
                >
                  Clear Clear
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <form onSubmit={executeAiPromptFilter} className="flex gap-2">
                <div className="relative flex-1">
                  <Sparkles className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={aiPromptQuery}
                    onChange={(e) => setAiPromptQuery(e.target.value)}
                    placeholder="Describe what domains to look for (e.g., 'high dr domains with no contacts', 'tech category above 80 DR', 'sites in campaign')..."
                    className="w-full bg-teal-50/10 border-2 border-teal-500/20 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-teal-600 hover:bg-[#008276] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm cursor-pointer transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>Query AI</span>
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                </button>
              </form>

              {/* Instant suggested templates */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Suggested Prompts:</span>
                <button
                  onClick={() => handleSetQuickAiPrompt("high dr domains with no contacts")}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 rounded-md transition-all cursor-pointer"
                >
                  "No contacts identified"
                </button>
                <button
                  onClick={() => handleSetQuickAiPrompt("technology category above 85 DR")}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-teal-50 border border-teal-100 text-[#006056] hover:bg-teal-100 rounded-md transition-all cursor-pointer"
                >
                  "Tech above 85 DR"
                </button>
                <button
                  onClick={() => handleSetQuickAiPrompt("ready status without emails")}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 rounded-md transition-all cursor-pointer"
                >
                  "Ready but missing emails"
                </button>
                <button
                  onClick={() => {
                    setAppliedAiPrompt("");
                    setAiPromptQuery("");
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-red-500 hover:bg-rose-50 rounded-md transition-all cursor-pointer ml-auto flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Prompt</span>
                </button>
              </div>

              {appliedAiPrompt && (
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#006a61]">
                    <Sparkles className="w-3.5 h-3.5 fill-teal-500 text-teal-600" />
                    <span>AI Engine Filtering active for: <strong className="font-extrabold italic bg-teal-100/50 px-1.5 py-0.5 rounded">&quot;{appliedAiPrompt}&quot;</strong></span>
                  </div>
                  <span className="font-bold text-slate-400 text-[10px]">Found {filteredProspects.length} matches</span>
                </div>
              )}
            </div>
          )}

          {/* Core filters bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100" id="secondary-filter-selectors">
            {/* Filter by assigned list */}
            <div>
              <label className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5">Grouping List</label>
              <div className="relative">
                <select
                  value={listFilter}
                  onChange={(e) => setListFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer appearance-none"
                >
                  <option value="All">List: All Workspaces</option>
                  <option value="unassigned">List: Unassigned Pool</option>
                  {prospectLists.map(l => (
                    <option key={l.id} value={l.id}>List: {l.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Campaign Outreach pipeline status */}
            <div>
              <label className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5">Outreach Stage</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer appearance-none"
                >
                  <option value="All">Status: All</option>
                  <option value="New">Status: New Prospect</option>
                  <option value="Enriched">Status: Enriched</option>
                  <option value="Ready">Status: Ready</option>
                  <option value="In Campaign">Status: In Campaign</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Enrichment condition */}
            <div>
              <label className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5">Crawl Enrichment</label>
              <div className="relative">
                <select
                  value={enrichmentFilter}
                  onChange={(e) => setEnrichmentFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer appearance-none"
                >
                  <option value="All">Enrichment: All</option>
                  <option value="None">Enrichment: Not Enriched</option>
                  <option value="Full">Enrichment: Fully Enriched</option>
                  <option value="SEO">Enrichment: SEO Metrics only</option>
                  <option value="Contacts">Enrichment: Contacts only</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter by contact presence */}
            <div>
              <label className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Availability</label>
              <div className="relative">
                <select
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer appearance-none"
                >
                  <option value="All">Contact: All</option>
                  <option value="With Contacts">Contact: With Emails</option>
                  <option value="No Contacts">Contact: No Contacts</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Batch selected control action drawer */}
      {selectedCount > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-slate-750 animate-slide-up" id="batch-actions-bar">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping shrink-0" />
            <span className="text-xs font-sans font-bold">
              Selected <strong className="text-teal-400 text-sm font-black">{selectedCount}</strong> items for workflow processing
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Batch Enrichment */}
            <button
              onClick={runBatchEnrichment}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 font-bold rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all text-white cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Full Batch Enrich ({selectedCount})</span>
            </button>

            {/* Move selected to List dropdown */}
            <div className="relative group">
              <button
                className="px-4 py-2 bg-slate-800 hover:bg-slate-755 font-bold rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all text-slate-200 cursor-pointer border border-slate-700"
              >
                <span>Move to Group...</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <div className="hidden group-hover:block absolute bottom-full mb-1 right-0 w-56 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                <div className="p-2 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Assign List Target
                </div>
                {prospectLists.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleBatchAssignList(l.id)}
                    className="w-full text-left p-2 hover:bg-slate-750 hover:text-white transition-all text-xs font-semibold"
                  >
                    {l.name}
                  </button>
                ))}
                <button
                  onClick={() => handleBatchAssignList("unassigned")}
                  className="w-full text-left p-2 hover:bg-slate-750 hover:text-red-400 border-t border-slate-700 transition-all text-xs font-semibold text-slate-400"
                >
                  Leave Unassigned Pool
                </button>
              </div>
            </div>

            {/* Batch Clear selection button */}
            <button
              onClick={() => setSelectedIds({})}
              className="px-3.5 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Prospects Table Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="prospects-main-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" id="prospects-interactive-grid">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-250/70 text-slate-500 font-bold uppercase text-[10px] select-none">
                <th className="p-4 pl-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedProspects.length > 0 && paginatedProspects.every(p => selectedIds[p.id])}
                    onChange={toggleAll}
                    className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer accent-[#0d9488]"
                  />
                </th>
                <th className="p-4 font-extrabold text-slate-700">Domain / Authority</th>
                <th className="p-4 text-center font-extrabold text-[#006056] w-20">DR</th>
                <th className="p-4 text-center font-extrabold text-slate-700 w-28">Traffic (S)</th>
                <th className="p-4 text-center font-extrabold text-slate-700 w-20">Spam Score</th>
                <th className="p-4 font-extrabold text-slate-700">Primary Contact</th>
                <th className="p-4 text-center font-extrabold text-slate-700 w-28">Status</th>
                <th className="p-4 font-extrabold text-slate-700 hidden lg:table-cell max-w-[200px]">AI Opener Preview</th>
                <th className="p-4 pr-6 text-center font-extrabold text-teal-700 w-44">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-150 font-medium text-slate-650">
              {paginatedProspects.length > 0 ? (
                paginatedProspects.map((site) => {
                  const isChecked = !!selectedIds[site.id];
                  const hasSeoEnrichmentObj = site.enrichmentStatus === "SEO" || site.enrichmentStatus === "Full";
                  const hasContactEnrichmentObj = site.enrichmentStatus === "Contacts" || site.enrichmentStatus === "Full";

                  // Match list tag
                  const activeListLabel = site.listId === "unassigned" 
                    ? "Unassigned" 
                    : (prospectLists.find(l => l.id === site.listId)?.name || "Assigned List");

                  return (
                    <tr 
                      key={site.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isChecked ? "bg-teal-50/10" : ""}`}
                    >
                      {/* Checkbox column */}
                      <td className="p-4 pl-6 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRowSelection(site.id)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer accent-[#0d9488]"
                        />
                      </td>

                      {/* Domain column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setActiveDetailId(site.id);
                              // Reset contact manual fields
                              setNewContactName("");
                              setNewContactEmail("");
                            }}
                            className="text-slate-900 font-sans font-black hover:text-teal-600 transition-colors text-right relative inline-flex items-center text-sm cursor-pointer"
                          >
                            <span>{site.domain}</span>
                          </button>
                          
                          <a
                            href={`https://${site.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-350 hover:text-teal-600 cursor-pointer inline-block shrink-0"
                            title="Open site directly in new window"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        
                        {/* Tags under domain of Category & Specific Project List */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="bg-slate-100 text-slate-650 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap">
                            {site.category}
                          </span>
                          
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            site.listId === "unassigned" 
                              ? "bg-slate-100 text-slate-400 text-[9px]" 
                              : "bg-teal-50 text-[#006056] border border-teal-100 font-bold"
                          }`}>
                            {activeListLabel}
                          </span>
                        </div>
                      </td>

                      {/* DR column */}
                      <td className="p-4 text-center">
                        {hasSeoEnrichmentObj ? (
                          <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${
                            site.dr >= 90 ? "bg-teal-100 text-[#005049] border border-teal-200" : "bg-slate-100 text-slate-850"
                          }`}>
                            {site.dr}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-sans">⊘</span>
                        )}
                      </td>

                      {/* Traffic column */}
                      <td className="p-4 text-center font-mono text-slate-700 font-bold">
                        {hasSeoEnrichmentObj ? (
                          site.traffic >= 1000000 
                            ? `${(site.traffic / 1000000).toFixed(1)}M` 
                            : `${Math.round(site.traffic / 1000)}K`
                        ) : (
                          <span className="text-slate-300 font-sans">⊘</span>
                        )}
                      </td>

                      {/* Spam rating column */}
                      <td className="p-4 text-center">
                        {hasSeoEnrichmentObj ? (
                          <span className={`text-[10px] font-bold ${
                            parseInt(site.spam) > 5 ? "text-rose-600" : "text-green-600"
                          }`}>
                            {site.spam}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-sans">⊘</span>
                        )}
                      </td>

                      {/* Primary Contact details column */}
                      <td className="p-4">
                        {site.primaryContact ? (
                          <div className="space-y-0.5 text-slate-800">
                            <div className="font-bold flex items-center gap-1">
                              <span className="truncate max-w-[120px] inline-block">{site.primaryContact.name}</span>
                              <span className="bg-emerald-50 text-emerald-800 font-black text-[8px] px-1.5 py-0.2 rounded uppercase">Primary</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[150px]" title={site.primaryContact.email}>
                              {site.primaryContact.email}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start space-y-1">
                            <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                              <CircleAlert className="w-3 h-3 text-rose-500" />
                              <span>No Contact</span>
                            </span>
                            {/* Contact enrich fast trigger */}
                            <button
                              onClick={() => runContactEnrichment(site.id)}
                              className="text-[10px] text-teal-600 hover:text-teal-800 hover:underline transition-colors font-bold tracking-tight cursor-pointer"
                              title="Search verified contact names & emails"
                            >
                              + Run Discovery
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status column */}
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.8 rounded-full border ${
                          site.status === "New" ? "bg-slate-100 text-slate-650 border-slate-200" :
                          site.status === "Enriched" ? "bg-blue-50 text-blue-800 border-blue-150" :
                          site.status === "Ready" ? "bg-emerald-50 text-emerald-800 border-emerald-150" :
                          "bg-amber-50 text-amber-800 border-amber-150"
                        }`}>
                          {site.status}
                        </span>
                      </td>

                      {/* AI Opener Preview column - hidden on small tablets */}
                      <td className="p-4 hidden lg:table-cell max-w-[200px]" title={site.aiOpener}>
                        {site.aiOpener ? (
                          <span className="text-[11px] text-slate-500 font-medium italic line-clamp-2 max-w-[180px] leading-snug">
                            &ldquo;{site.aiOpener}&rdquo;
                          </span>
                        ) : (
                          <span className="text-slate-350 text-[10px] italic">Not enriched yet</span>
                        )}
                      </td>

                      {/* Action buttons list */}
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Standard details drawer opener */}
                          <button
                            onClick={() => {
                              setActiveDetailId(site.id);
                              // Reset contact manual fields
                              setNewContactName("");
                              setNewContactEmail("");
                            }}
                            className="p-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-550 hover:text-slate-800 transition-all cursor-pointer"
                            title="Edit Contacts & details"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          {/* SEO Enrich trigger inside row */}
                          <button
                            disabled={loadingRowId === site.id}
                            onClick={() => runSeoEnrichment(site.id)}
                            className={`px-2 py-1 border rounded-lg text-[10.5px] font-bold transition-all ${
                              hasSeoEnrichmentObj 
                                ? "border-slate-100 bg-slate-50 text-slate-450 hover:bg-slate-100" 
                                : "border-teal-150 text-[#0d9488] hover:bg-[#0d9488] hover:text-white"
                            }`}
                            title="Re-run SEO crawl on this domain"
                          >
                            {loadingRowId === site.id && loadingType === "seo" ? (
                              <Loader2 className="w-3 h-3 animate-spin mx-auto text-teal-600" />
                            ) : (
                              hasSeoEnrichmentObj ? "SEO Enriched" : "SEO Enrich"
                            )}
                          </button>

                          {/* Contact enrichment trigger inside row */}
                          <button
                            disabled={loadingRowId === site.id}
                            onClick={() => runContactEnrichment(site.id)}
                            className={`px-2 py-1 border rounded-lg text-[10.5px] font-bold transition-all ${
                              hasContactEnrichmentObj 
                                ? "border-slate-150 bg-slate-55 hover:bg-slate-100 text-slate-500" 
                                : "bg-teal-50 border-[#0d9488] text-[#0d9488] hover:bg-[#008276] hover:text-white"
                            }`}
                            title="Find validated emails list"
                          >
                            {loadingRowId === site.id && loadingType === "contact" ? (
                              <Loader2 className="w-3 h-3 animate-spin mx-auto text-teal-600" />
                            ) : (
                              hasContactEnrichmentObj ? "Contacts Enriched" : "Contact Enrich"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-slate-400 bg-white leading-normal" id="no-matching-data">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-[#0b1c30] font-sans font-black text-sm">No prospects found matching targets</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Adjust your Standard filter selectors or reset the AI Search Copilot queries back to the clean defaults pool!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation Footer */}
        <div className="border-t border-slate-150 bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="prospects-pagination-footer">
          <div className="flex flex-wrap items-center gap-4 text-slate-550 text-xs text-slate-500 font-semibold">
            <span>
              Showing <strong className="text-slate-800 font-bold">{(filteredProspects.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0)}</strong> to <strong className="text-slate-800 font-bold">{Math.min(currentPage * itemsPerPage, filteredProspects.length)}</strong> of <strong className="text-slate-800 font-bold">{filteredProspects.length}</strong> prospects
            </span>

            <div className="flex items-center gap-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="text-slate-400 font-semibold">Per Page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 select-none font-sans font-semibold">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-slate-200 flex items-center justify-center transition-all ${
                currentPage === 1 
                  ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-350" 
                  : "bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-900 cursor-pointer"
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-2 text-slate-400 text-xs text-center font-bold">
                    ...
                  </span>
                );
              }

              const num = Number(pageNum);
              const isActive = num === currentPage;

              return (
                <button
                  key={`page-btn-${num}`}
                  onClick={() => setCurrentPage(num)}
                  className={`min-w-8 h-8 px-2.5 flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? "bg-teal-600 text-white shadow-xs font-black" 
                      : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900"
                  }`}
                >
                  {num}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-slate-200 flex items-center justify-center transition-all ${
                currentPage === totalPages 
                  ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-350" 
                  : "bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-900 cursor-pointer"
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Detail slide-over drawer panel widget */}
      {activeDetailId && activeDetailRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-[100] animate-fade-in" id="drawer-backdrop">
          <div 
            className="bg-white w-full max-w-2xl h-screen flex flex-col shadow-2xl relative animate-slide-left overflow-y-auto"
            id="drawer-surface"
          >
            
            {/* Drawer Header Panel */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 sticky top-0 bg-white z-20 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#006a61] uppercase font-bold block">Prospect Diagnostic Panel</span>
                <h3 className="text-lg font-sans font-black text-slate-900 mt-1 flex items-center gap-1.5">
                  <Globe className="w-5 h-5 text-slate-500" />
                  <span>{activeDetailRecord.domain}</span>
                </h3>
              </div>
              
              <button
                onClick={() => {
                  setActiveDetailId(null);
                  setNewContactName("");
                  setNewContactEmail("");
                }}
                className="p-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all font-bold cursor-pointer text-xs flex items-center gap-1"
                title="Discard drawer panel"
              >
                <X className="w-4 h-4" />
                <span>Save & Close</span>
              </button>
            </div>

            {/* Drawer Body Area */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              
              {/* Quick Status and Group Allocation */}
              <div className="grid grid-cols-2 gap-4 bg-teal-50/30 p-4 rounded-xl border border-teal-100/50">
                <div>
                  <label className="block text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Group List</label>
                  <div className="relative">
                    <select
                      value={activeDetailRecord.listId}
                      onChange={(e) => {
                        const updated = prospects.map(p => {
                          if (p.id === activeDetailRecord.id) {
                            return { ...p, listId: e.target.value };
                          }
                          return p;
                        });
                        persistProspects(updated);
                        showToastMsg(`Prospect moved list category.`);
                      }}
                      className="w-full bg-white border border-slate-200 text-slate-700 font-bold p-2 rounded-lg text-xs cursor-pointer focus:outline-none focus:border-teal-500 appearance-none"
                    >
                      <option value="unassigned">Unassigned Pool</option>
                      {prospectLists.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1">Qualify Stage</label>
                  <div className="relative">
                    <select
                      value={activeDetailRecord.status}
                      onChange={(e) => handleUpdateProspectStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 text-slate-700 font-bold p-2 rounded-lg text-xs cursor-pointer focus:outline-none focus:border-teal-500 appearance-none"
                    >
                      <option value="New">New Prospect</option>
                      <option value="Enriched">Enriched</option>
                      <option value="Ready">Ready for Outreach</option>
                      <option value="In Campaign">In Campaign</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Core SEO Authority metrics card */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-sans font-black text-slate-800 uppercase tracking-widest">Authority Metrics</h4>
                  <button
                    disabled={loadingRowId === activeDetailRecord.id}
                    onClick={() => runSeoEnrichment(activeDetailRecord.id)}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Recheck SEO stats</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-center">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-450 uppercase">Domain Rating (DR)</span>
                    <span className="block text-lg font-black text-slate-800 mt-1">
                      {activeDetailRecord.dr > 0 ? activeDetailRecord.dr : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-450 uppercase">Monthly Traffic</span>
                    <span className="block text-lg font-black text-slate-800 mt-1">
                      {activeDetailRecord.dr > 0 
                        ? (activeDetailRecord.traffic >= 1000000 
                            ? `${(activeDetailRecord.traffic / 1000000).toFixed(1)}M` 
                            : `${Math.round(activeDetailRecord.traffic / 100).toFixed(0)}K`)
                        : "—"
                      }
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-450 uppercase">Spam Score</span>
                    <span className={`block text-lg font-black mt-1 ${
                      activeDetailRecord.dr > 0 && parseInt(activeDetailRecord.spam) > 5 ? "text-rose-600" : "text-emerald-700"
                    }`}>
                      {activeDetailRecord.dr > 0 ? activeDetailRecord.spam : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. Emails & Verified Contacts Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-sans font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Contact Directory</span>
                  </h4>
                  <span className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold font-mono text-[10px]">
                    {activeDetailRecord.contacts.length} Record(s) found
                  </span>
                </div>

                {/* Simulated No Contact state with dynamic "enrich" button */}
                {activeDetailRecord.contacts.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-3">
                    <CircleAlert className="w-8 h-8 text-rose-500 mx-auto" />
                    <div>
                      <h5 className="font-extrabold text-[#0b1c30]">No verified contact details identified</h5>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">Please run out contact finder crawler engine or dynamically upload a manually discovered email.</p>
                    </div>
                    
                    {/* Enrich Button */}
                    <button
                      type="button"
                      disabled={loadingRowId === activeDetailRecord.id}
                      onClick={() => runContactEnrichment(activeDetailRecord.id)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-90 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 mx-auto"
                    >
                      {loadingRowId === activeDetailRecord.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                      )}
                      <span>Enrich Contact Details</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10.5px] text-slate-400">
                      Select which identified lead serves as the **Primary Contact** receiver for automatic email outboxes.
                    </p>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {activeDetailRecord.contacts.map((c) => (
                        <div 
                          key={c.id}
                          className={`p-3 border rounded-xl flex items-center justify-between gap-3 transition-all ${
                            c.isPrimary ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Option checklist to change primary */}
                            <button
                              onClick={() => handleSelectPrimaryContact(c.id)}
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                c.isPrimary ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                              }`}
                            >
                              {c.isPrimary && <Check className="w-2.5 h-2.5" />}
                            </button>

                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-2">
                                <span>{c.name}</span>
                                {c.isPrimary && (
                                  <span className="bg-emerald-100 text-emerald-800 font-black text-[8px] px-1.5 py-0.2 rounded-md uppercase">Primary</span>
                                )}
                              </div>
                              <span className="text-[10.5px] text-slate-400 font-mono mt-0.5 block">{c.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Make primary manual click pill */}
                            {!c.isPrimary && (
                              <button
                                onClick={() => handleSelectPrimaryContact(c.id)}
                                className="px-2 py-1 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-white rounded"
                              >
                                Set Primary
                              </button>
                            )}

                            {/* Delete Contact action */}
                            <button
                              onClick={() => handleDeleteContactFromList(c.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Delete contact entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick enrich simulation button */}
                    <button
                      type="button"
                      onClick={() => runContactEnrichment(activeDetailRecord.id)}
                      className="text-[10px] text-teal-600 font-bold hover:underline py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 fill-teal-500 text-teal-600" />
                      <span>Re-enrich Contacts list (Simulate Fresh Discovery)</span>
                    </button>
                  </div>
                )}

                {/* Add Custom manual contact form inside drawer */}
                <form onSubmit={handleAddManualContactObj} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                  <div className="font-bold text-[#0b1c30]">Add Custom Recipient manually</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Amanda Ross"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. editor@domain.com"
                        value={newContactEmail}
                        onChange={(e) => setNewContactEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-850 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    + Append Recipient Record
                  </button>
                </form>
              </div>

              {/* 8. AI Outreach Personalization Panel */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-sans font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>AI Generated Pitch Opener</span>
                </h4>

                {activeDetailRecord.aiOpener ? (
                  <div className="space-y-2">
                    <p className="text-[10.5px] text-slate-400">
                      The SEO agent automatically extracted this personalized greeting from the domain's RSS feeds & site headers:
                    </p>
                    <textarea
                      value={activeDetailRecord.aiOpener}
                      onChange={(e) => handleUpdateOpenerText(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-sans leading-relaxed focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100"
                    />
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeDetailRecord.aiOpener);
                          showToastMsg("Copied opening sentence to clipboard!");
                        }}
                        className="px-3 py-1 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 text-xs text-slate-500 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy opener</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-slate-500 leading-normal">
                      No personalized intro generated. Run contact enrichment to automatically scan current editor publications!
                    </p>
                    <button
                      type="button"
                      disabled={loadingRowId === activeDetailRecord.id}
                      onClick={() => runContactEnrichment(activeDetailRecord.id)}
                      className="px-3 py-1.5 bg-teal-50 border border-teal-150 text-[#0d9488] font-bold text-[10px] rounded hover:bg-[#008276] hover:text-white transition-all cursor-pointer"
                    >
                      Process AI Personalizer
                    </button>
                  </div>
                )}
              </div>

              {/* Delete / Archive button */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span>
                  <strong className="text-slate-400 text-[10px] uppercase">Unique identifier:</strong>
                  <code className="bg-slate-100 text-slate-500 rounded font-mono px-1 py-0.5 ml-1 text-[10px]">{activeDetailRecord.id}</code>
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to completely erase this prospect domain out of the index database?")) {
                      handleDeleteProspect(activeDetailRecord.id, activeDetailRecord.domain);
                    }
                  }}
                  className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Permanently Delete Prospect</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 9. Manual Creation Dialogue Dialogue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-modal-backdrop">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-scale-up" id="add-modal-surface">
            <button
              onClick={() => setShowAddModal(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-sans font-black text-slate-900 flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-teal-600" />
              <span>Register Prospect Domain</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-normal mb-4">
              Provision a new domain candidate. You can trigger crawlers later to populate Domain Rating (DR), monthly organic traffic, spam signals, and editorial email contact records.
            </p>

            <form onSubmit={handleAddNewProspect} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Domain Name / Publisher URL *</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. webdesignledger.com"
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl p-3 focus:outline-none focus:border-teal-500 font-bold text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Grouping Category (Niche)</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none cursor-pointer"
                >
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="SEO & Ads">SEO & Ads</option>
                  <option value="Business">Business</option>
                  <option value="Finance">Finance</option>
                  <option value="News & Media">News & Media</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Assign to Workspace List</label>
                <select
                  value={assignList}
                  onChange={(e) => setAssignList(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none cursor-pointer"
                >
                  <option value="unassigned">Leave Unassigned Pool</option>
                  {prospectLists.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-50 text-slate-500 font-bold rounded-xl"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#008276] text-white font-bold rounded-xl shadow-sm text-center cursor-pointer"
                >
                  Add Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating interactive screen response Toast notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[210] bg-slate-900 border border-slate-750/70 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-slide-up max-w-sm">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{toast}</span>
          <button 
            type="button" 
            onClick={() => setToast(null)} 
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
