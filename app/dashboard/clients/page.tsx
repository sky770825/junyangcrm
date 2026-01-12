'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ClientRequestModal from '@/app/components/ClientRequestModal'
import type { Client } from '@/app/types/database'

export default function ClientsPage() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'available' | 'my'>('available')

  useEffect(() => {
    if (session) {
      loadClients()
    }
  }, [filter, session])

  const loadClients = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      setError('')
      
      let url = '/api/clients?status=active'
      if (filter === 'available') {
        // Available clients (no owner)
      } else if (filter === 'my') {
        url += `&ownerId=${session.user.id}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('載入客戶失敗')
      const data = await response.json()
      
      // Filter available clients
      if (filter === 'available') {
        setClients(data.filter((c: Client) => !c.current_owner_id))
      } else {
        setClients(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入客戶時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (clientId: string, requestNote: string) => {
    if (!session?.user?.id) {
      setError('請先登入')
      return
    }

    const response = await fetch('/api/client-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        agent_id: session.user.id,
        request_note: requestNote || null
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '申請失敗')
    }

    alert('申請已提交，請等待管理員審核')
    await loadClients()
  }

  const handleClientClick = (client: Client) => {
    if (client.current_owner_id) return
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">客戶列表</h1>
          <p className="text-gray-600 mt-1">申請客戶或查看已分配的客戶</p>
        </header>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-3 border-b border-gray-200">
          {[
            { id: 'available', label: '可申請' },
            { id: 'my', label: '我的客戶' },
            { id: 'all', label: '全部' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                filter === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">載入中...</div>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">目前沒有客戶</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleClientClick(client)}
                className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                  client.current_owner_id
                    ? 'border-gray-300 opacity-60'
                    : 'border-blue-300 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    {client.phone && (
                      <div className="text-sm text-gray-600 mt-1">電話: {client.phone}</div>
                    )}
                    {client.tags.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {client.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {client.current_owner_id ? (
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                      已分配
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                      可申請
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedClient && (
          <ClientRequestModal
            client={selectedClient}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedClient(null)
            }}
            onRequest={handleRequest}
          />
        )}
      </div>
    </div>
  )
}
