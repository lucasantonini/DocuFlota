import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Configuración del transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Template HTML para el email
const createEmailTemplate = (reportData) => {
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

// Función para enviar el reporte por email
export const sendDocumentReport = async (reportData, adminEmail) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"DocuFlota" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `📋 Reporte Diario de Documentos - ${new Date().toLocaleDateString('es-AR')}`,
      html: createEmailTemplate(reportData),
      text: `Reporte Diario de Documentos - ${new Date().toLocaleDateString('es-AR')}\n\n` +
            `Documentos vencidos: ${reportData.expired.length}\n` +
            `Próximos a vencer (7 días): ${reportData.expiring7Days.length}\n` +
            `Próximos a vencer (30 días): ${reportData.expiring30Days.length}`
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email enviado exitosamente:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, error: error.message }
  }
}

// Función para verificar la configuración de email
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Configuración de email verificada correctamente')
    return { success: true }
  } catch (error) {
    console.error('❌ Error en configuración de email:', error)
    return { success: false, error: error.message }
  }
}
