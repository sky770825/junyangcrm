-- Client Requests table (业务员申请客户)
CREATE TABLE IF NOT EXISTS client_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_note TEXT,
  response_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, agent_id, status) -- 防止重复申请
);

-- User Applications table (业务员注册申请)
CREATE TABLE IF NOT EXISTS user_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  application_note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_client_requests_client_id ON client_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_client_requests_agent_id ON client_requests(agent_id);
CREATE INDEX IF NOT EXISTS idx_client_requests_status ON client_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_applications_status ON user_applications(status);

-- RLS Policies for client_requests
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own requests" ON client_requests
  FOR SELECT USING (
    agent_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

CREATE POLICY "Agents can create requests" ON client_requests
  FOR INSERT WITH CHECK (agent_id::text = auth.uid()::text);

CREATE POLICY "Managers can manage all requests" ON client_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for user_applications
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create application" ON user_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own application" ON user_applications
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id::text = auth.uid()::text) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

CREATE POLICY "Managers can manage all applications" ON user_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_client_requests_updated_at BEFORE UPDATE ON client_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_applications_updated_at BEFORE UPDATE ON user_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
