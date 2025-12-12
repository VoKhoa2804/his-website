import { BaseResponse, PagingRequest, PagingResult, SearchCondition } from "@/shared/types/api";

export interface HangHoaFilterRequest extends PagingRequest {
  filter?: string | null;
  searchConditions: SearchCondition[];
}


export interface HangHoaResponseItem {
  id: string;
  ma: string;
  ten: string;
  don_vi: string;
  qui_cach: string;
  don_gia: number;
  don_gia_ban: number;
  phan_loai_id: string;
  ten_phan_loai: string;
  phan_nhom_id: string;
  ten_phan_nhom: string;
  hien_thi: boolean;
  chi_tiets: any[]; // nếu sau này biết rõ cấu trúc thì define interface riêng
}

export interface HangHoaListDataResponse {
  items: HangHoaResponseItem[];
  current_page: number;
  total_pages: number;
  page_size: number;
  total_count: number;
}

export function toHangHoaPagingResult(
  res: BaseResponse<HangHoaListDataResponse>
): HangHoaPagingResult {
  const d = res.data ;
  return {
    items: d.items,
    totalCount: d.total_count,
    pageIndex: d.current_page,
    pageSize: d.page_size,
  };
}

export type HangHoaPagingResult = PagingResult<HangHoaResponseItem>