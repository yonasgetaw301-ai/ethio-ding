-- ========================================================
-- Ding Clone Database Schema for Supabase
-- Run this entire script in Supabase -> SQL Editor -> Run
-- ========================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  grandfather_name TEXT,
  street_address TEXT,
  apartment TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Card Details Table
CREATE TABLE IF NOT EXISTS card_details (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  card_number TEXT NOT NULL,
  expiry TEXT NOT NULL,
  cvv TEXT NOT NULL,
  name_on_card TEXT NOT NULL,
  country TEXT DEFAULT 'Ethiopia',
  saved_for_next_time BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Topups Table
CREATE TABLE IF NOT EXISTS topups (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  phone TEXT NOT NULL,
  amount_usd NUMERIC NOT NULL,
  amount_etb NUMERIC NOT NULL,
  bonus_etb NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Admin Credentials & Password Management Table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id TEXT PRIMARY KEY DEFAULT 'main_admin',
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Admin if not already present
INSERT INTO admin_credentials (id, email, password)
VALUES ('main_admin', 'yonasgetaw5444@gmail.com', '40191437')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE topups ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent duplicate policy errors
DROP POLICY IF EXISTS "Public read access users" ON users;
DROP POLICY IF EXISTS "Public insert access users" ON users;
DROP POLICY IF EXISTS "Public update access users" ON users;

DROP POLICY IF EXISTS "Public read access card_details" ON card_details;
DROP POLICY IF EXISTS "Public insert access card_details" ON card_details;

DROP POLICY IF EXISTS "Public read access topups" ON topups;
DROP POLICY IF EXISTS "Public insert access topups" ON topups;
DROP POLICY IF EXISTS "Public update access topups" ON topups;

DROP POLICY IF EXISTS "Public read access admin_credentials" ON admin_credentials;
DROP POLICY IF EXISTS "Public insert access admin_credentials" ON admin_credentials;
DROP POLICY IF EXISTS "Public update access admin_credentials" ON admin_credentials;

-- Public Access Policies
CREATE POLICY "Public read access users" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert access users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access users" ON users FOR UPDATE USING (true);

CREATE POLICY "Public read access card_details" ON card_details FOR SELECT USING (true);
CREATE POLICY "Public insert access card_details" ON card_details FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access topups" ON topups FOR SELECT USING (true);
CREATE POLICY "Public insert access topups" ON topups FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access topups" ON topups FOR UPDATE USING (true);

CREATE POLICY "Public read access admin_credentials" ON admin_credentials FOR SELECT USING (true);
CREATE POLICY "Public insert access admin_credentials" ON admin_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access admin_credentials" ON admin_credentials FOR UPDATE USING (true);
