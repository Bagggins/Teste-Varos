import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import ClientCounter from "../clientCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UserForm from "../userForm";

export default function ClientTable() {
  const [consultant, setConsultant] = useState("John Doe");
  const [consultantList, setConsultantList] = useState<string[]>([]);
  const [clientList, setClientLst] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Skeleton className="h-[20px] w-[100px] rounded-full" />
  ) : (
    <div className="flex min-h-screen bg-[#0f0f0f] text-gray-100">
      {/* Main content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        {/* Filters */}
        <div className="flex place-content-between">
          <ClientCounter />
          <div className="flex justify-self-end flex-col items-end gap-4 mb-6 flex-wrap w-fit">
            <UserForm isEdit={false} />
            <div className="flex flex-row">
              <div className="flex items-center gap-2 bg-[#151515] border border-gray-800 rounded-lg px-3 py-2">
                <label className="text-xs text-gray-400 whitespace-nowrap">
                  Nome do consultor
                </label>
                <select
                  value={consultant}
                  onChange={(e) => setConsultant(e.target.value)}
                  className="bg-transparent text-sm outline-none appearance-none"
                >
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-2 bg-[#151515] border border-gray-800 rounded-lg px-3 py-2">
                <label className="text-xs text-gray-400 whitespace-nowrap">
                  Email do consultor
                </label>
                <select className="bg-transparent text-sm outline-none appearance-none">
                  <option>johndoe@gmail.com</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-2 bg-[#151515] border border-gray-800 rounded-lg px-3 py-2">
                <label className="text-xs text-gray-400 whitespace-nowrap">
                  Período
                </label>
                <input
                  type="text"
                  value="21/10/2025 até 21/12/2025"
                  readOnly
                  className="bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#151515] border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">CPF</th>
                <th className="px-4 py-3">Idade</th>
                <th className="px-4 py-3">Endereço</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="border-t border-gray-800 hover:bg-[#1b1b1b]"
                >
                  <td className="px-4 py-3">John Doe</td>
                  <td className="px-4 py-3">johndoe@gmail.com</td>
                  <td className="px-4 py-3">(00) 00000-0000</td>
                  <td className="px-4 py-3">000.000.000-00</td>
                  <td className="px-4 py-3">28 anos</td>
                  <td className="px-4 py-3">Lorem ipsum dolor...</td>
                  <td className="px-4 py-3">08/05/2024 às 8:20h</td>
                  <td className="px-4 py-3">08/05/2024 às 9:20h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
