#!/usr/bin/env node

/**
 * Script de prueba para el sistema de reportes por email
 * Uso: node test-email.js
 */

import dotenv from 'dotenv'
import { testEmailReport } from './src/services/dailyReportService.js'

// Cargar variables de entorno
dotenv.config()

console.log('🧪 Iniciando prueba del sistema de reportes por email...')
console.log('📧 Email de destino:', process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar')
console.log('📮 Servidor SMTP:', process.env.SMTP_HOST || 'smtp.gmail.com')
console.log('')

async function runTest() {
  try {
    const result = await testEmailReport()
    
    if (result.success) {
      console.log('✅ ¡Prueba exitosa!')
      console.log('📊 Datos del reporte:', result.reportData)
      console.log('')
      console.log('📧 Revisa tu bandeja de entrada para ver el email.')
      console.log('📁 También revisa la carpeta de spam si no lo encuentras.')
    } else {
      console.log('❌ Error en la prueba:', result.error)
      console.log('')
      console.log('🔧 Posibles soluciones:')
      console.log('1. Verifica las variables de entorno en tu archivo .env')
      console.log('2. Asegúrate de que SMTP_USER y SMTP_PASS sean correctos')
      console.log('3. Para Gmail, usa una contraseña de aplicación')
      console.log('4. Verifica que el servidor SMTP esté disponible')
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error.message)
  }
}

runTest()
