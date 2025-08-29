-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role TEXT,
    avatar_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (id, data) VALUES ('main', '{
    "hero": {
        "title": "Auto Order - Your Trusted Vehicle Partner",
        "subtitle": "Find the perfect vehicle with our expert sourcing and delivery service",
        "ctaLabel": "Get Started",
        "ctaHref": "/contact",
        "heroImage": ""
    },
    "header": {
        "headline": "Auto Order",
        "subheadline": "Professional Vehicle Sourcing"
    },
    "seo": {
        "title": "Auto Order - Professional Vehicle Sourcing Service",
        "description": "Expert vehicle sourcing and delivery service. Find your perfect car with Auto Order.",
        "ogImage": ""
    },
    "newsletter": {
        "enabled": true,
        "provider": "mailchimp"
    },
    "contact": {
        "phone": "+44 123 456 789",
        "email": "info@autoorder.com",
        "address": "123 Business Street, London, UK",
        "schedule": "Mon-Fri: 9AM-6PM"
    }
}') ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "site_settings_select_policy" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "site_settings_write_policy" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- RLS Policies for testimonials
CREATE POLICY "testimonials_select_policy" ON testimonials
    FOR SELECT USING (true);

CREATE POLICY "testimonials_write_policy" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated ON site_settings(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for site_settings
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
