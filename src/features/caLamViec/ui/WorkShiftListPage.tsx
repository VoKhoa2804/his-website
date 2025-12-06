import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { toast } from '@/shared/ui/sonner'
import { useWorkShifts } from '../hooks/useWorkShifts'
import { DataTable } from './data-table'
import { columns } from './columns'

export const WorkShiftListPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    loading,
    error,
    loadWorkShifts,
    deleteShift,
  } = useWorkShifts()

  // Load data on mount
  useEffect(() => {
    loadWorkShifts()
  }, [loadWorkShifts])

  // Handle delete with confirmation
  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa ca làm việc này?')) return

    try {
      await deleteShift(id)
      toast.success('Đã xóa ca làm việc')
      loadWorkShifts() // Refresh list
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Xóa thất bại'
      toast.error(message)
    }
  }

  // Handle edit navigation
  const handleEdit = (id: string) => {
    navigate(`/ca-lam-viec/${id}/edit`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Danh sách ca làm việc</h1>
        <Button onClick={() => navigate('/ca-lam-viec/create')}>
          + Thêm ca làm việc
        </Button>
      </div>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kết quả</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <DataTable
              columns={columns}
              data={items}
              meta={{
                onEdit: handleEdit,
                onDelete: handleDelete,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
