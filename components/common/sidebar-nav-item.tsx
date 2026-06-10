"use client";

import Link from "next/link";

import type { NavItem } from "@/lib/config/nav-items";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({ item, isActive, isCollapsed }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-[11px] tracking-wide transition-all text-left font-medium cursor-pointer relative group ${
        isActive
          ? "bg-[#edf4fc] text-[#0d9488] font-bold pl-3"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
      id={`nav-item-${item.id}`}
    >
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#0d9488] rounded-r-sm" />
      )}

      <Icon
        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
          isActive ? "text-[#0d9488]" : "text-[#6d7a77] group-hover:text-slate-700"
        }`}
      />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {isCollapsed && (
        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[9.5px] font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
}
