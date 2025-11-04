import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
//isEdit, userData?, userDataType
export default function UserForm() {



	return (
		<Dialog>
			<div className="flex items-center gap-2 bg-[#151515] border border-gray-800 rounded-lg px-3 py-2">
				<DialogTrigger asChild>
					<button className=" flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium">
						Criar usuário
						<Plus className="w-4 h-4" />
					</button>
				</DialogTrigger>
			</div>
			<DialogContent className="max-w-2xl bg-[#121212] border-gray-800 text-gray-100">
				<DialogHeader className="flex flex-row place-content-end mt-3">
					<DialogTitle hidden>
						Criação de usuário
					</DialogTitle>
					<Button className="w-fit flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium">
						Criar usuário
						<Plus className="w-4 h-4" />
					</Button>
					<Button className="w-fit flex items-center gap-2 hover:bg-red-800 text-white rounded-md px-4 py-2 text-sm font-medium">
						Deletar usuário
						<Plus className="w-4 h-4" />
					</Button>
				</DialogHeader>

				{/* Form content */}
				<div className="space-y-4 mt-4">
					{/* Tipo do usuário */}
					<div className="space-y-2">
						<Label>Tipo do usuário</Label>
						<Select>
							<SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-gray-300">
								<SelectValue placeholder="Selecione o tipo do usuário" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">Administrador</SelectItem>
								<SelectItem value="consultor">Consultor</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Nome e Telefone */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Nome</Label>
							<Input
								placeholder="Digite o nome"
								className="bg-[#1a1a1a] border-gray-700 text-gray-200"
							/>
						</div>
						<div>
							<Label>Telefone</Label>
							<Input
								placeholder="Digite o telefone"
								className="bg-[#1a1a1a] border-gray-700 text-gray-200"
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<Label>Email</Label>
						<Input
							placeholder="Digite o email"
							className="bg-[#1a1a1a] border-gray-700 text-gray-200"
						/>
					</div>

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
								value="clients"
								className="text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white"
							>
								Adicionar clientes
							</TabsTrigger>
						</TabsList>

						<TabsContent value="info" className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Idade</Label>
									<Input
										defaultValue="28 anos"
										className="bg-[#1a1a1a] border-gray-700 text-gray-200"
									/>
								</div>
								<div>
									<Label>CPF</Label>
									<Input
										defaultValue="000.000.000-00"
										className="bg-[#1a1a1a] border-gray-700 text-gray-200"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>CEP</Label>
									<Input
										placeholder="Insira o CEP"
										className="bg-[#1a1a1a] border-gray-700 text-gray-200"
									/>
								</div>
								<div>
									<Label>Estado</Label>
									<Select>
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
									placeholder="Digite o endereço"
									className="bg-[#1a1a1a] border-gray-700 text-gray-200"
								/>
							</div>

							<div>
								<Label>Complemento</Label>
								<Input
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
				</div>
			</DialogContent>
		</Dialog>
	)
}