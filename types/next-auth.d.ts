import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: 'agent' | 'manager'
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'agent' | 'manager'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'agent' | 'manager'
  }
}
