-- Insert sample brands
INSERT INTO brands (name, description, website, industry, location, employees) VALUES
('TechCorp Solutions', 'A leading technology company', 'https://techcorp.com', 'Technology', 'San Francisco', '250'),
('GreenEnergy Corp', 'Sustainable energy solutions', 'https://greenenergy.com', 'Energy', 'Austin', '180'),
('HealthTech Innovations', 'AI-powered medical solutions', 'https://healthtech.com', 'Healthcare', 'Boston', '120');

-- Insert sample signals (assuming you have brand IDs 1, 2, 3)
INSERT INTO signals (name, prompt, brand_id, insights, recommendations) VALUES
('Market Trend Analysis', 'Analyze market trends for sustainable technology', 1, 'Increased mentions of sustainable technology by 45%', '["Launch sustainability campaign", "Introduce eco-friendly variants"]'),
('Social Media Sentiment', 'Monitor social media sentiment across platforms', 2, 'Negative sentiment spike - 67% relate to customer service', '["Implement 24/7 chatbot", "Create customer success team"]');
