import Link from 'next/link'
import AuthButton from '@/app/components/AuthButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            常順地產CRM系統
          </h1>
          <p className="text-gray-600 mb-6">
            客戶關係管理與活動追蹤系統
          </p>
          <div className="flex justify-center mb-4">
            <AuthButton />
          </div>
        </div>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            業務員面板
          </Link>
          <Link
            href="/admin"
            className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
          >
            管理後台
          </Link>
        </div>
      </div>
    </div>
  )
}
