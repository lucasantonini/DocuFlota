# DocuFlota - Gestión de Documentación para Flotas

Una plataforma SaaS para empresas de logística que necesitan gestionar la documentación habilitante de vehículos y personal (choferes).

## 🚀 Características

- **Gestión Centralizada**: Documentos de vehículos y personal en un solo lugar
- **Sistema de Semáforo**: Estado visual de documentos (verde, amarillo, rojo)
- **Alertas Automáticas**: Notificaciones antes de vencimientos
- **Dashboard Intuitivo**: Vista general con métricas clave
- **Carga de Documentos**: Upload de PDFs e imágenes
- **Clasificación Automática**: Identificación de tipo de documento y campos clave

## 🏗️ Arquitectura

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Supabase
- **Base de Datos**: Supabase (PostgreSQL)
- **Despliegue**: Sin contenedores, desarrollo local

## 📋 Requisitos Previos

- Node.js 18+
- Cuenta de Supabase
- Git

## 🚀 Instalación Rápida

### 1. Configurar Supabase

1. Crear una cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. En el SQL Editor, ejecutar el contenido de `backend/supabase-schema.sql`
4. Copiar las credenciales de tu proyecto

### 2. Configurar el Proyecto

```bash
# Clonar el repositorio
git clone <repository-url>
cd docuflota

# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Configurar variables de entorno
cp backend/env.example backend/.env

# Editar backend/.env con tus credenciales de Supabase:
# SUPABASE_URL=tu-url-de-supabase
# SUPABASE_ANON_KEY=tu-anon-key
# SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Poblar la base de datos
npm run seed

# Iniciar en modo desarrollo
npm run dev
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔑 Credenciales por Defecto

- **Email**: admin@docuflota.com
- **Contraseña**: admin123

## 📊 Datos de Prueba

El sistema incluye datos de ejemplo:

- **3 Clientes** con diferentes estados
- **5 Vehículos** (tractores, semirremolques, camiones)
- **5 Personal** (choferes, administrativos, mecánicos)
- **Documentos** con diferentes estados de vencimiento

## 🗂️ Estructura del Proyecto

```
docuflota/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   └── ...
│   └── package.json
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   ├── models/          # Modelos de base de datos
│   │   ├── middleware/      # Middleware personalizado
│   │   └── ...
│   ├── supabase-schema.sql  # Esquema de base de datos
│   └── package.json
├── uploads/                  # Archivos subidos
└── README.md
```

## 🔧 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia frontend y backend
npm run dev:frontend # Solo frontend
npm run dev:backend  # Solo backend
npm run seed         # Poblar con datos de prueba
```

### Producción
```bash
npm run build        # Construir frontend
npm run start        # Iniciar backend en producción
```

## 📱 Funcionalidades Implementadas

### Dashboard
- ✅ Vista general con métricas clave
- ✅ Contadores de documentos por estado
- ✅ Diseño responsive

### Gestión de Vehículos
- ✅ Lista de vehículos con estado global
- ✅ Filas expandibles para ver documentos
- ✅ Sistema de semáforo por documento
- ✅ Acciones de carga y historial

### Gestión de Personal
- ✅ Lista de personal con estado global
- ✅ Documentos individuales por persona
- ✅ Estados de vencimiento detallados

### Gestión de Clientes
- ✅ Lista de clientes con estadísticas
- ✅ Información de contacto
- ✅ Métricas de documentos por cliente

### API Backend
- ✅ Endpoints REST completos
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Upload de archivos
- ✅ Autenticación JWT

## 🔮 Próximas Funcionalidades

- [ ] OCR para identificación automática de documentos
- [ ] Notificaciones push en tiempo real
- [ ] Reportes y exportación de datos
- [ ] Integración con servicios de email
- [ ] Dashboard de analytics avanzado
- [ ] API para integraciones externas

## 🛠️ Desarrollo

### Agregar Nuevo Documento

1. Crear tipo de documento en `document_types`
2. Implementar validación en el frontend
3. Agregar lógica de estado en el backend

### Agregar Nueva Página

1. Crear componente en `frontend/src/pages/`
2. Agregar ruta en `frontend/src/App.jsx`
3. Crear endpoint en `backend/src/routes/`

## 📝 Notas Técnicas

- **Sistema de Semáforo**: 
  - Verde: > 30 días hasta vencimiento
  - Amarillo: 1-30 días hasta vencimiento
  - Rojo: Vencido

- **Estados de Documentos**:
  - `valid`: Vigente
  - `warning`: Por vencer
  - `expired`: Vencido

- **Categorías**:
  - `vehicle`: Documentos de vehículos
  - `personnel`: Documentos de personal

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.

---

**DocuFlota** - Tu flota siempre en regla 🚛📋