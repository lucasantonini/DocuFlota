#!/usr/bin/env node

/**
 * Script de prueba del REPORTE REAL de DocuFlota
 * Simula datos reales de documentos para probar el reporte completo
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

// Datos simulados de documentos para la prueba
const generateMockData = () => {
  const today = new Date()
  
  // Documentos vencidos (hace 5, 10, 15 días)
  const expired = [
    {
      name: "Seguro Vehículo ABC-123",
      type_name: "Seguro",
      category: "vehicle",
      vehicle_name: "Camión Volvo FH16",
      client_name: "Transportes del Norte S.A.",
      expiration_date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Licencia de Conducir - Juan Pérez",
      type_name: "Licencia de Conducir",
      category: "personnel",
      personnel_name: "Juan Pérez",
      client_name: "Logística Central",
      expiration_date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      name: "VTV - DEF-456",
      type_name: "VTV",
      category: "vehicle",
      vehicle_name: "Camión Mercedes Actros",
      client_name: "Fletes Rápidos S.R.L.",
      expiration_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
    }
  ]

  // Documentos que vencen en 7 días
  const expiring7Days = [
    {
      name: "Seguro Vehículo GHI-789",
      type_name: "Seguro",
      category: "vehicle",
      vehicle_name: "Camión Scania R500",
      client_name: "Transportes del Sur",
      expiration_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Licencia de Conducir - María García",
      type_name: "Licencia de Conducir",
      category: "personnel",
      personnel_name: "María García",
      client_name: "Logística Central",
      expiration_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      name: "VTV - JKL-012",
      type_name: "VTV",
      category: "vehicle",
      vehicle_name: "Camión Iveco Stralis",
      client_name: "Fletes Rápidos S.R.L.",
      expiration_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Certificado Médico - Carlos López",
      type_name: "Certificado Médico",
      category: "personnel",
      personnel_name: "Carlos López",
      client_name: "Transportes del Norte S.A.",
      expiration_date: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
    }
  ]

  // Documentos que vencen en 30 días
  const expiring30Days = [
    {
      name: "Seguro Vehículo MNO-345",
      type_name: "Seguro",
      category: "vehicle",
      vehicle_name: "Camión Renault T480",
      client_name: "Transportes del Este",
      expiration_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Licencia de Conducir - Ana Martínez",
      type_name: "Licencia de Conducir",
      category: "personnel",
      personnel_name: "Ana Martínez",
      client_name: "Logística Central",
      expiration_date: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)
    },
    {
      name: "VTV - PQR-678",
      type_name: "VTV",
      category: "vehicle",
      vehicle_name: "Camión MAN TGX",
      client_name: "Fletes Rápidos S.R.L.",
      expiration_date: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Certificado Médico - Roberto Silva",
      type_name: "Certificado Médico",
      category: "personnel",
      personnel_name: "Roberto Silva",
      client_name: "Transportes del Norte S.A.",
      expiration_date: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Seguro Vehículo STU-901",
      type_name: "Seguro",
      category: "vehicle",
      vehicle_name: "Camión DAF XF",
      client_name: "Transportes del Oeste",
      expiration_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    }
  ]

  return { expired, expiring7Days, expiring30Days }
}

// Template HTML para el reporte real
const createRealReportTemplate = (reportData) => {
  const { expired, expiring7Days, expiring30Days, reportDate } = reportData
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const createTable = (documents, title, emptyMessage) => {
    if (documents.length === 0) {
      return `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px;">${title}</h3>
          <p style="color: #6B7280; font-style: italic;">${emptyMessage}</p>
        </div>
      `
    }

    return `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px;">${title} (${documents.length})</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #E5E7EB;">
          <thead>
            <tr style="background-color: #F9FAFB;">
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Documento</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Tipo</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Vehículo/Personal</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Cliente</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            ${documents.map(doc => `
              <tr>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${doc.name}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${doc.type_name}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">
                  ${doc.category === 'vehicle' ? doc.vehicle_name : doc.personnel_name}
                </td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${doc.client_name}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${formatDate(doc.expiration_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte Diario de Documentos - DocuFlota</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📋 Reporte Diario de Documentos</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">DocuFlota - Sistema de Gestión de Documentos</p>
      </div>
      
      <div style="background-color: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #F8FAFC; border-radius: 6px;">
          <h2 style="margin: 0; color: #1F2937; font-size: 20px;">Reporte del ${formatDate(reportDate)}</h2>
          <p style="margin: 10px 0 0 0; color: #6B7280;">Resumen de documentos por estado de vencimiento</p>
        </div>

        ${createTable(expired, '🔴 Documentos Vencidos', '¡Excelente! No hay documentos vencidos.')}
        
        ${createTable(expiring7Days, '🟡 Documentos que Vencen en 7 Días', 'No hay documentos próximos a vencer en 7 días.')}
        
        ${createTable(expiring30Days, '🟠 Documentos que Vencen en 30 Días', 'No hay documentos próximos a vencer en 30 días.')}

        <div style="margin-top: 40px; padding: 20px; background-color: #F0F9FF; border-left: 4px solid #3B82F6; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1E40AF; font-size: 16px;">📊 Resumen del Reporte</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li><strong>Documentos vencidos:</strong> ${expired.length}</li>
            <li><strong>Próximos a vencer (7 días):</strong> ${expiring7Days.length}</li>
            <li><strong>Próximos a vencer (30 días):</strong> ${expiring30Days.length}</li>
            <li><strong>Total de documentos en seguimiento:</strong> ${expired.length + expiring7Days.length + expiring30Days.length}</li>
          </ul>
        </div>

        <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 6px;">
          <p style="margin: 0; color: #6B7280; font-size: 14px;">
            Este reporte se genera automáticamente todos los días a las 8:00 AM.<br>
            Para más información, accede al sistema DocuFlota.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Función para enviar el reporte real
const sendRealReport = async () => {
  try {
    console.log('📊 Generando reporte REAL de DocuFlota...')
    console.log('📧 Email de destino:', process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar')
    console.log('')

    // Generar datos simulados
    const mockData = generateMockData()
    const reportData = {
      reportDate: new Date(),
      ...mockData
    }

    console.log('📈 Datos del reporte:')
    console.log(`   🔴 Documentos vencidos: ${mockData.expired.length}`)
    console.log(`   🟡 Próximos a vencer (7 días): ${mockData.expiring7Days.length}`)
    console.log(`   🟠 Próximos a vencer (30 días): ${mockData.expiring30Days.length}`)
    console.log(`   📊 Total: ${mockData.expired.length + mockData.expiring7Days.length + mockData.expiring30Days.length}`)
    console.log('')

    // Verificar configuración de email
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Configuración de email verificada')

    // Crear y enviar email
    const mailOptions = {
      from: `"DocuFlota" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'caguerrieri@itba.edu.ar',
      subject: `📋 Reporte Diario de Documentos - ${new Date().toLocaleDateString('es-AR')}`,
      html: createRealReportTemplate(reportData),
      text: `Reporte Diario de Documentos - ${new Date().toLocaleDateString('es-AR')}\n\n` +
            `Documentos vencidos: ${mockData.expired.length}\n` +
            `Próximos a vencer (7 días): ${mockData.expiring7Days.length}\n` +
            `Próximos a vencer (30 días): ${mockData.expiring30Days.length}`
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ ¡Reporte REAL enviado exitosamente!')
    console.log('📧 Message ID:', result.messageId)
    console.log('')
    console.log('🎉 ¡Este es el reporte que recibirás todos los días!')
    console.log('📧 Revisa tu bandeja de entrada para ver el reporte completo.')
    console.log('📁 También revisa la carpeta de spam si no lo encuentras.')
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error enviando reporte real:', error.message)
    return { success: false, error: error.message }
  }
}

// Ejecutar prueba del reporte real
sendRealReport()
