import React from 'react'

interface WorkShiftStatusBadgeProps {
  active: boolean
}

export const WorkShiftStatusBadge: React.FC<WorkShiftStatusBadgeProps> = ({ active }) => {
  if (active) {
    return (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
        Hiển thị
      </span>
    )
  }

  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
      Ẩn
    </span>
  )
}
