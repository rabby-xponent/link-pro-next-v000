import { DashboardFooter } from "@/components/common/dashboard-footer";
import { NoSsr } from "@/components/common/no-ssr";
import { Sidebar } from "@/components/common/sidebar";
import { TopBar } from "@/components/common/top-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex font-sans selection:bg-teal-100 selection:text-[#006a61]"
      id="app-viewport"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" id="main-content-stream">
        <TopBar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto" id="app-main-body">
          <NoSsr>{children}</NoSsr>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
