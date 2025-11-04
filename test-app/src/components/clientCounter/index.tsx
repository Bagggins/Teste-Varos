import { useState } from 'react'

export default function ClientCounter() {
	const [totalClients, setTotalClients] = useState(0);

	return (
		 <div className="mb-8 w-fit">
          <div className="items-center bg-[#151515] border border-gray-800 rounded-lg p-5 w-[200px]">
            <p className="text-sm text-gray-400">Total de clientes</p>
            <div className="flex items-end gap-1 mt-2">
              <p className="text-3xl font-semibold">{totalClients}</p>
              <span className="text-green-500 text-sm">↑</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">nos últimos 7 dias</p>
          </div>
        </div>
	)

}