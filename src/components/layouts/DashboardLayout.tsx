import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChildProcess } from "child_process";
import { ReactNode } from "react";
import { ResponsiveLayout } from "./ResponsiveLayout";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ResponsiveLayout>{children}</ResponsiveLayout>
      {/* <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div> */}
    </div>
  );
};
