import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const DocumentDistributionChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const validPercentage = data.find(item => item.name === 'Vigentes')?.value || 0
  const percentage = Math.round((validPercentage / total) * 100)

  const COLORS = {
    'Vigentes': '#22c55e',      // success-500
    'Por vencer': '#f59e0b',    // warning-500
    'Vencidos': '#ec4899'       // danger-500
  }


  return (
    <div className="card" role="region" aria-label="Distribución de documentos">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Estado actual de la documentación
        </h3>
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
            <div className="text-4xl font-bold text-text-primary">
              {percentage}%
            </div>
            <div className="text-sm text-text-muted font-medium">
              Vigentes
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DocumentDistributionChart
