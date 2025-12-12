import { api } from '@/api'
import { HangHoaFilterRequest, HangHoaListDataResponse, HangHoaPagingResult, HangHoaResponseItem } from '@/entities/hanghoa.model'

const CV_API_BASE = import.meta.env.VITE_CV_API_BASE as string

/**
 * Fetch paginated work shifts with optional search filter
 */
export async function getHangHoas(
  filter: HangHoaFilterRequest
): Promise<HangHoaPagingResult> {
  // Call backend with specific baseURL override
  const response = await api.post<{ data: HangHoaListDataResponse }>('/api/hanghoas/getdanhsach1', {
    data: filter
  },
{
    baseURL: CV_API_BASE
  })

  // Client-side filtering and pagination (matching current behavior)
  let list = response?.data || []
//   const keyword = (filter.search || '').toLowerCase().trim()
  
//   if (keyword) {
//     list = list.filter(
//       (x) =>
//         x.ma.toLowerCase().includes(keyword) ||
//         x.ten.toLowerCase().includes(keyword)
//     )
//   }

  const { pageIndex, pageSize } = filter
  const start = (pageIndex - 1) * pageSize
  const items = list.items.slice(start, start + pageSize)

  return {
    items,
    totalCount: list.total_pages * pageSize,
    pageIndex,
    pageSize,
  }
}
