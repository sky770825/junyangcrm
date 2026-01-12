'use client'

import { useState } from 'react'
import type { Client } from '@/app/types/database'

interface ClientRequestModalProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  onRequest: (clientId: string, requestNote: string) => Promise<void>
}

export default function ClientRequestModal({
  client,
  isOpen,
  onClose,
  onRequest
}: ClientRequestModalProps) {
  const [requestNote, setRequestNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      setIsSubmitting(true)
      await onRequest(client.id, requestNote.trim())
      setRequestNote('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '申請失敗')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">申請客戶</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              客戶名稱
            </label>
            <div className="p-3 bg-gray-50 rounded border">
              {client.name}
            </div>
          </div>

          {client.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {client.phone}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="requestNote" className="block text-sm font-medium text-gray-700 mb-1">
              申請理由（可選）
            </label>
            <textarea
              id="requestNote"
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="請說明為什麼要申請此客戶..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '提交申請'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
