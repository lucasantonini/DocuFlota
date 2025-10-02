# Guía de Prueba - Flujo de Carga y Reemplazo de Documentos

## Descripción General

Esta guía describe cómo probar el flujo funcional de carga y reemplazo de documentos en DocuFlota. El sistema permite cargar documentos desde la cabecera de vehículos/personal y reemplazar documentos específicos, manteniendo un historial completo de cambios.

## Prerrequisitos

1. **Base de datos Supabase configurada** con el esquema actualizado
2. **Backend ejecutándose** en el puerto configurado
3. **Frontend ejecutándose** y accesible
4. **Archivos de prueba** en formato PDF o JPG (máximo 16MB)

## Configuración Inicial

### 1. Ejecutar el esquema de Supabase

```sql
-- Ejecutar el archivo backend/supabase-schema.sql en Supabase SQL Editor
-- Esto creará las tablas necesarias y datos de prueba
```

### 2. Verificar que el backend esté ejecutándose

```bash
cd backend
npm install
npm run dev
```

### 3. Verificar que el frontend esté ejecutándose

```bash
cd frontend
npm install
npm run dev
```

## Pruebas del Flujo de Carga desde Cabecera

### Prueba 1: Cargar Documentos de Vehículo

1. **Acceder a la página de Vehículos**
   - Navegar a `/vehicles` en el frontend
   - Verificar que se muestre la lista de vehículos

2. **Abrir modal de carga**
   - Hacer clic en el botón "Cargar" junto al nombre de un vehículo
   - Verificar que se abra el modal "Cargar Documentos - [Nombre del Vehículo]"

3. **Configurar documentos**
   - Seleccionar archivos PDF o JPG (máximo 16MB)
   - Para cada archivo:
     - Seleccionar tipo de documento del dropdown (ej: "Seguro", "VTV", "Otro")
     - Establecer fecha de vencimiento (obligatorio)
   - Verificar validación de archivos (solo PDF, JPG, JPEG)

4. **Subir documentos**
   - Hacer clic en "Subir Documentos"
   - Verificar mensaje de éxito
   - Verificar que los documentos aparezcan en la lista del vehículo

### Prueba 2: Cargar Documentos de Personal

1. **Acceder a la página de Personal**
   - Navegar a `/personnel` en el frontend
   - Verificar que se muestre la lista de personal

2. **Abrir modal de carga**
   - Hacer clic en el botón "Cargar" junto al nombre de una persona
   - Verificar que se abra el modal "Cargar Documentos - [Nombre del Personal]"

3. **Configurar documentos**
   - Seleccionar archivos PDF o JPG
   - Para cada archivo:
     - Seleccionar tipo de documento (ej: "Licencia de Conducir", "DNI", "Otro")
     - Establecer fecha de vencimiento
   - Verificar que solo aparezcan tipos de documento de personal

4. **Subir documentos**
   - Hacer clic en "Subir Documentos"
   - Verificar mensaje de éxito
   - Verificar que los documentos aparezcan en la lista del personal

## Pruebas del Flujo de Reemplazo de Documentos

### Prueba 3: Reemplazar Documento de Vehículo

1. **Acceder a un vehículo con documentos**
   - Expandir la fila de un vehículo que tenga documentos
   - Verificar que se muestren las tarjetas de documentos

2. **Abrir modal de reemplazo**
   - Hacer clic en "Cargar documento" en una tarjeta de documento
   - Verificar que se abra el modal "Reemplazar Documento"

3. **Configurar reemplazo**
   - Verificar que el nombre del documento esté prellenado
   - Modificar el nombre si es necesario
   - Actualizar la fecha de vencimiento
   - Seleccionar un nuevo archivo (PDF o JPG)

4. **Confirmar reemplazo**
   - Hacer clic en "Reemplazar Documento"
   - Verificar mensaje de éxito
   - Verificar que la tarjeta se actualice con el nuevo documento

### Prueba 4: Reemplazar Documento de Personal

1. **Acceder a personal con documentos**
   - Expandir la fila de una persona que tenga documentos
   - Verificar que se muestren las tarjetas de documentos

2. **Abrir modal de reemplazo**
   - Hacer clic en "Cargar documento" en una tarjeta de documento
   - Verificar que se abra el modal "Reemplazar Documento"

3. **Configurar reemplazo**
   - Verificar que el nombre del documento esté prellenado
   - Modificar el nombre si es necesario
   - Actualizar la fecha de vencimiento
   - Seleccionar un nuevo archivo

4. **Confirmar reemplazo**
   - Hacer clic en "Reemplazar Documento"
   - Verificar mensaje de éxito
   - Verificar que la tarjeta se actualice con el nuevo documento

## Pruebas del Historial de Documentos

### Prueba 5: Ver Historial de Documento

1. **Acceder a un documento con historial**
   - Expandir la fila de un vehículo/personal que tenga documentos
   - Asegurarse de que el documento haya sido reemplazado al menos una vez

2. **Abrir modal de historial**
   - Hacer clic en "Ver historial" en una tarjeta de documento
   - Verificar que se abra el modal "Historial del Documento"

3. **Verificar información del historial**
   - Verificar que se muestre el documento actual (marcado como "ACTUAL")
   - Verificar que se muestren las versiones anteriores
   - Verificar que cada versión muestre:
     - Nombre del archivo anterior
     - Fecha de vencimiento anterior
     - Fecha de reemplazo
     - Usuario que realizó el reemplazo

4. **Cerrar modal**
   - Hacer clic en "Cerrar"
   - Verificar que el modal se cierre correctamente

## Pruebas de Validación y Errores

### Prueba 6: Validación de Archivos

1. **Probar archivos inválidos**
   - Intentar subir archivos que no sean PDF, JPG o JPEG
   - Verificar que se muestre error: "Solo se permiten archivos PDF, JPG o JPEG"

2. **Probar archivos muy grandes**
   - Intentar subir archivos mayores a 16MB
   - Verificar que se muestre error: "El archivo no puede ser mayor a 16MB"

3. **Probar campos obligatorios**
   - Intentar subir sin seleccionar tipo de documento
   - Intentar subir sin fecha de vencimiento
   - Verificar que se muestre error: "Todos los archivos deben tener tipo de documento y fecha de vencimiento"

### Prueba 7: Validación de Reemplazo

1. **Probar reemplazo sin archivo**
   - Abrir modal de reemplazo
   - Intentar confirmar sin seleccionar archivo
   - Verificar que se muestre error: "Debe seleccionar un archivo para reemplazar"

2. **Probar reemplazo sin datos obligatorios**
   - Abrir modal de reemplazo
   - Borrar nombre del documento o fecha de vencimiento
   - Intentar confirmar
   - Verificar que se muestre error: "El nombre del documento y la fecha de vencimiento son obligatorios"

## Verificación de Base de Datos

### Prueba 8: Verificar Persistencia en Supabase

1. **Verificar tabla documents**
   ```sql
   SELECT * FROM documents ORDER BY created_at DESC LIMIT 10;
   ```
   - Verificar que los documentos se guarden correctamente
   - Verificar que los nombres de archivo se generen automáticamente
   - Verificar que las relaciones con vehículos/personal sean correctas

2. **Verificar tabla document_history**
   ```sql
   SELECT * FROM document_history ORDER BY replaced_at DESC LIMIT 10;
   ```
   - Verificar que se guarden los reemplazos en el historial
   - Verificar que se mantenga la información del documento anterior

3. **Verificar tabla document_types**
   ```sql
   SELECT * FROM document_types ORDER BY category, name;
   ```
   - Verificar que se hayan creado los tipos de documento por defecto
   - Verificar que se separen correctamente por categoría (vehicle/personnel)

## Casos de Prueba Adicionales

### Prueba 9: Carga Múltiple

1. **Cargar varios documentos a la vez**
   - Seleccionar múltiples archivos en el modal de carga
   - Configurar cada uno con tipo y fecha diferentes
   - Verificar que todos se suban correctamente

### Prueba 10: Navegación entre Modales

1. **Probar flujo completo**
   - Cargar documentos desde cabecera
   - Reemplazar uno de los documentos
   - Ver el historial del documento reemplazado
   - Verificar que toda la información sea consistente

## Criterios de Aceptación

✅ **Funcionalidad Completa**
- [ ] Carga desde cabecera funciona para vehículos y personal
- [ ] Reemplazo de documentos funciona correctamente
- [ ] Historial se mantiene y es consultable
- [ ] Validaciones de archivos funcionan
- [ ] Nombres de archivo se generan automáticamente
- [ ] Datos se persisten en Supabase

✅ **Experiencia de Usuario**
- [ ] Interfaz intuitiva y fácil de usar
- [ ] Mensajes de error claros y útiles
- [ ] Mensajes de éxito apropiados
- [ ] Validación en tiempo real

✅ **Integridad de Datos**
- [ ] Relaciones correctas entre entidades
- [ ] Historial completo de cambios
- [ ] Nombres de archivo únicos
- [ ] Datos consistentes entre frontend y backend

## Notas Técnicas

- **Límite de archivos**: 16MB máximo por archivo
- **Formatos soportados**: PDF, JPG, JPEG
- **Generación de nombres**: `{tipo}_{id_entidad}_{timestamp}{extension}`
- **Historial**: Se mantiene indefinidamente para auditoría
- **Validaciones**: Cliente y servidor

## Solución de Problemas

### Error: "Error de conexión"
- Verificar que el backend esté ejecutándose
- Verificar la configuración de Supabase

### Error: "No se permiten archivos"
- Verificar que el archivo sea PDF, JPG o JPEG
- Verificar que el tamaño sea menor a 16MB

### Error: "Documento no encontrado"
- Verificar que el documento exista en la base de datos
- Verificar que el ID del documento sea correcto

### Modal no se abre
- Verificar que se hayan importado correctamente los componentes
- Verificar la consola del navegador para errores JavaScript
