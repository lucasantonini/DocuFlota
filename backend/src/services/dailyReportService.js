import cron from 'node-cron'
import { generateDocumentReport } from './reportService.js'
import { sendDocumentReport, testEmailConnection } from './emailService.js'

// Email del administrador (configurable)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar'

// Función principal para enviar el reporte diario
export const sendDailyReport = async (testMode = false) => {
  try {
    console.log('🚀 Iniciando envío de reporte diario...')
    
    // Generar el reporte de documentos
    const reportData = await generateDocumentReport()
    
    // Enviar el email
    const emailResult = await sendDocumentReport(reportData, ADMIN_EMAIL)
    
    if (emailResult.success) {
      console.log('✅ Reporte diario enviado exitosamente')
      return {
        success: true,
        message: 'Reporte enviado correctamente',
        reportData: {
          expired: reportData.expired.length,
          expiring7Days: reportData.expiring7Days.length,
          expiring30Days: reportData.expiring30Days.length,
          total: reportData.summary.totalTracked
        }
      }
    } else {
      console.error('❌ Error enviando reporte:', emailResult.error)
      return {
        success: false,
        error: emailResult.error
      }
    }
  } catch (error) {
    console.error('❌ Error en proceso de reporte diario:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Función para probar el envío de email
export const testEmailReport = async () => {
  try {
    console.log('🧪 Probando envío de email...')
    
    // Verificar configuración de email
    const connectionTest = await testEmailConnection()
    if (!connectionTest.success) {
      return {
        success: false,
        error: 'Error en configuración de email: ' + connectionTest.error
      }
    }
    
    // Enviar reporte de prueba
    const result = await sendDailyReport(true)
    
    if (result.success) {
      console.log('✅ Email de prueba enviado exitosamente a:', ADMIN_EMAIL)
    }
    
    return result
  } catch (error) {
    console.error('❌ Error en prueba de email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Configurar el cron job para envío automático diario
export const setupDailyReportCron = () => {
  // Ejecutar todos los días a las 8:00 AM
  const cronExpression = '0 8 * * *'
  
  console.log('⏰ Configurando cron job para reporte diario a las 8:00 AM...')
  
  const task = cron.schedule(cronExpression, async () => {
    console.log('🕐 Ejecutando reporte diario programado...')
    await sendDailyReport()
  }, {
    scheduled: false, // No iniciar automáticamente
    timezone: 'America/Argentina/Buenos_Aires'
  })
  
  return task
}

// Función para iniciar el cron job
export const startDailyReportSchedule = () => {
  const task = setupDailyReportCron()
  task.start()
  console.log('✅ Cron job de reporte diario iniciado')
  return task
}

// Función para detener el cron job
export const stopDailyReportSchedule = (task) => {
  if (task) {
    task.stop()
    console.log('⏹️ Cron job de reporte diario detenido')
  }
}

// Función para obtener el estado del cron job
export const getCronStatus = (task) => {
  return {
    running: task ? task.running : false,
    nextRun: task ? task.nextDate() : null,
    adminEmail: ADMIN_EMAIL
  }
}
