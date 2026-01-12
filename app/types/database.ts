export type UserRole = 'agent' | 'manager'
export type ClientStatus = 'active' | 'archived'
export type TaskStatus = 'pending' | 'completed'
export type TaskType = 'Call' | 'Visit' | 'Message'
export type ClientTag = 'A-Hot' | 'B-Warm' | 'C-Cold' | 'D-Invalid'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  phone: string | null
  tags: ClientTag[]
  current_owner_id: string | null
  status: ClientStatus
  last_contact_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  client_id: string
  agent_id: string
  type: TaskType
  due_date: string
  status: TaskStatus
  completion_time: string | null
  result_note: string | null
  next_followup_date: string | null
  created_at: string
  updated_at: string
}

export interface TaskWithClient extends Task {
  clients: Client
}

export interface ClientRequest {
  id: string
  client_id: string
  agent_id: string
  status: 'pending' | 'approved' | 'rejected'
  request_note: string | null
  response_note: string | null
  created_at: string
  updated_at: string
}

export interface ClientRequestWithDetails extends ClientRequest {
  clients: Client
  users: User
}

export interface UserApplication {
  id: string
  email: string
  name: string | null
  phone: string | null
  application_note: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}
