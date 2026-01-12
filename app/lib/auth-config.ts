import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@/app/lib/supabase/server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // 使用 Supabase Auth 验证用户
          const supabase = await createClient()
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          })

          if (error || !data.user) {
            console.error('Auth error:', error)
            return null
          }

          // 获取用户信息（包括角色）
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (userError || !userData) {
            // 如果 users 表中没有记录，创建一个
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
                role: 'agent',
              })
              .select()
              .single()

            if (createError || !newUser) {
              console.error('Create user error:', createError)
              return null
            }

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            }
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as 'agent' | 'manager'
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
