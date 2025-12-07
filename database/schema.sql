-- ========================================
-- TRAVEL PROPOSAL DATABASE SCHEMA
-- PostgreSQL + Supabase
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  role VARCHAR(50) DEFAULT 'consultant' CHECK (role IN ('admin', 'consultant', 'viewer')),
  agency_id UUID,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_agency_id ON users(agency_id);

-- ========================================
-- 2. AGENCIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  logo_url VARCHAR(255),
  description TEXT,
  theme_primary VARCHAR(7) DEFAULT '#0052CC',
  theme_accent VARCHAR(7) DEFAULT '#FFC107',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT agencies_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_agencies_slug ON agencies(slug);

-- Add agency_id to users if not exists
ALTER TABLE users 
ADD CONSTRAINT fk_users_agency 
FOREIGN KEY (agency_id) REFERENCES agencies(id) 
ON DELETE SET NULL;

-- ========================================
-- 3. PROPOSALS TABLE (Main Storage)
-- ========================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic info
  destination_name VARCHAR(255),
  check_in DATE,
  check_out DATE,
  travelers_count INTEGER DEFAULT 1,
  total_price DECIMAL(12, 2),
  
  -- Complete proposal data as JSON
  data JSONB NOT NULL,
  
  -- Status & Control
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  shared_with UUID[] DEFAULT '{}',
  shared_at TIMESTAMP,
  sent_at TIMESTAMP,
  
  -- Metadata
  title VARCHAR(255),
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT proposals_pkey PRIMARY KEY (id),
  CONSTRAINT fk_proposals_agency FOREIGN KEY (agency_id) REFERENCES agencies(id),
  CONSTRAINT fk_proposals_creator FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE INDEX idx_proposals_agency_id ON proposals(agency_id);
CREATE INDEX idx_proposals_creator_id ON proposals(creator_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX idx_proposals_destination ON proposals(destination_name);

-- Full-text search index
CREATE INDEX idx_proposals_search ON proposals USING GIN (data);

-- ========================================
-- 4. PROPOSAL ACTIVITIES TABLE (Audit Log)
-- ========================================
CREATE TABLE IF NOT EXISTS proposal_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  action VARCHAR(50) CHECK (action IN (
    'created', 'updated', 'shared', 'pdf_downloaded', 
    'whatsapp_sent', 'status_changed', 'deleted'
  )),
  
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_activity_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_activities_proposal_id ON proposal_activities(proposal_id);
CREATE INDEX idx_activities_user_id ON proposal_activities(user_id);
CREATE INDEX idx_activities_created_at ON proposal_activities(created_at DESC);

-- ========================================
-- 5. TEMPLATES TABLE (Optional for future)
-- ========================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  data JSONB NOT NULL,
  
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT templates_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_templates_agency_id ON templates(agency_id);
CREATE INDEX idx_templates_category ON templates(category);

-- ========================================
-- 6. DOCUMENTS TABLE (For storing PDFs, etc)
-- ========================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  file_url VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT documents_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_documents_proposal_id ON documents(proposal_id);

-- ========================================
-- 7. SESSIONS TABLE (For authentication)
-- ========================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for agencies
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for proposals
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for templates
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INSERT DEMO DATA
-- ========================================

-- Create demo agency
INSERT INTO agencies (id, name, slug, theme_primary, theme_accent)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::UUID,
  'Demo Agency',
  'demo-agency',
  '#0052CC',
  '#FFC107'
)
ON CONFLICT DO NOTHING;

-- Create demo user (perine / admin)
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  name, 
  role, 
  agency_id, 
  is_active
)
VALUES (
  '650e8400-e29b-41d4-a716-446655440000'::UUID,
  'perine@demo.com',
  '$2b$10$YIvxPbNWvLCqC2X.E1JBaOvFJ.xMqCvqMqVkD89zFKGXc0gVBt0Ya', -- bcrypt: admin
  'Perine',
  'admin',
  '550e8400-e29b-41d4-a716-446655440000'::UUID,
  true
)
ON CONFLICT DO NOTHING;

-- ========================================
-- VIEWS (Optional for convenience)
-- ========================================

-- View for proposal with creator info
CREATE OR REPLACE VIEW proposals_with_creator AS
SELECT 
  p.*,
  u.name as creator_name,
  u.email as creator_email,
  a.name as agency_name
FROM proposals p
LEFT JOIN users u ON p.creator_id = u.id
LEFT JOIN agencies a ON p.agency_id = a.id;

-- ========================================
-- COMMENTS
-- ========================================
COMMENT ON TABLE users IS 'Stored user accounts and authentication info';
COMMENT ON TABLE agencies IS 'Travel agencies using the platform';
COMMENT ON TABLE proposals IS 'Travel proposals - main data storage with JSONB';
COMMENT ON TABLE proposal_activities IS 'Audit log for all proposal activities';
COMMENT ON COLUMN proposals.data IS 'Complete TravelProposal object stored as JSONB for flexibility';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hashed password - never store plain text';

-- ========================================
-- SECURITY NOTES
-- ========================================
/*
  1. Passwords should ALWAYS be hashed with bcrypt before storage
  2. Use row-level security (RLS) policies in production
  3. Set proper permissions on tables
  4. Regular backups are essential
  5. Implement proper authentication tokens
  6. Sanitize all user inputs on backend
  7. Use environment variables for secrets
*/
