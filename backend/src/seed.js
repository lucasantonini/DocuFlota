import supabase, { createTables, updateDocumentStatus } from './models/index.js'
import bcrypt from 'bcryptjs'

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Create tables
    await createTables()

    // Clear existing data
    await supabase.from('notifications').delete().neq('id', 0)
    await supabase.from('documents').delete().neq('id', 0)
    await supabase.from('document_types').delete().neq('id', 0)
    await supabase.from('vehicles').delete().neq('id', 0)
    await supabase.from('personnel').delete().neq('id', 0)
    await supabase.from('clients').delete().neq('id', 0)
    await supabase.from('users').delete().neq('id', 0)

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .insert([{
        email: 'admin@docuflota.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      }])
      .select()

    if (userError) throw userError
    console.log('✅ Admin user created')

    // Create clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert([
        {
          name: 'Transportes del Norte S.A.',
          cuit: '30-12345678-9',
          contact_name: 'Juan Pérez',
          contact_email: 'juan.perez@transportesnorte.com',
          contact_phone: '+54 11 1234-5678',
          status: 'active'
        },
        {
          name: 'Logística Central S.R.L.',
          cuit: '30-87654321-0',
          contact_name: 'María González',
          contact_email: 'maria.gonzalez@logisticacentral.com',
          contact_phone: '+54 11 8765-4321',
          status: 'active'
        },
        {
          name: 'Fletes Rápidos S.A.',
          cuit: '30-11223344-5',
          contact_name: 'Carlos Rodríguez',
          contact_email: 'carlos.rodriguez@fletesrapidos.com',
          contact_phone: '+54 11 1122-3344',
          status: 'inactive'
        }
      ])
      .select()

    if (clientsError) throw clientsError
    console.log('✅ Clients created')

    // Create document types
    const { data: documentTypes, error: docTypesError } = await supabase
      .from('document_types')
      .insert([
        { name: 'SOAT', category: 'vehicle', required: true, validity_days: 365 },
        { name: 'Revisión Técnica', category: 'vehicle', required: true, validity_days: 365 },
        { name: 'Tarjeta de Propiedad', category: 'vehicle', required: true, validity_days: null },
        { name: 'Seguro', category: 'vehicle', required: true, validity_days: 365 },
        { name: 'DNI', category: 'personnel', required: true, validity_days: null },
        { name: 'Licencia de Conducir', category: 'personnel', required: true, validity_days: 365 },
        { name: 'Certificado de Antecedentes', category: 'personnel', required: true, validity_days: 90 },
        { name: 'Certificado Médico', category: 'personnel', required: true, validity_days: 365 }
      ])
      .select()

    if (docTypesError) throw docTypesError
    console.log('✅ Document types created')

    // Create vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert([
        { plate: 'ABC-123', name: 'Tractor Principal', type: 'Tractor', client_id: 1, status: 'active' },
        { plate: 'DEF-456', name: 'Semirremolque A', type: 'Semirremolque', client_id: 1, status: 'active' },
        { plate: 'GHI-789', name: 'Tractor Secundario', type: 'Tractor', client_id: 1, status: 'active' },
        { plate: 'JKL-012', name: 'Camión de Carga', type: 'Camión', client_id: 2, status: 'active' },
        { plate: 'MNO-345', name: 'Remolque B', type: 'Remolque', client_id: 2, status: 'active' }
      ])
      .select()

    if (vehiclesError) throw vehiclesError
    console.log('✅ Vehicles created')

    // Create personnel
    const { data: personnel, error: personnelError } = await supabase
      .from('personnel')
      .insert([
        { name: 'Juan Carlos Pérez', role: 'Chofer', dni: '12345678', client_id: 1, status: 'active' },
        { name: 'María Elena González', role: 'Chofer', dni: '87654321', client_id: 1, status: 'active' },
        { name: 'Roberto Martínez', role: 'Administrativo', dni: '11223344', client_id: 1, status: 'active' },
        { name: 'Ana López', role: 'Chofer', dni: '55667788', client_id: 2, status: 'active' },
        { name: 'Pedro Sánchez', role: 'Mecánico', dni: '99887766', client_id: 2, status: 'active' }
      ])
      .select()

    if (personnelError) throw personnelError
    console.log('✅ Personnel created')

    // Create documents
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .insert([
        // Vehicle documents
        { name: 'SOAT ABC-123', type_id: 1, category: 'vehicle', file_url: '/uploads/soat-abc123.pdf', file_name: 'soat-abc123.pdf', file_size: 1024000, expiration_date: '2024-01-14', vehicle_id: 1, client_id: 1, uploaded_by: 1, status: 'expired' },
        { name: 'Revisión Técnica ABC-123', type_id: 2, category: 'vehicle', file_url: '/uploads/revision-abc123.pdf', file_name: 'revision-abc123.pdf', file_size: 2048000, expiration_date: '2024-03-19', vehicle_id: 1, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'Tarjeta de Propiedad ABC-123', type_id: 3, category: 'vehicle', file_url: '/uploads/tarjeta-abc123.pdf', file_name: 'tarjeta-abc123.pdf', file_size: 1536000, expiration_date: '2024-12-30', vehicle_id: 1, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'SOAT DEF-456', type_id: 1, category: 'vehicle', file_url: '/uploads/soat-def456.pdf', file_name: 'soat-def456.pdf', file_size: 1024000, expiration_date: '2024-02-09', vehicle_id: 2, client_id: 1, uploaded_by: 1, status: 'warning' },
        { name: 'Revisión Técnica DEF-456', type_id: 2, category: 'vehicle', file_url: '/uploads/revision-def456.pdf', file_name: 'revision-def456.pdf', file_size: 2048000, expiration_date: '2024-08-15', vehicle_id: 2, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'SOAT GHI-789', type_id: 1, category: 'vehicle', file_url: '/uploads/soat-ghi789.pdf', file_name: 'soat-ghi789.pdf', file_size: 1024000, expiration_date: '2024-04-24', vehicle_id: 3, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'Revisión Técnica GHI-789', type_id: 2, category: 'vehicle', file_url: '/uploads/revision-ghi789.pdf', file_name: 'revision-ghi789.pdf', file_size: 2048000, expiration_date: '2024-06-10', vehicle_id: 3, client_id: 1, uploaded_by: 1, status: 'valid' },
        // Personnel documents
        { name: 'DNI Juan Carlos Pérez', type_id: 5, category: 'personnel', file_url: '/uploads/dni-juan.pdf', file_name: 'dni-juan.pdf', file_size: 512000, expiration_date: '2030-01-01', personnel_id: 1, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'Licencia Juan Carlos Pérez', type_id: 6, category: 'personnel', file_url: '/uploads/licencia-juan.pdf', file_name: 'licencia-juan.pdf', file_size: 768000, expiration_date: '2024-06-15', personnel_id: 1, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'DNI María Elena González', type_id: 5, category: 'personnel', file_url: '/uploads/dni-maria.pdf', file_name: 'dni-maria.pdf', file_size: 512000, expiration_date: '2030-01-01', personnel_id: 2, client_id: 1, uploaded_by: 1, status: 'valid' },
        { name: 'Licencia María Elena González', type_id: 6, category: 'personnel', file_url: '/uploads/licencia-maria.pdf', file_name: 'licencia-maria.pdf', file_size: 768000, expiration_date: '2024-02-20', personnel_id: 2, client_id: 1, uploaded_by: 1, status: 'warning' },
        { name: 'DNI Roberto Martínez', type_id: 5, category: 'personnel', file_url: '/uploads/dni-roberto.pdf', file_name: 'dni-roberto.pdf', file_size: 512000, expiration_date: '2024-04-20', personnel_id: 3, client_id: 1, uploaded_by: 1, status: 'expired' },
        { name: 'Certificado de Antecedentes Roberto', type_id: 7, category: 'personnel', file_url: '/uploads/antecedentes-roberto.pdf', file_name: 'antecedentes-roberto.pdf', file_size: 256000, expiration_date: '2024-09-30', personnel_id: 3, client_id: 1, uploaded_by: 1, status: 'valid' }
      ])
      .select()

    if (documentsError) throw documentsError
    console.log('✅ Documents created')

    // Update document statuses
    await updateDocumentStatus()

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: 1`)
    console.log(`- Clients: ${clients.length}`)
    console.log(`- Vehicles: ${vehicles.length}`)
    console.log(`- Personnel: ${personnel.length}`)
    console.log(`- Documents: ${documents.length}`)
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
