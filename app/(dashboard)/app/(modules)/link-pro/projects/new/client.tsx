"use client";

import { useRouter } from "next/navigation";
import { CreateProjectWizardView } from "@/components/app/link-pro/create-project-wizard/create-project-wizard-view";

export function CreateProjectWizardClient() {
  const router = useRouter();
  return (
    <CreateProjectWizardView
      onComplete={() => router.push("/app/link-pro")}
      onCancel={() => router.push("/app/link-pro")}
    />
  );
}
