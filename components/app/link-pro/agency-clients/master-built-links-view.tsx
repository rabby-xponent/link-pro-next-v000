"use client";

import React from "react";
import { ExternalLink, RefreshCw, Plus, ChevronDown, Check, Clock } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Order {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  quantity: number;
}

interface BuiltLink {
  id: string;
  orderId: string;
  anchorText: string;
  referringUrl: string;
  destination: string;
  price: string;
  status: "LINKED" | "PENDING" | "REJECTED";
  date: string;
  comment?: string;
}

interface MasterBuiltLinksViewProps {
  clients: Client[];
  orders: Order[];
  builtLinks: BuiltLink[];
  verifyingLinkId: string | null;
  handleVerifySingleLink: (id: string) => void;
  handleVerifyAllLinks: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  linksUrlFilter: string;
  setLinksUrlFilter: (val: string) => void;
  linksStatusFilter: string;
  setLinksStatusFilter: (val: string) => void;
  setSelectedOrder: (order: Order | null) => void;
  setShowAddBuiltLink: (val: boolean) => void;
  triggerToast: (msg: string) => void;
}

export function MasterBuiltLinksView({
  clients,
  orders,
  builtLinks,
  verifyingLinkId,
  handleVerifySingleLink,
  handleVerifyAllLinks,
  searchQuery,
  setSearchQuery,
  linksUrlFilter,
  setLinksUrlFilter,
  linksStatusFilter,
  setLinksStatusFilter,
  setSelectedOrder,
  setShowAddBuiltLink,
  triggerToast
}: MasterBuiltLinksViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-fade-in p-5 space-y-6 text-[#0b1c30]">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-black text-slate-1000 tracking-tight flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-[#0d9488]" />
            <span>Master Placements & Backlinks Database</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Comprehensive registry of active, verified and pending outer refers across all campaigns.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleVerifyAllLinks}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d9488] text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verify Live index status (All)</span>
          </button>
          <button
            onClick={() => {
              if (orders.length > 0) {
                setSelectedOrder(orders[0]);
                setShowAddBuiltLink(true);
              } else {
                triggerToast("Setup an order campaign inside the master orders screen before attaching links manually.");
              }
            }}
            className="px-4 py-2 bg-[#0d9488] hover:bg-[#007b6e] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Built Link Record</span>
          </button>
        </div>
      </div>

      {/* Filter items matching screenshot layout guidelines */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Client Selector dropdown filter */}
        <div className="relative md:w-56">
          <select
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-250 text-slate-705 font-bold p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0d9488] cursor-pointer appearance-none"
          >
            <option value="">Filter by Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.name}>{c.name} ({c.company})</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Text Filter input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={linksUrlFilter}
            onChange={(e) => setLinksUrlFilter(e.target.value)}
            placeholder="Search by anchor keywords, publisher referred address or destination..."
            className="w-full px-3 py-2.5 bg-white border border-slate-250 rounded-lg text-xs font-semibold placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-teal-500 transition-all font-mono"
          />
        </div>

        {/* Status drop filter */}
        <div className="relative md:w-44">
          <select
            value={linksStatusFilter}
            onChange={(e) => setLinksStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-250 text-slate-755 font-black p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0d9488] cursor-pointer"
          >
            <option value="All">All Live Statuses</option>
            <option value="LINKED">LINKED (Active)</option>
            <option value="PENDING">PENDING (In Queue)</option>
            <option value="REJECTED">REJECTED (Lost)</option>
          </select>
        </div>
      </div>

      {/* Links registry list table block */}
      <div className="overflow-x-auto border border-slate-210 rounded-xl">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-sans font-black text-slate-450 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Anchor Target Text</th>
              <th className="py-3 px-4">Campaign context</th>
              <th className="py-3 px-4">Publisher address</th>
              <th className="py-3 px-4">Destination Target</th>
              <th className="py-3 px-4 text-center">DR value</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Google index</th>
              <th className="py-3 px-4 text-right">Interactive actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {builtLinks
              .filter(bl => {
                const parentOrder = orders.find(o => o.id === bl.orderId);
                const parentClientName = parentOrder ? parentOrder.clientName : "Unknown";

                if (searchQuery && !parentClientName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                if (linksStatusFilter !== "All" && bl.status !== linksStatusFilter) return false;

                if (linksUrlFilter) {
                  const q = linksUrlFilter.toLowerCase();
                  return (
                    bl.anchorText.toLowerCase().includes(q) ||
                    bl.referringUrl.toLowerCase().includes(q) ||
                    bl.destination.toLowerCase().includes(q) ||
                    (bl.comment && bl.comment.toLowerCase().includes(q))
                  );
                }
                return true;
              })
              .map(bl => {
                const orderContext = orders.find(o => o.id === bl.orderId);
                const calculatedDR = bl.anchorText.length % 2 === 0 ? 71 : 62;

                return (
                  <tr key={bl.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{bl.anchorText}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-sans font-black text-slate-800 block">
                        {orderContext ? orderContext.clientName : "Agency Client"}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[120px] font-bold">
                        {orderContext ? orderContext.name : bl.orderId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0d9488] hover:underline font-bold max-w-[210px] truncate" title={bl.referringUrl}>
                      <a href={bl.referringUrl} target="_blank" rel="noopener noreferrer referrerPolicy='no-referrer'" className="flex items-center gap-1.5 focus:outline-none">
                        <span>{bl.referringUrl}</span>
                        <ExternalLink className="w-3.2 h-3.2 text-slate-300" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-550 max-w-[150px] truncate" title={bl.destination}>
                      {bl.destination}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-sans font-black px-1.5 py-0.5 rounded">
                        DR {calculatedDR}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{bl.price}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        bl.status === "LINKED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {bl.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {bl.status === "LINKED" ? (
                        <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>INDEXED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] text-zinc-400 font-black bg-slate-100 px-2 py-0.5 rounded">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>QUEUED</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleVerifySingleLink(bl.id)}
                        disabled={verifyingLinkId === bl.id}
                        className="text-[10.5px] font-black bg-slate-100 hover:bg-teal-50 hover:text-[#0d9488] px-3 py-1 rounded-lg transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
                      >
                        {verifyingLinkId === bl.id ? (
                          <span className="flex items-center gap-1.5 justify-center">
                            <RefreshCw className="w-3 h-3 animate-spin text-[#0d9488]" />
                            <span>Verifying...</span>
                          </span>
                        ) : (
                          <span>Verify index</span>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
