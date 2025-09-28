# 🚀 Migración a Supabase - DocuFlota

## ✅ Cambios Realizados

### 🗑️ Archivos Eliminados
- `docker-compose.yml` - Configuración de Docker Compose
- `backend/Dockerfile` - Dockerfile del backend
- `frontend/Dockerfile` - Dockerfile del frontend
- `setup.sh` - Script de setup con Docker
- `setup.bat` - Script de setup con Docker (Windows)

### 🔧 Archivos Modificados
- `backend/package.json` - Reemplazado `pg` por `@supabase/supabase-js`
- `backend/env.example` - Cambiadas variables de entorno a Supabase
- `backend/src/config/database.js` - Migrado de PostgreSQL a Supabase
- `backend/src/models/index.js` - Adaptado para usar Supabase
- `backend/src/seed.js` - Migrado para usar Supabase
- `package.json` - Eliminados scripts de Docker
- `README.md` - Actualizado con instrucciones de Supabase

### 📄 Archivos Nuevos
- `backend/supabase-schema.sql` - Esquema de base de datos para Supabase

## 🚀 Próximos Pasos

### 1. Configurar Supabase
1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ejecutar `backend/supabase-schema.sql` en el SQL Editor
4. Copiar credenciales del proyecto

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp backend/env.example backend/.env

# Editar backend/.env con tus credenciales:
SUPABASE_URL=tu-url-de-supabase
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 3. Instalar Dependencias
```bash
# Instalar dependencias del proyecto
npm install

# Instalar dependencias del frontend
cd frontend && npm install && cd ..

# Instalar dependencias del backend
cd backend && npm install && cd ..
```

### 4. Poblar Base de Datos
```bash
npm run seed
```

### 5. Iniciar Desarrollo
```bash
npm run dev
```

## 🔄 Migración de Datos

Si tienes datos existentes en PostgreSQL, necesitarás:

1. Exportar datos de PostgreSQL
2. Transformar el formato para Supabase
3. Importar usando el script de seed o directamente en Supabase

## 🎯 Ventajas de la Migración

- ✅ **Sin Docker** - Desarrollo más simple
- ✅ **Interfaz Web** - Dashboard visual de Supabase
- ✅ **Backups Automáticos** - No te preocupas por perder datos
- ✅ **Escalabilidad** - Supabase maneja la infraestructura
- ✅ **APIs Automáticas** - Endpoints generados automáticamente
- ✅ **Autenticación Integrada** - Sistema de usuarios listo

## ⚠️ Consideraciones

- **Costo**: Después del plan gratuito, Supabase es pago
- **Dependencia**: Dependes de un servicio externo
- **Migración**: Todo el código fue adaptado para Supabase

## 🆘 Soporte

Si encuentras problemas durante la migración:

1. Verifica que las credenciales de Supabase sean correctas
2. Asegúrate de que el esquema se ejecutó correctamente
3. Revisa los logs del backend para errores de conexión
4. Verifica que las variables de entorno estén configuradas

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Migración](https://supabase.com/docs/guides/migrations)
- [API Reference](https://supabase.com/docs/reference/javascript)
