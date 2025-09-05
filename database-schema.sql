-- Guardian Guide Database Schema for Supabase
-- This file contains the complete database schema as specified in the PRD

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
    emergency_contacts JSONB DEFAULT '[]'::jsonb,
    state VARCHAR(2),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
    incident_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location JSONB, -- {latitude: number, longitude: number, accuracy: number}
    recording_url TEXT,
    notes TEXT DEFAULT '',
    contacts_notified JSONB DEFAULT '[]'::jsonb,
    incident_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE legal_guides (
    guide_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(2) NOT NULL,
    content JSONB NOT NULL, -- Contains coreRights, scenarios, etc.
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state, language)
);

-- User sessions table (for tracking active sessions)
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    device_info JSONB,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table (for tracking sent alerts)
CREATE TABLE emergency_alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    contact_info JSONB NOT NULL, -- Contact details and method
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- App usage analytics table
CREATE TABLE usage_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_status);
CREATE INDEX idx_incidents_user_id ON incidents(user_id);
CREATE INDEX idx_incidents_timestamp ON incidents(timestamp DESC);
CREATE INDEX idx_legal_guides_state_lang ON legal_guides(state, language);
CREATE INDEX idx_emergency_alerts_incident ON emergency_alerts(incident_id);
CREATE INDEX idx_usage_analytics_user ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_timestamp ON usage_analytics(timestamp DESC);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Incidents policies
CREATE POLICY "Users can view own incidents" ON incidents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incidents" ON incidents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents" ON incidents
    FOR UPDATE USING (auth.uid() = user_id);

-- Legal guides are public (read-only)
CREATE POLICY "Legal guides are public" ON legal_guides
    FOR SELECT TO public USING (true);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emergency alerts policies
CREATE POLICY "Users can view alerts for own incidents" ON emergency_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM incidents 
            WHERE incidents.incident_id = emergency_alerts.incident_id 
            AND incidents.user_id = auth.uid()
        )
    );

-- Usage analytics policies
CREATE POLICY "Users can view own analytics" ON usage_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics" ON usage_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_guides_updated_at BEFORE UPDATE ON legal_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for recordings (to be created in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Storage policies for recordings bucket
-- CREATE POLICY "Users can upload own recordings" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own recordings" ON storage.objects
--     FOR SELECT USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own recordings" ON storage.objects
--     FOR DELETE USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sample data for legal guides (California and New York)
INSERT INTO legal_guides (state, content, language) VALUES 
('CA', '{
    "coreRights": [
        {
            "title": "Right to Remain Silent",
            "description": "You have the constitutional right to remain silent. In California, you are only required to provide identification during a lawful detention."
        },
        {
            "title": "Right to Refuse Searches",
            "description": "You can refuse consent to search your person, belongings, or vehicle unless the officer has a warrant or probable cause."
        },
        {
            "title": "Right to Record",
            "description": "California is a two-party consent state for private conversations, but recording police in public is generally legal as long as you don''t interfere."
        },
        {
            "title": "Right to an Attorney",
            "description": "If arrested, you have the right to an attorney. California provides public defenders for those who cannot afford representation."
        }
    ],
    "scenarios": [
        {
            "title": "Traffic Stop",
            "description": "What to do when pulled over by police in California",
            "actions": [
                "Pull over safely and turn off engine",
                "Keep hands visible on steering wheel",
                "Provide license, registration, and insurance when asked",
                "You may ask if you''re free to leave",
                "Remain calm and polite"
            ]
        }
    ],
    "recordingLaws": "Recording police in public spaces is generally legal in California, but be aware of two-party consent laws for private conversations.",
    "stateSpecificNotes": "California has specific laws regarding police interactions and civilian rights that may differ from other states."
}', 'en'),

('NY', '{
    "coreRights": [
        {
            "title": "Right to Remain Silent",
            "description": "You have the constitutional right to remain silent. In New York, you must provide identification if lawfully requested during a stop."
        },
        {
            "title": "Right to Refuse Searches",
            "description": "You can refuse consent to search unless the officer has a warrant, probable cause, or reasonable suspicion."
        },
        {
            "title": "Right to Record",
            "description": "New York is a one-party consent state. Recording police in public is legal as long as you don''t interfere with their duties."
        },
        {
            "title": "Right to an Attorney",
            "description": "If arrested, you have the right to an attorney. New York provides legal aid for those who cannot afford representation."
        }
    ],
    "scenarios": [
        {
            "title": "Stop and Frisk",
            "description": "New York''s stop and frisk procedures and your rights",
            "actions": [
                "Stay calm and keep hands visible",
                "Ask ''Am I free to leave?''",
                "If detained, ask for the reason",
                "You can refuse consent to search beyond a pat-down for weapons",
                "Don''t resist even if you believe the stop is unlawful"
            ]
        }
    ],
    "recordingLaws": "Recording police is legal in New York in public spaces. The state has one-party consent laws for recordings.",
    "stateSpecificNotes": "New York has specific stop and frisk laws and procedures that citizens should be aware of."
}', 'en');

-- Sample Spanish content for California
INSERT INTO legal_guides (state, content, language) VALUES 
('CA', '{
    "coreRights": [
        {
            "title": "Derecho a Permanecer en Silencio",
            "description": "Tienes el derecho constitucional de permanecer en silencio. En California, solo debes proporcionar identificación durante una detención legal."
        },
        {
            "title": "Derecho a Rechazar Búsquedas",
            "description": "Puedes rechazar el consentimiento para registrar tu persona, pertenencias o vehículo a menos que el oficial tenga una orden o causa probable."
        },
        {
            "title": "Derecho a Grabar",
            "description": "California requiere consentimiento de ambas partes para conversaciones privadas, pero grabar a la policía en público es generalmente legal si no interfiere."
        },
        {
            "title": "Derecho a un Abogado",
            "description": "Si eres arrestado, tienes derecho a un abogado. California proporciona defensores públicos para quienes no pueden pagar representación."
        }
    ],
    "scenarios": [
        {
            "title": "Parada de Tráfico",
            "description": "Qué hacer cuando te detiene la policía en California",
            "actions": [
                "Deténte de manera segura y apaga el motor",
                "Mantén las manos visibles en el volante",
                "Proporciona licencia, registro y seguro cuando se solicite",
                "Puedes preguntar si eres libre de irte",
                "Mantén la calma y sé cortés"
            ]
        }
    ],
    "recordingLaws": "Grabar a la policía en espacios públicos es generalmente legal en California, pero ten en cuenta las leyes de consentimiento de ambas partes para conversaciones privadas.",
    "stateSpecificNotes": "California tiene leyes específicas sobre interacciones policiales y derechos civiles que pueden diferir de otros estados."
}', 'es');

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_incidents', (SELECT COUNT(*) FROM incidents WHERE user_id = user_uuid),
        'total_recordings', (SELECT COUNT(*) FROM incidents WHERE user_id = user_uuid AND recording_url IS NOT NULL),
        'emergency_alerts_sent', (
            SELECT COUNT(*) FROM emergency_alerts ea
            JOIN incidents i ON ea.incident_id = i.incident_id
            WHERE i.user_id = user_uuid
        ),
        'subscription_status', (SELECT subscription_status FROM users WHERE user_id = user_uuid),
        'member_since', (SELECT created_at FROM users WHERE user_id = user_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
