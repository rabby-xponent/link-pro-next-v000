"use client";

import { useRouter } from "next/navigation";
import { ProjectsView } from "@/components/app/link-pro/projects/projects-view";

export function ProjectsClient() {
  const router = useRouter();
  return <ProjectsView onRequestCreate={() => router.push("/app/link-pro/projects/new")} />;
}
