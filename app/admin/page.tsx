'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/app/components/AdminHeader'
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal'
import EditClientModal from '@/app/components/EditClientModal'
import type { Client, User, UserApplication, ClientRequestWithDetails } from '@/app/types/database'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'clients' | 'users' | 'applications' | 'requests'>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [requests, setRequests] = useState<ClientRequestWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      if (activeTab === 'clients') {
        const res = await fetch('/api/clients')
        if (!res.ok) throw new Error('載入客戶失敗')
        const data = await res.json()
        setClients(data)
      } else if (activeTab === 'users') {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('載入用戶失敗')
        const data = await res.json()
        setUsers(data)
      } else if (activeTab === 'applications') {
        const res = await fetch('/api/users/applications')
        if (!res.ok) throw new Error('載入申請失敗')
        const data = await res.json()
        setApplications(data)
      } else if (activeTab === 'requests') {
        const res = await fetch('/api/client-requests')
        if (!res.ok) throw new Error('載入客戶申請失敗')
        const data = await res.json()
        setRequests(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入數據失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewApplication = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/users/applications/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('審核失敗')
      await loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : '審核失敗')
    }
  }

  const handleReviewRequest = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/client-requests/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('審核失敗')
      await loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : '審核失敗')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'clients', label: '客戶管理' },
              { id: 'users', label: '用戶管理' },
              { id: 'applications', label: '註冊申請' },
              { id: 'requests', label: '客戶申請' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">載入中...</div>
          </div>
        ) : (
          <>
            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <ClientsTab clients={clients} onRefresh={loadData} />
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <UsersTab users={users} />
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <ApplicationsTab
                applications={applications}
                onReview={handleReviewApplication}
              />
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <RequestsTab
                requests={requests}
                onReview={handleReviewRequest}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ClientsTab({ clients, onRefresh }: { clients: Client[], onRefresh: () => void }) {
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/clients/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '上傳失敗')
      }

      alert('上傳成功！')
      setShowUpload(false)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '上傳失敗')
    } finally {
      setUploading(false)
      // Reset input
      if (e.target) e.target.value = ''
    }
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const handleDelete = (client: Client) => {
    setSelectedClient(client)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '刪除失敗')
      }

      setIsDeleteModalOpen(false)
      setSelectedClient(null)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '刪除失敗')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveClient = async (client: Client) => {
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '保存失敗')
      }

      setIsEditModalOpen(false)
      setSelectedClient(null)
      onRefresh()
    } catch (err) {
      throw err
    }
  }

  const handleToggleSelect = (clientId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(clientId)) {
        next.delete(clientId)
      } else {
        next.add(clientId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === clients.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(clients.map(c => c.id)))
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return

    if (!confirm(`確定要刪除 ${selectedIds.size} 個客戶嗎？此操作無法復原。`)) {
      return
    }

    try {
      setIsDeleting(true)
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/clients/${id}`, { method: 'DELETE' })
      )

      const results = await Promise.allSettled(deletePromises)
      const failed = results.filter(r => r.status === 'rejected' || 
        (r.status === 'fulfilled' && !r.value.ok))

      if (failed.length > 0) {
        alert(`刪除完成，但有 ${failed.length} 個客戶刪除失敗（可能有關聯的任務）`)
      } else {
        alert(`成功刪除 ${selectedIds.size} 個客戶`)
      }

      setSelectedIds(new Set())
      onRefresh()
    } catch (err) {
      alert('批量刪除失敗')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">客戶列表 ({clients.length})</h2>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBatchDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? '刪除中...' : `批量刪除 (${selectedIds.size})`}
            </button>
          )}
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
            {uploading ? '上傳中...' : '上傳 Excel'}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === clients.length && clients.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標籤</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所有者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className={selectedIds.has(client.id) ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(client.id)}
                      onChange={() => handleToggleSelect(client.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {client.photos && client.photos.length > 0 ? (
                        <img
                          src={client.photos[0]}
                          alt={client.name}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          無照片
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-1 flex-wrap">
                      {client.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {tag}
                        </span>
                      ))}
                      {client.tags.length === 0 && '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? '活躍' : '已歸檔'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.current_owner_id ? '已分配' : '未分配'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="text-red-600 hover:text-red-900"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function UsersTab({ users }: { users: User[] }) {
  const agents = users.filter(u => u.role === 'agent')
  const managers = users.filter(u => u.role === 'manager')

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">用戶列表</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">業務員 ({agents.length})</h3>
          <div className="space-y-2">
            {agents.map((user) => (
              <div key={user.id} className="p-3 border border-gray-200 rounded">
                <div className="font-medium">{user.name || user.email}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">管理員 ({managers.length})</h3>
          <div className="space-y-2">
            {managers.map((user) => (
              <div key={user.id} className="p-3 border border-gray-200 rounded">
                <div className="font-medium">{user.name || user.email}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ApplicationsTab({ applications, onReview }: { 
  applications: UserApplication[], 
  onReview: (id: string, status: 'approved' | 'rejected') => void 
}) {
  const pending = applications.filter(a => a.status === 'pending')

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        註冊申請 ({applications.length}, 待審核: {pending.length})
      </h2>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-lg">{app.name || app.email}</div>
                <div className="text-sm text-gray-500 mt-1">Email: {app.email}</div>
                {app.phone && <div className="text-sm text-gray-500">電話: {app.phone}</div>}
                {app.application_note && (
                  <div className="mt-2 text-sm text-gray-700">{app.application_note}</div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  申請時間: {new Date(app.created_at).toLocaleString('zh-TW')}
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status === 'pending' ? '待審核' :
                   app.status === 'approved' ? '已批准' : '已拒絕'}
                </span>
              </div>
            </div>
            {app.status === 'pending' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => onReview(app.id, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  批准
                </button>
                <button
                  onClick={() => onReview(app.id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  拒絕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RequestsTab({ requests, onReview }: { 
  requests: ClientRequestWithDetails[], 
  onReview: (id: string, status: 'approved' | 'rejected') => void 
}) {
  const pending = requests.filter(r => r.status === 'pending')

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        客戶申請 ({requests.length}, 待審核: {pending.length})
      </h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-lg">{req.clients.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  申請人: {req.users.name || req.users.email}
                </div>
                {req.request_note && (
                  <div className="mt-2 text-sm text-gray-700">{req.request_note}</div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  申請時間: {new Date(req.created_at).toLocaleString('zh-TW')}
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  req.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {req.status === 'pending' ? '待審核' :
                   req.status === 'approved' ? '已批准' : '已拒絕'}
                </span>
              </div>
            </div>
            {req.status === 'pending' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => onReview(req.id, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  批准
                </button>
                <button
                  onClick={() => onReview(req.id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  拒絕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
