"use client";

import type { NavItem } from "@/lib/config/nav-items";

import { SidebarNavItem } from "./sidebar-nav-item";

interface SidebarNavSectionProps {
  title: string;
  items: NavItem[];
  activeHref: string;
  isCollapsed: boolean;
  showDivider: boolean;
  dividerIndex: number;
}

export function SidebarNavSection({
  title,
  items,
  activeHref,
  isCollapsed,
  showDivider,
  dividerIndex,
}: SidebarNavSectionProps) {
  return (
    <div className="space-y-1">
      {showDivider && (
        <div className="border-t border-slate-100/80 my-3 mx-1" id={`cat-divider-${dividerIndex}`} />
      )}

      {!isCollapsed ? (
        <p className="px-3 font-bold text-[9.5px] text-[#6d7a77]/80 uppercase tracking-widest mb-1.5 mt-1 select-none font-sans">
          {title}
        </p>
      ) : (
        <div className="h-1" />
      )}

      <div className="space-y-0.5">
        {items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isActive={activeHref === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
}
