import pool from '../config/database.js'

// Create tables if they don't exist
export const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Clients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cuit VARCHAR(20) UNIQUE NOT NULL,
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        plate VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Personnel table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personnel (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        dni VARCHAR(20) UNIQUE,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Document types table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL, -- 'vehicle' or 'personnel'
        required BOOLEAN DEFAULT true,
        validity_days INTEGER, -- days until expiration
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type_id INTEGER REFERENCES document_types(id),
        category VARCHAR(50) NOT NULL, -- 'vehicle' or 'personnel'
        file_url VARCHAR(500),
        file_name VARCHAR(255),
        file_size INTEGER,
        expiration_date DATE,
        status VARCHAR(20) DEFAULT 'valid', -- 'valid', 'warning', 'expired'
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        personnel_id INTEGER REFERENCES personnel(id) ON DELETE CASCADE,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (
          (category = 'vehicle' AND vehicle_id IS NOT NULL AND personnel_id IS NULL) OR
          (category = 'personnel' AND personnel_id IS NOT NULL AND vehicle_id IS NULL)
        )
      )
    `)

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'expiration', 'upload', 'system'
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Database tables created successfully')
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    throw error
  }
}

// Update document status based on expiration dates
export const updateDocumentStatus = async () => {
  try {
    // Update expired documents
    await pool.query(`
      UPDATE documents 
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP
      WHERE expiration_date < CURRENT_DATE 
      AND status != 'expired'
    `)

    // Update documents expiring soon (30 days)
    await pool.query(`
      UPDATE documents 
      SET status = 'warning', updated_at = CURRENT_TIMESTAMP
      WHERE expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND status = 'valid'
    `)

    // Update valid documents (more than 30 days)
    await pool.query(`
      UPDATE documents 
      SET status = 'valid', updated_at = CURRENT_TIMESTAMP
      WHERE expiration_date > CURRENT_DATE + INTERVAL '30 days'
      AND status = 'warning'
    `)

    console.log('📊 Document statuses updated')
  } catch (error) {
    console.error('❌ Error updating document statuses:', error)
  }
}

export default pool
