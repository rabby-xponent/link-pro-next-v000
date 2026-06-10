"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList } from "@/components/app/link-pro/shared/prospect-shared";

export interface CreateCampaignViewProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function CreateCampaignView({ onComplete, onCancel }: CreateCampaignViewProps) {
  const [campName, setCampName] = useState("");
  const [templateType, setTemplateType] = useState("Skyscraper");
  const [senderAccount, setSenderAccount] = useState("");
  const [delaySec, setDelaySec] = useState("180");
  const [toast, setToast] = useState<string | null>(null);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName) {
      setToast("Please specify an Outreach Campaign Name!");
      return;
    }
    setToast(`Initializing outreach pipeline with '${campName}' sequence config!`);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto space-y-6" id="add-campaign-wizard">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PlusCircle className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-sans font-bold text-slate-100 tracking-tight text-slate-800">Configure Campaign Pitch</h2>
        </div>
        <p className="text-xs text-[#6d7a77]">Compose active drip sequences, associate custom pitch templates, and assign target lists safely.</p>
      </div>

      <form onSubmit={handleLaunchCampaign} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Outreach Campaign Name</label>
          <input 
            type="text" 
            placeholder="e.g. Broken Link Reclamation - Tech DR 50+"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50/50 outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Pitch Template Method</label>
            <select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50"
            >
              <option value="Skyscraper">Skyscraper Outreach (94% Deliverability)</option>
              <option value="Broken Link">Broken Link Recovery (81% Deliverability)</option>
              <option value="Guest Post">Editorial Guest Post Pitch (76% Deliverability)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Sequence Drip Delay</label>
            <select
              value={delaySec}
              onChange={(e) => setDelaySec(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50"
            >
              <option value="30">30 seconds (Sandbox test)</option>
              <option value="180">3 minutes split interval</option>
              <option value="600">10 minutes (Safe SMTP shield)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Default Outreach Sender Email</label>
          <input 
            type="email" 
            placeholder="e.g. mak@uprankly-domain.com"
            value={senderAccount}
            onChange={(e) => setSenderAccount(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50/50 outline-none font-medium"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500 leading-normal font-sans font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>This wizard auto-checks matching referring publisher emails and schedules follow-up triggers up to 3 days post-delivery if no replies are logged. Use this carefully!</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-[#0d9488] hover:bg-[#0b7e74] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Launch Outreach Campaign
          </button>
        </div>
      </form>

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
