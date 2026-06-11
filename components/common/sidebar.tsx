"use client";

import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAV_ITEMS, NAV_SECTIONS, UPRANKLY_NAV_ITEMS, UPRANKLY_NAV_SECTIONS } from "@/lib/config/nav-items";
import { isLinkProMode } from "@/lib/helpers/is-link-pro-mode";

import { SidebarNavSection } from "./sidebar-nav-section";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const linkProMode = isLinkProMode(pathname);
  const sections = linkProMode ? NAV_SECTIONS : UPRANKLY_NAV_SECTIONS;
  const items = linkProMode ? NAV_ITEMS : UPRANKLY_NAV_ITEMS;

  return (
    <div
      style={{ transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      className={`bg-white border-r border-[#bcc9c6]/40 h-screen flex flex-col justify-between shrink-0 sticky top-0 overflow-y-auto z-50 ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
      id="app-sidebar-container"
    >
      {toastMsg && (
        <div
          className="absolute top-24 left-4 right-4 bg-teal-900 text-white p-3 rounded-lg shadow-xl text-[11px] font-sans font-semibold z-50 line-clamp-2 animate-slide-up"
          id="sidebar-context-toast"
        >
          {toastMsg}
        </div>
      )}

      <div>
        <div className="px-5 py-6 flex items-center justify-between border-b border-slate-100" id="sidebar-header">
          {!isCollapsed ? (
            <Link
              href="/app/command-center"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity text-left"
              title="Return to Uprankly Tools Suite"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 bg-[#0d9488]" id="sidebar-logo">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-slate-800 tracking-tight text-base leading-none" style={{ color: "#006a61" }}>
                  uprankly<span className="text-[#0d9488]">.</span>
                </span>
                <span className="text-[8px] text-[#6d7a77] uppercase font-mono font-bold tracking-widest mt-0.5">
                  {linkProMode ? "Link Pro App" : "Suite overview"}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/app/command-center"
              className="w-8 h-8 bg-[#0d9488] rounded-lg flex items-center justify-center text-white mx-auto shadow-sm hover:opacity-85 transition-opacity"
              title="Return to Uprankly Tools"
              id="sidebar-logo-collapsed"
            >
              <LayoutGrid className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 hover:bg-slate-100 rounded text-[#6d7a77] cursor-pointer transition-colors ml-1"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            id="sidebar-toggle-btn"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {linkProMode && (
          <div className="p-3 pb-0" id="back-to-uprankly-wrapper">
            <Link
              href="/app/command-center"
              className="w-full flex items-center gap-2 py-2 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-md text-[10.5px] font-black tracking-wide transition-all text-left cursor-pointer uppercase font-sans"
              id="global-uprankly-nav-btn"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
              {!isCollapsed && (
                <span className="flex items-center gap-1">
                  <span>←</span> Uprankly Tools
                </span>
              )}
            </Link>
          </div>
        )}

        <div className="p-3 space-y-4" id="sidebar-categories-scroller">
          {sections.map((section, index) => (
            <SidebarNavSection
              key={section || `section-${index}`}
              title={section}
              items={items.filter((item) => item.section === section)}
              activeHref={pathname}
              isCollapsed={isCollapsed}
              showDivider={index > 0}
              dividerIndex={index}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#bcc9c6]/20 mt-auto bg-slate-50/50" id="sidebar-footer">
        {!isCollapsed && (
          <div className="p-2 border-b border-slate-100 flex items-center justify-around text-[10px] text-[#6d7a77] font-semibold">
            <Link
              href="/app/link-pro/projects"
              className="hover:text-[#0d9488] flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Guide</span>
            </Link>
            <span className="text-slate-200">|</span>
            <button
              type="button"
              onClick={() =>
                triggerToast("Direct customer ticketing stream established. Support is online.")
              }
              className="hover:text-[#0d9488] flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Support</span>
            </button>
          </div>
        )}

        <div className="p-3.5" id="sidebar-profile-block">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full border border-[#0d9488]/20 bg-[#e5eeff] flex items-center justify-center text-[#0b1c30] font-bold text-xs shadow-sm shrink-0 uppercase select-none">
                MK
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-slate-800 text-xs leading-tight truncate">
                    Mak
                  </span>
                  <p className="text-[10px] text-[#6d7a77] font-medium leading-tight truncate">
                    Pro Member
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                type="button"
                onClick={() =>
                  triggerToast(
                    "User settings dashboard compiled. Authorized under verified premium token key.",
                  )
                }
                className="text-[#6d7a77]/50 hover:text-[#0d9488] cursor-pointer p-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                title="System Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
