#!/usr/bin/env node

/**
 * Script de prueba SIMPLE para el sistema de reportes por email
 * Este script funciona SIN base de datos para probar solo el envío de email
 */

import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// Cargar variables de entorno
dotenv.config()

// Configuración del transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Template HTML simple para el email de prueba
const createTestEmailTemplate = () => {
  const reportDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prueba de Reporte - DocuFlota</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🧪 Prueba de Sistema de Reportes</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">DocuFlota - Sistema de Gestión de Documentos</p>
      </div>
      
      <div style="background-color: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #F8FAFC; border-radius: 6px;">
          <h2 style="margin: 0; color: #1F2937; font-size: 20px;">✅ Prueba Exitosa</h2>
          <p style="margin: 10px 0 0 0; color: #6B7280;">Fecha: ${reportDate}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px;">🎉 ¡El sistema de reportes está funcionando!</h3>
          <p style="color: #6B7280; margin-bottom: 15px;">
            Este es un email de prueba para verificar que la configuración de email está funcionando correctamente.
          </p>
          <p style="color: #6B7280; margin-bottom: 15px;">
            Una vez que tengas la base de datos configurada, el sistema enviará reportes automáticos con:
          </p>
          <ul style="color: #374151; padding-left: 20px;">
            <li>Documentos vencidos</li>
            <li>Documentos que vencen en 7 días</li>
            <li>Documentos que vencen en 30 días</li>
          </ul>
        </div>

        <div style="margin-top: 40px; padding: 20px; background-color: #F0F9FF; border-left: 4px solid #3B82F6; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1E40AF; font-size: 16px;">📊 Estado del Sistema</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li><strong>Email:</strong> ✅ Configurado correctamente</li>
            <li><strong>Base de datos:</strong> ⚠️ Necesita configuración</li>
            <li><strong>Cron job:</strong> ✅ Listo para funcionar</li>
          </ul>
        </div>

        <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 6px;">
          <p style="margin: 0; color: #6B7280; font-size: 14px;">
            Este es un email de prueba del sistema DocuFlota.<br>
            Si recibiste este email, ¡la configuración está funcionando perfectamente! 🚀
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Función para enviar email de prueba
const sendTestEmail = async () => {
  try {
    console.log('🧪 Iniciando prueba SIMPLE del sistema de email...')
    console.log('📧 Email de destino:', process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar')
    console.log('📮 Servidor SMTP:', process.env.SMTP_HOST || 'smtp.gmail.com')
    console.log('')

    // Verificar configuración
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Configuración de email verificada correctamente')

    // Crear email de prueba
    const mailOptions = {
      from: `"DocuFlota - Prueba" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar',
      subject: `🧪 Prueba de Sistema - DocuFlota - ${new Date().toLocaleDateString('es-AR')}`,
      html: createTestEmailTemplate(),
      text: `Prueba de Sistema DocuFlota - ${new Date().toLocaleDateString('es-AR')}\n\n¡El sistema de reportes está funcionando correctamente!`
    }

    // Enviar email
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ ¡Email de prueba enviado exitosamente!')
    console.log('📧 Message ID:', result.messageId)
    console.log('')
    console.log('🎉 ¡Prueba exitosa!')
    console.log('📧 Revisa tu bandeja de entrada para ver el email.')
    console.log('📁 También revisa la carpeta de spam si no lo encuentras.')
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
    console.log('')
    console.log('🔧 Posibles soluciones:')
    console.log('1. Verifica las variables de entorno en tu archivo .env')
    console.log('2. Asegúrate de que SMTP_USER y SMTP_PASS sean correctos')
    console.log('3. Para Gmail, usa una contraseña de aplicación')
    console.log('4. Verifica que el servidor SMTP esté disponible')
    
    return { success: false, error: error.message }
  }
}

// Ejecutar prueba
sendTestEmail()
