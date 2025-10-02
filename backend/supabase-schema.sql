-- DocuFlota Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cuit VARCHAR(20) UNIQUE NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  plate VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'vehicle' or 'personnel'
  required BOOLEAN DEFAULT true,
  validity_days INTEGER, -- days until expiration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type_id BIGINT REFERENCES document_types(id),
  category VARCHAR(50) NOT NULL, -- 'vehicle' or 'personnel'
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  file_size BIGINT,
  expiration_date DATE,
  status VARCHAR(20) DEFAULT 'valid', -- 'valid', 'warning', 'expired'
  vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE CASCADE,
  personnel_id BIGINT REFERENCES personnel(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  uploaded_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_document_category CHECK (
    (category = 'vehicle' AND vehicle_id IS NOT NULL AND personnel_id IS NULL) OR
    (category = 'personnel' AND personnel_id IS NOT NULL AND vehicle_id IS NULL)
  )
);

-- Document history table for tracking document replacements
CREATE TABLE IF NOT EXISTS document_history (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  previous_file_url VARCHAR(500),
  previous_file_name VARCHAR(255),
  previous_expiration_date DATE,
  replaced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replaced_by BIGINT REFERENCES users(id),
  reason VARCHAR(255) DEFAULT 'replacement'
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'expiration', 'upload', 'system'
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_expiration ON documents(expiration_date);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_vehicle ON documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_documents_personnel ON documents(personnel_id);
CREATE INDEX IF NOT EXISTS idx_document_history_document ON document_history(document_id);
CREATE INDEX IF NOT EXISTS idx_document_history_replaced_at ON document_history(replaced_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - you can restrict later)
CREATE POLICY "Enable all for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all for clients" ON clients FOR ALL USING (true);
CREATE POLICY "Enable all for vehicles" ON vehicles FOR ALL USING (true);
CREATE POLICY "Enable all for personnel" ON personnel FOR ALL USING (true);
CREATE POLICY "Enable all for documents" ON documents FOR ALL USING (true);
CREATE POLICY "Enable all for document_history" ON document_history FOR ALL USING (true);
CREATE POLICY "Enable all for notifications" ON notifications FOR ALL USING (true);

-- Insert default document types
INSERT INTO document_types (name, category, required, validity_days) VALUES
-- Vehicle document types
('Seguro', 'vehicle', true, 365),
('VTV', 'vehicle', true, 365),
('Cédula Verde', 'vehicle', true, 365),
('Cédula Azul', 'vehicle', true, 365),
('Patente', 'vehicle', true, 365),
('RTO', 'vehicle', true, 365),
('Habilitación Municipal', 'vehicle', true, 365),
('Otro', 'vehicle', false, NULL),
-- Personnel document types
('Licencia de Conducir', 'personnel', true, 365),
('DNI', 'personnel', true, 365),
('Certificado Médico', 'personnel', true, 365),
('Curso de Capacitación', 'personnel', true, 365),
('Seguro de Vida', 'personnel', false, 365),
('Otro', 'personnel', false, NULL)
ON CONFLICT DO NOTHING;
