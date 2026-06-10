"use client";

import { useState } from "react";
import { BlueprintView } from "@/components/app/link-pro/blueprint/blueprint-view";

export function BlueprintClient() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <BlueprintView
      isSidebarCollapsedGlobal={isSidebarCollapsed}
      onToggleSidebarGlobal={setIsSidebarCollapsed}
    />
  );
}
