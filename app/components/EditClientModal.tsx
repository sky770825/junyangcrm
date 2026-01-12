'use client'

import { useState, useEffect } from 'react'
import ClientPhotos from './ClientPhotos'
import type { Client, ClientTag } from '@/app/types/database'

interface EditClientModalProps {
  client: Client | null
  isOpen: boolean
  onClose: () => void
  onSave: (client: Client) => Promise<void>
}

const CLIENT_TAGS: ClientTag[] = ['A-Hot', 'B-Warm', 'C-Cold', 'D-Invalid']

export default function EditClientModal({
  client,
  isOpen,
  onClose,
  onSave
}: EditClientModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [tags, setTags] = useState<ClientTag[]>([])
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'active' | 'archived'>('active')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [currentClient, setCurrentClient] = useState<Client | null>(null)

  useEffect(() => {
    if (client) {
      setCurrentClient(client)
      setName(client.name)
      setPhone(client.phone || '')
      setTags(client.tags || [])
      setNotes(client.notes || '')
      setStatus(client.status)
    }
  }, [client])

  const handleClientUpdate = async () => {
    if (!client) return
    try {
      const res = await fetch(`/api/clients/${client.id}`)
      if (res.ok) {
        const updated = await res.json()
        setCurrentClient(updated)
      }
    } catch (err) {
      console.error('Failed to reload client:', err)
    }
  }

  if (!isOpen || !client) return null

  const handleTagToggle = (tag: ClientTag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('客戶名稱不能為空')
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        ...client,
        name: name.trim(),
        phone: phone.trim() || null,
        tags,
        notes: notes.trim() || null,
        status
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失敗')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">編輯客戶</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              客戶名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              標籤
            </label>
            <div className="flex flex-wrap gap-2">
              {CLIENT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={isSaving}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              狀態
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'archived')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
            >
              <option value="active">活躍</option>
              <option value="archived">已歸檔</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              備註
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            {currentClient && (
              <ClientPhotos client={currentClient} onUpdate={handleClientUpdate} />
            )}
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
              disabled={isSaving}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}