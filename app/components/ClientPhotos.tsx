'use client'

import { useState } from 'react'
import FileUpload from './FileUpload'
import type { Client } from '@/app/types/database'

interface ClientPhotosProps {
  client: Client
  onUpdate: () => void
}

export default function ClientPhotos({ client, onUpdate }: ClientPhotosProps) {
  const [uploading, setUploading] = useState(false)

  const handleUploadSuccess = async (url: string, key: string) => {
    try {
      setUploading(true)
      const res = await fetch(`/api/clients/${client.id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'photo' })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '添加照片失敗')
      }

      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : '添加照片失敗')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!confirm('確定要刪除此照片嗎？')) return

    try {
      const res = await fetch(`/api/clients/${client.id}/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: photoUrl, type: 'photo' })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '刪除照片失敗')
      }

      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : '刪除照片失敗')
    }
  }

  const photos = client.photos || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">客戶照片 ({photos.length})</h3>
        {!uploading && (
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => alert(error)}
            folder={`clients/${client.id}`}
            accept="image/*"
            maxSize={10}
            label="上傳照片"
          />
        )}
      </div>

      {photos.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm">尚未上傳照片</p>
          <p className="text-gray-400 text-xs mt-1">點擊上方按鈕上傳照片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photoUrl, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img
                src={photoUrl}
                alt={`${client.name} 照片 ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E圖片載入失敗%3C/text%3E%3C/svg%3E'
                }}
              />
              <button
                onClick={() => handleDeletePhoto(photoUrl)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                title="刪除照片"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
