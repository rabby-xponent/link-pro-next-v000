"use client";

import { FileCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer
      className="bg-white border-t border-slate-200 py-6 px-6 sm:px-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-auto shrink-0 relative"
      id="app-footer-wrapper"
    >
      <div className="absolute top-0 left-6 -translate-y-1/2" id="footer-zone-indicator">
        <span className="bg-emerald-700 text-white text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase shadow-sm">
          Footer Zone
        </span>
      </div>

      <div className="space-y-1" id="footer-brand-claims">
        <h4 className="text-sm font-bold text-[#006a61] tracking-tight">Aetheric Intelligence</h4>
        <p className="text-xs text-slate-400 font-mono">
          &copy; {new Date().getFullYear()} Link Pro SEO OS. All rights reserved. Registered SaaS.
        </p>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500"
        id="footer-anchors"
      >
        <a
          href="#apidoc"
          onClick={(e) => {
            e.preventDefault();
            alert("Preparing sandbox API token documents...");
          }}
          className="hover:text-[#006a61] transition-colors cursor-pointer"
        >
          API Reference
        </a>
        <a
          href="#security"
          onClick={(e) => {
            e.preventDefault();
            alert("Platform complies strictly with SOC-2, OAuth 2.0 standards.");
          }}
          className="hover:text-[#006a61] transition-colors cursor-pointer"
        >
          Security Specs
        </a>
        <Link href="/app/link-pro/projects" className="hover:text-[#006a61] transition-colors cursor-pointer">
          Assets
        </Link>
      </div>

      <div className="flex items-center gap-2 text-slate-400" id="footer-shortcuts">
        <button
          type="button"
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          title="Secure Shell tunnel protocol established"
        >
          <FileCheck className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          title="Global firewall logs healthy"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </button>
      </div>
    </footer>
  );
}
