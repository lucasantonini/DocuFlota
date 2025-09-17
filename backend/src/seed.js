import pool, { createTables, updateDocumentStatus } from './models/index.js'
import bcrypt from 'bcryptjs'

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Create tables
    await createTables()

    // Clear existing data
    await pool.query('DELETE FROM notifications')
    await pool.query('DELETE FROM documents')
    await pool.query('DELETE FROM document_types')
    await pool.query('DELETE FROM vehicles')
    await pool.query('DELETE FROM personnel')
    await pool.query('DELETE FROM clients')
    await pool.query('DELETE FROM users')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await pool.query(`
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, ['admin@docuflota.com', hashedPassword, 'Admin User', 'admin'])

    console.log('✅ Admin user created')

    // Create clients
    const clients = await pool.query(`
      INSERT INTO clients (name, cuit, contact_name, contact_email, contact_phone, status)
      VALUES 
        ('Transportes del Norte S.A.', '30-12345678-9', 'Juan Pérez', 'juan.perez@transportesnorte.com', '+54 11 1234-5678', 'active'),
        ('Logística Central S.R.L.', '30-87654321-0', 'María González', 'maria.gonzalez@logisticacentral.com', '+54 11 8765-4321', 'active'),
        ('Fletes Rápidos S.A.', '30-11223344-5', 'Carlos Rodríguez', 'carlos.rodriguez@fletesrapidos.com', '+54 11 1122-3344', 'inactive')
      RETURNING *
    `)

    console.log('✅ Clients created')

    // Create document types
    const documentTypes = await pool.query(`
      INSERT INTO document_types (name, category, required, validity_days)
      VALUES 
        ('SOAT', 'vehicle', true, 365),
        ('Revisión Técnica', 'vehicle', true, 365),
        ('Tarjeta de Propiedad', 'vehicle', true, null),
        ('Seguro', 'vehicle', true, 365),
        ('DNI', 'personnel', true, null),
        ('Licencia de Conducir', 'personnel', true, 365),
        ('Certificado de Antecedentes', 'personnel', true, 90),
        ('Certificado Médico', 'personnel', true, 365)
      RETURNING *
    `)

    console.log('✅ Document types created')

    // Create vehicles
    const vehicles = await pool.query(`
      INSERT INTO vehicles (plate, name, type, client_id, status)
      VALUES 
        ('ABC-123', 'Tractor Principal', 'Tractor', 1, 'active'),
        ('DEF-456', 'Semirremolque A', 'Semirremolque', 1, 'active'),
        ('GHI-789', 'Tractor Secundario', 'Tractor', 1, 'active'),
        ('JKL-012', 'Camión de Carga', 'Camión', 2, 'active'),
        ('MNO-345', 'Remolque B', 'Remolque', 2, 'active')
      RETURNING *
    `)

    console.log('✅ Vehicles created')

    // Create personnel
    const personnel = await pool.query(`
      INSERT INTO personnel (name, role, dni, client_id, status)
      VALUES 
        ('Juan Carlos Pérez', 'Chofer', '12345678', 1, 'active'),
        ('María Elena González', 'Chofer', '87654321', 1, 'active'),
        ('Roberto Martínez', 'Administrativo', '11223344', 1, 'active'),
        ('Ana López', 'Chofer', '55667788', 2, 'active'),
        ('Pedro Sánchez', 'Mecánico', '99887766', 2, 'active')
      RETURNING *
    `)

    console.log('✅ Personnel created')

    // Create documents
    const documents = await pool.query(`
      INSERT INTO documents (name, type_id, category, file_url, file_name, file_size, expiration_date, vehicle_id, personnel_id, client_id, uploaded_by, status)
      VALUES 
        -- Vehicle documents
        ('SOAT ABC-123', 1, 'vehicle', '/uploads/soat-abc123.pdf', 'soat-abc123.pdf', 1024000, '2024-01-14', 1, null, 1, 1, 'expired'),
        ('Revisión Técnica ABC-123', 2, 'vehicle', '/uploads/revision-abc123.pdf', 'revision-abc123.pdf', 2048000, '2024-03-19', 1, null, 1, 1, 'valid'),
        ('Tarjeta de Propiedad ABC-123', 3, 'vehicle', '/uploads/tarjeta-abc123.pdf', 'tarjeta-abc123.pdf', 1536000, '2024-12-30', 1, null, 1, 1, 'valid'),
        
        ('SOAT DEF-456', 1, 'vehicle', '/uploads/soat-def456.pdf', 'soat-def456.pdf', 1024000, '2024-02-09', 2, null, 1, 1, 'warning'),
        ('Revisión Técnica DEF-456', 2, 'vehicle', '/uploads/revision-def456.pdf', 'revision-def456.pdf', 2048000, '2024-08-15', 2, null, 1, 1, 'valid'),
        
        ('SOAT GHI-789', 1, 'vehicle', '/uploads/soat-ghi789.pdf', 'soat-ghi789.pdf', 1024000, '2024-04-24', 3, null, 1, 1, 'valid'),
        ('Revisión Técnica GHI-789', 2, 'vehicle', '/uploads/revision-ghi789.pdf', 'revision-ghi789.pdf', 2048000, '2024-06-10', 3, null, 1, 1, 'valid'),
        
        -- Personnel documents
        ('DNI Juan Carlos Pérez', 5, 'personnel', '/uploads/dni-juan.pdf', 'dni-juan.pdf', 512000, '2030-01-01', null, 1, 1, 1, 'valid'),
        ('Licencia Juan Carlos Pérez', 6, 'personnel', '/uploads/licencia-juan.pdf', 'licencia-juan.pdf', 768000, '2024-06-15', null, 1, 1, 1, 'valid'),
        
        ('DNI María Elena González', 5, 'personnel', '/uploads/dni-maria.pdf', 'dni-maria.pdf', 512000, '2030-01-01', null, 2, 1, 1, 'valid'),
        ('Licencia María Elena González', 6, 'personnel', '/uploads/licencia-maria.pdf', 'licencia-maria.pdf', 768000, '2024-02-20', null, 2, 1, 1, 'warning'),
        
        ('DNI Roberto Martínez', 5, 'personnel', '/uploads/dni-roberto.pdf', 'dni-roberto.pdf', 512000, '2024-04-20', null, 3, 1, 1, 'expired'),
        ('Certificado de Antecedentes Roberto', 7, 'personnel', '/uploads/antecedentes-roberto.pdf', 'antecedentes-roberto.pdf', 256000, '2024-09-30', null, 3, 1, 1, 'valid')
      RETURNING *
    `)

    console.log('✅ Documents created')

    // Update document statuses
    await updateDocumentStatus()

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: 1`)
    console.log(`- Clients: ${clients.rows.length}`)
    console.log(`- Vehicles: ${vehicles.rows.length}`)
    console.log(`- Personnel: ${personnel.rows.length}`)
    console.log(`- Documents: ${documents.rows.length}`)
    console.log('\n🔑 Admin credentials:')
    console.log('Email: admin@docuflota.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export default seedData
