-- Migration script to add location column to brands table
-- Run this in your Supabase SQL editor if you have an existing database

-- Add location column to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Ensure employee_count column exists (it should already exist)
ALTER TABLE brands ADD COLUMN IF NOT EXISTS employee_count VARCHAR(50);

-- Add any missing indexes
CREATE INDEX IF NOT EXISTS idx_brands_location ON brands(location);
CREATE INDEX IF NOT EXISTS idx_brands_employee_count ON brands(employee_count);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'brands' 
ORDER BY ordinal_position;
