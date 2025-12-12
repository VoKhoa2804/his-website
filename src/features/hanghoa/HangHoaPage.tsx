import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Spinner } from "@/shared/ui/spinner"
import { toast } from "@/shared/ui/sonner"
import { columns } from "./columns"
import { useHangHoas } from "./useHangHoas"
import { DataTable } from "../work-shift/ui/data-table"

export const HangHoaPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, loading, error, loadHangHoas, deleteHangHoa } = useHangHoas()

  useEffect(() => {
    loadHangHoas(1, 10)
  }, [loadHangHoas])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa hàng hóa này?")) return

    try {
      await deleteHangHoa(id)
      toast.success("Đã xóa hàng hóa")
      loadHangHoas()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Xóa hàng hóa thất bại"
      toast.error(message)
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/hang-hoa/${id}/edit`)
  }

  const handleCreate = () => {
    navigate("/hang-hoa/create")
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Danh sách hàng hóa</h1>
        <Button onClick={handleCreate}>+ Thêm hàng hóa</Button>
      </div>

      {/* Card chứa DataTable */}
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
