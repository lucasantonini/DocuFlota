import React, { useState } from 'react'
import { 
  Plus, 
  Building2, 
  FileText,
  Users,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const Clients = () => {
  const [clients] = useState([
    {
      id: 1,
      name: 'Supermercado La Anónima S.A.',
      cuit: '30-12345678-9',
      contact: 'María Fernández',
      email: 'maria.fernandez@laanonima.com.ar',
      phone: '+54 11 1234-5678',
      status: 'active',
      vehicles: 5,
      personnel: 8,
      documents: {
        total: 23,
        valid: 18,
        expiringSoon: 3,
        expired: 2
      }
    },
    {
      id: 2,
      name: 'Cargill Argentina S.A.',
      cuit: '30-87654321-0',
      contact: 'Roberto Silva',
      email: 'roberto.silva@cargill.com',
      phone: '+54 11 8765-4321',
      status: 'active',
      vehicles: 3,
      personnel: 6,
      documents: {
        total: 18,
        valid: 15,
        expiringSoon: 2,
        expired: 1
      }
    },
    {
      id: 3,
      name: 'Molinos Río de la Plata S.A.',
      cuit: '30-11223344-5',
      contact: 'Ana Martínez',
      email: 'ana.martinez@molinos.com.ar',
      phone: '+54 11 1122-3344',
      status: 'inactive',
      vehicles: 2,
      personnel: 4,
      documents: {
        total: 12,
        valid: 8,
        expiringSoon: 2,
        expired: 2
      }
    }
  ])


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes y documentación requerida</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
              <p className="text-sm text-gray-500">Clientes registrados</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentos Requeridos</p>
              <p className="text-3xl font-bold text-gray-900">
                {clients.reduce((sum, client) => sum + client.documents.total, 0)}
              </p>
              <p className="text-sm text-gray-500">En el sistema</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio por Cliente</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(clients.reduce((sum, client) => sum + client.documents.total, 0) / clients.length)}
              </p>
              <p className="text-sm text-gray-500">Documentos por cliente</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículos Habilitados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal Habilitado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos Requeridos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">CUIT: {client.cuit}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.contact}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.vehicles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.personnel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="text-lg font-bold text-gray-900">{client.documents.total}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        Ver detalles
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Clients
