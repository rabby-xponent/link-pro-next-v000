"use client";

import { FileCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isLinkProMode } from "@/lib/helpers/is-link-pro-mode";

export function DashboardFooter() {
  const pathname = usePathname();
  const linkProMode = isLinkProMode(pathname);

  return (
    <footer
      className="bg-white border-t border-slate-200/90 py-5 px-6 sm:px-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-auto shrink-0 relative"
      id="app-footer-wrapper"
    >
      <div className="absolute top-0 left-6 -translate-y-1/2" id="footer-zone-indicator">
        <span className="bg-[#006a61] text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase shadow-xs">
          {linkProMode ? "Link Pro Footer" : "Base Footer"}
        </span>
      </div>

      <div className="space-y-0.5" id="footer-brand-claims">
        <h4 className="text-sm font-black text-[#006a61] tracking-tight uppercase">Uprankly</h4>
        <p className="text-[11px] text-slate-400 font-sans font-semibold">
          &copy; {new Date().getFullYear()} Uprankly SEO platform &bull;{" "}
          {linkProMode ? "Link Pro Workspace" : "Console Workspace"}. All rights reserved.
        </p>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs font-bold text-slate-500"
        id="footer-anchors"
      >
        {linkProMode ? (
          <>
            <Link
              href="/app/link-pro"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="View active client projects catalog"
            >
              All Projects
            </Link>
            <Link
              href="/app/link-pro/projects/new"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Launch setup wizard for brand domain"
            >
              Add Project
            </Link>
            <Link
              href="/app/link-pro/projects"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Configure Link Opportunities profiles"
            >
              Link Profiles Strategy
            </Link>
            <Link
              href="/app/link-pro/campaigns"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Track ongoing email pitches and sequences"
            >
              Outreach Campaigns
            </Link>
            <Link
              href="/app/link-pro/inventory"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Inspect catalog of acquired backlinks with status"
            >
              Acquired Links
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/app/command-center"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Return to central Uprankly control console"
            >
              SEO Suite Console
            </Link>
            <Link
              href="/app/account"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Update personal profile and admin credentials"
            >
              Account Profile
            </Link>
            <Link
              href="/app/billing"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Review current SaaS plan level and invoices"
            >
              Plans &amp; Billing
            </Link>
            <Link
              href="/app/team"
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Invite collaborators to your seo organization"
            >
              Team Access
            </Link>
            <button
              type="button"
              onClick={() =>
                alert(
                  "Uprankly Diagnostic Report:\n• Server Node: Tokyo (asia-east1)\n• Core Database latency: 12ms\n• Crawler Engine status: 100% Operational",
                )
              }
              className="hover:text-[#006a61] hover:underline transition-colors cursor-pointer text-left focus:outline-none"
              title="Inspect technical latency and health nodes"
            >
              System Status
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400" id="footer-shortcuts">
        <button
          type="button"
          onClick={() =>
            alert(
              "Secure Workspace Check:\n• Encryption: TLS 1.3\n• Protocol: HTTP/2 Tunneling Active.\n• Session: Verified via JWT.",
            )
          }
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded cursor-pointer transition-colors"
          title="Secure Shell tunnel protocol established"
        >
          <FileCheck className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            alert(
              "Global Firewall Shield: Active\nNo suspicious activity logs detected in the last 24 hours.",
            )
          }
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded cursor-pointer transition-colors"
          title="Global firewall logs healthy"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </button>
      </div>
    </footer>
  );
}
