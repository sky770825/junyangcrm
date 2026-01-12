'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="px-4 py-2 text-gray-500">
        載入中...
      </div>
    )
  }

  if (session) {
    const userRole = (session.user as any).role || 'agent'
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{session.user.name || session.user.email}</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            {userRole === 'manager' ? '管理員' : '業務員'}
          </span>
        </div>
        <button
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          登出
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push('/auth/signin')}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      登入
    </button>
  )
}
