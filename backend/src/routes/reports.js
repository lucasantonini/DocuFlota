import express from 'express'
import { sendDailyReport, testEmailReport, getCronStatus } from '../services/dailyReportService.js'
import { generateDocumentReport, getReportStatistics } from '../services/reportService.js'

const router = express.Router()

// Variable para almacenar la instancia del cron job
let cronTask = null

// Middleware para verificar autenticación (opcional, puedes ajustar según tu sistema de auth)
const authenticateAdmin = (req, res, next) => {
  // Aquí puedes agregar tu lógica de autenticación
  // Por ahora, permitimos acceso sin autenticación para pruebas
  next()
}

// Ruta para enviar reporte de prueba
router.post('/test-email', authenticateAdmin, async (req, res) => {
  try {
    console.log('🧪 Iniciando prueba de email...')
    const result = await testEmailReport()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        data: result.reportData
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('❌ Error en endpoint de prueba:', error)
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    })
  }
})

// Ruta para enviar reporte manual
router.post('/send-report', authenticateAdmin, async (req, res) => {
  try {
    console.log('📧 Enviando reporte manual...')
    const result = await sendDailyReport()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Reporte enviado exitosamente',
        data: result.reportData
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('❌ Error enviando reporte manual:', error)
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    })
  }
})

// Ruta para obtener estadísticas del reporte
router.get('/statistics', authenticateAdmin, async (req, res) => {
  try {
    const statistics = await getReportStatistics()
    res.json({
      success: true,
      data: statistics
    })
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error)
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas'
    })
  }
})

// Ruta para generar reporte sin enviar email
router.get('/generate', authenticateAdmin, async (req, res) => {
  try {
    const reportData = await generateDocumentReport()
    res.json({
      success: true,
      data: reportData
    })
  } catch (error) {
    console.error('❌ Error generando reporte:', error)
    res.status(500).json({
      success: false,
      error: 'Error generando reporte'
    })
  }
})

// Ruta para iniciar el cron job
router.post('/start-schedule', authenticateAdmin, async (req, res) => {
  try {
    if (cronTask && cronTask.running) {
      return res.json({
        success: true,
        message: 'El cron job ya está ejecutándose',
        status: getCronStatus(cronTask)
      })
    }

    const { startDailyReportSchedule } = await import('../services/dailyReportService.js')
    cronTask = startDailyReportSchedule()
    
    res.json({
      success: true,
      message: 'Cron job iniciado exitosamente',
      status: getCronStatus(cronTask)
    })
  } catch (error) {
    console.error('❌ Error iniciando cron job:', error)
    res.status(500).json({
      success: false,
      error: 'Error iniciando cron job'
    })
  }
})

// Ruta para detener el cron job
router.post('/stop-schedule', authenticateAdmin, async (req, res) => {
  try {
    if (!cronTask || !cronTask.running) {
      return res.json({
        success: true,
        message: 'El cron job no está ejecutándose',
        status: getCronStatus(cronTask)
      })
    }

    const { stopDailyReportSchedule } = await import('../services/dailyReportService.js')
    stopDailyReportSchedule(cronTask)
    cronTask = null
    
    res.json({
      success: true,
      message: 'Cron job detenido exitosamente',
      status: getCronStatus(cronTask)
    })
  } catch (error) {
    console.error('❌ Error deteniendo cron job:', error)
    res.status(500).json({
      success: false,
      error: 'Error deteniendo cron job'
    })
  }
})

// Ruta para obtener el estado del cron job
router.get('/schedule-status', authenticateAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: getCronStatus(cronTask)
    })
  } catch (error) {
    console.error('❌ Error obteniendo estado del cron job:', error)
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estado del cron job'
    })
  }
})

export default router
