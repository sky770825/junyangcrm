'use client'

import { useState } from 'react'

interface FileUploadProps {
  onUploadSuccess: (url: string, key: string) => void
  onUploadError?: (error: string) => void
  folder?: string
  accept?: string
  maxSize?: number // in MB
  label?: string
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  folder = 'uploads',
  accept = 'image/*,video/*',
  maxSize = 100,
  label = '上傳文件'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`文件大小超过 ${maxSize}MB 限制`)
      return
    }

    try {
      setUploading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '上传失败')
      }

      const data = await response.json()
      onUploadSuccess(data.url, data.key)
      setProgress(100)
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : '上传失败')
    } finally {
      setUploading(false)
      // 重置 input
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="w-full">
      <label className="block">
        <span className="sr-only">{label}</span>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">上传中...</p>
        </div>
      )}
    </div>
  )
}
