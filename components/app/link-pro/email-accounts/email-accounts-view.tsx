"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList, type ConnectedEmail } from "@/components/app/link-pro/shared/prospect-shared";

export function EmailAccountsView() {
  const [toast, setToast] = useState<string | null>(null);

  const initialEmails: ConnectedEmail[] = [
    { id: "e-1", address: "mak@uprankly.com", provider: "Google", status: "Verified", dailyLimit: 250, sentToday: 114, dkimSpf: true },
    { id: "e-2", address: "outreach@uprankly.com", provider: "SMTP Custom", status: "Warming", dailyLimit: 50, sentToday: 12, dkimSpf: true },
    { id: "e-3", address: "alex.marketing@gmail.com", provider: "Google", status: "Error", dailyLimit: 100, sentToday: 0, dkimSpf: false }
  ];

  const handleTestConnection = (address: string) => {
    setToast(`Test envelope successfully delivered to '${address}' sandbox receiver! SPF keys verified.`);
  };

  return (
    <div className="space-y-6" id="email-accounts-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-sans font-bold text-slate-800 tracking-tight">Outreach Senders (SMTP/OAuth)</h2>
          </div>
          <p className="text-xs text-[#6d7a77] font-medium">Verify outbound email clients, SMTP relays, warm-up paces, and secure OAuth keys safely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="emails-workspace-grid">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
          <h4 className="text-xs font-sans font-bold text-slate-700 uppercase tracking-widest mb-4">Authenticated Outreach Identifiers</h4>
          <div className="space-y-3">
            {initialEmails.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-xl bg-slate-50/20 hover:bg-slate-50 transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{item.address}</span>
                    <p className="text-[10px] text-slate-400 font-medium">Provider: {item.provider} | SPF/DKIM: {item.dkimSpf ? "Passed" : "Failed"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === "Verified" ? "bg-teal-50 text-[#0d9488]" :
                    item.status === "Warming" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {item.status}
                  </span>

                  <button
                    onClick={() => handleTestConnection(item.address)}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer transition-all"
                  >
                    Test client
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-sans font-bold text-slate-700 uppercase tracking-widest mb-2">Pacing & Warm-Up Pace</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Protect domain reputation. The workspace automatically regulates sent schedules post OAuth connection, capping rates to max 25 emails daily initially, ramping up by 15% weekly.</p>
          </div>
          <button 
            onClick={() => setToast("SMTP pacing constraints saved. Domain security Shield is active!")}
            className="w-full bg-[#0d9488] hover:bg-[#0b7e74] text-white font-bold rounded-xl py-2.5 px-4 text-xs transition-colors cursor-pointer"
          >
            Optimize Sender Limits
          </button>
        </div>
      </div>

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}