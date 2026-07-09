-- FlowSentinel AI — Initial Schema
-- Author: Felipe Alirio Baruja

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (extends Supabase auth.users via profile)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL DEFAULT 'free',
  owner_id UUID NOT NULL REFERENCES profiles(id),
  simulations_this_month INT DEFAULT 0,
  billing_period_start TIMESTAMPTZ DEFAULT NOW(),
  stripe_customer_id TEXT,
  mp_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  is_active BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flow_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  trigger_text TEXT NOT NULL,
  expected_response TEXT NOT NULL,
  risk_weight NUMERIC(3,2) DEFAULT 0.2
);

CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  traits TEXT[] DEFAULT '{}',
  sample_messages TEXT[] DEFAULT '{}',
  aggression_level INT DEFAULT 5 CHECK (aggression_level BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE simulation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  flow_id UUID NOT NULL REFERENCES flows(id),
  flow_version INT NOT NULL,
  persona_id UUID NOT NULL REFERENCES personas(id),
  status TEXT NOT NULL DEFAULT 'queued',
  risk_score INT DEFAULT 0,
  pass_rate INT DEFAULT 0,
  total_turns INT DEFAULT 0,
  heatmap JSONB DEFAULT '[]',
  regression_delta INT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE simulation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID NOT NULL REFERENCES simulation_runs(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  turn_index INT NOT NULL,
  flagged BOOLEAN DEFAULT FALSE,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE simulation_failures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID NOT NULL REFERENCES simulation_runs(id) ON DELETE CASCADE,
  step_id UUID REFERENCES flow_steps(id),
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  turn_index INT,
  suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE failure_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  simulation_id UUID NOT NULL REFERENCES simulation_runs(id),
  flow_id UUID NOT NULL REFERENCES flows(id),
  flow_name TEXT NOT NULL,
  risk_score INT NOT NULL,
  top_failures JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing_webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_flows_workspace ON flows(workspace_id);
CREATE INDEX idx_simulations_workspace ON simulation_runs(workspace_id);
CREATE INDEX idx_simulations_flow ON simulation_runs(flow_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE failure_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: own profile only
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workspace access via membership
CREATE POLICY workspaces_select ON workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY workspace_members_select ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Flows: workspace members
CREATE POLICY flows_all ON flows FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY flow_steps_all ON flow_steps FOR ALL
  USING (flow_id IN (
    SELECT id FROM flows WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY personas_all ON personas FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY simulations_all ON simulation_runs FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY simulation_messages_all ON simulation_messages FOR ALL
  USING (simulation_id IN (
    SELECT id FROM simulation_runs WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY simulation_failures_all ON simulation_failures FOR ALL
  USING (simulation_id IN (
    SELECT id FROM simulation_runs WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY failure_reports_all ON failure_reports FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
