"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AgencyBrandingView } from "./agency-branding-view";
import { AutomatedReportsConfigView } from "./automated-reports-config-view";
import { WorkReportsConsoleView } from "./work-reports-console-view";
import { MasterBuiltLinksView } from "./master-built-links-view";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Mail,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Send,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Download,
  Filter,
  Check,
  X,
  RefreshCw,
  MoreVertical
} from "lucide-react";

// --- TYPES ---
export interface Client {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Inactive";
  company: string;
  createdAt: string;
}

export interface OrderedLink {
  id: string;
  anchorText: string;
  prospectName: string;
  referringUrl: string;
  quantity: number;
  status: "PENDING" | "COMPLETED";
}

export interface BuiltLink {
  id: string;
  orderId: string;
  anchorText: string;
  referringUrl: string;
  destination: string;
  price: string;
  status: "LINKED" | "PENDING" | "REJECTED";
  date: string;
  comment: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  type: "PACKAGE" | "MONTHLY";
  quantity: number;
  status: "PENDING" | "COMPLETED";
  orderedAt: string;
  notes: string;
  orderedLinks: OrderedLink[];
}

export interface Message {
  id: string;
  orderId: string;
  clientId: string;
  sender: "You" | "Client";
  text: string;
  timestamp: string;
}

// --- INITIAL DEFAULT DATA ---
const DEFAULT_CLIENTS: Client[] = [
  {
    id: "client-yovi",
    name: "Yovi",
    email: "yayovi8299@getasail.com",
    username: "yovi_agency",
    role: "Agency Client",
    status: "Active",
    company: "Yovi Outreach Group",
    createdAt: "2026-05-10"
  },
  {
    id: "client-gedimo",
    name: "Gedimo",
    email: "gedimo9087@getasail.com",
    username: "gedimo_seo",
    role: "Agency Client",
    status: "Active",
    company: "Gedimo Marketing",
    createdAt: "2026-05-18"
  },
  {
    id: "client-ynk4iurp",
    name: "ynk4iurp",
    email: "ynk4iurp37@yzcalo.com",
    username: "ynk4_client",
    role: "Agency Client",
    status: "Active",
    company: "Ynk Software INC",
    createdAt: "2026-06-01"
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "6a23c770f538292a28f14c65",
    clientId: "client-yovi",
    clientName: "Yovi",
    name: "Demo order",
    type: "PACKAGE",
    quantity: 2,
    status: "PENDING",
    orderedAt: "June 06, 2026",
    notes: "Please target technology and SaaS sectors with High DR.",
    orderedLinks: [
      { id: "ol-1", anchorText: "read", prospectName: "-", referringUrl: "https://read.com", quantity: 1, status: "PENDING" },
      { id: "ol-2", anchorText: "hello", prospectName: "-", referringUrl: "https://hello.com", quantity: 1, status: "PENDING" }
    ]
  },
  {
    id: "6a0ae66157efb8e7ba6c966e",
    clientId: "client-yovi",
    clientName: "Yovi",
    name: "order 2",
    type: "MONTHLY",
    quantity: 1,
    status: "COMPLETED",
    orderedAt: "May 18, 2026",
    notes: "asdf",
    orderedLinks: [
      { id: "ol-3", anchorText: "hello", prospectName: "Prospect List 1 - KW", referringUrl: "https://www.hellop.com", quantity: 1, status: "COMPLETED" }
    ]
  },
  {
    id: "6a0ae55157efb8e7ba6c955d",
    clientId: "client-yovi",
    clientName: "Yovi",
    name: "order 1",
    type: "PACKAGE",
    quantity: 2,
    status: "COMPLETED",
    orderedAt: "May 18, 2026",
    notes: "Fast delivery requested",
    orderedLinks: [
      { id: "ol-4", anchorText: "Test", prospectName: "Outreach 2", referringUrl: "https://www.test.com", quantity: 2, status: "COMPLETED" }
    ]
  },
  {
    id: "g-order-1",
    clientId: "client-gedimo",
    clientName: "Gedimo",
    name: "SaaS Premium Post",
    type: "PACKAGE",
    quantity: 1,
    status: "PENDING",
    orderedAt: "June 02, 2026",
    notes: "Finance keyword target Link Profile",
    orderedLinks: [
      { id: "ol-5", anchorText: "growth", prospectName: "-", referringUrl: "https://saas-growth.com", quantity: 1, status: "PENDING" }
    ]
  },
  {
    id: "y-order-1",
    clientId: "client-ynk4iurp",
    clientName: "ynk4iurp",
    name: "Enterprise Booster",
    type: "MONTHLY",
    quantity: 1,
    status: "COMPLETED",
    orderedAt: "May 28, 2026",
    notes: "Tech post with custom anchor",
    orderedLinks: [
      { id: "ol-6", anchorText: "software", prospectName: "-", referringUrl: "https://ynk4iurp-tech.com", quantity: 1, status: "COMPLETED" }
    ]
  }
];

const DEFAULT_BUILT_LINKS: BuiltLink[] = [
  {
    id: "bl-1",
    orderId: "6a0ae66157efb8e7ba6c966e",
    anchorText: "Test",
    referringUrl: "https://www.test.com",
    destination: "https://clarionledger.com",
    price: "$100",
    status: "LINKED",
    date: "20 days ago (May 20th 26)",
    comment: "Verified index status active"
  },
  {
    id: "bl-2",
    orderId: "6a0ae66157efb8e7ba6c966e",
    anchorText: "Hello",
    referringUrl: "https://www.hellop.com",
    destination: "https://www.hellop.com",
    price: "$200",
    status: "LINKED",
    date: "23 days ago (May 18th 26)",
    comment: "Verified live and cached"
  },
  {
    id: "bl-3",
    orderId: "6a0ae66157efb8e7ba6c966e",
    anchorText: "Do",
    referringUrl: "https://www.do.com",
    destination: "https://www.do.com",
    price: "$120",
    status: "LINKED",
    date: "23 days ago (May 18th 26)",
    comment: "Contextual paragraph updated"
  },
  {
    id: "bl-4",
    orderId: "6a0ae66157efb8e7ba6c966e",
    anchorText: "Read",
    referringUrl: "https://read.com",
    destination: "N/A",
    price: "N/A",
    status: "PENDING",
    date: "N/A",
    comment: "Pitched writer"
  },
  {
    id: "bl-5",
    orderId: "6a0ae66157efb8e7ba6c966e",
    anchorText: "Hello",
    referringUrl: "https://hello.com",
    destination: "N/A",
    price: "N/A",
    status: "PENDING",
    date: "N/A",
    comment: "Waiting live editor checkout"
  },
  {
    id: "bl-6",
    orderId: "6a0ae55157efb8e7ba6c955d",
    anchorText: "Test",
    referringUrl: "https://www.test.com",
    destination: "https://uprankly.com",
    price: "$150",
    status: "LINKED",
    date: "25 days ago (May 16th 26)",
    comment: "Verified anchor details"
  },
  {
    id: "bl-7",
    orderId: "y-order-1",
    anchorText: "software",
    referringUrl: "https://ynk4iurp-tech.com",
    destination: "https://ynk4iurp37.com",
    price: "$180",
    status: "LINKED",
    date: "14 days ago",
    comment: "Excellent high-relevance post"
  }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    orderId: "6a0ae66157efb8e7ba6c966e",
    clientId: "client-yovi",
    sender: "You",
    text: "Hi yovi",
    timestamp: "2026-05-18T14:30:00.000Z"
  },
  {
    id: "msg-2",
    orderId: "6a0ae66157efb8e7ba6c966e",
    clientId: "client-yovi",
    sender: "Client",
    text: "Received. Thank you for the quick updates!",
    timestamp: "2026-05-18T15:02:00.000Z"
  }
];

export function ClientManagementView() {
  // --- STATES ---
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [builtLinks, setBuiltLinks] = useState<BuiltLink[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Base tabs: "clients" | "built-links" | "orders" | "reports" | "automated-reports" | "branding" | "messages"
  const [activeTab, setActiveTab] = useState<"clients" | "built-links" | "orders" | "reports" | "automated-reports" | "branding" | "messages">("clients");

  // Drilled client state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  // Nested view tabs: "orders" | "links"
  const [clientSubTab, setClientSubTab] = useState<"orders" | "links">("orders");
  // Active selected order details
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [linksOrderFilter, setLinksOrderFilter] = useState("All");
  const [linksUrlFilter, setLinksUrlFilter] = useState("");
  const [linksStatusFilter, setLinksStatusFilter] = useState("All");

  // Creation State modals
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showAddBuiltLink, setShowAddBuiltLink] = useState(false);

  // Form Inputs
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientUsername, setNewClientUsername] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [newClientRole, setNewClientRole] = useState("Agency Client");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Order Creation inputs
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderClientId, setNewOrderClientId] = useState("");
  const [newOrderType, setNewOrderType] = useState<"PACKAGE" | "MONTHLY">("PACKAGE");
  const [newOrderNotes, setNewOrderNotes] = useState("");
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderAnchors, setNewOrderAnchors] = useState("hello, read");

  // Built Link Creation inputs
  const [newLinkAnchor, setNewLinkAnchor] = useState("");
  const [newLinkRefUrl, setNewLinkRefUrl] = useState("");
  const [newLinkDestination, setNewLinkDestination] = useState("");
  const [newLinkPrice, setNewLinkPrice] = useState("$150");
  const [newLinkStatus, setNewLinkStatus] = useState<"LINKED" | "PENDING" | "REJECTED">("LINKED");
  const [newLinkComment, setNewLinkComment] = useState("");

  // Chat/Messages Floating Popover
  const [chattingLink, setChattingLink] = useState<BuiltLink | null>(null);
  const [chatMessageText, setChatMessageText] = useState("");

  // Action Menu dropdown indices
  const [clientMenuOpen, setClientMenuOpen] = useState<string | null>(null);
  const [masterOrderMenuOpen, setMasterOrderMenuOpen] = useState<string | null>(null);

  // Feedback notifications
  const [toast, setToast] = useState<string | null>(null);

  // Reports Preview State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState<Order | null>(null);

  // --- BRANDING SYSTEM STATES ---
  const [agencyName, setAgencyName] = useState("uprankly SEO Agency");
  const [agencySlogan, setAgencySlogan] = useState("White-label Premium Link Building Suite");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80");
  const [accentColor, setAccentColor] = useState("#0d9488");
  const [smtpName, setSmtpName] = useState("uprankly Outbox <no-reply@uprankly-agency.com>");
  const [supportEmail, setSupportEmail] = useState("success@uprankly-agency.com");
  const [portalTheme, setPortalTheme] = useState("modern-teal");
  const [customWelcomeMsg, setCustomWelcomeMsg] = useState("Welcome back to your real-time backlinks reporting panel.");

  // --- AUTOMATED REPORTS CONFIG STATES ---
  const [dispatchSchedule, setDispatchSchedule] = useState("Monthly");
  const [autoTriggerOnComplete, setAutoTriggerOnComplete] = useState(true);
  const [notifyOnStatusChange, setNotifyOnStatusChange] = useState(false);
  const [emailTemplateText, setEmailTemplateText] = useState("Hi {CLIENT_NAME},\n\nWe have compiled and completed {LINKS_COUNT} authority backlink placements for your campaign under Order ID: {ORDER_ID}.\n\nYou can access your fully indexed white-label SEO report live here:\n- Portal Address: uprankly-agency.com/dashboard/p/{CLIENT_ID}\n\nOur crawling bots regularly ping these URLs to monitor referring status and cached dates.\n\nWarm regards,\n{AGENCY_NAME} Team");
  const [dispatchLogs, setDispatchLogs] = useState([
    { id: "log-1", clientName: "Yovi", orderName: "Demo order", recipient: "yayovi8299@getasail.com", date: "June 01, 2026", status: "SENT_SUCCESS", trigger: "SCHEDULED_RUN" },
    { id: "log-2", clientName: "Gedimo", orderName: "SaaS Premium Post", recipient: "gedimo9087@getasail.com", date: "May 28, 2026", status: "SENT_SUCCESS", trigger: "MANUAL_DISPATCH" }
  ]);

  // --- WORK REPORTS GENERAL CONSOLE FILTER ---
  const [reportsSelectedClient, setReportsSelectedClient] = useState<string>("");
  const [reportsSelectedOrder, setReportsSelectedOrder] = useState<string>("");
  const [reportsCustomComment, setReportsCustomComment] = useState("");
  const [reportsKpiToggles, setReportsKpiToggles] = useState({
    anchorAnalysis: true,
    drDistribution: true,
    spentMetrics: true,
    backlinkIndexPercentage: true
  });

  // Built links interactive verification loading
  const [verifyingLinkId, setVerifyingLinkId] = useState<string | null>(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    const savedClients = localStorage.getItem("uprankly_agency_clients");
    const savedOrders = localStorage.getItem("uprankly_agency_orders");
    const savedLinks = localStorage.getItem("uprankly_agency_links");
    const savedMsg = localStorage.getItem("uprankly_agency_messages");

    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients(DEFAULT_CLIENTS);
      localStorage.setItem("uprankly_agency_clients", JSON.stringify(DEFAULT_CLIENTS));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(DEFAULT_ORDERS);
      localStorage.setItem("uprankly_agency_orders", JSON.stringify(DEFAULT_ORDERS));
    }

    if (savedLinks) {
      setBuiltLinks(JSON.parse(savedLinks));
    } else {
      setBuiltLinks(DEFAULT_BUILT_LINKS);
      localStorage.setItem("uprankly_agency_links", JSON.stringify(DEFAULT_BUILT_LINKS));
    }

    if (savedMsg) {
      setMessages(JSON.parse(savedMsg));
    } else {
      setMessages(DEFAULT_MESSAGES);
      localStorage.setItem("uprankly_agency_messages", JSON.stringify(DEFAULT_MESSAGES));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // --- PERSISTENCE WRITERS ---
  const saveClientsToDb = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem("uprankly_agency_clients", JSON.stringify(newClients));
  };

  const saveOrdersToDb = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("uprankly_agency_orders", JSON.stringify(newOrders));
    if (selectedOrder) {
      const updatedSel = newOrders.find(o => o.id === selectedOrder.id);
      if (updatedSel) setSelectedOrder(updatedSel);
    }
  };

  const saveLinksToDb = (newLinks: BuiltLink[]) => {
    setBuiltLinks(newLinks);
    localStorage.setItem("uprankly_agency_links", JSON.stringify(newLinks));
  };

  const saveMessagesToDb = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("uprankly_agency_messages", JSON.stringify(newMsgs));
  };

  // --- ACTIONS ---
  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail || !newClientUsername) {
      triggerToast("Please fill out all required Client fields.");
      return;
    }

    const newC: Client = {
      id: `client-${Date.now()}`,
      name: newClientName.trim(),
      email: newClientEmail.trim(),
      username: newClientUsername.trim(),
      status: "Active",
      role: newClientRole,
      company: newClientCompany.trim() || `${newClientName.trim()} Marketing`,
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveClientsToDb([...clients, newC]);
    setNewClientName("");
    setNewClientEmail("");
    setNewClientUsername("");
    setNewClientPassword("");
    setNewClientCompany("");
    setShowAddClient(false);
    triggerToast(`Successfully added new client account: ${newC.name}`);
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnPQRSTUVWXYZ123456789!@#$%^*";
    let generatedPass = "";
    for (let i = 0; i < 10; i++) {
      generatedPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewClientPassword(generatedPass);
    setShowPassword(true);
    triggerToast("Generated secure random password.");
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (!window.confirm(`Are you sure you want to delete client ${clientName}? This will clear associated records.`)) return;
    const nextClients = clients.filter(c => c.id !== clientId);
    const nextOrders = orders.filter(o => o.clientId !== clientId);
    saveClientsToDb(nextClients);
    saveOrdersToDb(nextOrders);
    triggerToast(`Deleted ${clientName} along with associated projects.`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedClientId = newOrderClientId || (selectedClient ? selectedClient.id : "");
    if (!assignedClientId || !newOrderName) {
      triggerToast("An order name and assigned client are required.");
      return;
    }

    const assignedClient = clients.find(c => c.id === assignedClientId);
    const clientLabel = assignedClient ? assignedClient.name : "Client";

    const anchorList = newOrderAnchors.split(",").map((t, idx) => ({
      id: `ol-gen-${Date.now()}-${idx}`,
      anchorText: t.trim() || "anchor",
      prospectName: "-",
      referringUrl: `https://${(t.trim() || "link").toLowerCase().replace(/[^a-z0-9]/g, "") || "refer"}.com`,
      quantity: 1,
      status: "PENDING" as const
    }));

    const newOrd: Order = {
      id: `order-${Math.random().toString(16).substring(2, 10)}${Date.now().toString().substring(8)}`,
      clientId: assignedClientId,
      clientName: clientLabel,
      name: newOrderName,
      type: newOrderType,
      quantity: newOrderQty || anchorList.length,
      status: "PENDING",
      orderedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      notes: newOrderNotes.trim() || "-",
      orderedLinks: anchorList
    };

    saveOrdersToDb([...orders, newOrd]);
    setNewOrderName("");
    setNewOrderNotes("");
    setNewOrderQty(1);
    setNewOrderAnchors("hello, read");
    setShowAddOrder(false);
    triggerToast(`Manual order registered: ${newOrd.name} for ${clientLabel}. No payment gateway triggered.`);
  };

  const handleAddBuiltLinkAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newLinkAnchor || !newLinkRefUrl) {
      triggerToast("An anchor text and referring URL are required.");
      return;
    }

    const newBl: BuiltLink = {
      id: `bl-gen-${Date.now()}`,
      orderId: selectedOrder.id,
      anchorText: newLinkAnchor.trim(),
      referringUrl: newLinkRefUrl.trim(),
      destination: newLinkDestination.trim() || "-",
      price: newLinkPrice,
      status: newLinkStatus,
      date: "Today",
      comment: newLinkComment.trim() || "Added via admin panel"
    };

    saveLinksToDb([...builtLinks, newBl]);
    setNewLinkAnchor("");
    setNewLinkRefUrl("");
    setNewLinkDestination("");
    setNewLinkComment("");
    setShowAddBuiltLink(false);
    triggerToast("Manual built link registration complete.");
  };

  const handleToggleOrderedLinkStatus = (linkId: string) => {
    if (!selectedOrder) return;
    const nextOrders = orders.map(ord => {
      if (ord.id === selectedOrder.id) {
        const nextLinks = ord.orderedLinks.map(lk => {
          if (lk.id === linkId) {
            return { ...lk, status: lk.status === "PENDING" ? "COMPLETED" : "PENDING" as any };
          }
          return lk;
        });
        const isAllDone = nextLinks.every(lk => lk.status === "COMPLETED");
        return {
          ...ord,
          orderedLinks: nextLinks,
          status: isAllDone ? "COMPLETED" : "PENDING" as any
        };
      }
      return ord;
    });

    saveOrdersToDb(nextOrders);
    triggerToast("Updated ordered link status.");
  };

  const handleUpdateOrderStatus = (status: "PENDING" | "COMPLETED") => {
    if (!selectedOrder) return;
    const nextOrders = orders.map(ord => {
      if (ord.id === selectedOrder.id) {
        return { ...ord, status };
      }
      return ord;
    });
    saveOrdersToDb(nextOrders);
    triggerToast(`Order status marked as ${status}`);
  };

  const sendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !chattingLink) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      orderId: chattingLink.orderId,
      clientId: selectedClient ? selectedClient.id : "client-yovi",
      sender: "You",
      text: chatMessageText.trim(),
      timestamp: new Date().toISOString()
    };

    const nextMsgs = [...messages, newMsg];
    saveMessagesToDb(nextMsgs);
    setChatMessageText("");

    // Automated simulated interactive client reply 1 sec later
    setTimeout(() => {
      const autoReply: Message = {
        id: `msg-reply-${Date.now()}`,
        orderId: chattingLink.orderId,
        clientId: selectedClient ? selectedClient.id : "client-yovi",
        sender: "Client",
        text: `Got your note regarding the link built at "${chattingLink.anchorText}". We will verify the cached status instantly.`,
        timestamp: new Date().toISOString()
      };
      saveMessagesToDb([...nextMsgs, autoReply]);
    }, 1100);
  };

  // --- BRANDING, LINKS & AUTOMATION ACTION HANDLERS ---
  const handleVerifySingleLink = (linkId: string) => {
    setVerifyingLinkId(linkId);
    setTimeout(() => {
      const nextLinks = builtLinks.map(bl => {
        if (bl.id === linkId) {
          return {
            ...bl,
            status: "LINKED" as const,
            comment: `Verified Live & Indexed (Pinged Today)`
          };
        }
        return bl;
      });
      saveLinksToDb(nextLinks);
      setVerifyingLinkId(null);
      triggerToast("Google Index Bot verified link placement. Response code: 200 OK.");
    }, 800);
  };

  const handleVerifyAllLinks = () => {
    triggerToast("Crawl engine started. Contacting global private index proxies...");
    setTimeout(() => {
      const nextLinks = builtLinks.map(bl => ({
        ...bl,
        status: "LINKED" as const,
        comment: "Bulk bot verified Live and Indexed"
      }));
      saveLinksToDb(nextLinks);
      triggerToast("Crawl complete. Verified all referred URLs. All placements active!");
    }, 1200);
  };

  const handleTestDispatchReport = (cName: string, oId: string) => {
    const matchedClient = clients.find(c => c.name === cName) || clients[0];
    const clientLabel = matchedClient ? matchedClient.name : cName;
    const clientEmailSelected = matchedClient ? matchedClient.email : "client@domain.com";
    const orderObj = orders.find(o => o.id === oId) || orders[0];
    const orderLabel = orderObj ? orderObj.name : "SEO Campaign Deluxe";

    triggerToast(`[SMTP Server] Synthesizing white-label mail envelope for ${clientLabel}...`);
    
    setTimeout(() => {
      const newLog = {
        id: `log-gen-${Date.now()}`,
        clientName: clientLabel,
        orderName: orderLabel,
        recipient: clientEmailSelected,
        date: "Just Now",
        status: "SENT_SUCCESS",
        trigger: "MANUAL_DISPATCH"
      };
      setDispatchLogs(prev => [newLog, ...prev]);
      triggerToast(`Report successfully dispatched to ${clientEmailSelected} using White-label outbox!`);
    }, 1300);
  };

  // --- STATS COMPUTATIONS ---
  const clientsWithOrders = useMemo(() => {
    return clients.map(cl => {
      const clientOrders = orders.filter(o => o.clientId === cl.id);
      return {
        ...cl,
        ordersCount: clientOrders.length
      };
    });
  }, [clients, orders]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientsWithOrders;
    const q = searchQuery.toLowerCase();
    return clientsWithOrders.filter(
      cl => cl.name.toLowerCase().includes(q) || cl.email.toLowerCase().includes(q) || cl.company.toLowerCase().includes(q)
    );
  }, [clientsWithOrders, searchQuery]);

  const clientsOrderCountObj = useMemo(() => {
    const totalCount = orders.length;
    const pendingCount = orders.filter(o => o.status === "PENDING").length;
    const completedCount = orders.filter(o => o.status === "COMPLETED").length;
    return { totalCount, pendingCount, completedCount };
  }, [orders]);

  // Specific client active orders
  const clientSpecificOrders = useMemo(() => {
    if (!selectedClient) return [];
    return orders.filter(o => o.clientId === selectedClient.id);
  }, [selectedClient, orders]);

  const filteredClientOrders = useMemo(() => {
    const records = clientSpecificOrders;
    if (!orderQuery.trim()) return records;
    const q = orderQuery.toLowerCase();
    return records.filter(o => o.name.toLowerCase().includes(q) || o.id.includes(q));
  }, [clientSpecificOrders, orderQuery]);

  // Specific client active links
  const clientSpecificLinks = useMemo(() => {
    if (!selectedClient) return [];
    const clientOrderIds = orders.filter(o => o.clientId === selectedClient.id).map(o => o.id);
    return builtLinks.filter(bl => clientOrderIds.includes(bl.orderId));
  }, [selectedClient, orders, builtLinks]);

  const filteredClientLinks = useMemo(() => {
    let items = clientSpecificLinks;
    if (linksOrderFilter !== "All") {
      items = items.filter(l => l.orderId === linksOrderFilter);
    }
    if (linksUrlFilter.trim() !== "") {
      const q = linksUrlFilter.toLowerCase();
      items = items.filter(l => l.referringUrl.toLowerCase().includes(q) || l.anchorText.toLowerCase().includes(q));
    }
    if (linksStatusFilter !== "All") {
      items = items.filter(l => l.status === linksStatusFilter);
    }
    return items;
  }, [clientSpecificLinks, linksOrderFilter, linksUrlFilter, linksStatusFilter]);

  // Messages thread filter
  const chattingMessages = useMemo(() => {
    if (!chattingLink) return [];
    return messages.filter(m => m.orderId === chattingLink.orderId);
  }, [chattingLink, messages]);

  const clientUnreadMessagesCount = (clientId: string) => {
    const thread = messages.filter(m => m.clientId === clientId);
    return thread.length; // Simulate all messages counts
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-[#0b1c30]">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-400 uppercase tracking-widest">
            <span>Link Pro</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0d9488]">Clients</span>
          </div>
          <h1 className="text-2xl font-sans font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Account Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Register white-label clients, customize security passwords, generate work reports, and manually add orders.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddClient(true)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#0d9488] hover:bg-[#007a6e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Main Toast Widget */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#006a61] text-white px-5 py-3.5 rounded-xl shadow-2xl text-xs font-semibold z-50 animate-slide-up flex items-stretch gap-2 border border-teal-500 max-w-md">
          <Sparkles className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Only render Top Master Navigation Tabs if no specific client is currently drilled */}
      {!selectedClient ? (
        <div className="space-y-6">
          {/* Top Master Navigation Bar */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "clients" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clients List ({clients.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("built-links")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "built-links" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Built Links Registry ({builtLinks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "orders" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Master Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "reports" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Work Reports</span>
            </button>
            <button
              onClick={() => setActiveTab("automated-reports")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "automated-reports" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Automated Reports</span>
            </button>
            <button
              onClick={() => setActiveTab("branding")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "branding" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Branding Setup</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "messages" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mailbox Center ({messages.length})</span>
            </button>
          </div>

          {/* MASTER VIEW ROUNTING */}
          {activeTab === "clients" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search client Name, Email or company..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#0d9488]/10 focus:border-[#0d9488] transition-all"
                  />
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Showing {filteredClients.length} of {clients.length} Clients
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-sans font-black text-slate-450 uppercase tracking-wider">
                      <th className="py-3 px-5 text-center w-4">
                        <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer" />
                      </th>
                      <th className="py-3.5 px-5">Name</th>
                      <th className="py-3.5 px-5">Orders</th>
                      <th className="py-3.5 px-5">Email</th>
                      <th className="py-3.5 px-5">Role</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors text-xs font-medium">
                        <td className="py-3 px-5 text-center">
                          <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                              {client.name.substring(0, 2)}
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  setSelectedClient(client);
                                  setClientSubTab("orders");
                                  setSelectedOrder(null);
                                }}
                                className="font-sans font-extrabold text-slate-800 hover:text-[#0d9488] hover:underline transition-colors block text-left"
                              >
                                {client.name}
                              </button>
                              <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{client.company}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setClientSubTab("orders");
                              setSelectedOrder(null);
                            }}
                            className="bg-slate-100 text-slate-705 px-2.5 py-1 rounded-md hover:bg-[#edf4fc] hover:text-[#0d9488] transition-colors font-mono font-extrabold"
                          >
                            {client.ordersCount}
                          </button>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-semibold font-sans">{client.email}</td>
                        <td className="py-3.5 px-5">
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase border border-blue-100">
                            {client.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right relative">
                          <button
                            onClick={() => setClientMenuOpen(clientMenuOpen === client.id ? null : client.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {clientMenuOpen === client.id && (
                            <div className="absolute right-5 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-xl z-25 py-1 text-left animate-fade-in font-semibold">
                              <button
                                onClick={() => {
                                  setClientMenuOpen(null);
                                  setSelectedClient(client);
                                  setClientSubTab("orders");
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Orders</span>
                              </button>
                              <button
                                onClick={() => {
                                  setClientMenuOpen(null);
                                  const tempPassword = Math.random().toString(36).slice(-8);
                                  alert(`Password reset code for ${client.name} has been completed! Password generated: "${tempPassword}". (No email actually sent by this mock module).`);
                                  triggerToast(`Password reset completed for ${client.name}.`);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Reset Password</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => {
                                  setClientMenuOpen(null);
                                  handleDeleteClient(client.id, client.name);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Delete Client</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredClients.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                          No agency clients matched search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0d9488]" />
                  <span>Master Orders List Registry</span>
                </h2>
                <button
                  onClick={() => setShowAddOrder(true)}
                  className="px-3.5 py-2 bg-slate-105 hover:bg-[#edf4fc] text-[#006a61] text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Master Order</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-sans font-black text-slate-455 uppercase tracking-wider">
                      <th className="py-3 px-5">Order ID / Name</th>
                      <th className="py-3 px-5">Agency Client Name</th>
                      <th className="py-3 px-5">Links Require</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Ordered At</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors text-xs font-medium">
                        <td className="py-3 px-5">
                          <div>
                            <button
                              onClick={() => {
                                const parentClient = clients.find(c => c.id === ord.clientId);
                                if (parentClient) {
                                  setSelectedClient(parentClient);
                                  setClientSubTab("orders");
                                  setSelectedOrder(ord);
                                } else {
                                  triggerToast("Parent client account missing.");
                                }
                              }}
                              className="font-sans font-extrabold text-slate-800 hover:text-[#0d9488] hover:underline"
                            >
                              {ord.name}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono font-semibold block mt-1">{ord.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 font-bold text-slate-600">{ord.clientName}</td>
                        <td className="py-3 px-5 font-mono font-bold text-[#0d9488]">{ord.quantity} links</td>
                        <td className="py-3 px-5">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            ord.status === "COMPLETED" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-slate-500 font-semibold">{ord.orderedAt}</td>
                        <td className="py-3 px-5 text-right relative">
                          <button
                            onClick={() => setMasterOrderMenuOpen(masterOrderMenuOpen === ord.id ? null : ord.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-404 hover:text-slate-700 rounded-lg cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {masterOrderMenuOpen === ord.id && (
                            <div className="absolute right-5 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-25 py-1 text-left font-semibold">
                              <button
                                onClick={() => {
                                  setMasterOrderMenuOpen(null);
                                  const parentClient = clients.find(c => c.id === ord.clientId);
                                  if (parentClient) {
                                    setSelectedClient(parentClient);
                                    setClientSubTab("orders");
                                    setSelectedOrder(ord);
                                  }
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Inspect Order Detail</span>
                              </button>
                              <button
                                onClick={() => {
                                  setMasterOrderMenuOpen(null);
                                  const nextOrders = orders.filter(o => o.id !== ord.id);
                                  saveOrdersToDb(nextOrders);
                                  triggerToast(`Cleared master order: ${ord.name}`);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Delete Order</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "built-links" && (
            <MasterBuiltLinksView
              clients={clients}
              orders={orders}
              builtLinks={builtLinks}
              verifyingLinkId={verifyingLinkId}
              handleVerifySingleLink={handleVerifySingleLink}
              handleVerifyAllLinks={handleVerifyAllLinks}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              linksUrlFilter={linksUrlFilter}
              setLinksUrlFilter={setLinksUrlFilter}
              linksStatusFilter={linksStatusFilter}
              setLinksStatusFilter={setLinksStatusFilter}
              setSelectedOrder={(order) => setSelectedOrder(order as Order | null)}
              setShowAddBuiltLink={setShowAddBuiltLink}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "reports" && (
            <WorkReportsConsoleView
              clients={clients}
              orders={orders}
              builtLinks={builtLinks}
              logoUrl={logoUrl}
              agencyName={agencyName}
              agencySlogan={agencySlogan}
              supportEmail={supportEmail}
              reportsSelectedClient={reportsSelectedClient}
              setReportsSelectedClient={setReportsSelectedClient}
              reportsSelectedOrder={reportsSelectedOrder}
              setReportsSelectedOrder={setReportsSelectedOrder}
              reportsCustomComment={reportsCustomComment}
              setReportsCustomComment={setReportsCustomComment}
              reportsKpiToggles={reportsKpiToggles}
              setReportsKpiToggles={setReportsKpiToggles}
              setSelectedReportOrder={(order) => setSelectedReportOrder(order as Order | null)}
              setShowReportModal={setShowReportModal}
              handleTestDispatchReport={handleTestDispatchReport}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "automated-reports" && (
            <AutomatedReportsConfigView
              dispatchSchedule={dispatchSchedule}
              setDispatchSchedule={setDispatchSchedule}
              autoTriggerOnComplete={autoTriggerOnComplete}
              setAutoTriggerOnComplete={setAutoTriggerOnComplete}
              notifyOnStatusChange={notifyOnStatusChange}
              setNotifyOnStatusChange={setNotifyOnStatusChange}
              emailTemplateText={emailTemplateText}
              setEmailTemplateText={setEmailTemplateText}
              dispatchLogs={dispatchLogs}
              handleTestDispatchReport={handleTestDispatchReport}
              clients={clients}
              orders={orders}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "branding" && (
            <AgencyBrandingView
              agencyName={agencyName}
              setAgencyName={setAgencyName}
              agencySlogan={agencySlogan}
              setAgencySlogan={setAgencySlogan}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              smtpName={smtpName}
              setSmtpName={setSmtpName}
              supportEmail={supportEmail}
              setSupportEmail={setSupportEmail}
              portalTheme={portalTheme}
              setPortalTheme={setPortalTheme}
              customWelcomeMsg={customWelcomeMsg}
              setCustomWelcomeMsg={setCustomWelcomeMsg}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "messages" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-sm font-extrabold text-slate-850 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0d9488]" />
                  <span>Central Messaging Center</span>
                </h2>
              </div>
              <div className="p-5 divide-y divide-slate-100">
                {clients.map(cl => {
                  const unread = clientUnreadMessagesCount(cl.id);
                  return (
                    <div key={cl.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0d9488] font-bold shadow-xs">
                          <MessageCircle className="w-5 h-5 text-[#0d9488]" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-800 block">{cl.name} Thread</span>
                          <span className="text-[10.5px] text-slate-500 block font-semibold mt-0.5">{cl.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {unread} historic exchanges
                        </span>
                        <button
                          onClick={() => {
                            setSelectedClient(cl);
                            setClientSubTab("orders"); // default
                            setSelectedOrder(null);
                            // Auto open chat popup with first order
                            const parentOrd = orders.find(o => o.clientId === cl.id);
                            if (parentOrd) {
                              const relatedLink = builtLinks.find(b => b.orderId === parentOrd.id) || {
                                id: "synthetic-link",
                                orderId: parentOrd.id,
                                anchorText: parentOrd.name,
                                referringUrl: "N/A"
                              } as any;
                              setChattingLink(relatedLink);
                            } else {
                              triggerToast(`No active orders exist for ${cl.name} to chat.`);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-[#edf4fc] hover:bg-teal-100 text-[#0d9488] text-xs font-black rounded-lg transition-colors cursor-pointer"
                        >
                          Open Thread
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* DRILLED CLIENT MANAGEMENT PORTAL */
        <div className="space-y-6">
          {/* Back button Row */}
          <div className="flex justify-between items-center bg-slate-100/50 p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setSelectedClient(null);
                setSelectedOrder(null);
              }}
              className="px-3.5 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all outline-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to clients</span>
            </button>
            <div className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
              <span>Selected Profile:</span>
              <span className="bg-[#edf4fc] text-[#0d9488] px-2.5 py-1 rounded-md">
                {selectedClient.name} ({selectedClient.company})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Embedded Left sub-navigation tab list */}
            <div className="md:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block px-1.5">
                Workspace Tabs
              </span>
              <button
                onClick={() => {
                  setClientSubTab("orders");
                  setSelectedOrder(null);
                }}
                className={`w-full flex items-center gap-2 py-2 px-3 text-xs font-extrabold rounded-lg transition-colors text-left cursor-pointer ${
                  clientSubTab === "orders" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setClientSubTab("links")}
                className={`w-full flex items-center gap-2 py-2 px-3 text-xs font-extrabold rounded-lg transition-colors text-left cursor-pointer ${
                  clientSubTab === "links" ? "bg-[#edf4fc] text-[#0d9488]" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Links</span>
              </button>
            </div>

            {/* Drilled client sub-screens details */}
            <div className="md:col-span-3">
              {clientSubTab === "orders" ? (
                /* ORDERS SUB SECTION */
                <div className="space-y-6">
                  {/* If an Order is specifically Selected, show order details drilldown */}
                  {selectedOrder ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 animate-fade-in relative">
                      {/* Back to Client Orders */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                            title="Back to Orders index"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-lg font-black text-slate-800">Order Details</h2>
                              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${
                                selectedOrder.status === "COMPLETED" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}>
                                {selectedOrder.status}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-bold block mt-0.5">{selectedOrder.name}</span>
                          </div>
                        </div>

                        {/* Order detail controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedOrder.status === "PENDING" ? (
                            <button
                              onClick={() => handleUpdateOrderStatus("COMPLETED")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Mark Complete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateOrderStatus("PENDING")}
                              className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Revert to Pending
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedReportOrder(selectedOrder);
                              setShowReportModal(true);
                            }}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-250 hover:bg-slate-100 text-slate-755 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Generate Report</span>
                          </button>
                        </div>
                      </div>

                      {/* Info grid block mirroring Screenshot 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="space-y-2 text-xs font-semibold">
                          <div className="flex items-center">
                            <span className="w-32 text-slate-450">Order Id:</span>
                            <span className="text-slate-800 font-mono font-bold select-all bg-white px-2 py-0.5 rounded border border-slate-200 text-[10.5px]">
                              {selectedOrder.id}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-32 text-slate-450">Agency Client:</span>
                            <span className="text-slate-800 font-bold">{selectedOrder.clientName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-32 text-slate-450">Order Type:</span>
                            <span className="text-slate-800 font-bold text-[11px] bg-[#edf4fc] text-[#0d9488] px-2 py-0.5 rounded font-mono uppercase">
                              {selectedOrder.type}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-32 text-slate-450">Quantity:</span>
                            <span className="text-slate-800 font-mono font-bold">{selectedOrder.quantity}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs font-semibold">
                          <span className="text-slate-450 block">Notes:</span>
                          <span className="text-slate-700 bg-white p-2 border border-slate-150 rounded block font-mono text-[11px] h-16 leading-relaxed overflow-y-auto">
                            {selectedOrder.notes || "None"}
                          </span>
                        </div>
                      </div>

                      {/* Ordered Links Table Block mirroring Screenshot 3 */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Ordered Links</h3>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-sans font-black text-slate-450 uppercase tracking-wider border-b border-slate-200">
                                <th className="py-2.5 px-4 font-bold">Anchor Text</th>
                                <th className="py-2.5 px-4 font-bold">Prospect Name</th>
                                <th className="py-2.5 px-4 font-bold">Referring URL</th>
                                <th className="py-2.5 px-4 font-bold">Quantity</th>
                                <th className="py-2.5 px-4 font-bold">Status</th>
                                <th className="py-2.5 px-4 font-bold text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {selectedOrder.orderedLinks.map((ol) => (
                                <tr key={ol.id} className="hover:bg-slate-50/50 font-medium">
                                  <td className="py-3 px-4 font-bold font-mono text-slate-850">{ol.anchorText}</td>
                                  <td className="py-3 px-4 text-slate-500">{ol.prospectName}</td>
                                  <td className="py-3 px-4 text-[#006a61] font-bold font-mono truncate max-w-[200px]" title={ol.referringUrl}>
                                    {ol.referringUrl}
                                  </td>
                                  <td className="py-3 px-4 font-mono font-bold">{ol.quantity}</td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                      ol.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                                    }`}>
                                      {ol.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() => handleToggleOrderedLinkStatus(ol.id)}
                                      className="text-[10.5px] font-black bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                                    >
                                      Toggle State
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Built Links Table Block mirroring Screenshot 3 & 5 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Build Links</h3>
                          <button
                            onClick={() => setShowAddBuiltLink(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Built Link</span>
                          </button>
                        </div>

                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-sans font-black text-slate-450 uppercase tracking-wider border-b border-slate-200">
                                <th className="py-2.5 px-4">Anchor Text</th>
                                <th className="py-2.5 px-4">Referring URL</th>
                                <th className="py-2.5 px-4">Destination</th>
                                <th className="py-2.5 px-4">Price</th>
                                <th className="py-2.5 px-4">Status</th>
                                <th className="py-2.5 px-4">Date</th>
                                <th className="py-2.5 px-4 text-center">Comment</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {builtLinks.filter(l => l.orderId === selectedOrder.id).map((bl) => (
                                <tr key={bl.id} className="hover:bg-slate-50/50 font-medium font-sans">
                                  <td className="py-3 px-4 font-bold font-mono text-slate-800">{bl.anchorText}</td>
                                  <td className="py-3 px-4 text-[#006a61] hover:underline font-bold font-mono truncate max-w-[160px]">
                                    <a href={bl.referringUrl} target="_blank" rel="noopener noreferrer referrerPolicy='no-referrer'" className="flex items-center gap-1">
                                      <span>{bl.referringUrl}</span>
                                      <ExternalLink className="w-3 h-3 text-slate-300" />
                                    </a>
                                  </td>
                                  <td className="py-3 px-4 font-bold font-mono truncate text-slate-600 max-w-[150px]">{bl.destination}</td>
                                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{bl.price}</td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                      bl.status === "LINKED" 
                                        ? "bg-emerald-50 text-[#0d9488]" 
                                        : bl.status === "PENDING"
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                    }`}>
                                      {bl.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-500 font-semibold">{bl.date}</td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={() => setChattingLink(bl)}
                                      className="p-1 border border-slate-200 hover:border-teal-500 rounded-lg hover:bg-teal-50/20 text-slate-400 hover:text-[#006a61] cursor-pointer transition-all inline-flex items-center"
                                      title="Open chat message history widget"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {builtLinks.filter(l => l.orderId === selectedOrder.id).length === 0 && (
                                <tr>
                                  <td colSpan={7} className="text-center py-6 text-slate-400 font-bold italic">
                                    No results.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* General client specific orders list mirroring Screenshot 4 */
                    <div className="bg-white p-5 rounded-2xl border border-slate-250/80 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={orderQuery}
                            onChange={(e) => setOrderQuery(e.target.value)}
                            placeholder="Search order"
                            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-305 rounded-lg text-xs font-semibold placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-teal-500 cursor-text"
                          />
                        </div>
                        <button
                          onClick={() => setShowAddOrder(true)}
                          className="px-4 py-2 bg-[#0d9488] hover:bg-[#007e71] text-white text-xs font-extrabold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Order</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto border border-slate-150 rounded-xl">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-sans font-black text-slate-450 uppercase tracking-wider border-b border-slate-200">
                              <th className="py-3 px-4 font-bold">Name</th>
                              <th className="py-3 px-4 font-bold">Quantity</th>
                              <th className="py-3 px-4 font-bold">Links (Qty)</th>
                              <th className="py-3 px-4 font-bold">Status</th>
                              <th className="py-3 px-4 font-bold">Ordered At</th>
                              <th className="py-3 px-4 text-right font-bold w-12">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                            {filteredClientOrders.map((ord) => {
                              const relatedBuilt = builtLinks.filter(l => l.orderId === ord.id);
                              return (
                                <tr key={ord.id} className="hover:bg-slate-50/50 font-medium font-sans">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => setSelectedOrder(ord)}
                                      className="font-extrabold text-slate-800 hover:text-[#006a61] hover:underline block text-left"
                                    >
                                      {ord.name}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4 font-mono">{ord.quantity}</td>
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => setSelectedOrder(ord)}
                                      className="text-[10px] font-extrabold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md hover:bg-[#edf4fc] hover:text-[#0d9488]"
                                    >
                                      Links ({relatedBuilt.length})
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                      ord.status === "COMPLETED" 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-500 font-semibold">{ord.orderedAt}</td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() => setSelectedOrder(ord)}
                                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-705 inline-block"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}

                            {filteredClientOrders.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-slate-400 font-bold italic">
                                  No client orders found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* LINKS SUB SECTION mirroring Screenshot 5 */
                <div className="bg-white p-5 rounded-2xl border border-slate-205/70 space-y-4">
                  {/* Filter elements mirroring Screenshot 5 exactly */}
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Order List filter */}
                    <div className="relative md:w-48">
                      <select
                        value={linksOrderFilter}
                        onChange={(e) => setLinksOrderFilter(e.target.value)}
                        className="w-full bg-white border border-slate-250 text-slate-700 font-bold p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer appearance-none"
                      >
                        <option value="All">Select an order</option>
                        {clientSpecificOrders.map(o => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Search string Referring URL input */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={linksUrlFilter}
                        onChange={(e) => setLinksUrlFilter(e.target.value)}
                        placeholder="Filter by Referring Url..."
                        className="w-full px-3 py-2.5 bg-white border border-slate-250 rounded-lg text-xs font-semibold placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                      />
                    </div>

                    {/* Status Select Badge filter */}
                    <div className="relative md:w-36">
                      <select
                        value={linksStatusFilter}
                        onChange={(e) => setLinksStatusFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 text-slate-755 font-bold p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="All">+ Status</option>
                        <option value="LINKED">LINKED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>

                  {/* Built links list */}
                  <div className="overflow-x-auto border border-slate-150 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-sans font-black text-slate-450 uppercase tracking-wider border-b border-slate-200">
                          <th className="py-2.5 px-4 font-bold">Anchor Text</th>
                          <th className="py-2.5 px-4 font-bold">Referring URL</th>
                          <th className="py-2.5 px-4 font-bold">Destination</th>
                          <th className="py-2.5 px-4 font-bold">Price</th>
                          <th className="py-2.5 px-4 font-bold">Status</th>
                          <th className="py-2.5 px-4 font-bold">Date</th>
                          <th className="py-2.5 px-4 text-center font-bold w-12">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                        {filteredClientLinks.map((blk) => (
                          <tr key={blk.id} className="hover:bg-slate-50/50 font-medium font-sans">
                            <td className="py-3 px-4 font-bold font-mono text-slate-800">{blk.anchorText}</td>
                            <td className="py-3 px-4 text-[#006a61] font-bold font-mono truncate max-w-[180px]">
                              {blk.referringUrl}
                            </td>
                            <td className="py-3 px-4 font-bold font-mono text-slate-500 truncate max-w-[180px]">{blk.destination}</td>
                            <td className="py-3 px-4 font-mono font-bold">{blk.price}</td>
                            <td className="py-3 px-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                blk.status === "LINKED" 
                                  ? "bg-emerald-50 text-[#0d9488]" 
                                  : "bg-amber-50 text-amber-700"
                              }`}>
                                {blk.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-semibold">{blk.date}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setChattingLink(blk)}
                                className="p-1 border border-slate-200 hover:border-teal-500 rounded-lg hover:bg-teal-50/20 text-slate-400 hover:text-[#006a61] cursor-pointer inline-flex"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {filteredClientLinks.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400 font-bold italic">
                              No matching links identified.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination footer mirroring Screenshot 5 exactly */}
                  <div className="flex justify-between items-center bg-slate-50/40 p-3 rounded-lg border border-slate-150 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                      <span>Rows per page</span>
                      <div className="relative">
                        <select className="bg-white border border-slate-200 rounded p-1 text-xs cursor-pointer font-bold select-none">
                          <option>10</option>
                          <option>25</option>
                          <option>50</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-400" disabled>
                        <span>◀</span>
                      </button>
                      <span className="font-sans font-bold text-slate-700 px-2">Page 1 of 1</span>
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-400" disabled>
                        <span>▶</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ADD NEW CLIENT SIDE DRAWER MODAL --- */}
      {showAddClient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0d9488]" />
                  <span>Register Client account</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">Authorized under manual token creation framework</span>
              </div>
              <button
                onClick={() => setShowAddClient(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewClient} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Full Name</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="E.g. Jane Doe"
                    required
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Username ID</label>
                  <input
                    type="text"
                    value={newClientUsername}
                    onChange={(e) => {
                      setNewClientUsername(e.target.value.toLowerCase().replace(/\s/g, ""));
                    }}
                    placeholder="E.g. jane_doe"
                    required
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 block">Email Address</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="jane.doe@company.com"
                  required
                  className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Password Option</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newClientPassword}
                      onChange={(e) => setNewClientPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-2.5 pr-8 py-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="w-full bg-[#edf4fc] hover:bg-slate-100 hover:border-slate-350 border border-slate-200 text-[#0d9488] p-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>Generate password</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Company name</label>
                  <input
                    type="text"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    placeholder="E.g. Acme Corp"
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Space Role</label>
                  <select
                    value={newClientRole}
                    onChange={(e) => setNewClientRole(e.target.value)}
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  >
                    <option>Agency Client</option>
                    <option>Vetted Publisher Partner</option>
                    <option>White-label Editor</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="px-4 py-2 border border-slate-205 text-slate-500 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#007a6e] text-white font-black rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD NEW ORDER MODAL --- */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0d9488]" />
                  <span>Manual Link Order Registration</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">Bypasses automated Stripe checkout gateway process</span>
              </div>
              <button onClick={() => setShowAddOrder(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 block">Order Campaign Name</label>
                <input
                  type="text"
                  value={newOrderName}
                  onChange={(e) => setNewOrderName(e.target.value)}
                  placeholder="E.g. Q3 Growth links Package"
                  required
                  className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              {/* Client Dropdown Assign (if not specifically already filtered) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Assign Client Account</label>
                  <select
                    value={newOrderClientId}
                    onChange={(e) => setNewOrderClientId(e.target.value)}
                    required={!selectedClient}
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    {selectedClient ? (
                      <option value={selectedClient.id}>{selectedClient.name}</option>
                    ) : (
                      <>
                        <option value="">-- Choose client --</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Payment Type Style</label>
                  <select
                    value={newOrderType}
                    onChange={(e) => setNewOrderType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs"
                  >
                    <option value="PACKAGE">PACKAGE (Fixed Deliverable)</option>
                    <option value="MONTHLY">MONTHLY (Retainer Service)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Links Quantity</label>
                  <input
                    type="number"
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(parseInt(e.target.value, 10))}
                    min={1}
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Target Anchors list (Comma separator)</label>
                  <input
                    type="text"
                    value={newOrderAnchors}
                    onChange={(e) => setNewOrderAnchors(e.target.value)}
                    placeholder="read, hello, agency boost"
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none focus:border-[#0d9488] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 block">Private Internal Notes</label>
                <textarea
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  placeholder="E.g. custom domain list, guest post specifications..."
                  className="w-full p-2.5 border border-slate-250 rounded-lg text-xs outline-none h-20"
                />
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddOrder(false)}
                  className="px-4 py-2 border border-slate-205 text-slate-500 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#007a6e] text-white font-black rounded-lg"
                >
                  Add Manual Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD DETAILED BUILT LINK MODAL --- */}
      {showAddBuiltLink && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-250/85 overflow-hidden shadow-2xl animate-fade-in text-xs font-semibold">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800">Add Built Link Deliverable</h3>
                <span className="text-[11px] text-slate-500 block">Register a verified publisher live link to order registry</span>
              </div>
              <button onClick={() => setShowAddBuiltLink(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBuiltLinkAction} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Anchor Text</label>
                  <input
                    type="text"
                    required
                    value={newLinkAnchor}
                    onChange={(e) => setNewLinkAnchor(e.target.value)}
                    placeholder="Test"
                    className="w-full p-2.5 border border-slate-250 rounded-lg font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Referring URL Publisher</label>
                  <input
                    type="text"
                    required
                    value={newLinkRefUrl}
                    onChange={(e) => setNewLinkRefUrl(e.target.value)}
                    placeholder="https://www.test.com"
                    className="w-full p-2.5 border border-slate-250 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Destination Target Link</label>
                  <input
                    type="text"
                    value={newLinkDestination}
                    onChange={(e) => setNewLinkDestination(e.target.value)}
                    placeholder="https://clarionledger.com"
                    className="w-full p-2.5 border border-slate-250 rounded-lg font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Pricing Cost (USD)</label>
                  <input
                    type="text"
                    value={newLinkPrice}
                    onChange={(e) => setNewLinkPrice(e.target.value)}
                    placeholder="$150"
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Live Status</label>
                  <select
                    value={newLinkStatus}
                    onChange={(e) => setNewLinkStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="LINKED">LINKED (Verified live)</option>
                    <option value="PENDING">PENDING (Outreach Stage)</option>
                    <option value="REJECTED">REJECTED (Lost / Nofollow error)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-400">Private Verification Comment</label>
                  <input
                    type="text"
                    value={newLinkComment}
                    onChange={(e) => setNewLinkComment(e.target.value)}
                    placeholder="Anchor verified placement"
                    className="w-full p-2.5 border border-slate-250 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBuiltLink(false)}
                  className="px-4 py-2 border border-slate-205 text-slate-500 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#007a6e] text-white font-black rounded-lg"
                >
                  Register Built Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REPORTS GENERATED PREVIEW WHITE-LABEL MODAL --- */}
      {showReportModal && selectedReportOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center whitespace-nowrap">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black tracking-tight">Generate White-Label Report Preview</h3>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Automated compilation engine for stakeholders</span>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 font-sans text-xs">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-slate-850 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-sans font-black text-slate-900 uppercase tracking-tight">uprankly White-Label Report</h4>
                    <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">SEO Links Delivery Statement</span>
                  </div>
                  <div className="text-right text-[11px] font-bold text-slate-600">
                    <div>Date: {new Date().toLocaleDateString()}</div>
                    <div>Order: {selectedReportOrder.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Prepared For:</span>
                    <div className="font-extrabold text-slate-800">{selectedReportOrder.clientName}</div>
                    <div className="text-[11px] text-slate-500 font-semibold italic mt-0.5">Campaign Name: {selectedReportOrder.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Delivery Status:</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                      {selectedReportOrder.status}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[10.5px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-extrabold border-b border-slate-200">
                        <th className="py-2 px-3">Anchor Text</th>
                        <th className="py-2 px-3">Referring URL</th>
                        <th className="py-2 px-3">Destination</th>
                        <th className="py-2 px-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-semibold text-[#0b1c30]">
                      {builtLinks.filter(l => l.orderId === selectedReportOrder.id).map(lk => (
                        <tr key={lk.id}>
                          <td className="py-2 px-3 font-mono font-bold text-slate-800">{lk.anchorText}</td>
                          <td className="py-2 px-3 font-mono text-[#006a61]">{lk.referringUrl}</td>
                          <td className="py-2 px-3 font-mono text-slate-550 truncate max-w-[155px]">{lk.destination}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-700">{lk.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-zinc-400 font-semibold text-center pt-2">
                  Generated autonomously via uprankly.com API with secure backlink signature verification.
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-205 text-slate-500 rounded-lg font-bold"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("PDF Report compilation complete. Handing file output stream to browser print spooler.");
                    window.print();
                  }}
                  className="px-4 py-2 bg-[#0b1c30] hover:bg-slate-800 text-white font-extrabold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CHAT MESSAGES POPUP FLOATING OVERLAY DIALOG (Screenshot 6) --- */}
      {chattingLink && (
        <div className="fixed bottom-6 right-6 w-96 bg-white border border-slate-250/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up flex flex-col h-[400px]">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0 border-b border-slate-755">
            <div className="overflow-hidden">
              <span className="text-[10px] text-teal-400 uppercase tracking-widest font-black block">Live Client Correspondence</span>
              <h4 className="text-xs font-sans font-extrabold truncate text-ellipsis text-white mt-0.5" title={`${chattingLink.anchorText} (${chattingLink.referringUrl})`}>
                {chattingLink.anchorText} ({chattingLink.referringUrl})
              </h4>
            </div>
            <button
              onClick={() => setChattingLink(null)}
              className="p-1 bg-slate-800 hover:bg-slate-705 text-slate-350 hover:text-white rounded-lg cursor-pointer max-h-7 max-w-7 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 flex flex-col">
            <span className="text-[9.5px] font-bold text-center text-slate-400 block select-none">
              SECURE SMTP ENVELOPE ESTABLISHED
            </span>

            {chattingMessages.map((msg) => {
              const isSenderYou = msg.sender === "You";
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isSenderYou ? "self-end items-end" : "self-start items-start"}`}>
                  <div className={`p-2.5 rounded-2xl text-[11px] font-semibold leading-relaxed ${
                    isSenderYou 
                      ? "bg-[#0d9488] text-white rounded-br-none" 
                      : "bg-white border border-slate-200 text-slate-850 rounded-bl-none shadow-xs"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1 font-mono uppercase">
                    {msg.sender === "You" ? "You" : selectedClient ? selectedClient.name : "Client"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {chattingMessages.length === 0 && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-slate-450 italic font-medium my-auto mx-4 text-xs">
                No active chat posts detected. Write the first note below to trigger interactive feedback.
              </div>
            )}
          </div>

          {/* Form write input */}
          <form onSubmit={sendLiveMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={chatMessageText}
              onChange={(e) => setChatMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0d9488] rounded-xl px-3 py-2 text-xs font-semibold placeholder:text-slate-400 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const triggerId = chattingLink.orderId;
                const autoPrompt = {
                  id: `msg-sim-${Date.now()}`,
                  orderId: triggerId,
                  clientId: selectedClient ? selectedClient.id : "client-yovi",
                  sender: "Client" as const,
                  text: "Hi uprankly, checked the Live reports. Looks fully indexable. Can we add another monthly package next week?",
                  timestamp: new Date().toISOString()
                };
                saveMessagesToDb([...messages, autoPrompt]);
                triggerToast("Simulated live inbound message from client.");
              }}
              className="p-2 bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
              title="Simulate inbound message reply"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="p-2 bg-[#006a61] hover:bg-[#004d44] text-white rounded-xl cursor-pointer flex items-center justify-center"
              title="Send live note"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
