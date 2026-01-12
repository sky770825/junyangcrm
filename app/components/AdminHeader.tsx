'use client'

import Link from 'next/link'

export default function AdminHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">常順地產CRM系統</h1>
            <p className="text-sm text-blue-100 mt-1">管理後台</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              業務員面板
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
