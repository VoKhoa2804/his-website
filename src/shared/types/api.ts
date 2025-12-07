export interface PagingRequest {
  pageIndex: number;
  pageSize: number;
}

export interface PagingResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface SearchCondition {
  field_id: string;
  field_name: string;
  operator: string;
  value: string | number | null;
  value_to?: string | number | null;
  logical_operator?: string; // 'AND' | 'OR' | ...
}

// shared/types/base-response.ts
export interface BaseResponse<T> {
  code: number;
  is_succeeded: boolean;
  message: string | null;
  data: T;
}