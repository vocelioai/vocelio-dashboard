-- Vocelio Flow Builder Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;

-- Create flows table
CREATE TABLE flows (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_production boolean DEFAULT false,
    user_id uuid REFERENCES auth.users(id),
    description text,
    version integer DEFAULT 1
);

-- Create flow_nodes table
CREATE TABLE flow_nodes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    node_id text NOT NULL,
    type text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}',
    position jsonb NOT NULL DEFAULT '{"x": 0, "y": 0}',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(flow_id, node_id)
);

-- Create flow_edges table
CREATE TABLE flow_edges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    edge_id text NOT NULL,
    source text NOT NULL,
    target text NOT NULL,
    label text,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(flow_id, edge_id)
);

-- Create test_calls table for logging
CREATE TABLE test_calls (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    call_sid text UNIQUE NOT NULL,
    phone_number text NOT NULL,
    script text,
    flow_id uuid REFERENCES flows(id),
    status text DEFAULT 'initiated',
    duration integer,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);

-- Create templates table for predefined flows
CREATE TABLE flow_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL, -- 'solar', 'real_estate', 'insurance', etc.
    description text,
    template_data jsonb NOT NULL DEFAULT '{}',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Create flow_analytics table for tracking performance
CREATE TABLE flow_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    metric_name text NOT NULL,
    metric_value numeric NOT NULL,
    date_recorded date DEFAULT CURRENT_DATE,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Create collaboration table for team features
CREATE TABLE flow_collaborators (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    role text DEFAULT 'editor', -- 'owner', 'editor', 'viewer'
    invited_at timestamp with time zone DEFAULT now(),
    accepted_at timestamp with time zone,
    UNIQUE(flow_id, user_id)
);

-- Create flow_versions table for version control
CREATE TABLE flow_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    changes_summary text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    flow_data jsonb NOT NULL DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_flows_user_id ON flows(user_id);
CREATE INDEX idx_flows_is_production ON flows(is_production);
CREATE INDEX idx_flow_nodes_flow_id ON flow_nodes(flow_id);
CREATE INDEX idx_flow_edges_flow_id ON flow_edges(flow_id);
CREATE INDEX idx_test_calls_flow_id ON test_calls(flow_id);
CREATE INDEX idx_test_calls_created_at ON test_calls(created_at);
CREATE INDEX idx_flow_analytics_flow_id ON flow_analytics(flow_id);
CREATE INDEX idx_flow_analytics_date ON flow_analytics(date_recorded);
CREATE INDEX idx_flow_collaborators_flow_id ON flow_collaborators(flow_id);
CREATE INDEX idx_flow_collaborators_user_id ON flow_collaborators(user_id);
CREATE INDEX idx_flow_versions_flow_id ON flow_versions(flow_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to flows table
CREATE TRIGGER update_flows_updated_at 
    BEFORE UPDATE ON flows 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flows
CREATE POLICY "Users can view their own flows" ON flows 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create flows" ON flows 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flows" ON flows 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flows" ON flows 
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for flow_nodes
CREATE POLICY "Users can view nodes of their flows" ON flow_nodes 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM flows 
            WHERE flows.id = flow_nodes.flow_id 
            AND flows.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage nodes of their flows" ON flow_nodes 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM flows 
            WHERE flows.id = flow_nodes.flow_id 
            AND flows.user_id = auth.uid()
        )
    );

-- RLS Policies for flow_edges
CREATE POLICY "Users can view edges of their flows" ON flow_edges 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM flows 
            WHERE flows.id = flow_edges.flow_id 
            AND flows.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage edges of their flows" ON flow_edges 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM flows 
            WHERE flows.id = flow_edges.flow_id 
            AND flows.user_id = auth.uid()
        )
    );

-- RLS Policies for test_calls
CREATE POLICY "Users can view test calls for their flows" ON test_calls 
    FOR SELECT USING (
        flow_id IS NULL OR EXISTS (
            SELECT 1 FROM flows 
            WHERE flows.id = test_calls.flow_id 
            AND flows.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create test calls" ON test_calls 
    FOR INSERT WITH CHECK (true); -- Allow API to insert test calls

-- Templates are public read-only
CREATE POLICY "Anyone can view templates" ON flow_templates 
    FOR SELECT USING (is_active = true);

-- Insert some default templates
INSERT INTO flow_templates (name, category, description, template_data) VALUES 
(
    'Solar Sales Flow',
    'solar',
    'Complete solar sales conversation flow with objection handling',
    '{
        "nodes": [
            {
                "id": "start-1",
                "type": "start",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Solar Introduction",
                    "script": "Hi! I''m calling about the solar program in your area. We''re helping homeowners reduce their electricity bills by up to 90%. Do you currently pay more than $100 per month for electricity?",
                    "objectionHandling": {
                        "tooExpensive": "I understand cost is a concern. The great news is there''s typically no upfront cost, and most homeowners save money from day one. Would you like to see how much you could save?",
                        "alreadyHaveAgency": "That''s great that you''re already looking into solar! What''s been your experience so far? We might be able to offer some additional options.",
                        "notInterested": "I appreciate your honesty. Can I ask - is it the solar technology itself, or are you happy with your current electricity bill?"
                    }
                }
            }
        ]
    }'
),
(
    'Real Estate Lead Flow',
    'real_estate',
    'Real estate lead qualification and appointment setting',
    '{
        "nodes": [
            {
                "id": "start-1",
                "type": "start",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Real Estate Introduction",
                    "script": "Hi! I''m calling about your interest in real estate in the area. Are you currently looking to buy, sell, or perhaps both?",
                    "objectionHandling": {
                        "tooExpensive": "I understand the market can seem pricey. The good news is we have options at every price point. What''s your ideal budget range?",
                        "alreadyHaveAgency": "That''s great! How long have you been working with them? Sometimes a second opinion can be really valuable.",
                        "notInterested": "No problem at all. Are you planning to stay in your current home for the foreseeable future?"
                    }
                }
            }
        ]
    }'
),
(
    'Insurance Sales Flow',
    'insurance',
    'Insurance lead qualification and needs assessment',
    '{
        "nodes": [
            {
                "id": "start-1",
                "type": "start",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Insurance Introduction",
                    "script": "Hi! I''m calling about insurance options in your area. We''re helping families save an average of $200 per month on their insurance. Do you currently have auto or home insurance?",
                    "objectionHandling": {
                        "tooExpensive": "I completely understand wanting to keep costs down. That''s exactly why I''m calling - we''ve been able to reduce most people''s premiums significantly. What are you paying now?",
                        "alreadyHaveAgency": "That''s good that you have coverage! When was the last time you shopped around? Rates change frequently, and you might be missing out on savings.",
                        "notInterested": "I respect that. Can I ask - are you happy with what you''re currently paying for insurance?"
                    }
                }
            }
        ]
    }'
);

-- Create a function to get flow analytics
CREATE OR REPLACE FUNCTION get_flow_analytics(flow_uuid uuid)
RETURNS TABLE (
    total_calls bigint,
    successful_calls bigint,
    average_duration numeric,
    conversion_rate numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_calls,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::bigint as successful_calls,
        AVG(duration)::numeric as average_duration,
        (COUNT(CASE WHEN status = 'completed' THEN 1 END)::numeric / COUNT(*)::numeric * 100) as conversion_rate
    FROM test_calls 
    WHERE flow_id = flow_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to duplicate a flow
CREATE OR REPLACE FUNCTION duplicate_flow(source_flow_id uuid, new_name text)
RETURNS uuid AS $$
DECLARE
    new_flow_id uuid;
BEGIN
    -- Create new flow
    INSERT INTO flows (name, user_id, description)
    SELECT new_name, user_id, description || ' (Copy)'
    FROM flows 
    WHERE id = source_flow_id
    RETURNING id INTO new_flow_id;
    
    -- Copy nodes
    INSERT INTO flow_nodes (flow_id, node_id, type, data, position)
    SELECT new_flow_id, node_id, type, data, position
    FROM flow_nodes 
    WHERE flow_id = source_flow_id;
    
    -- Copy edges
    INSERT INTO flow_edges (flow_id, edge_id, source, target, label)
    SELECT new_flow_id, edge_id, source, target, label
    FROM flow_edges 
    WHERE flow_id = source_flow_id;
    
    RETURN new_flow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
