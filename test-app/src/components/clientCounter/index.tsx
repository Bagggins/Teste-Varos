import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ClientCounter() {
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetCounter();
  }, []);

  async function handleGetCounter() {
    try {
      const response = await fetch("/api/clients/count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setTotalClients(data);
    } catch (error) {
      console.error("Error fetching clients count:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return isLoading ? (
    <Skeleton className="h-10 w-[600px]" />
  ) : (
    <div className="mb-8 w-fit">
      <div className="items-center bg-[#151515] border border-gray-800 rounded-lg p-5 w-[100%]">
        <p className="text-sm text-gray-400">Total de clientes</p>
        <div className="flex justify-center items-center gap-1 mt-2">
          <p className="text-3xl font-semibold">{totalClients}</p>
          <span className="text-green-500 text-sm">↑</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">nos últimos 7 dias</p>
      </div>
    </div>
  );
}
