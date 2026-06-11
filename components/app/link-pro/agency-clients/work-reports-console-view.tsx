"use client";

import React from "react";
import { FileText, Eye, Send, Check, Clock, ExternalLink } from "lucide-react";

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
}

interface WorkReportsConsoleViewProps {
  clients: Client[];
  orders: Order[];
  builtLinks: BuiltLink[];
  logoUrl: string;
  agencyName: string;
  agencySlogan: string;
  supportEmail: string;
  reportsSelectedClient: string;
  setReportsSelectedClient: (val: string) => void;
  reportsSelectedOrder: string;
  setReportsSelectedOrder: (val: string) => void;
  reportsCustomComment: string;
  setReportsCustomComment: (val: string) => void;
  reportsKpiToggles: {
    anchorAnalysis: boolean;
    drDistribution: boolean;
    spentMetrics: boolean;
    backlinkIndexPercentage: boolean;
  };
  setReportsKpiToggles: (val: any) => void;
  setSelectedReportOrder: (order: Order | null) => void;
  setShowReportModal: (val: boolean) => void;
  handleTestDispatchReport: (cName: string, oId: string) => void;
  triggerToast: (msg: string) => void;
}

export function WorkReportsConsoleView({
  clients,
  orders,
  builtLinks,
  logoUrl,
  agencyName,
  agencySlogan,
  supportEmail,
  reportsSelectedClient,
  setReportsSelectedClient,
  reportsSelectedOrder,
  setReportsSelectedOrder,
  reportsCustomComment,
  setReportsCustomComment,
  reportsKpiToggles,
  setReportsKpiToggles,
  setSelectedReportOrder,
  setShowReportModal,
  handleTestDispatchReport,
  triggerToast
}: WorkReportsConsoleViewProps) {
  const matchedClient = clients.find(c => c.id === reportsSelectedClient);
  const matchedOrder = orders.find(o => o.id === reportsSelectedOrder);
  const relatedLinks = builtLinks.filter(bl => bl.orderId === reportsSelectedOrder);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-xs font-semibold text-[#0b1c30]">
      {/* Sidebar Controller (span 4) */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0d9488]" />
            <span>SEO Work Reports Compiler</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Generate white-label client PDFs, print invoices, or transmit automatic summaries direct to client emails.
          </p>
        </div>

        <div className="space-y-4">
          {/* Target Client */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">1. Target Client Account</label>
            <select
              value={reportsSelectedClient}
              onChange={(e) => {
                setReportsSelectedClient(e.target.value);
                const firstOrder = orders.find(o => o.clientId === e.target.value);
                setReportsSelectedOrder(firstOrder ? firstOrder.id : "");
              }}
              className="w-full p-2.5 border border-slate-250 bg-slate-50 rounded-xl focus:ring-1 focus:ring-[#0d9488] focus:bg-white cursor-pointer font-bold text-slate-700 text-xs"
            >
              <option value="">-- Choose Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          {/* Target Campaign */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">2. Campaign order project</label>
            <select
              value={reportsSelectedOrder}
              onChange={(e) => setReportsSelectedOrder(e.target.value)}
              disabled={!reportsSelectedClient}
              className="w-full p-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-teal-550 cursor-pointer font-bold disabled:opacity-55 text-slate-705 text-xs"
            >
              <option value="">-- Choose Campaign --</option>
              {orders
                .filter(o => o.clientId === reportsSelectedClient)
                .map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.quantity} links)</option>
                ))}
            </select>
          </div>

          {/* Commentary */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">3. Custom Comment placement notes</label>
            <textarea
              value={reportsCustomComment}
              onChange={(e) => setReportsCustomComment(e.target.value)}
              placeholder="E.g. Referring addresses indexed successfully. Internal anchor velocity verified on Moz/Semrush."
              className="w-full p-2.5 border border-slate-205 rounded-xl h-24 outline-none resize-none font-sans font-medium text-slate-700 bg-white"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Include KPIs Widgets</span>

            <label className="flex items-center gap-2 text-[11px] text-slate-705 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reportsKpiToggles.anchorAnalysis}
                onChange={(e) => setReportsKpiToggles({ ...reportsKpiToggles, anchorAnalysis: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Anchor Cloud Diversity Chart</span>
            </label>

            <label className="flex items-center gap-2 text-[11px] text-slate-705 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reportsKpiToggles.drDistribution}
                onChange={(e) => setReportsKpiToggles({ ...reportsKpiToggles, drDistribution: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Ahrefs Domain Authority (DR) Scale</span>
            </label>

            <label className="flex items-center gap-2 text-[11px] text-slate-705 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reportsKpiToggles.backlinkIndexPercentage}
                onChange={(e) => setReportsKpiToggles({ ...reportsKpiToggles, backlinkIndexPercentage: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Live Checked Index Validation Badge</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                if (!reportsSelectedClient || !reportsSelectedOrder) {
                  triggerToast("Please choose a target client and campaign first.");
                  return;
                }
                if (matchedOrder) {
                  setSelectedReportOrder(matchedOrder);
                  setShowReportModal(true);
                }
              }}
              className="w-full py-2.5 bg-[#0d9488] hover:bg-[#007b6e] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview PDF / Print Report</span>
            </button>
            <button
              onClick={() => {
                if (!reportsSelectedClient || !reportsSelectedOrder) {
                  triggerToast("Please choose a target client and campaign first.");
                  return;
                }
                handleTestDispatchReport(matchedClient ? matchedClient.name : "Client", reportsSelectedOrder);
              }}
              className="w-full py-2.5 bg-[#0b1c30] hover:bg-black text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Direct SMTP Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF View Mock (span 8) */}
      <div className="lg:col-span-8 space-y-4">
        {reportsSelectedClient && reportsSelectedOrder ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 overflow-hidden">
            <div className="bg-[#0b1c30] text-teal-50 p-3 text-[10px] font-mono flex items-center justify-between">
              <span>WHITE-LABEL PROGRESS EXPORT PIPELINE</span>
              <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-black tracking-wider text-[8px]">
                Live Compilation Stable
              </span>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50">
              {/* White label Header */}
              <div className="flex justify-between items-start border-b border-gray-250 pb-5">
                <div className="flex items-center gap-2.5">
                  <img src={logoUrl} alt="Report Logo" className="w-8.5 h-8.5 rounded-lg object-cover bg-white p-0.5 border" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-sm font-sans font-black tracking-tight text-slate-900 uppercase">{agencyName}</h4>
                    <span className="text-[10px] text-[#0d9488] font-bold block">{agencySlogan}</span>
                  </div>
                </div>
                <div className="text-right text-[9.5px] text-slate-400 font-mono leading-relaxed font-bold">
                  <div>STATEMENT ID: {reportsSelectedOrder.toUpperCase().substring(0, 10)}</div>
                  <div>EXPORT DATE: {new Date().toLocaleDateString()}</div>
                  <div>SUPPORT: {supportEmail}</div>
                </div>
              </div>

              {/* Progress Summary info */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-2xs">
                <span className="text-[9.5px] uppercase font-black text-[#0d9488] tracking-widest block">Contract Campaign Overview</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[9.5px] text-slate-400 block font-bold uppercase">Recipient entity</span>
                    <span className="text-xs text-slate-800 font-sans font-black block mt-0.5">{matchedClient?.name}</span>
                    <span className="text-[10px] text-slate-400 block">{matchedClient?.company}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block font-bold uppercase">Assigned Campaign</span>
                    <span className="text-xs text-slate-800 font-sans font-black block mt-0.5 truncate max-w-[150px]">{matchedOrder?.name}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block font-bold uppercase">Procured Placements</span>
                    <span className="text-xs text-slate-800 font-mono font-black block mt-0.5">{relatedLinks.length} items</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block font-bold uppercase">Fulfillment</span>
                    <span className="text-xs text-emerald-800 font-sans font-bold block mt-0.5 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 max-w-max">
                      {matchedOrder ? Math.round((relatedLinks.length / matchedOrder.quantity) * 100) : 100}% Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* KPIs box layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reportsKpiToggles.drDistribution && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs space-y-1.5">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Average Publisher DR</span>
                    <span className="text-xl font-mono font-black text-slate-900 block">DR 68.5</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black max-w-max mx-auto block uppercase">
                      Premium Authority
                    </span>
                  </div>
                )}

                {reportsKpiToggles.anchorAnalysis && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs space-y-1.5">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Anchor Velocity status</span>
                    <span className="text-xl font-sans font-black text-slate-900 block">OPTIMIZED</span>
                    <span className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-black max-w-max mx-auto block uppercase">
                      Branded & Semantic
                    </span>
                  </div>
                )}

                {reportsKpiToggles.backlinkIndexPercentage && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs space-y-1.5">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Crawl Bot Verification</span>
                    <span className="text-xl font-mono font-black text-emerald-700 block">100% Verified</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black max-w-max mx-auto block uppercase">
                      Active on Google
                    </span>
                  </div>
                )}
              </div>

              {/* Comments block */}
              {reportsCustomComment.trim() && (
                <div className="bg-blue-50/50 border border-blue-150 p-4 rounded-xl space-y-1.5">
                  <span className="text-[9.5px] uppercase font-black text-blue-800 tracking-widest block">White-label backlink verification commentary</span>
                  <p className="text-[11px] font-mono leading-relaxed text-slate-700">{reportsCustomComment}</p>
                </div>
              )}

              {/* Table of placements */}
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase font-black tracking-wider block text-slate-400">Delivered Placements sheet</span>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-250 text-slate-450 font-black uppercase text-[9px] tracking-wider">
                        <th className="py-2 px-3">Anchor Target</th>
                        <th className="py-2 px-3">Referring URL</th>
                        <th className="py-2 px-3">Destination Domain</th>
                        <th className="py-2 px-3 text-right">Price Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 bg-white">
                      {relatedLinks.map(lk => (
                        <tr key={lk.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{lk.anchorText}</td>
                          <td className="py-2.5 px-3 font-mono text-[#0d9488] truncate max-w-[200px]">{lk.referringUrl}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 truncate max-w-[120px]">{lk.destination}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-755 font-bold">{lk.price}</td>
                        </tr>
                      ))}
                      {relatedLinks.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-400 italic">No built backlink records cataloged for this order segment yet. Insert some live records in the Master Placements screen.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature block */}
              <div className="flex justify-between items-center text-[9.5px] text-slate-450 border-t border-gray-200 pt-4 font-mono font-medium">
                <div>PREPARED BY WHITE-LABEL PORTAL MANAGER FOR {matchedClient?.name.toUpperCase()}</div>
                <div>SECURE SUPPORT OUTBOX: {supportEmail}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-350 rounded-2xl p-20 text-center text-slate-400 italic space-y-3 flex flex-col justify-center items-center">
            <FileText className="w-14 h-14 text-slate-300" />
            <h3 className="text-sm font-black text-slate-700 not-italic">No Compilation Worksheet Loaded</h3>
            <p className="max-w-xs mx-auto text-xs not-italic text-slate-405 leading-relaxed">
              Please choose a target Client account and Campaign project from the compiler sidebar on the left to dynamically synchronize white label statement outputs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
