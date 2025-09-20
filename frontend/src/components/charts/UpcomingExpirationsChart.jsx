import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const UpcomingExpirationsChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-soft border border-border-light">
          <p className="text-sm font-medium text-text-primary mb-1">
            {label}
          </p>
          <p className="text-sm text-primary-600">
            <span className="font-semibold">{payload[0].value}</span> documentos
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card" role="region" aria-label="Próximos vencimientos por mes">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Próximos Vencimientos
        </h3>
        <p className="text-sm text-text-muted">
          Documentos que vencen en los próximos 6 meses
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#64748b',
                fontWeight: 500 
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#64748b',
                fontWeight: 500 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="documents" 
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              name="Documentos"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-4 bg-background-50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Total próximos vencimientos:
          </span>
          <span className="font-semibold text-text-primary">
            {data.reduce((sum, item) => sum + item.documents, 0)} documentos
          </span>
        </div>
      </div>
    </div>
  )
}

export default UpcomingExpirationsChart
