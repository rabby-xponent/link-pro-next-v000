"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { getPageTitle } from "@/lib/helpers/get-page-title";

import { TopBarToolsMenu } from "./top-bar-tools-menu";

export function TopBar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40" id="top-bar-header">
      <div className="flex items-center gap-4 text-sm" id="top-bar-breadcrumbs">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-slate-400 font-medium">Layout</span>
          <span className="text-slate-300 font-mono">/</span>
          <span className="text-[#006a61] font-semibold">{pageTitle}</span>
        </div>

        <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />

        <TopBarToolsMenu />
      </div>

      <div className="hidden lg:flex items-center relative max-w-sm w-full mx-4" id="top-bar-search-wrapper">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Quick Search (e.g. Domain Rating)..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full bg-[#f8f9ff] text-[#0b1c30] pl-10 pr-4 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-[#006a61] focus:ring-2 focus:ring-teal-100 transition-all font-sans"
          id="top-bar-search-input"
        />
      </div>

      <div className="flex items-center gap-4 sm:gap-6" id="top-bar-actions-profile">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-[#006a61] rounded-full relative cursor-pointer"
            title="Notifications"
            id="notification-badge-btn"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <Link
            href="/app/command-center"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf4fc] text-[#0d9488] hover:bg-[#dce9f8] text-xs font-black rounded-lg transition-all cursor-pointer border border-[#bcc9c6]/30 uppercase"
            title="Return to Uprankly Tools main suite"
            id="topbar-nav-uprankly-tools-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Uprankly Tools</span>
          </Link>
        </div>

        <span className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-semibold text-slate-800">Alex Chen</span>
            <span className="text-[10px] text-slate-400 font-mono px-1 bg-slate-50 border border-slate-100 rounded self-end">
              Admin
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Alex"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
