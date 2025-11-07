"use client";

import ClientTable from "@/src/components/clientTable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-gray-100">
      {/* Sidebar */}
      <header className="w-full border-b border-gray-800 px-8 py-4 flex items-center">
        <h1 className="text-xl font-semibold tracking-widest text-gray-300">
          VAROS
        </h1>
      </header>
      <div className="px-20">
        <ClientTable />
      </div>
    </div>
  );
}
