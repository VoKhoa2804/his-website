import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

export type HanhChinhKey =
  | "GioiTinh"
  | "NgheNghiep"
  | "QuocTich"
  | "DanToc"
  | "PhongBan"
  | "DoiTuong"
  | "UuTien"
  | "BsGioiThieu"
  | "LoaiKCB"
  | "DoiTuongKCB"
  | "CoSoKCB"

export interface HanhChinhOption {
  id: string
  ma?: string
  ten?: string
}

interface LoadParams {
  url?: string
  force?: boolean
}

type HanhChinhStatus = "idle" | "loading" | "succeeded" | "failed"

interface HanhChinhState {
  status: HanhChinhStatus
  error?: string
  loadedAt?: number
  data?: Record<string, any>
  optionsByKey: Partial<Record<HanhChinhKey | string, HanhChinhOption[]>>
}

const initialState: HanhChinhState = {
  status: "idle",
  optionsByKey: {},
}

const OPTION_KEYS: HanhChinhKey[] = [
  "GioiTinh",
  "NgheNghiep",
  "QuocTich",
  "DanToc",
  "PhongBan",
  "DoiTuong",
  "UuTien",
  "BsGioiThieu",
  "LoaiKCB",
  "DoiTuongKCB",
  "CoSoKCB",
]

function normalizeOptions(rawList: any[] = []): HanhChinhOption[] {
  return rawList
    .filter((item) => item && item.HienThi !== false)
    .map((item) => ({
      id: String(item.Id ?? item.id ?? item.Ma ?? item.ma ?? item.ten ?? item.Ten ?? ""),
      ma: String(item.Ma ?? item.ma ?? ""),
      ten: String(item.Ten ?? item.ten ?? ""),
    }))
    .filter((item) => item.id || item.ma || item.ten)
    .sort((a, b) => (a.ten || "").localeCompare(b.ten || "", "vi"))
}

export const loadHanhChinh = createAsyncThunk(
  "hanhchinh/load",
  async ({ url }: LoadParams = {}) => {
    const resolvedUrl = url || import.meta.env.VITE_HANHCHINH_URL
    if (!resolvedUrl) {
      throw new Error("Missing VITE_HANHCHINH_URL")
    }
    const response = await fetch(resolvedUrl, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = await response.json()
    const options: Partial<Record<HanhChinhKey, HanhChinhOption[]>> = {}

    for (const key of OPTION_KEYS) {
      options[key] = normalizeOptions(json[key])
    }

    return {
      raw: json,
      options,
    }
  },
  {
    condition: ({ force }: LoadParams = {}, { getState }) => {
      const state = getState() as RootState
      const slice = state.hanhchinh
      if (!slice) return true
      if (force) return true
      if (slice.status === "loading") return false
      if (slice.status === "succeeded" && slice.loadedAt) {
        return false
      }
      return true
    },
  },
)

const hanhchinhSlice = createSlice({
  name: "hanhchinh",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHanhChinh.pending, (state) => {
        if (state.status === "succeeded" && state.loadedAt) {
          return
        }
        state.status = "loading"
        state.error = undefined
      })
      .addCase(loadHanhChinh.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.optionsByKey = action.payload.options
        state.data = action.payload.raw
        state.loadedAt = Date.now()
        state.error = undefined
      })
      .addCase(loadHanhChinh.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
})

export const selectOptionsByKey = (key: HanhChinhKey | string) => (state: RootState) =>
  state.hanhchinh.optionsByKey[key] ?? []

export const selectHanhChinhStatus = (state: RootState) => state.hanhchinh.status

export default hanhchinhSlice.reducer
