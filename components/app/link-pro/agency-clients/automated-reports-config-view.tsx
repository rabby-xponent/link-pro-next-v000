"use client";

import React from "react";
import { Clock, Send } from "lucide-react";

interface DispatchLog {
  id: string;
  clientName: string;
  orderName: string;
  recipient: string;
  date: string;
  status: string;
  trigger: string;
}

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

interface AutomatedReportsConfigViewProps {
  dispatchSchedule: string;
  setDispatchSchedule: (val: string) => void;
  autoTriggerOnComplete: boolean;
  setAutoTriggerOnComplete: (val: boolean) => void;
  notifyOnStatusChange: boolean;
  setNotifyOnStatusChange: (val: boolean) => void;
  emailTemplateText: string;
  setEmailTemplateText: (val: string) => void;
  dispatchLogs: DispatchLog[];
  handleTestDispatchReport: (cName: string, oId: string) => void;
  clients: Client[];
  orders: Order[];
  triggerToast: (msg: string) => void;
}

export function AutomatedReportsConfigView({
  dispatchSchedule,
  setDispatchSchedule,
  autoTriggerOnComplete,
  setAutoTriggerOnComplete,
  notifyOnStatusChange,
  setNotifyOnStatusChange,
  emailTemplateText,
  setEmailTemplateText,
  dispatchLogs,
  handleTestDispatchReport,
  clients,
  orders,
  triggerToast
}: AutomatedReportsConfigViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-xs font-semibold text-[#0b1c30]">
      {/* Configuration column (span 6) */}
      <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-[#0d9488]" />
            <span>Reports Dispatch Scheduler</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Establish automated cron outbox queues. Clients receive dynamic email digests styled by your white-label settings.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerToast("Campaign automation cron constraints activated successfully!");
          }}
          className="space-y-4"
        >
          {/* Dispatch Interval select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-450 block">Outbox Dispatch Interval</label>
            <select
              value={dispatchSchedule}
              onChange={(e) => setDispatchSchedule(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl cursor-pointer font-bold text-slate-705 text-xs focus:ring-1 focus:ring-teal-500 font-sans outline-none"
            >
              <option value="Weekly">Weekly (Every Monday at 8:00 AM UTC)</option>
              <option value="Bi-Weekly">Bi-Weekly (1st and 15th of month)</option>
              <option value="Monthly">Monthly (Every 1st at 6:00 AM UTC)</option>
              <option value="Manual Only">Disabled (Manual trigger only)</option>
            </select>
          </div>

          {/* Trigger events checklist */}
          <div className="space-y-2.5 pb-2 border-b border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Automation Event Triggers</span>

            <label className="flex items-center gap-2 text-[11px] text-slate-705 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoTriggerOnComplete}
                onChange={(e) => setAutoTriggerOnComplete(e.target.checked)}
                className="rounded text-teal-600 focus:ring-[#0d9488]"
              />
              <span>Trigger instant delivery as soon as campaign reaches 100% completion</span>
            </label>

            <label className="flex items-center gap-2 text-[11px] text-slate-705 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyOnStatusChange}
                onChange={(e) => setNotifyOnStatusChange(e.target.checked)}
                className="rounded text-teal-600 focus:ring-[#0d9488]"
              />
              <span>Dispatch incremental delta digests when referring link index flags change</span>
            </label>
          </div>

          {/* Dynamic Template customization section */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold text-slate-450 block">Digest Message Template (HTML)</label>
              <span className="text-[9px] text-[#0d9488] font-mono font-black">SMTP PARSER PLUGGED</span>
            </div>
            <textarea
              value={emailTemplateText}
              onChange={(e) => setEmailTemplateText(e.target.value)}
              className="w-full h-36 font-mono text-[10.5px] p-2.5 border border-slate-205 rounded-xl outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed font-semibold bg-white"
            />
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] space-y-1 text-slate-450 leading-relaxed">
              <span className="text-[#0d9488] font-black uppercase text-[8px] tracking-wider block">Placeholders Substitution Syntax</span>
              <div>Include these dynamic tokens dynamically: <code className="bg-white px-1 py-0.5 rounded text-slate-800 border font-mono font-bold">{`{CLIENT_NAME}`}</code>, <code className="bg-white px-1 py-0.5 rounded text-slate-800 border font-mono font-bold">{`{ORDER_ID}`}</code>, <code className="bg-white px-1 py-0.5 rounded text-slate-800 border font-mono font-bold">{`{LINKS_COUNT}`}</code>, <code className="bg-white px-1 py-0.5 rounded text-slate-800 border font-mono font-bold">{`{AGENCY_NAME}`}</code>.</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0d9488] hover:bg-[#007b6e] text-white text-xs font-black rounded-xl cursor-pointer hover:shadow-xs transition-all"
          >
            Activate Automation rules
          </button>
        </form>
      </div>

      {/* Outbound mail dispatch historical audit desk (span 6) */}
      <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#0d9488]" />
              <span>Cron Dispatched Outbox Logs</span>
            </h2>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Outbox delivery queue chronological logs.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (clients.length > 0 && orders.length > 0) {
                handleTestDispatchReport(clients[0].name, orders[0].id);
              } else {
                triggerToast("Add a client and an order project record first to simulate sending.");
              }
            }}
            className="px-3.5 py-1.5 bg-[#edf4fc] hover:bg-teal-50 text-[#0d9488] border border-slate-200 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Dispatch Test Outbox
          </button>
        </div>

        <div className="space-y-3">
          {dispatchLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:shadow-xs transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-black text-slate-800 block">{log.clientName} ({log.recipient})</span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                    SMTP SUCCESS
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-500 font-semibold space-y-0.5">
                  <div>Ref Order: <b className="font-bold text-slate-700">{log.orderName}</b></div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span>Source:</span>
                    <span className="bg-slate-150 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold text-slate-650">{log.trigger}</span>
                  </div>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-400 space-y-1">
                <div>{log.date}</div>
                <div className="text-[#0d9488] font-sans text-[10px] font-black tracking-tight flex items-center justify-end gap-1 uppercase">
                  <span>Delivered</span>
                  <span>✔</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
