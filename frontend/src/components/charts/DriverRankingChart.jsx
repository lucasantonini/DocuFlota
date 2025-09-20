import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const DriverRankingChart = ({ data, onViewAll }) => {
  const getTrendIcon = (trend) => {
    switch (trend.type) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success-600" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-warning-600" />
      default:
        return <Minus className="h-3 w-3 text-text-muted" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend.type) {
      case 'up':
        return 'bg-success-100 text-success-700'
      case 'down':
        return 'bg-warning-100 text-warning-700'
      default:
        return 'bg-background-100 text-text-muted'
    }
  }

  return (
    <div className="card" role="region" aria-label="Ranking de choferes">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Ranking de Choferes
          </h3>
          <p className="text-sm text-text-muted">
            Top 5 por cumplimiento de documentación
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="btn-ghost text-sm"
          aria-label="Ver todos los choferes"
        >
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {data.map((driver, index) => (
          <div 
            key={driver.id} 
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-50 transition-colors"
          >
            {/* Posición */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>

            {/* Información del chofer */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary truncate">
                  {driver.name}
                </span>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(driver.trend)}`}>
                  {getTrendIcon(driver.trend)}
                  <span aria-label={driver.trend.ariaLabel}>
                    {driver.trend.delta}
                  </span>
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full bg-background-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${driver.compliance}%` }}
                  role="progressbar"
                  aria-valuenow={driver.compliance}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${driver.name}: ${driver.compliance}% de cumplimiento`}
                />
              </div>
            </div>

            {/* Porcentaje */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-text-primary">
                {driver.compliance}%
              </div>
              <div className="text-xs text-text-muted">
                cumplimiento
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DriverRankingChart
