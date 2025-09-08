-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_competitors ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read/write all data (for development)
CREATE POLICY "Allow all operations for anon users" ON brands
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for anon users" ON signals
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for anon users" ON brand_goals
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for anon users" ON brand_competitors
    FOR ALL USING (true);
