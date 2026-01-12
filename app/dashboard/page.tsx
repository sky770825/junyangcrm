'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TaskCard from '@/app/components/TaskCard'
import CompleteTaskModal from '@/app/components/CompleteTaskModal'
import type { TaskWithClient } from '@/app/types/database'
import { isOverdue } from '@/app/lib/utils'
import AuthButton from '@/app/components/AuthButton'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<TaskWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<TaskWithClient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      loadTasks()
    }
  }, [session])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      // For now, we'll use a client-side approach
      // In production, this should be a server action or API route
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('載入任務失敗')
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入任務時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = (task: TaskWithClient) => {
    if (task.status === 'completed') return
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCompleteTask = async (resultNote: string, nextFollowupDate: string) => {
    if (!selectedTask) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultNote, nextFollowupDate })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '完成任務失敗')
      }

      // Reload tasks
      await loadTasks()
      setIsModalOpen(false)
      setSelectedTask(null)
    } catch (err) {
      throw err
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  // Separate tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  // Sort pending tasks: overdue first, then by due_date
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const aOverdue = isOverdue(a.due_date, a.status)
    const bOverdue = isOverdue(b.due_date, b.status)
    
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">任務列表</h1>
              <p className="text-gray-600 mt-1">您的待辦事項和已完成任務</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard/clients"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                客戶列表
              </a>
              <AuthButton />
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">載入中...</div>
          </div>
        ) : (
          <>
            {/* Pending Tasks Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  待處理任務 ({pendingTasks.length})
                </h2>
                {pendingTasks.filter(t => isOverdue(t.due_date, t.status)).length > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    逾期任務: {pendingTasks.filter(t => isOverdue(t.due_date, t.status)).length}
                  </span>
                )}
              </div>

              {sortedPendingTasks.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">目前沒有待處理的任務</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedPendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  已完成任務 ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks
                    .sort((a, b) => 
                      new Date(b.completion_time || b.updated_at).getTime() - 
                      new Date(a.completion_time || a.updated_at).getTime()
                    )
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => {}}
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}

        {selectedTask && (
          <CompleteTaskModal
            task={selectedTask}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onComplete={handleCompleteTask}
          />
        )}
      </div>
    </div>
  )
}
