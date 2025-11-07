import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ClientCounterProps {
  needsRefresh: boolean;
  setNeedsRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function ClientCounter(props: ClientCounterProps) {
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetCounter();
  }, []);

  useEffect(() => {
    if (props.needsRefresh === true) {
      handleGetCounter();
      props.setNeedsRefresh(false);
    }
  }, [props, props.needsRefresh]);

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

  return isLoading || props.needsRefresh ? (
    <Skeleton className="opacity-10 h-10 w-[30%]" />
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
