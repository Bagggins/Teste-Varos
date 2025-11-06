"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus } from "lucide-react";
import ClientCounter from "../clientCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import UserForm from "../userForm";
import { UserType } from "@/src/Types/user";

export default function ClientTable() {
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("");
  const [selectedConsultantData, setSelectedConsultantData] =
    useState<UserType>({} as UserType);
  const [consultantList, setConsultantList] = useState<UserType[]>([]);
  const [clientList, setClientList] = useState<UserType[]>([]);
  const [filteredClientList, setFilteredClientList] = useState<UserType[]>([]);
  const [isLoadingConsultants, setIsLoadingConsultants] = useState(true);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false);
  const [isEditUserFormOpen, setIsEditUserFormOpen] = useState(false);

  // Fetch consultants on mount
  useEffect(() => {
    fetchConsultants();
  }, []);

  // Fetch clients when consultant changes
  useEffect(() => {
    if (selectedConsultantId) {
      const consultant = consultantList.find(
        (c) => c.id.toString() === selectedConsultantId
      );
      if (consultant) {
        fetchClientsForConsultant(consultant);
      }
    } else {
      setClientList([]);
      setFilteredClientList([]);
    }
  }, [consultantList, selectedConsultantId]);

  // Filter clients by date range
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredClientList(clientList);
      return;
    }

    const filtered = clientList.filter((client) => {
      const createdDate = new Date(client.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return createdDate >= start && createdDate <= end;
      } else if (start) {
        return createdDate >= start;
      } else if (end) {
        return createdDate <= end;
      }
      return true;
    });

    setFilteredClientList(filtered);
  }, [clientList, startDate, endDate]);

  async function fetchConsultants() {
    setIsLoadingConsultants(true);
    try {
      const response = await fetch("/api/consultants", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch consultants");
      }

      const data = await response.json();
      setConsultantList(data);

      // Auto-select first consultant
      if (data.length > 0) {
        setSelectedConsultantId(data[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching consultants:", error);
      setConsultantList([]);
    } finally {
      setIsLoadingConsultants(false);
    }
  }

  async function fetchClientsForConsultant(consultant: UserType) {
    // If consultant has no clients, don't fetch
    if (!consultant.clientList || consultant.clientList.length === 0) {
      setClientList([]);
      return;
    }
    setSelectedConsultantData(consultant);
    setIsLoadingClients(true);
    try {
      // Ensure clientList contains numbers, not strings
      const clientIds = consultant.clientList.map((id) =>
        typeof id === "string" ? parseInt(id, 10) : id
      );

      const response = await fetch("/api/clients/by-consultant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientList: clientIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClientList(data);
      setFilteredClientList(data);
    } catch (error) {
      console.error("Error fetching clients for consultant:", error);
      setClientList([]);
    } finally {
      setIsLoadingClients(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}h`;
  }

  function handleEditClient(client: UserType) {
    console.log("Edit client:", client);
    // Dialog implementation will come later
  }

  const selectedConsultant = consultantList.find(
    (c) => c.id.toString() === selectedConsultantId
  );

  const isLoading = isLoadingConsultants || isLoadingClients;

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-gray-100">
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        {/* Filters and Actions */}
        <div className="flex justify-between items-start mb-6">
          <ClientCounter />

          <div className="flex flex-col items-end gap-4">
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsNewUserFormOpen(true)}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Criar usuário
                <Plus className="w-4 h-4" />
              </Button>

              <UserForm
                open={isNewUserFormOpen}
                onOpenChange={setIsNewUserFormOpen}
                isEdit={false}
              />
              <Button
                onClick={() => setIsEditUserFormOpen(true)}
                disabled={
                  !selectedConsultantId ||
                  isLoadingConsultants ||
                  isLoadingClients
                }
                className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white disabled:opacity-50"
              >
                Editar consultor
                <Pencil className="w-4 h-4" />
              </Button>

              <UserForm
                open={isEditUserFormOpen}
                onOpenChange={setIsEditUserFormOpen}
                isEdit={true}
                userData={selectedConsultantData}
              />
            </div>

            {/* Filters */}
            {isLoadingConsultants ? (
              <Skeleton className="h-10 w-[600px]" />
            ) : (
              <div className="flex gap-2">
                {/* Consultant Name Selector */}
                <Card className="bg-[#151515] border-gray-800 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 whitespace-nowrap">
                      Nome do consultor
                    </label>
                    <Select
                      value={selectedConsultantId}
                      onValueChange={setSelectedConsultantId}
                    >
                      <SelectTrigger className="w-[180px] bg-transparent border-0 text-sm h-auto p-0 text-gray-100">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-gray-700 text-gray-100">
                        {consultantList.map((consultant) => (
                          <SelectItem
                            key={consultant.id}
                            value={consultant.id.toString()}
                            className="text-gray-100 focus:bg-gray-800 focus:text-gray-100"
                          >
                            {consultant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Consultant Email Display */}
                <Card className="bg-[#151515] border-gray-800 px-3 py-2 pt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 whitespace-nowrap">
                      Email do consultor
                    </label>
                    <span className="text-sm text-gray-100">
                      {selectedConsultant?.email || "-"}
                    </span>
                  </div>
                </Card>

                {/* Period - Date Range Picker */}
                <Card className="bg-[#151515] border-gray-800 px-3 py-2 pt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 whitespace-nowrap">
                      Período
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent text-sm outline-none text-gray-100 [color-scheme:dark]"
                      placeholder="Data inicial"
                    />
                    <span className="text-gray-400">até</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent text-sm outline-none text-gray-100 [color-scheme:dark]"
                      placeholder="Data final"
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Clients Table */}
        <Card className="bg-[#151515] border-gray-800 text-gray-100">
          {isLoading ? (
            <div className="p-8 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Table className="[&_th]:text-gray-100 [&_td]:text-gray-100">
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-[#1a1a1a]">
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center opacity-60 py-12"
                    >
                      {selectedConsultantId
                        ? clientList.length === 0
                          ? "Este consultor não possui clientes cadastrados"
                          : "Nenhum cliente encontrado no período selecionado"
                        : "Selecione um consultor para ver seus clientes"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientList.map((client) => (
                    <TableRow
                      key={client.id}
                      className="border-gray-800 hover:bg-[#1b1b1b] transition-colors"
                    >
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.cpf}</TableCell>
                      <TableCell>{client.age} anos</TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={client.address}
                      >
                        {client.address}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(client.createdAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(client.lastUpdated)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClient(client)}
                          className="bg-green-800 hover:bg-green-900 h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}
