'use client'

import { formatDate, isOverdue } from '@/app/lib/utils'
import type { TaskWithClient } from '@/app/types/database'
import { cn } from '@/app/lib/utils'

interface TaskCardProps {
  task: TaskWithClient
  onClick: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.status)
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-lg border-2 text-left transition-all",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        overdue
          ? "border-red-500 bg-red-50 border-4"
          : task.status === 'completed'
          ? "border-green-500 bg-green-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-semibold text-lg",
            overdue && "font-bold text-red-600"
          )}>
            {task.clients.name}
          </h3>
          {overdue && (
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
              逾期
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">類型：</span>
            <span>{task.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">到期時間：</span>
            <span className={cn(overdue && "text-red-600 font-semibold")}>
              {formatDate(task.due_date)}
            </span>
          </div>
          {task.clients.phone && (
            <div className="flex items-center gap-2">
              <span className="font-medium">電話：</span>
              <span>{task.clients.phone}</span>
            </div>
          )}
        </div>
        
        {task.status === 'completed' && task.completion_time && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">✓ 已完成</span>
              <span className="text-gray-500">
                {formatDate(task.completion_time)}
              </span>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}
