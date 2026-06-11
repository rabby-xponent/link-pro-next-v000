"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AgencyBrandingViewProps {
  agencyName: string;
  setAgencyName: (val: string) => void;
  agencySlogan: string;
  setAgencySlogan: (val: string) => void;
  logoUrl: string;
  setLogoUrl: (val: string) => void;
  accentColor: string;
  setAccentColor: (val: string) => void;
  smtpName: string;
  setSmtpName: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  portalTheme: string;
  setPortalTheme: (val: string) => void;
  customWelcomeMsg: string;
  setCustomWelcomeMsg: (val: string) => void;
  triggerToast: (msg: string) => void;
}

export function AgencyBrandingView({
  agencyName,
  setAgencyName,
  agencySlogan,
  setAgencySlogan,
  logoUrl,
  setLogoUrl,
  accentColor,
  setAccentColor,
  smtpName,
  setSmtpName,
  supportEmail,
  setSupportEmail,
  portalTheme,
  setPortalTheme,
  customWelcomeMsg,
  setCustomWelcomeMsg,
  triggerToast
}: AgencyBrandingViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-xs font-semibold">
      {/* Configurator block (span 5) */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#0d9488]" />
            <span>White-Label Customization Desk</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Configure domains, agency titles, outbox SMTP templates, and branding details. Your clients see this in their secure view.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerToast("White-label branding rules synchronized successfully!");
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Agency Brand Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-xs text-slate-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Portal welcome Slogan / Subtitle</label>
            <input
              type="text"
              value={agencySlogan}
              onChange={(e) => setAgencySlogan(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-xs text-slate-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">White-label Logo Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-xs text-slate-800 font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  const images = [
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=120&q=80"
                  ];
                  const picked = images[Math.floor(Math.random() * images.length)];
                  setLogoUrl(picked);
                  triggerToast("Brand logo asset randomized!");
                }}
                className="px-3 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 text-xs cursor-pointer font-bold transition-colors"
              >
                Rotate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-455 block">Primary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-9 p-0.5 border border-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-700">{accentColor.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-455 block">Portal Theme Mode</label>
              <select
                value={portalTheme}
                onChange={(e) => setPortalTheme(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-teal-500 font-bold text-slate-700"
              >
                <option value="modern-teal">Clean Swiss (Teal)</option>
                <option value="cosmic-charcoal">Midnight Slate (Dark)</option>
                <option value="emerald-forest">Bespoke Forest (Green)</option>
                <option value="royal-slate">Corporate Authority (Blue)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">SMTP Outbox Sender Header</label>
            <input
              type="text"
              value={smtpName}
              onChange={(e) => setSmtpName(e.target.value)}
              placeholder="E.g. uprankly Outbox <no-reply@uprankly-agency.com>"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono text-xs text-slate-705"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Direct Support Email address</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-705 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Welcome greeting Banner text</label>
            <input
              type="text"
              value={customWelcomeMsg}
              onChange={(e) => setCustomWelcomeMsg(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-705 text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0d9488] hover:bg-[#007b6e] text-white text-xs font-black rounded-xl cursor-pointer transition-colors"
          >
            Synchronize Theme Settings
          </button>
        </form>
      </div>

      {/* Simulated Preview Workspace Device Frame (span 7) */}
      <div className="lg:col-span-7 space-y-4">
        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Real-time Portal view</span>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[480px]">
          {/* Device Browser Head */}
          <div className="bg-slate-100 border-b border-slate-250 p-2.5 flex items-center gap-2 shrink-0 select-none">
            <div className="flex gap-1">
              <span className="w-2 bg-[#f43f5e] h-2 rounded-full inline-block" />
              <span className="w-2 bg-[#eab308] h-2 rounded-full inline-block" />
              <span className="w-2 bg-[#22c55e] h-2 rounded-full inline-block" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded px-2 py-0.5 text-[9.5px] text-slate-400 font-mono flex items-center gap-1.5 justify-center">
              <span className="text-emerald-500 font-black">🔒 SECURED WHITE-LABEL</span>
              <span>https://reports.{agencyName.toLowerCase().replace(/[^a-z0-9]/g, "") || "agency"}.com/p/portal</span>
            </div>
            <div className="w-10 text-right text-[8.5px] font-mono text-slate-400 font-bold">100% LIVE</div>
          </div>

          {/* Simulated Workspace Interior */}
          <div className="flex-1 overflow-y-auto flex bg-slate-50 text-xs">
            {/* Sidebar */}
            <div className="w-44 bg-[#0a1829] text-slate-300 p-4 flex flex-col shrink-0">
              {/* Dynamic Logo rendering based on edits */}
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3.5 mb-3.5">
                <img src={logoUrl} alt="Logo Preview" className="w-6.5 h-6.5 rounded-lg object-cover bg-[#edf4fc]" referrerPolicy="no-referrer" />
                <div className="overflow-hidden">
                  <span className="font-black text-[10px] text-white block uppercase truncate">{agencyName}</span>
                  <span className="text-[8.5px] text-slate-450 block truncate font-medium">{agencySlogan}</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 select-none">
                <div className="py-1 px-2.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 text-white bg-slate-800" style={{ borderLeft: `3.5px solid ${accentColor}` }}>
                  <span>🎯 Backlinks Suite</span>
                </div>
                <div className="py-1 px-2.5 rounded-lg text-slate-400 font-bold text-[10px]">
                  <span>📈 Domain Analytics</span>
                </div>
                <div className="py-1 px-2.5 rounded-lg text-slate-400 font-bold text-[10px]">
                  <span>📄 Export statement</span>
                </div>
                <div className="py-1 px-2.5 rounded-lg text-slate-400 font-bold text-[10px]">
                  <span>💬 SMTP Helpdesk</span>
                </div>
              </div>

              <div className="text-[8px] text-slate-500 border-t border-slate-800 pt-2 font-mono font-bold">
                PRO PORTAL ENGINE
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-400 font-mono tracking-widest">Reports secure workspace</span>
                  <h3 className="text-sm font-black text-slate-930 tracking-tight mt-0.5">Real-time campaigns Progress</h3>
                </div>
                <span className="text-[9.5px] uppercase font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Portal Synced
                </span>
              </div>

              {/* Dynamic Welcome Message preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5 shadow-3xs">
                <div className="text-[10px] font-sans font-black flex items-center gap-1.5 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  <span>Authorized client greeting:</span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-bold italic bg-slate-50 p-2 border border-slate-100 rounded leading-relaxed font-mono">
                  "{customWelcomeMsg}"
                </p>
              </div>

              {/* Standard Stats showing color accent usage */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-center shadow-3xs">
                  <span className="text-[8.5px] uppercase font-black text-slate-400 block tracking-wider">Indexed Links</span>
                  <span className="text-[13px] font-mono font-black mt-1 block">18 Placements</span>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-center shadow-3xs">
                  <span className="text-[8.5px] uppercase font-black text-slate-400 block tracking-wider">Domain status</span>
                  <span className="text-[13px] font-sans font-extrabold mt-1 block" style={{ color: accentColor }}>100% Active</span>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-center shadow-3xs">
                  <span className="text-[8.5px] uppercase font-black text-slate-400 block tracking-wider">Avg Authority</span>
                  <span className="text-[13px] font-mono font-black mt-1 block">DR 72</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
