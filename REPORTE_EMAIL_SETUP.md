# 📧 Sistema de Reportes por Email - DocuFlota

## Descripción

Sistema automatizado que envía reportes diarios por email al administrador con información sobre documentos vencidos y próximos a vencer.

## Características

- ✅ **Reporte automático diario** a las 8:00 AM
- ✅ **Categorización de documentos**:
  - Documentos vencidos
  - Documentos que vencen en 7 días
  - Documentos que vencen en 30 días
- ✅ **Email HTML profesional** con tablas organizadas
- ✅ **Endpoint de prueba** para envío manual
- ✅ **Gestión del cron job** (iniciar/detener/estado)

## Configuración

### 1. Variables de Entorno

Actualiza tu archivo `.env` con la configuración de email:

```env
# Email (para notificaciones y reportes diarios)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion

# Email del administrador para reportes diarios
ADMIN_EMAIL=caguerrieri@itba.edu.ar
```

### 2. Configuración de Gmail (Recomendado)

1. **Habilita la verificación en 2 pasos** en tu cuenta de Gmail
2. **Genera una contraseña de aplicación**:
   - Ve a Configuración de Google → Seguridad
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "DocuFlota"
   - Usa esta contraseña en `SMTP_PASS`

### 3. Otras Configuraciones SMTP

El sistema es compatible con cualquier proveedor SMTP:

```env
# Para Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# Para Yahoo
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587

# Para servidor personalizado
SMTP_HOST=tu-servidor-smtp.com
SMTP_PORT=587
```

## Uso

### Endpoints Disponibles

#### 1. Probar Envío de Email
```bash
POST /api/reports/test-email
```
Envía un email de prueba al administrador.

#### 2. Enviar Reporte Manual
```bash
POST /api/reports/send-report
```
Envía el reporte actual sin esperar al cron job.

#### 3. Generar Reporte (Sin Enviar)
```bash
GET /api/reports/generate
```
Genera el reporte y lo devuelve en JSON.

#### 4. Obtener Estadísticas
```bash
GET /api/reports/statistics
```
Devuelve estadísticas de documentos por categoría.

#### 5. Gestionar Cron Job

**Iniciar cron job:**
```bash
POST /api/reports/start-schedule
```

**Detener cron job:**
```bash
POST /api/reports/stop-schedule
```

**Ver estado:**
```bash
GET /api/reports/schedule-status
```

### Ejemplo de Uso con cURL

```bash
# Probar envío de email
curl -X POST http://localhost:5000/api/reports/test-email

# Enviar reporte manual
curl -X POST http://localhost:5000/api/reports/send-report

# Ver estadísticas
curl http://localhost:5000/api/reports/statistics
```

## Estructura del Email

El email incluye:

1. **Encabezado** con fecha del reporte
2. **Tabla de documentos vencidos** (rojo)
3. **Tabla de documentos próximos a vencer en 7 días** (amarillo)
4. **Tabla de documentos próximos a vencer en 30 días** (naranja)
5. **Resumen estadístico** al final

### Columnas de cada tabla:
- Documento
- Tipo
- Vehículo/Personal
- Cliente
- Fecha de Vencimiento

## Programación Automática

- **Horario**: Todos los días a las 8:00 AM
- **Zona horaria**: America/Argentina/Buenos_Aires
- **Inicio automático**: Al iniciar el servidor
- **Configuración**: Editable en `dailyReportService.js`

## Monitoreo

### Logs del Sistema

El sistema genera logs detallados:

```
📊 Generando reporte de documentos...
✅ Reporte generado exitosamente: { vencidos: 2, '7 días': 5, '30 días': 8, total: 15 }
🚀 Iniciando envío de reporte diario...
✅ Email enviado exitosamente: <message-id>
```

### Verificación de Estado

```bash
# Ver estado del cron job
curl http://localhost:5000/api/reports/schedule-status
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "running": true,
    "nextRun": "2024-01-15T08:00:00.000Z",
    "adminEmail": "caguerrieri@itba.edu.ar"
  }
}
```

## Solución de Problemas

### Error de Autenticación SMTP

```
❌ Error enviando email: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solución**: Verifica que `SMTP_USER` y `SMTP_PASS` sean correctos. Para Gmail, usa contraseña de aplicación.

### Error de Conexión

```
❌ Error en configuración de email: connect ECONNREFUSED
```

**Solución**: Verifica `SMTP_HOST` y `SMTP_PORT`. Asegúrate de que el servidor SMTP esté disponible.

### Cron Job No Inicia

```
❌ Error iniciando cron job: ...
```

**Solución**: Verifica que `node-cron` esté instalado y que no haya conflictos de zona horaria.

## Personalización

### Cambiar Horario del Reporte

Edita `dailyReportService.js`:

```javascript
// Cambiar de 8:00 AM a 9:00 AM
const cronExpression = '0 9 * * *'
```

### Modificar Template del Email

Edita la función `createEmailTemplate` en `emailService.js`.

### Agregar Más Categorías

Modifica `reportService.js` para agregar nuevas consultas y categorías.

## Seguridad

- ✅ Las rutas están protegidas (puedes agregar autenticación)
- ✅ Las contraseñas se manejan via variables de entorno
- ✅ No se almacenan credenciales en el código
- ✅ Validación de entrada en todos los endpoints

## Próximos Pasos

1. **Configurar autenticación** en las rutas de reportes
2. **Agregar notificaciones push** además de email
3. **Implementar reportes personalizados** por cliente
4. **Agregar métricas de envío** y estadísticas
5. **Crear dashboard** para gestión de reportes

---

**¡El sistema está listo para usar!** 🚀

Para probar inmediatamente, ejecuta:
```bash
curl -X POST http://localhost:5000/api/reports/test-email
```
