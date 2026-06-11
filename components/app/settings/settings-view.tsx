"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Shield,
  Users,
  Mail,
  Bell,
  Key,
  RefreshCw,
  BarChart2,
  Database,
  Download,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Check,
  Smartphone,
  AlertCircle
} from "lucide-react";

export function SettingsView({ tab }: { tab: string }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  // Profile inputs
  const [fullName, setFullName] = useState("Mak");
  const [userEmail] = useState("makctg@gmail.com");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password inputs
  const [currentPassword, setCurrentPassword] = useState("••••••••");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Team states
  const [teamMemberEmail, setTeamMemberEmail] = useState("");
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamMemberPassword, setTeamMemberPassword] = useState("");
  const [teamMemberRole, setTeamMemberRole] = useState("SEO Analyst");
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [teamList, setTeamList] = useState([
    { name: "Mak", email: "makctg@gmail.com", role: "Owner", status: "Active" },
    { name: "Alex Chen", email: "alex.c@uprankly-client.com", role: "Admin", status: "Active" },
    { name: "Emily Watson", email: "emily@uprankly-client.com", role: "SEO Analyst", status: "Active" }
  ]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTeamMemberPassword(password);
    setShowMemberPassword(true);
    triggerToast("Generated secure password.");
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamMemberEmail.trim() || !teamMemberName.trim() || !teamMemberPassword.trim()) {
      triggerToast("Please input a valid Name, Email, and Password.");
      return;
    }

    const newMember = {
      name: teamMemberName.trim(),
      email: teamMemberEmail.trim(),
      role: teamMemberRole,
      status: "Active"
    };
    setTeamList(prev => [...prev, newMember]);

    const notificationMsg = `Teammate status: ACTIVE. A secure SMTP email has been dispatched to ${newMember.email} with credentials to login.`;

    // Clear inputs
    setTeamMemberName("");
    setTeamMemberEmail("");
    setTeamMemberPassword("");
    setTeamMemberRole("SEO Analyst");

    triggerToast(notificationMsg);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      triggerToast("Your profile configurations have been updated securely.");
    }, 900);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      triggerToast("Please input a valid new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("Passwords do not match. Please verify.");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("••••••••");
      setNewPassword("");
      setConfirmPassword("");
      triggerToast("Administrative password updated securely.");
    }, 1000);
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    triggerToast(twoFactorEnabled ? "Two-factor authentication disabled." : "Two-factor authentication set up successfully via Authenticator App.");
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto px-4 py-2" id="uprankly-settings-view">

      {/* Absolute Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#004d40] text-emerald-100 py-3 px-5 rounded-lg shadow-2xl z-50 flex items-center gap-3 border border-emerald-500/20 animate-slide-up" id="settings-toast">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold font-sans">{toast}</span>
        </div>
      )}

      {/* Settings Navigation Sync Bar */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px" id="settings-tabs-row">
        {[
          { id: "account", label: "Account", icon: User },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
          { id: "usage", label: "Credit Usage", icon: BarChart2 },
          { id: "team", label: "Team", icon: Users }
        ].map((t) => {
          const isActive = tab === t.id;
          const IconStyle = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => router.push(`/app/${t.id}`)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px whitespace-nowrap ${
                isActive
                  ? "border-[#006a61] text-[#00665c]"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-200"
              }`}
            >
              <IconStyle className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Account view matches design system precisely */}
      {tab === "account" && (
        <div className="space-y-8">

          {/* Header Title Information */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight" id="account-settings-title">
              Account Settings
            </h1>
            <p className="text-slate-500 text-xs font-medium font-sans">
              Update your personal information and security credentials.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden" id="account-profile-card">

            {/* Inner Header */}
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/40">
              <h2 className="text-sm font-semibold text-slate-800">Profile</h2>
              <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
                General information about your account.
              </p>
            </div>

            {/* Fields layout */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Address details (Disabled state in mockup) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-[#f3f7f9] border border-slate-200 rounded-lg text-xs text-slate-500 font-medium cursor-not-allowed select-none"
                  />
                  <p className="text-[10.5px] text-slate-400 italic font-sans" id="email-warning-note">
                    Email cannot be changed manually. Contact support for assistance.
                  </p>
                </div>

              </div>

              {/* Action save trigger aligns bottom right */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-4 py-2.5 bg-[#006a61] hover:bg-[#004d44] disabled:bg-slate-200 text-white rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden" id="account-password-card">

            {/* Header portion */}
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/40">
              <h2 className="text-sm font-semibold text-slate-800">Change Password</h2>
              <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>

            {/* Form password layout */}
            <form onSubmit={handleChangePassword} className="p-5 sm:p-6 space-y-6">

              {/* Current password full width */}
              <div className="space-y-2 max-w-sm">
                <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Grid with new password and confirmations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Save password bottom right */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2.5 bg-[#006a61] hover:bg-[#004d44] disabled:bg-slate-200 text-white rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-2"
                >
                  {isUpdatingPassword ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <span>Change Password</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Bottom Grid for Two-Factor & Status Tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 2FA Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-teal-50 text-[#006a61]' : 'bg-slate-100 text-slate-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest block">Two-Factor Authentication</span>
                    {twoFactorEnabled ? (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded border border-emerald-150">ENABLED</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase rounded border border-amber-150 font-sans">RECOMMENDED</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">
                    Add an extra layer of system security. Logins require a verified code generated through apps like Google Authenticator or 1Password.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Toggle Protection Status</span>
                <button
                  type="button"
                  onClick={toggleTwoFactor}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactorEnabled ? 'bg-[#006a61]' : 'bg-slate-300'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>

            {/* Pro Plan Status Card */}
            <div className="bg-[#edf6f4] border border-[#d2eae4] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-mono text-[#006a61] uppercase tracking-wider block">Membership Badge</span>
                  <span className="px-2 py-0.5 bg-[#006a61] text-white text-[10px] font-extrabold uppercase rounded shadow-xs font-sans">PRO</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 font-sans">Uprankly Suite Authorized</h3>
                <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed">
                  Your seat is authorized under account <strong className="text-[#005c54] font-mono">{userEmail}</strong>. Enjoy full access to Link Pro campaigns, vetted guest-post directories, and automated site crawlers.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#c0e6da]/40 text-xs">
                <span className="text-slate-500 font-medium">Subscription Billing Renewals:</span>
                <span className="font-extrabold text-slate-850 font-mono">July 10, 2026</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Billing & Subscription View */}
      {tab === "billing" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Billing & Plans</h1>
            <p className="text-slate-500 text-xs font-medium font-sans">Review payment history, active tiers, and quotas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">

              {/* Subscription Summary */}
              <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-5 shadow-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#006a61]" />
                    Subscription Summary
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-150 text-[10px] font-black uppercase rounded">Active</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div className="space-y-1">
                    <span className="text-sm font-sans font-extrabold text-slate-800">Uprankly Pro Starter Package</span>
                    <p className="text-[11px] text-slate-500 font-semibold font-sans">Next renewal date: July 10, 2026. Custom credit parameters active.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast("Agency pro plan pricing is compiling. Redirecting soon.")}
                    className="px-3.5 py-1.8 bg-[#006a61] hover:bg-[#004d44] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Credit Limits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-3xs">
                      <span className="text-slate-400 block text-[9.5px] font-mono font-bold">CRAWL QUOTA</span>
                      <strong className="text-slate-800 block mt-0.5 font-mono text-sm font-extrabold">10,000 / month</strong>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-3xs">
                      <span className="text-slate-400 block text-[9.5px] font-mono font-bold">OUTBOX CAMPAIGNS</span>
                      <strong className="text-slate-800 block mt-0.5 font-mono text-sm font-extrabold">1,500 / month</strong>
                    </div>
                    <div className="p-3 border border-slate-250 rounded-lg bg-white shadow-3xs">
                      <span className="text-slate-400 block text-[9.5px] font-mono font-bold">TRACKED KEYWORDS</span>
                      <strong className="text-slate-800 block mt-0.5 font-mono text-sm font-extrabold">200 / month</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices table */}
              <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                <h3 className="text-sm font-semibold text-slate-800">
                  Recent Invoices
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="pb-2.5">INVOICE ID</th>
                        <th className="pb-2.5">DATE</th>
                        <th className="pb-2.5">AMOUNT</th>
                        <th className="pb-2.5">STATUS</th>
                        <th className="pb-2.5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 text-slate-700">
                        <td className="py-3 font-mono font-bold text-[#006a61]">INV-2026-004</td>
                        <td className="py-3">Jun 10, 2026</td>
                        <td className="py-3 font-mono font-bold">$0.00</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold rounded">Paid</span>
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => triggerToast("Compiling Secure invoice PDF wrapper... Downloading.")} className="text-[#006a61] hover:underline font-bold font-sans cursor-pointer">Download</button>
                        </td>
                      </tr>
                      <tr className="text-slate-700">
                        <td className="py-3 font-mono font-bold text-[#006a61]">INV-2026-003</td>
                        <td className="py-3">May 10, 2026</td>
                        <td className="py-3 font-mono font-bold">$0.00</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold rounded">Paid</span>
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => triggerToast("Generating bill statement May 2026...")} className="text-[#006a61] hover:underline font-bold font-sans cursor-pointer">Download</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Sidebar visual */}
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-950 space-y-4 h-fit shadow-md">
              <h4 className="text-xs font-extrabold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                SaaS Upgrade Tier
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
                Unlock high-fidelity client reports with white-labeled PDF files, automated schedule indexes, and priority Google crawl budgets.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => triggerToast("Stripe checkout portal initiating securely.")}
                  className="w-full bg-[#0d9488] hover:bg-[#0b7c72] text-white py-2 px-3 text-xs font-black rounded-lg transition-colors cursor-pointer text-center"
                >
                  Unlock Unlimited Pro Seat
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Credit Usage TAB */}
      {tab === "usage" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Credit & Resource Monitoring</h1>
            <p className="text-slate-500 text-xs font-medium font-sans">Monitor live crawler bandwidth and workspace limits.</p>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-6 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#006a61]" />
                Resource Usage
              </h3>
              <button
                onClick={() => triggerToast("Fetching active API credit logs...")}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Status
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Connected Senders</span>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-extrabold text-slate-800 font-mono">3 / 5</span>
                  <span className="text-slate-400 text-xs font-sans">Active</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 override-progress overflow-hidden">
                  <div className="bg-[#006a61] h-full rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#006a61] uppercase tracking-wider block">Tracked Site Crawls</span>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-extrabold text-slate-800 font-mono">2 / 2</span>
                  <span className="text-slate-400 text-xs font-sans">Domains</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 override-progress overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Outreach Target Pipelines</span>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-extrabold text-slate-800 font-mono">4 / 10</span>
                  <span className="text-slate-400 text-xs font-sans">Campaigns</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 override-progress overflow-hidden">
                  <div className="bg-[#006a61] h-full rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-teal-50/20 border border-teal-150 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-[#006a61] flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Ledger Allocations
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                Your monthly quota is shared globally across teammate slots. High-frequency link scans run on off-peak cycles to maximize speed. If you need dedicated SMTP relays or faster scan cycles, configure custom keys inside Account tab.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team settings content */}
      {tab === "team" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Team Management</h1>
            <p className="text-slate-500 text-xs font-medium font-sans">Invite collaborators and manage workspace permissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">

              <form onSubmit={handleAddNewMember} className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-xs" id="add-team-member-form">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#006a61]" />
                    Add Team Member Account
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Create a member account directly with custom credentials. An email will be automatically sent to the login inbox.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-755 block">Full Name</label>
                    <input
                      type="text"
                      value={teamMemberName}
                      onChange={(e) => setTeamMemberName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-755 block">Work Email</label>
                    <input
                      type="email"
                      value={teamMemberEmail}
                      onChange={(e) => setTeamMemberEmail(e.target.value)}
                      required
                      placeholder="teammate@uprankly.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password & Generator */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-755 block">Assign Password</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showMemberPassword ? "text" : "password"}
                          value={teamMemberPassword}
                          onChange={(e) => setTeamMemberPassword(e.target.value)}
                          required
                          placeholder="••••••••••••"
                          className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMemberPassword(!showMemberPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showMemberPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-705 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Generate a secure random password"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#006a61]" />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>

                  {/* Role Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-755 block">Workspace Role</label>
                    <select
                      value={teamMemberRole}
                      onChange={(e) => setTeamMemberRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#006a61]/10 focus:border-[#006a61] cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="SEO Analyst">SEO Analyst</option>
                      <option value="Billing Admin">Billing Admin</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#006a61] hover:bg-[#004d44] text-white text-xs font-black rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Register Member & Send Credentials</span>
                  </button>
                </div>
              </form>

              <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                <h3 className="text-sm font-semibold text-slate-850">
                  Active Staff Roster ({teamList.length})
                </h3>
                <div className="divide-y divide-slate-100 font-sans">
                  {teamList.map((m) => (
                    <div key={m.email} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">{m.name}</span>
                        <span className="font-mono text-slate-400 text-[10px] block">{m.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px]">{m.role}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold uppercase tracking-wider ${
                          m.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-amber-50 text-amber-700 border border-amber-150"
                        }`}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 h-fit font-sans">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Workspace Roles</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Owners & Admins can sync DNS settings, edit site campaigns, and modify billing parameters.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analysts hold read-only statistics and file compilation permissions keys. Custom permissions can be configured as workspace seats grow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
