"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList, type OutreachCampaign } from "@/components/app/link-pro/shared/prospect-shared";

export function CampaignsView() {
  const [toast, setToast] = useState<string | null>(null);

  const initialCampaigns: OutreachCampaign[] = [
    { id: "c-1", name: "High DR Technology Skyscraper Outreach", status: "Active", sent: 148, opened: 112, replied: 42, won: 12, creator: "Mak" },
    { id: "c-2", name: "SaaS Platform Broken Links recovery v3", status: "Active", sent: 88, opened: 61, replied: 18, won: 4, creator: "Alex Chen" },
    { id: "c-3", name: "Finance Hub Guest Post Pitch deck", status: "Completed", sent: 120, opened: 90, replied: 35, won: 8, creator: "Mak" },
    { id: "c-4", name: "E-commerce Referral Link prospecting", status: "Paused", sent: 45, opened: 21, replied: 3, won: 0, creator: "System Audit" }
  ];

  const handleToggleCampaignStatus = (id: string, name: string) => {
    setToast(`Toggled status for outreach campaign: '${name}'!`);
  };

  return (
    <div className="space-y-6" id="digital-campaigns-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-[#0d9488]" />
            <h2 className="text-xl font-sans font-bold text-slate-800 tracking-tight">Outreach Campaigns</h2>
          </div>
          <p className="text-xs text-[#6d7a77] font-medium">Coordinate bulk template pitches, sequential emails, and track conversion values at scale.</p>
        </div>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="campaigns-stats-grid">
        {[
          { label: "Active Kampaigns", val: "2 Running", desc: "1 Completed sequence", color: "border-l-teal-500" },
          { label: "Total Recipient Pitch Count", val: "401 Targets", desc: "94% mail delivery validation", color: "border-l-indigo-500" },
          { label: "Average Open Rate %", val: "72.4%", desc: "Industry benchmark is 31%", color: "border-l-sky-500" },
          { label: "Average Backlink Return", val: "6.1%", desc: "24 domains built successfully", color: "border-l-emerald-500" },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 ${stat.color}`}>
            <h5 className="text-[10px] font-sans font-bold text-[#6d7a77] uppercase tracking-wider">{stat.label}</h5>
            <div className="text-xl font-bold text-slate-800 tracking-tight mt-1">{stat.val}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Campaigns list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="campaigns-table-card">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <span className="text-xs font-sans font-bold text-slate-700 uppercase tracking-widest">Active Sequence Channels</span>
          <span className="text-[10px] font-mono text-slate-400">SMTP Auth is active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/10 border-b border-slate-100 text-[#6d7a77] font-semibold">
                <th className="p-4 pl-6">Campaign parameters</th>
                <th className="p-4">Delivery State</th>
                <th className="p-4">Sent/Delivered</th>
                <th className="p-4">Open rate %</th>
                <th className="p-4">Response rate %</th>
                <th className="p-4">Backlinks won</th>
                <th className="p-4 pr-6 text-right">Sequence Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {initialCampaigns.map((item, idx) => {
                const openPct = Math.round((item.opened / item.sent) * 100) || 0;
                const replyPct = Math.round((item.replied / item.opened) * 100) || 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                    <td className="p-4 pl-6 font-bold text-slate-800">
                      <div>{item.name}</div>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Author token: {item.creator}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Active" ? "bg-teal-50 text-[#0d9488]" :
                        item.status === "Completed" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"
                      }`}>
                        ● {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{item.sent} envelopes</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-800">{openPct}%</span>
                        <span className="text-[10px] text-slate-400">({item.opened})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-800">{replyPct}%</span>
                        <span className="text-[10px] text-slate-400">({item.replied})</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-600">+{item.won} Live links</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleToggleCampaignStatus(item.id, item.name)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer ${
                          item.status === "Active" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-teal-50 text-[#0d9488] hover:bg-teal-100"
                        }`}
                      >
                        {item.status === "Active" ? "Pause sequence" : "Resume sequence"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}