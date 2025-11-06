"use client";

import { POST } from "@/app/api/users/route";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserType } from "@/src/Types/user";
import { Plus } from "lucide-react";
import { useState } from "react";
//isEdit, userData?, userDataType
interface UserFoormProps {
  isEdit: boolean;
  userData?: UserType;
}
export default function UserForm(props: UserFoormProps) {
  const [userFormData, setUserFormData] = useState<UserType>({} as UserType);
  const [activeTab, setActiveTab] = useState("info");

  async function onSend(formData: UserType) {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log(response);
  }

  async function changeUserTypeHandler() {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium">
          Criar usuário
          <Plus className="w-4 h-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-[#121212] border-gray-800 text-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(userFormData);
          }}
        >
          <FieldGroup>
            <DialogHeader className="flex flex-row place-content-end mt-3">
              <DialogTitle hidden>Criação de usuário</DialogTitle>
              <Button
                type="submit"
                className="w-fit flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Criar usuário
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                className="w-fit flex items-center gap-2 hover:bg-red-800 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Deletar usuário
                <Plus className="w-4 h-4" />
              </Button>
            </DialogHeader>

            {/* Form content */}
            <FieldSet>
              {/* Tipo do usuário */}
              <div>
                <Label htmlFor="user-type">Tipo do usuário</Label>
                <Select
                  required
                  name="user-type"
                  onValueChange={(value: string) =>
                    setUserFormData({
                      ...userFormData,
                      isConsultant: value,
                    })
                  }
                >
                  <SelectTrigger
                    id="user-type"
                    className="bg-[#1a1a1a] border-gray-700 text-gray-300"
                  >
                    <SelectValue placeholder="Selecione o tipo do usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Client</SelectItem>
                    <SelectItem value="true">Consultor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Nome e Telefone */}
              <FieldGroup className="grid grid-cols-2 gap-2">
                <Field>
                  <Label>Nome</Label>
                  <Input
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
                  <Label>Telefone</Label>
                  <Input
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

              {/* Email */}
              <Field>
                <Label>Email</Label>
                <Input
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

              {/* Tabs */}
              <Tabs defaultValue="info">
                <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start mb-2">
                  <TabsTrigger
                    value="info"
                    className="text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white"
                  >
                    Informações básica
                  </TabsTrigger>
                  <TabsTrigger
                    disabled={
                      userFormData.isConsultant === "false" ||
                      props.userData?.isConsultant === "false"
                    }
                    value="clients"
                    className="text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white"
                  >
                    Adicionar clientes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label>Idade</Label>
                      <Input
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
                      <Label>CPF</Label>
                      <Input
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
                      <Label>CEP</Label>
                      <Input
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
                      <Label>Estado</Label>
                      <Select
                        required
                        onValueChange={(value: string) =>
                          setUserFormData({ ...userFormData, state: value })
                        }
                      >
                        <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-gray-300">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sp">São Paulo</SelectItem>
                          <SelectItem value="rj">Rio de Janeiro</SelectItem>
                          <SelectItem value="mg">Minas Gerais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Endereço</Label>
                    <Input
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
                    <Label>Complemento</Label>
                    <Input
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

                <TabsContent value="clients">
                  <p className="text-sm text-gray-500">
                    Área para adicionar clientes em breve.
                  </p>
                </TabsContent>
              </Tabs>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
