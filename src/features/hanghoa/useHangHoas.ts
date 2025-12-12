import { HangHoaResponseItem } from "@/entities/hanghoa.model"
import { getHangHoas }  from "@/services/hanghoa.service"
import { PagingResult } from "@/shared/types/api"
import { toast } from "@/shared/ui/sonner"
import { useCallback, useState } from "react"

export function useHangHoas() {
  const [items, setItems] = useState<HangHoaResponseItem[]>([])
  const [paging, setPaging] = useState<PagingResult<HangHoaResponseItem> | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHangHoas = useCallback(
    async (pageIndex = 1, pageSize = 10) => {
      try {
        setLoading(true)
        setError(null)

        const res = await getHangHoas({
          pageIndex,
          pageSize,
          filter: "",
          searchConditions: [],
        })

        // getHangHoaList trả về PagingResult<HangHoaResponseItem>
        setItems(res.items)
        setPaging(res)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi tải danh sách hàng hóa"
        setError(message)
      } finally {
        setLoading(false)
         toast.success("Thành công!", { description: "Dữ liệu đã lưu." })
      }
    },
    [],
  )

  const deleteHangHoa = useCallback(async (id: string) => {
    // TODO: call API xóa nếu có
    // await deleteHangHoaApi(id)
    // sau đó có thể gọi lại loadHangHoas()
  }, [])

  return {
    items,
    paging,
    loading,
    error,
    loadHangHoas,
    deleteHangHoa,
  }
}
