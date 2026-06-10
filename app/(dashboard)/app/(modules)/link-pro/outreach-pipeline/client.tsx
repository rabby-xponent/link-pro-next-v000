"use client";

import { useRouter } from "next/navigation";
import { ProspectListView } from "@/components/app/link-pro/outreach-pipeline/prospect-list-view";
import { NAV_ITEMS } from "@/lib/config/nav-items";

export function ProspectListClient() {
  const router = useRouter();
  const tabToHref = Object.fromEntries(NAV_ITEMS.map((item) => [item.id, item.href]));

  return (
    <ProspectListView
      onTabChange={(tab) => {
        const href = tabToHref[tab];
        if (href) router.push(href);
      }}
    />
  );
}
