"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CommandCenterView() {
  const router = useRouter();

  // Dynamic App States for Interactive SEO Command Center
  const [creditsRemaining, setCreditsRemaining] = useState<number>(8400);
  const [activeCampaigns, setActiveCampaigns] = useState<number>(1);
  const [prospectLists, setProspectLists] = useState<number>(0);

  // Custom interactive user parameters
  const [showQuickCreditDeducter, setShowQuickCreditDeducter] = useState<boolean>(false);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [waitlists, setWaitlists] = useState<{ monitor: boolean; aeo: boolean }>({
    monitor: false,
    aeo: false,
  });

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Dedux Action Simulators
  const handleLaunchCampaign = () => {
    if (creditsRemaining < 400) {
      showToast("Insufficient SEO credits to deploy a new campaign!");
      return;
    }
    setActiveCampaigns(prev => prev + 1);
    setCreditsRemaining(prev => prev - 400);
    setActionLog(prev => [`Deployed Campaign #${activeCampaigns + 1} (-400 credits)`, ...prev]);
    showToast(`Successfully launched Campaign #${activeCampaigns + 1}!`);
  };

  const handleCreateProspectList = () => {
    if (creditsRemaining < 150) {
      showToast("Insufficient SEO credits to build standard prospect directory!");
      return;
    }
    setProspectLists(prev => prev + 1);
    setCreditsRemaining(prev => prev - 150);
    setActionLog(prev => [`Assembled New Prospect List #${prospectLists + 1} (-150 credits)`, ...prev]);
    showToast(`Prospect directory List #${prospectLists + 1} compiled!`);
  };

  const handleResetCredits = () => {
    setCreditsRemaining(8400);
    setActiveCampaigns(1);
    setProspectLists(0);
    setActionLog([]);
    showToast("SEO Credit limits reset to monthly standard allowance (8,400 credits).");
  };

  const handleMonitorSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlists(prev => ({ ...prev, monitor: true }));
    showToast("Splendid! You have been prioritized for Link Monitor Pro. We will email secure invites upon launch.");
  };

  const handleAeoSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlists(prev => ({ ...prev, aeo: true }));
    showToast("Priority handshake registered! AEO Pro early access queue updated.");
  };

  // Calculate dynamic conic-gradient percentage for the credits overview gauge
  const creditRatio = Math.max(0, Math.min(100, (creditsRemaining / 8400) * 100));

  return (
    <div className="space-y-8 animate-slide-up" id="seo-command-center-root">

      {/* Absolute floating Toast panel */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#00685f] text-white py-3 px-5 rounded-lg shadow-2xl z-50 flex items-center gap-3 border border-teal-400/20 animate-slide-up" id="command-toast">
          <span className="material-symbols-outlined text-white text-lg font-bold">check_circle</span>
          <span className="text-sm font-medium font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Hero Welcome Unit */}
      <section className="mb-6" id="welcome-hero-banner">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-label-md text-slate-400 mb-2" id="dashboard-breadcrumb">
              <span className="hover:text-[#00685f] cursor-pointer transition-colors duration-300">Uprankly Suite</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-[#00685f] font-bold">Command Center</span>
            </nav>
            <h2 className="font-display-lg text-3xl font-bold text-[#121e1c]">Welcome back, Mak</h2>
            <p className="font-body-md text-slate-600 mt-2 max-w-xl">
              Your Uprankly suite at a glance. You have <span className="font-bold text-[#00685f]">{activeCampaigns} active {activeCampaigns === 1 ? 'campaign' : 'campaigns'}</span> showing positive growth trends this week.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#00685f] font-semibold text-xs transition-transform duration-300 hover:scale-105 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00685f] mr-2 animate-pulse"></span> System Healthy
            </span>
          </div>
        </div>
      </section>

      {/* Top Main Workspace and health statistics Grid */}
      <div className="grid grid-cols-12 gap-6 items-start" id="overview-dashboard-grid">

        {/* Main Workspace Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6" id="workspaces-column">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-lg font-bold text-[#121e1c]">My Workspaces</h3>

            <button
              onClick={() => setShowQuickCreditDeducter(!showQuickCreditDeducter)}
              className="text-xs text-[#00685f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              {showQuickCreditDeducter ? "Hide Controls" : "Interactive Simulator"}
            </button>
          </div>

          {/* Core Interactive Sandbox Controller */}
          {showQuickCreditDeducter && (
            <div className="p-5 bg-teal-50/50 border border-teal-100 rounded-xl space-y-3 animate-slide-up" id="sandbox-simulator-panel">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-[#00685f] uppercase tracking-wider">SEO Operating Sandbox Controls</span>
                <button onClick={handleResetCredits} className="text-[10px] text-red-600 hover:underline font-bold uppercase transition-colors">Reset Stats</button>
              </div>
              <p className="text-xs text-slate-600">
                Uprankly provides zero mock data layers. Test the react state engine directly below by deploying assets or performing outreach processes:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleLaunchCampaign}
                  className="px-3 py-1.5 bg-[#00685f] hover:bg-[#005049] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span> Outreach Campaign (-400 Credits)
                </button>
                <button
                  onClick={handleCreateProspectList}
                  className="px-3 py-1.5 bg-[#00685f]/15 hover:bg-[#00685f]/25 text-[#00685f] text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">playlist_add</span> Compile Prospect List (-150 Credits)
                </button>
              </div>

              {actionLog.length > 0 && (
                <div className="border-t border-teal-100/60 pt-2" id="action-logs-feed">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Deduction History</span>
                  <div className="max-h-24 overflow-y-auto space-y-1 text-xs">
                    {actionLog.map((log, index) => (
                      <div key={index} className="text-slate-600 flex items-center gap-2 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LinkPro Premium Display Workspace Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" id="linkpro-master-workcard">
            <div className="p-6 md:p-8">

              {/* Header profile of widget */}
              <div className="flex justify-between items-start gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-center text-[#00685f] shrink-0">
                    <span className="material-symbols-outlined text-[28px] rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-lg font-bold text-[#121e1c] leading-tight">LinkPro</h4>
                    <p className="font-body-sm text-xs text-slate-500">Powerful SEO tools for authority growth</p>
                  </div>
                </div>

                <span className="px-4 py-1 bg-teal-500/10 text-[#006a61] font-bold text-xs rounded-full uppercase tracking-wider border border-teal-500/15">
                  Active
                </span>
              </div>

              {/* Grid indicators for parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="linkpro-stats-triple">

                {/* Metric 1 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-[#00685f] transition-all duration-300 group cursor-default">
                  <span className="material-symbols-outlined text-[#00685f] mb-3 group-hover:scale-110 transition-transform duration-300">send</span>
                  <p className="font-headline-md text-2xl font-bold text-[#121e1c] tabular-nums">{activeCampaigns}</p>
                  <p className="font-label-md text-[10px] text-slate-400 uppercase tracking-wider mt-1">Active Campaigns</p>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-[#00685f] transition-all duration-300 group cursor-default">
                  <span className="material-symbols-outlined text-[#00685f] mb-3 group-hover:scale-110 transition-transform duration-300">account_balance_wallet</span>
                  <p className="font-headline-md text-2xl font-bold text-[#121e1c] tabular-nums">{creditsRemaining.toLocaleString()}</p>
                  <p className="font-label-md text-[10px] text-slate-400 uppercase tracking-wider mt-1">Credits Remaining</p>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-[#00685f] transition-all duration-300 group cursor-default">
                  <span className="material-symbols-outlined text-[#00685f] mb-3 group-hover:scale-110 transition-transform duration-300">list_alt</span>
                  <p className="font-headline-md text-2xl font-bold text-[#121e1c] tabular-nums">{prospectLists}</p>
                  <p className="font-label-md text-[10px] text-slate-400 uppercase tracking-wider mt-1">Prospect Lists</p>
                </div>

              </div>

            </div>

            {/* Launch CTA Trigger bottom block */}
            <div className="px-6 md:px-8 pb-8">
              <button
                onClick={() => router.push("/app/link-pro")}
                className="w-full bg-[#00685f] hover:bg-[#005049] text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer shadow-sm active:scale-99"
                id="launch-linkpro-operational-btn"
              >
                Launch LinkPro
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>

        {/* Health & Insights Column with Conic Scale Gauge */}
        <div className="col-span-12 lg:col-span-4 space-y-6" id="insights-column">
          <div>
            <h3 className="font-headline-md text-lg font-bold text-[#121e1c]">Suite Health &amp; Insights</h3>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 shadow-sm">
            <p className="font-label-md text-[10px] text-slate-400 uppercase tracking-widest mb-8 text-center font-bold">Current usage overview</p>

            {/* Credit Gauge Container matching CSS exactly */}
            <div className="relative flex flex-col items-center" id="conic-gauge-alignment">

              {/* Radial gradient frame wrapper is simulated with conic styles based on ratio */}
              <div
                className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner transition-all duration-500 ease-out"
                style={{
                  background: `conic-gradient(from 180deg, #00685f 0%, #00685f ${creditRatio}%, #f1f5f9 ${creditRatio}%, #f1f5f9 100%)`
                }}
                id="usage-gauge-circle"
              >
                {/* Mask layer hides center to preserve look */}
                <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center transition-all">
                  <span className="font-display-lg text-2xl font-bold text-[#121e1c] tabular-nums">{creditsRemaining.toLocaleString()}</span>
                  <span className="font-label-md text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Remaining</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-6 text-center">
                <span className="font-bold text-[#00685f] font-mono">{(8400 - creditsRemaining).toLocaleString()}</span> of 8,400 credits used this billing cycle
              </p>
            </div>

            {/* Minor columns representation */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="font-headline-sm text-base font-bold text-[#121e1c] tabular-nums">{activeCampaigns}</p>
                <p className="font-label-md text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-1">Campaigns</p>
              </div>
              <div className="text-center">
                <p className="font-headline-sm text-base font-bold text-[#121e1c] tabular-nums">{prospectLists}</p>
                <p className="font-label-md text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-1">Prospect Lists</p>
              </div>
            </div>

            {/* Plan Badge wrapper line */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <span className="font-label-md text-[9px] text-slate-400 uppercase tracking-wider font-bold">Current Plan</span>
              <span className="font-label-md text-[9px] text-[#00685f] font-black uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">Starter</span>
            </div>

          </div>
        </div>

      </div>

      {/* Section 3: Coming Soon Expansion Deck */}
      <section className="pt-8 border-t border-slate-200/60" id="coming-soon-suite-section">

        <div className="flex items-center gap-4 mb-8">
          <h3 className="font-headline-md text-lg font-bold text-[#121e1c] whitespace-nowrap">Coming Soon to your Suite</h3>
          <div className="h-px w-full bg-slate-200/80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="coming-soon-bento">

          {/* Link Monitor Pro Bento Box */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 group hover:border-[#00685f] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md" id="monitor-coming-soon-item">

            <div>
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-[#00685f] border border-slate-200/60 shrink-0">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

              <h4 className="font-headline-sm text-base font-bold text-[#121e1c] mb-2">Link Monitor Pro</h4>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                Monitor your link portfolio, track your competitors' backlinks, and protect your SEO investment with real-time alerts and automated health checks.
              </p>
            </div>

            {waitlists.monitor ? (
              <div className="w-full bg-teal-50 border border-teal-100 text-[#006a61] py-3 rounded-lg text-center text-xs font-bold font-sans flex items-center justify-center gap-2 animate-slide-up">
                <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                Priority Notification Activated
              </div>
            ) : (
              <button
                onClick={(e) => {
                  setWaitlists(prev => ({ ...prev, monitor: true }));
                  showToast("You are subscribed to receive early Link Monitor launch access!");
                }}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[#00685f]" style={{ fontVariationSettings: "'wght' 500" }}>notifications</span>
                Notify Me on Launch
              </button>
            )}

          </div>

          {/* AEO Pro Bento Box */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 group hover:border-[#00685f] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md" id="aeo-coming-soon-item">

            <div>
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-[#00685f] border border-slate-200/60 shrink-0">
                  <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

              <h4 className="font-headline-sm text-base font-bold text-[#121e1c] mb-2">AEO Pro</h4>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                Optimize your brand visibility for AI search engines and answer engines. Stay ahead of the AI-powered search revolution with advanced intent mapping.
              </p>
            </div>

            {waitlists.aeo ? (
              <div className="w-full bg-teal-50 border border-teal-100 text-[#006a61] py-3 rounded-lg text-center text-xs font-bold font-sans flex items-center justify-center gap-2 animate-slide-up">
                <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                Early Access Slot Guaranteed
              </div>
            ) : (
              <button
                onClick={(e) => {
                  setWaitlists(prev => ({ ...prev, aeo: true }));
                  showToast("Secured Early Access slot successfully!");
                }}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[#00685f]" style={{ fontVariationSettings: "'wght' 500" }}>stars</span>
                Request Early Access
              </button>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}
