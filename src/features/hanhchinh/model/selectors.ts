import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"
import type { LookupOption } from "@/shared/ui/lookups"

type PhuongXaItem = {
  PhuongXaId: string
  TinhThanhId: string
  TenPhuongXa?: string
  TenTinhThanh?: string
  MaTinhThanh?: string
  MaPhuongXa?: string
  HienThi?: boolean
}

const selectPhuongXaData = (state: RootState): PhuongXaItem[] =>
  (state.hanhchinh.data?.PhuongXaTinhThanh as PhuongXaItem[] | undefined) ?? []

const normalizeOption = (value: string, label: string | undefined): LookupOption => ({
  value,
  label: label || value,
})
const normalizeSearchText = (value: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

export const selectTinhOptions = createSelector([selectPhuongXaData], (list) => {
  const optionsMap = new Map<string, LookupOption>()

  for (const item of list) {
    if (!item || item.HienThi === false) continue
    if (!optionsMap.has(item.TinhThanhId)) {
      optionsMap.set(
        item.TinhThanhId,
        normalizeOption(item.TinhThanhId, item.TenTinhThanh || item.MaTinhThanh),
      )
    }
  }

  return Array.from(optionsMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "vi"),
  )
})

export const makeSelectHuyenOptions = () =>
  createSelector(
    [selectPhuongXaData, (_: RootState, tinhId?: string) => tinhId],
    () => {
      // Dataset does not provide district-level information
      return []
    },
  )

export const makeSelectXaOptions = () =>
  createSelector(
    [selectPhuongXaData, (_: RootState, params?: { tinhId?: string }) => params?.tinhId],
    (list, tinhId) => {
      if (!tinhId) {
        return []
      }

      const filtered = list.filter((item) => {
        if (!item || item.HienThi === false) return false
        return item.TinhThanhId === tinhId
      })

      return filtered
        .map((item) => normalizeOption(item.PhuongXaId, item.TenPhuongXa || item.MaPhuongXa))
        .sort((a, b) => a.label.localeCompare(b.label, "vi"))
    },
  )

export interface AddressOption {
  value: string
  label: string
  searchText: string
  tinhId?: string
  tinhName?: string
  huyenId?: string
  huyenName?: string
  xaId?: string
  xaName?: string
}

export const selectAddressSearchIndex = createSelector([selectPhuongXaData], (list) =>
  list
    .filter((item) => item && item.HienThi !== false)
    .map<AddressOption>((item) => {
      const xaName = item.TenPhuongXa || item.MaPhuongXa || ""
      const tinhName = item.TenTinhThanh || item.MaTinhThanh || ""
      const label = xaName ? `${xaName}${tinhName ? `, ${tinhName}` : ""}` : tinhName
      return {
        value: item.PhuongXaId,
        label,
        searchText: normalizeSearchText(`${xaName} ${tinhName}`),
        tinhId: item.TinhThanhId,
        tinhName,
        xaId: item.PhuongXaId,
        xaName,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, "vi")),
)

export function searchAddressOptions(
  index: AddressOption[],
  keyword: string,
  limit = 50,
): AddressOption[] {
  const trimmed = keyword?.trim() || ""
  if (!trimmed) {
    return index.slice(0, limit)
  }
  const query = normalizeSearchText(trimmed)

  const startsWith: AddressOption[] = []
  const contains: AddressOption[] = []

  for (const option of index) {
    if (!option.searchText) continue
    if (option.searchText.startsWith(query)) {
      startsWith.push(option)
    } else if (option.searchText.includes(query)) {
      contains.push(option)
    }
    if (startsWith.length + contains.length >= limit) break
  }

  return [...startsWith, ...contains].slice(0, limit)
}
