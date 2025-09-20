import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts'

const DocumentDistributionChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const validPercentage = data.find(item => item.name === 'Vigentes')?.value || 0
  const percentage = Math.round((validPercentage / total) * 100)

  const COLORS = {
    'Vigentes': '#22c55e',      // success-500
    'Por vencer': '#f59e0b',    // warning-500
    'Vencidos': '#ec4899'       // danger-500
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // No mostrar etiquetas para segmentos muy pequeños
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="card" role="region" aria-label="Distribución de documentos">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Distribución de Documentos
        </h3>
        <p className="text-sm text-text-muted">
          Estado actual de la documentación
        </p>
      </div>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name]} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centro del donut con porcentaje */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-text-primary">
              {percentage}%
            </div>
            <div className="text-sm text-text-muted">
              Vigentes
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[item.name] }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-text-primary">
                {item.name}
              </span>
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentDistributionChart
