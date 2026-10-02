-- Schema pour la base de données Mikolo Events PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS animators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  role VARCHAR(255),
  daily_rate NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  experience_years INT DEFAULT 0,
  location VARCHAR(255),
  contact VARCHAR(255),
  contact_type VARCHAR(50) DEFAULT 'email',
  status VARCHAR(50) DEFAULT 'disponible',
  status_tone VARCHAR(50) DEFAULT 'green',
  avatar TEXT,
  avatar_bg VARCHAR(50) DEFAULT 'bg-[#005459]',
  avatar_text VARCHAR(10) DEFAULT 'AN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  daily_rate NUMERIC(10,2) DEFAULT 0,
  available_stock INT DEFAULT 0,
  total_stock INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  budget NUMERIC(12,2) DEFAULT 0,
  priority VARCHAR(50) DEFAULT 'normale',
  status VARCHAR(50) DEFAULT 'brouillon',
  status_badge VARCHAR(255),
  status_tone VARCHAR(50) DEFAULT 'prep',
  countdown VARCHAR(100),
  progress INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  time VARCHAR(100),
  briefing_date DATE,
  briefing_time VARCHAR(50),
  location TEXT,
  venue_name VARCHAR(255),
  venue_address TEXT,
  city VARCHAR(100),
  guest_count INT DEFAULT 0,
  venue_type VARCHAR(100),
  access_notes TEXT,
  image_url TEXT,
  notes_alert TEXT,
  description TEXT,
  project_manager VARCHAR(255),
  briefing_notes TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(100),
  emergency_contact_role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_staffing (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  animator_id INT,
  name VARCHAR(255),
  role VARCHAR(255),
  avatar VARCHAR(50),
  rating VARCHAR(20),
  phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS event_equipment (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  equipment_id VARCHAR(50),
  name VARCHAR(255),
  category VARCHAR(100),
  quantity INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS event_dispatch_sessions (
  id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(100),
  location TEXT,
  animators JSONB DEFAULT '[]'::jsonb,
  equipment JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS event_documents (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  date VARCHAR(50),
  url TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
