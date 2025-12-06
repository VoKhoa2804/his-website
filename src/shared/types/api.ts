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
