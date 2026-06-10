"use client";

import { useRouter } from "next/navigation";
import { CreateCampaignView } from "@/components/app/link-pro/campaigns/create-campaign-view";

export function CreateCampaignClient() {
  const router = useRouter();
  return (
    <CreateCampaignView
      onComplete={() => router.push("/app/link-pro/campaigns")}
      onCancel={() => router.push("/app/link-pro/campaigns")}
    />
  );
}
