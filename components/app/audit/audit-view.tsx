"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  RotateCw, 
  Code2, 
  Play, 
  Eye, 
  ClipboardCopy,
  Terminal,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { CodeAuditResult } from "@/types/index";

export function AuditView() {
  const [codeSnippet, setCodeSnippet] = useState(
`// Non-compliant "Purple Blob" Hero Button
export function BadCard() {
  return (
    <div className="bg-purple-900 rounded-full p-8 shadow-2xl text-center">
      <h3 className="text-3xl text-pink-400 font-bold">Chronos Orbit Tracker v2</h3>
      <p className="text-purple-200 mt-4 text-xs">● SYSTEM STANDBY -- LATENCY: 22MS</p>
      <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-4 px-10 font-bold shadow-lg">
        LAUNCH METRICS ENGINE PORT:3000
      </button>
    </div>
  );
}`
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeAuditResult | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Preset snippets
  const presets = [
    {
      name: "Non-Compliant (Purple Drop)",
      snippet: `// Non-compliant "Purple Blob" Hero Button
export function BadCard() {
  return (
    <div className="bg-purple-900 rounded-full p-8 shadow-2xl text-center">
      <h3 className="text-3xl text-pink-400 font-bold">Chronos Orbit Tracker v2</h3>
      <p className="text-purple-200 mt-4 text-xs">● SYSTEM STANDBY -- LATENCY: 22MS</p>
      <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-4 px-10 font-bold shadow-lg">
        LAUNCH METRICS ENGINE PORT:3000
      </button>
    </div>
  );
}`
    },
    {
      name: "Mild-Conformant (Dark Slate)",
      snippet: `// OK structure, but misses corner radii and typography tokens
export function MildCard() {
  return (
    <div className="bg-slate-800 rounded-none border border-slate-700 p-6">
      <div className="text-xs font-mono text-zinc-400 uppercase">Audit Module</div>
      <h4 className="text-xl text-white font-medium tracking-wide mt-1">SEO Target Data Feed</h4>
      <p className="text-sm text-zinc-300 mt-2">Active crawlers polling page speed indexes.</p>
      <button className="mt-4 bg-teal-500 text-black py-2 px-6 font-semibold">
        Run Crawler
      </button>
    </div>
  );
}`
    },
    {
      name: "Compliant Baseline (Teal/Navy Grid)",
      snippet: `// Perfectly styled Uprankly Component!
import React from 'react';
export function CompliantCard() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl">
      <div className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">
        Category: Authority
      </div>
      <h3 className="font-semibold text-slate-800 text-base leading-tight mt-1 tracking-tight">
        Uprankly Domain Performance
      </h3>
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
        Integrate backlink authority metrics using strict 8px base units layout grids.
      </p>
      <div className="mt-5 flex gap-3">
        <button className="bg-[#006a61] hover:bg-opacity-90 text-white font-semibold text-xs py-2 px-4 rounded-md cursor-pointer transition-all">
          Provision Workspace
        </button>
        <button className="border border-[#006a61] text-[#006a61] font-semibold text-xs py-2 px-4 rounded-md cursor-pointer transition-all hover:bg-teal-50/50">
          Extract Reports
        </button>
      </div>
    </div>
  );
}`
    }
  ];

  // Run Gemini server-side audit via API
  const handleRunAudit = async () => {
    if (!codeSnippet.trim()) {
      alert("Please paste some React component code to audit.");
      return;
    }
    setLoading(true);
    setErrorStatus(null);
    setResult(null);

    try {
      const response = await fetch("/api/audit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeSnippet })
      });

      if (!response.ok) {
        throw new Error(`API returned standard error code ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Could not complete audit review request.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Corrected component output copied to clipboard!");
  };

  return (
    <div className="space-y-8" id="audit-root">
      
      {/* Informational Hero Area */}
      <div className="bg-[#eff4ff] border border-slate-200 rounded-xl p-6 relative overflow-hidden" id="audit-banner">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a61] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Design System Copilot</span>
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#006a61]" />
            <span>Aetheric Design System &amp; Component Auditor</span>
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Verify code against specific brand components, spacing tokens, typography grids, and color rules. Standardized in real-time by a custom <strong>Gemini 3.5-flash</strong> audit engine hosted securely on the server-side proxy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="audit-workspace-layout">
        
        {/* Left Side: Code Editor Workspace */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4" id="audit-editor-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#006a61]" />
              <span>React / Tailwind Source</span>
            </h3>

            {/* Presets lists buttons */}
            <div className="flex flex-wrap items-center gap-2" id="preset-selector-row">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCodeSnippet(p.snippet)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer text-slate-600"
                  title="Load Preset Code"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-normal">
            Edit the JSX block below, or select a template preset from above to trigger automated evaluations. Let Gemini rate layout conformity!
          </p>

          {/* Textarea code container */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 p-2" id="textarea-frame">
            <div className="flex items-center justify-between bg-slate-800 text-[10px] text-slate-400 font-mono py-1.5 px-3 rounded-md mb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>workspace_comp_index.tsx</span>
              </span>
              <span>JSX / TSX Support</span>
            </div>
            
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={11}
              className="w-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none p-2 resize-y leading-relaxed"
            />
          </div>

          {/* Core Action triggers */}
          <div className="flex justify-between items-center pt-2" id="trigger-audit-footer">
            <span className="text-[10px] text-slate-400 font-mono">Uses Gemini 3.5-flash API securely</span>
            
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className={`bg-[#006a61] hover:bg-[#005049] text-white py-2.5 px-5 font-bold text-xs rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              id="submit-audit-btn"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Auditing specifications...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Audit Component Guidelines</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Audit Reports and results */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between min-h-[480px]" id="audit-results-card">
          
          {loading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-4" id="audit-loader">
              <div className="w-12 h-12 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-[#006a61] animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">Reviewing Spacing, Typo &amp; Colors</p>
                <p className="text-xs text-slate-400 max-w-sm">Google AI Studio server-side Gemini 3.5-flash is checking components against strict final hierarchies...</p>
              </div>
            </div>
          )}

          {errorStatus && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-3" id="audit-error">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">Auditor Connection Failed</p>
                <p className="text-xs text-slate-400 mt-1">{errorStatus}</p>
              </div>
              <button 
                onClick={handleRunAudit}
                className="mt-2 text-xs font-semibold text-[#006a61] hover:underline"
              >
                Try connecting again
              </button>
            </div>
          )}

          {!loading && !errorStatus && !result && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400" id="audit-empty-report">
              <Code2 className="w-12 h-12 stroke-1 text-slate-300 block mb-2" />
              <p className="text-sm font-bold text-slate-700">Awaiting Specification Check</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">Click &quot;Audit Component Guidelines&quot; on the left to evaluate your component style, correct code layout issues or auto-convert colors to Teal.</p>
            </div>
          )}

          {!loading && !errorStatus && result && (
            <div className="flex-grow space-y-6" id="audit-report-loaded">
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4" id="loaded-header">
                <div>
                  <h4 className="font-bold text-slate-800">Design System Audit Report</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Evaluation score &amp; automated corrections</p>
                </div>

                {/* Score gauge */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-lg" id="score-block">
                  {/* Score radial */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="21" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="21" 
                        stroke={result.score >= 80 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"} 
                        strokeWidth="5" 
                        fill="none" 
                        strokeDasharray={132}
                        strokeDashoffset={132 - (132 * result.score) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-slate-800">{result.score}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block leading-none">Conformance</span>
                    <strong className="text-xs font-bold text-slate-700 block mt-1">
                      {result.score >= 80 ? "Excellent Match" : result.score >= 50 ? "Mild Violations" : "High Violations"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Checklist & bullet feedback */}
              <div className="space-y-4" id="report-bullets">
                {/* Text summary block */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed text-slate-600 font-sans">
                  <strong>Architect summary:</strong> {result.explanation}
                </div>

                {/* Bullet details */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">
                    Checklist Evaluations
                  </span>
                  <div className="grid grid-cols-1 gap-2" id="bullets-deck">
                    {result.details.map((b, bIdx) => (
                      <div 
                        key={bIdx}
                        className="flex items-start gap-2.5 p-2 bg-white rounded border border-slate-100 text-xs text-slate-600 font-sans"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#006a61] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corrected code view dropdown block */}
              <div className="space-y-2 pt-2" id="report-code-block">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Corrected Component Code</span>
                  <button
                    onClick={() => copyToClipboard(result.correctedCode)}
                    className="flex items-center gap-1 text-[#006a61] hover:underline cursor-pointer font-semibold"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg bg-slate-900 p-3 max-h-48 overflow-y-auto text-left font-mono text-[11px] text-slate-200 leading-normal" id="corrected-terminal">
                  <pre>{result.correctedCode}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
