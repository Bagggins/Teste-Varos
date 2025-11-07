"use client";
//ajustar selects!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserType } from "@/src/Types/user";
import { Pencil, Plus, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ClientType {
  id: string;
  name: string;
}

interface UserFormProps {
  isEdit: boolean;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  userData?: UserType;
  onSuccess: () => void;
}

export default function UserForm(props: UserFormProps) {
  const [userFormData, setUserFormData] = useState<UserType>({
    id: "0",
    name: "",
    email: "",
    phone: "",
    cpf: "",
    age: "",
    address: "",
    addon: "",
    cep: "",
    state: "",
    isConsultant: "",
    clientList: null,
    createdAt: "",
    lastUpdated: "",
  });
  const [activeTab, setActiveTab] = useState("info");
  const [clientList, setClientList] = useState<ClientType[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Fetch clients when dialog opens and user is consultant
  useEffect(() => {
    if (props.open && userFormData.isConsultant === "true") {
      fetchClients();
    }

    if (props.userData) {
      setUserFormData(props.userData);
      if (props.userData.clientList && props.userData.clientList.length > 0) {
        setSelectedClients(props.userData.clientList);
      }
    }
  }, [props.open, userFormData.isConsultant, props.userData]);

  async function fetchClients() {
    setIsLoadingClients(true);
    try {
      const response = await fetch("/api/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();

      // Map to correct structure - API already filters clients
      const mappedClients = Array.isArray(data)
        ? data.map((user: UserType) => ({
            id: user.id.toString(), // Convert to string for consistency
            name: user.name,
          }))
        : [];

      setClientList(mappedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Erro ao carregar clientes. Por favor, tente novamente.");
    } finally {
      setIsLoadingClients(false);
    }
  }

  async function onSend(formData: UserType) {
    // Add selected clients to form data before sending
    const dataToSend = {
      ...formData,
      clientList: formData.isConsultant === "true" ? selectedClients : null,
    };

    if (props.isEdit) {
      handleSendData(dataToSend, "PUT");
    } else {
      handleSendData(dataToSend, "POST");
    }
  }

  async function handleDeleteUser(formData: UserType) {
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to delete user");
      }

      // Close dialog on success
      props.onOpenChange(false);

      props.onSuccess();
      handleDialogOpen();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erro ao deletar usuário. Por favor, tente novamente.");
    }
  }

  async function handleSendData(dataToSend: UserType, method: string) {
    try {
      const response = await fetch("/api/users", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error cases
        if (response.status === 409 || errorData.code === "P2002") {
          alert("Este email já está cadastrado. Por favor, use outro email.");
          return;
        }

        throw new Error(
          errorData.message || props.isEdit
            ? "Failed to edit user"
            : "Failed to create user"
        );
      }

      // Close dialog on success
      props.onOpenChange(false);

      props.onSuccess();
      handleDialogOpen();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Erro ao criar usuário. Por favor, tente novamente.");
    }
  }

  async function changeUserTypeHandler(value: string) {
    if (value === "false" || value === "") {
      setActiveTab("info");
      setSelectedClients([]);
      setUserFormData({
        ...userFormData,
        clientList: null,
        isConsultant: value,
      });
    } else {
      setUserFormData({
        ...userFormData,
        isConsultant: value,
      });
    }
  }

  function addClient(clientId: string) {
    if (!selectedClients.includes(clientId)) {
      setSelectedClients([...selectedClients, clientId]);
    }
  }

  function removeClient(clientId: string) {
    setSelectedClients(selectedClients.filter((id) => id !== clientId));
  }

  function getClientNameById(clientId: string) {
    const client = clientList.find((client) => client.id === clientId);
    return client?.name || clientId; // Fallback to ID if name not found
  }

  function handleDialogOpen() {
    props.onOpenChange(!props.open);

    if (!props.open) {
      setActiveTab("info");
      setUserFormData({
        id: "0",
        name: "",
        email: "",
        phone: "",
        cpf: "",
        age: "",
        address: "",
        addon: "",
        cep: "",
        state: "",
        isConsultant: "",
        clientList: null,
        createdAt: "",
        lastUpdated: "",
      });
      setSelectedClients([]);
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={handleDialogOpen}>
      <DialogContent className="max-w-2xl bg-[#121212] border-gray-800 text-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(userFormData);
          }}
        >
          <FieldGroup>
            <DialogHeader className="flex flex-row place-content-end mt-3">
              <DialogTitle hidden>
                {props.isEdit ? "Edição de usuário" : "Criação de usuário"}
              </DialogTitle>
              <Button
                type="submit"
                className="w-fit flex items-center gap-2 bg-[#1B3F1B] hover:bg-green-900 text-[#00F700] rounded-md px-4 py-2 text-sm font-medium"
              >
                {props.isEdit ? "Editar usuário" : "Criar usuário"}
                {props.isEdit ? (
                  <Pencil className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => handleDeleteUser(userFormData)}
                hidden={!props.isEdit}
                type="button"
                className="w-fit flex items-center gap-2 hover:bg-red-800 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Deletar usuário
                <Trash className="w-4 h-4" />
              </Button>
            </DialogHeader>

            <FieldSet>
              <div>
                <Label htmlFor="user-type">Tipo do usuário</Label>
                <select
                  value={userFormData.isConsultant || undefined}
                  id="user-type"
                  name="user-type"
                  required
                  onChange={(e) => changeUserTypeHandler(e.target.value)}
                  className="flex h-10 w-[50%] mt-3 rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione o tipo do usuário</option>
                  <option value="false">Cliente</option>
                  <option value="true">Consultor</option>
                </select>
              </div>

              <FieldGroup className="grid grid-cols-2 gap-2">
                <Field>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    value={userFormData.name}
                    id="name"
                    name="name"
                    required
                    onChange={(event) =>
                      setUserFormData({
                        ...userFormData,
                        name: event.target.value,
                      })
                    }
                    placeholder="Digite o nome"
                    className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                  />
                </Field>
                <Field>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    value={userFormData.phone}
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    onChange={(event) =>
                      setUserFormData({
                        ...userFormData,
                        phone: event.target.value,
                      })
                    }
                    placeholder="Digite o telefone"
                    className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                  />
                </Field>
              </FieldGroup>

              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  value={userFormData.email}
                  id="email"
                  name="email"
                  required
                  onChange={(event) =>
                    setUserFormData({
                      ...userFormData,
                      email: event.target.value,
                    })
                  }
                  type="email"
                  placeholder="Digite o email"
                  className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                />
              </Field>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start mb-2">
                  <TabsTrigger
                    value="info"
                    className="text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white"
                  >
                    Informações básica
                  </TabsTrigger>
                  <TabsTrigger
                    disabled={userFormData.isConsultant !== "true"}
                    value="clients"
                    className="text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar clientes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        value={userFormData.age}
                        id="age"
                        name="age"
                        required
                        type="number"
                        onChange={(event) =>
                          setUserFormData({
                            ...userFormData,
                            age: event.target.value,
                          })
                        }
                        placeholder="Digite a idade"
                        className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        value={userFormData.cpf}
                        id="cpf"
                        name="cpf"
                        required
                        onChange={(event) =>
                          setUserFormData({
                            ...userFormData,
                            cpf: event.target.value,
                          })
                        }
                        placeholder="000.000.000-00"
                        className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                      />
                    </Field>
                  </FieldGroup>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        value={userFormData.cep}
                        id="cep"
                        name="cep"
                        required
                        onChange={(event) =>
                          setUserFormData({
                            ...userFormData,
                            cep: event.target.value,
                          })
                        }
                        placeholder="Insira o CEP"
                        className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <select
                        value={userFormData.state}
                        id="state"
                        name="state"
                        required
                        onChange={(e) =>
                          setUserFormData({
                            ...userFormData,
                            state: e.target.value,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Selecione o estado</option>
                        <option value="sp">São Paulo</option>
                        <option value="rj">Rio de Janeiro</option>
                        <option value="mg">Minas Gerais</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      value={userFormData.address}
                      id="address"
                      name="address"
                      required
                      onChange={(event) =>
                        setUserFormData({
                          ...userFormData,
                          address: event.target.value,
                        })
                      }
                      placeholder="Digite o endereço"
                      className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addon">Complemento</Label>
                    <Input
                      value={userFormData.addon}
                      id="addon"
                      name="addon"
                      onChange={(event) =>
                        setUserFormData({
                          ...userFormData,
                          addon: event.target.value,
                        })
                      }
                      placeholder="Digite o complemento"
                      className="bg-[#1a1a1a] border-gray-700 text-gray-200"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-4">
                  <div>
                    <Label htmlFor="client-select">Selecionar Cliente</Label>
                    <select
                      id="client-select"
                      onChange={(e) => {
                        if (e.target.value) {
                          addClient(e.target.value);
                          e.target.value = ""; // Reset select
                        }
                      }}
                      disabled={isLoadingClients}
                      className="flex h-10 w-full mt-3 rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingClients
                          ? "Carregando clientes..."
                          : "Selecione um cliente"}
                      </option>
                      {clientList
                        .filter(
                          (client) => !selectedClients.includes(client.id)
                        )
                        .map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Selected Clients List teste usuario git */}
                  {selectedClients.length > 0 && (
                    <div className="space-y-2">
                      <Label>
                        Clientes Selecionados ({selectedClients.length})
                      </Label>
                      <div className="flex flex-row gap-1">
                        {selectedClients.map((clientId) => {
                          const clientName = getClientNameById(clientId);
                          return (
                            <div
                              key={clientId}
                              className="flex w-[30%] items-center justify-between bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-2"
                            >
                              <span className="text-sm text-gray-200">
                                {clientName}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeClient(clientId)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedClients.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Nenhum cliente selecionado ainda.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
