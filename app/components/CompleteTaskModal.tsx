'use client'

import { useState } from 'react'
import type { TaskWithClient } from '@/app/types/database'

interface CompleteTaskModalProps {
  task: TaskWithClient
  isOpen: boolean
  onClose: () => void
  onComplete: (resultNote: string, nextFollowupDate: string) => Promise<void>
}

export default function CompleteTaskModal({
  task,
  isOpen,
  onClose,
  onComplete
}: CompleteTaskModalProps) {
  const [resultNote, setResultNote] = useState('')
  const [nextFollowupDate, setNextFollowupDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (resultNote.trim().length < 10) {
      setError('結果備註至少需要10個字符')
      return
    }

    if (!nextFollowupDate) {
      setError('請選擇下次跟進日期')
      return
    }

    // Check if next followup date is in the future
    if (new Date(nextFollowupDate) <= new Date()) {
      setError('下次跟進日期必須是未來時間')
      return
    }

    setIsSubmitting(true)
    try {
      await onComplete(resultNote.trim(), nextFollowupDate)
      // Reset form
      setResultNote('')
      setNextFollowupDate('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]
  const minDateTime = new Date().toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">完成任務</h2>
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
              {task.clients.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任務類型
            </label>
            <div className="p-3 bg-gray-50 rounded border">
              {task.type}
            </div>
          </div>

          <div>
            <label htmlFor="resultNote" className="block text-sm font-medium text-gray-700 mb-1">
              結果備註 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resultNote"
              value={resultNote}
              onChange={(e) => setResultNote(e.target.value)}
              placeholder="請詳細描述任務完成情況（至少10個字符）"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={10}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              已輸入 {resultNote.length} 個字符（至少需要10個字符）
            </p>
          </div>

          <div>
            <label htmlFor="nextFollowupDate" className="block text-sm font-medium text-gray-700 mb-1">
              下次跟進日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="nextFollowupDate"
              value={nextFollowupDate}
              onChange={(e) => setNextFollowupDate(e.target.value)}
              min={minDateTime}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
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
              disabled={isSubmitting || resultNote.trim().length < 10 || !nextFollowupDate}
            >
              {isSubmitting ? '提交中...' : '提交完成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
