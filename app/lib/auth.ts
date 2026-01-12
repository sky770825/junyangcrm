import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth-config'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser(): Promise<{
  id: string
  email: string
  name?: string | null
  role: 'agent' | 'manager'
} | null> {
  const session = await getSession()
  if (!session?.user) {
    return null
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  }
}

export async function requireAuth(): Promise<{
  id: string
  email: string
  name?: string | null
  role: 'agent' | 'manager'
}> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: 'agent' | 'manager'): Promise<{
  id: string
  email: string
  name?: string | null
  role: 'agent' | 'manager'
}> {
  const user = await requireAuth()
  if (user.role !== role && user.role !== 'manager') {
    throw new Error('Forbidden: Insufficient permissions')
  }
  return user
}
