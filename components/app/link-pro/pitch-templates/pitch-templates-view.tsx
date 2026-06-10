"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList, type PitchTemplate } from "@/components/app/link-pro/shared/prospect-shared";

export function PitchTemplatesView() {
  const [toast, setToast] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const initialTemplates: PitchTemplate[] = [
    {
      id: "t-1",
      name: "Skyscraper Resource Reclamation",
      subject: "Quick resource addition for {{Site_Topic}}?",
      body: "Hi {{Recipient_Name}},\n\nI was scouring your excellent index on {{Site_Topic}} and noticed the resource linked in section 4 is returning empty parameters. I compiled a comprehensive update covering this area recursively. Would you mind evaluating our directory and adding it as an update if you see value?\n\nExcited to hear, \n{{Sender_Name}}",
      successRate: "78% response",
      type: "Skyscraper"
    },
    {
      id: "t-2",
      name: "Editorial Guest Contribution Pitch",
      subject: "Dynamic content proposal for {{Associated_Project}} contributors",
      body: "Hey {{Recipient_Name}},\n\nI study the creative content trends at {{Associated_Project}}. I noticed some exciting gaps in search keyword directories for your tech blog. I designed three custom templates focusing precisely on these elements. Let me know if you would love to host a comprehensive, free article covering this on {{Site_Name}}!\n\nCheers,\n{{Sender_Name}}",
      successRate: "64% response",
      type: "Guest Post"
    }
  ];

  const [templates, setTemplates] = useState<PitchTemplate[]>(initialTemplates);
  const [selectedId, setSelectedId] = useState(initialTemplates[0]?.id || "t-1");
  const selectedTemplate = templates.find(t => t.id === selectedId) || templates[0];

  const handleTextChange = (newBody: string) => {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, body: newBody } : t));
  };

  const handleOptimizeWithAI = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const optimizedBody = selectedTemplate.body + "\n\nPS: I have added secondary references to authoritative papers to secure your search equity indices beautifully.";
      handleTextChange(optimizedBody);
      setIsOptimizing(false);
      setToast("Aetheric AI optimized outreach pitch for maximal response value!");
    }, 1200);
  };

  return (
    <div className="space-y-6" id="pitch-templates-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-sans font-bold text-slate-800 tracking-tight">Outreach Template Composer</h2>
          </div>
          <p className="text-xs text-[#6d7a77] font-medium">Draft and customize responsive pitch formats. Inject active placeholder variables dynamically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="templates-workspace">
        {/* Template List Selector */}
        <div className="space-y-3">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#6d7a77]">Pitch Blueprints</span>
          <div className="space-y-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedId === t.id 
                    ? "bg-[#0d9488]/5 border-[#0d9488] text-[#0d9488]" 
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <div className="font-bold text-xs leading-snug">{t.name}</div>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">{t.type}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 font-mono">{t.successRate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Composer Editor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-indigo-50">
            <h3 className="text-xs font-sans font-bold text-slate-600 uppercase tracking-widest">Selected Pitch Canvas</h3>
            <button
              onClick={handleOptimizeWithAI}
              disabled={isOptimizing}
              className="px-3 py-1 bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 hover:opacity-90 text-[#0d9488] text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isOptimizing ? "Optimizing tone..." : "Optimize Pitch Format"}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-[#6d7a77] uppercase mb-1">Subject Heading</label>
            <input 
              type="text" 
              value={selectedTemplate.subject}
              onChange={(e) => setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, subject: e.target.value } : t))}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50 font-semibold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-[#6d7a77] uppercase mb-1">Drip Body Paragraphs</label>
            <textarea
              rows={8}
              value={selectedTemplate.body}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-teal-500 bg-slate-50/50 outline-none block text-slate-700 leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-[9px] text-[#0d9488] font-bold font-mono">
            <span className="px-2 py-0.5 bg-teal-50 rounded">{"{{Site_Topic}}"}</span>
            <span className="px-2 py-0.5 bg-teal-50 rounded">{"{{Recipient_Name}}"}</span>
            <span className="px-2 py-0.5 bg-teal-50 rounded">{"{{Sender_Name}}"}</span>
            <span className="px-2 py-0.5 bg-teal-50 rounded">{"{{Site_Name}}"}</span>
          </div>
        </div>
      </div>

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}