"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAV_ITEMS } from "@/lib/config/nav-items";
import { TOOLS_MENU_ITEMS } from "@/lib/config/tools-menu";

export function TopBarToolsMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-100/60 hover:bg-teal-100/35 rounded-lg text-xs font-bold text-[#00685f] transition-all cursor-pointer select-none active:scale-95"
        id="uprankly-tools-trigger"
      >
        <Sparkles className="w-3.5 h-3.5 animate-bounce-gentle" />
        <span>Uprankly Tools Menu</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />

          <div
            className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-slide-up"
            id="uprankly-tools-dropdown-container"
          >
            <div className="p-3.5 bg-slate-50/50">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#006a61] block mb-0.5">
                Uprankly Intelligence Suite
              </span>
              <p className="text-xs text-slate-500">
                Fast jump to active operational engines & diagnostics
              </p>
            </div>

            <div className="py-1 max-h-[380px] overflow-y-auto">
              {TOOLS_MENU_ITEMS.map((tool) => {
                const navItem = NAV_ITEMS.find((item) => item.id === tool.id);
                if (!navItem) {
                  return null;
                }

                const isSelected = pathname === navItem.href;
                const Icon = tool.icon;

                return (
                  <Link
                    key={tool.id}
                    href={navItem.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full text-left p-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? "bg-teal-50/30" : ""
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg border shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "bg-teal-50 text-[#006a61] border-teal-100"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-[#006a61]" : "text-slate-800"
                          }`}
                        >
                          {tool.label}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-mono font-bold text-white bg-teal-600 px-1.5 py-0.5 rounded uppercase shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{tool.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
