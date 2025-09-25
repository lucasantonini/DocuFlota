import pool from '../config/database.js'

// Función para obtener documentos vencidos
const getExpiredDocuments = async () => {
  try {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.expiration_date,
        d.category,
        dt.name as type_name,
        c.name as client_name,
        v.name as vehicle_name,
        p.name as personnel_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN personnel p ON d.personnel_id = p.id
      WHERE d.expiration_date < CURRENT_DATE
      ORDER BY d.expiration_date ASC
    `
    
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    console.error('❌ Error obteniendo documentos vencidos:', error)
    throw error
  }
}

// Función para obtener documentos que vencen en los próximos 7 días
const getDocumentsExpiringIn7Days = async () => {
  try {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.expiration_date,
        d.category,
        dt.name as type_name,
        c.name as client_name,
        v.name as vehicle_name,
        p.name as personnel_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN personnel p ON d.personnel_id = p.id
      WHERE d.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      ORDER BY d.expiration_date ASC
    `
    
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    console.error('❌ Error obteniendo documentos próximos a vencer en 7 días:', error)
    throw error
  }
}

// Función para obtener documentos que vencen en los próximos 30 días
const getDocumentsExpiringIn30Days = async () => {
  try {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.expiration_date,
        d.category,
        dt.name as type_name,
        c.name as client_name,
        v.name as vehicle_name,
        p.name as personnel_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN personnel p ON d.personnel_id = p.id
      WHERE d.expiration_date BETWEEN CURRENT_DATE + INTERVAL '8 days' AND CURRENT_DATE + INTERVAL '30 days'
      ORDER BY d.expiration_date ASC
    `
    
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    console.error('❌ Error obteniendo documentos próximos a vencer en 30 días:', error)
    throw error
  }
}

// Función principal para generar el reporte completo
export const generateDocumentReport = async () => {
  try {
    console.log('📊 Generando reporte de documentos...')
    
    // Obtener documentos en paralelo para mejor rendimiento
    const [expired, expiring7Days, expiring30Days] = await Promise.all([
      getExpiredDocuments(),
      getDocumentsExpiringIn7Days(),
      getDocumentsExpiringIn30Days()
    ])

    const reportData = {
      reportDate: new Date(),
      expired,
      expiring7Days,
      expiring30Days,
      summary: {
        totalExpired: expired.length,
        totalExpiring7Days: expiring7Days.length,
        totalExpiring30Days: expiring30Days.length,
        totalTracked: expired.length + expiring7Days.length + expiring30Days.length
      }
    }

    console.log('✅ Reporte generado exitosamente:', {
      vencidos: expired.length,
      '7 días': expiring7Days.length,
      '30 días': expiring30Days.length,
      total: reportData.summary.totalTracked
    })

    return reportData
  } catch (error) {
    console.error('❌ Error generando reporte:', error)
    throw error
  }
}

// Función para obtener estadísticas del reporte
export const getReportStatistics = async () => {
  try {
    const query = `
      SELECT 
        COUNT(CASE WHEN expiration_date < CURRENT_DATE THEN 1 END) as expired_count,
        COUNT(CASE WHEN expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as expiring_7_days,
        COUNT(CASE WHEN expiration_date BETWEEN CURRENT_DATE + INTERVAL '8 days' AND CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_30_days,
        COUNT(*) as total_documents
      FROM documents
      WHERE expiration_date IS NOT NULL
    `
    
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error)
    throw error
  }
}
