import { useMemo } from "react"
import { useSelector } from "react-redux"
import { CommonSelectDialog, type ColumnDef } from "@/shared/ui/CommonSelectDialog"
import type { PhongKhamRow } from "@/features/hanhchinh/model/selectors"
import { selectPhongKhamRows } from "@/features/hanhchinh/model/selectors"

export const PHONG_KHAM_DIALOG_ID = "phongkham-select"

export interface PhongKhamDialogResult {
  selectedIds: string[]
  selectedRows: PhongKhamRow[]
  categoryId: string | null
}

interface PhongKhamSelectDialogProps {
  onConfirm: (result: PhongKhamDialogResult) => void
}

function highlight(text: string | undefined, term: string): React.ReactNode {
  if (!text) return "-"
  if (!term.trim()) return text
  const regex = new RegExp(`(${term})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={`${part}-${index}`} className="bg-yellow-200 text-inherit font-normal">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function PhongKhamSelectDialog({ onConfirm }: PhongKhamSelectDialogProps) {
  const rows = useSelector(selectPhongKhamRows)
  const columns = useMemo<ColumnDef<PhongKhamRow>[]>(() => {
    return [
      {
        key: "ma",
        header: "Mã",
        width: "96px",
        render: (row, searchTerm) => (
          <span className="font-mono">{highlight(row.ma || row.id, searchTerm)}</span>
        ),
      },
      {
        key: "ten",
        header: "Tên phòng khám",
        render: (row, searchTerm) => highlight(row.ten, searchTerm),
      },
      {
        key: "phongBanTen",
        header: "Khoa / Phòng",
        width: "200px",
        render: (row, searchTerm, isSelected) => (
          <span className={!isSelected ? "text-gray-600" : undefined}>
            {highlight(row.phongBanTen || "-", searchTerm)}
          </span>
        ),
      },
    ]
  }, [])

  const filterRows = (data: PhongKhamRow[], searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data
    return data.filter((row) => {
      return (
        row.ten.toLowerCase().includes(term) ||
        (row.ma?.toLowerCase().includes(term) ?? false) ||
        (row.phongBanTen?.toLowerCase().includes(term) ?? false)
      )
    })
  }

  const selectedPreview = (selectedRows: PhongKhamRow[]) => {
    if (!selectedRows.length) return null
    return (
      <div className="flex flex-wrap items-start gap-2 border-b border-gray-200 bg-white px-3 py-2 text-xs">
        <span className="font-medium text-gray-700">
          Đã chọn ({selectedRows.length}):
        </span>
        <div className="flex flex-wrap gap-1">
          {selectedRows.map((row) => (
            <span
              key={row.id}
              className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700"
            >
              {row.ten}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <CommonSelectDialog<PhongKhamRow>
      dialogId={PHONG_KHAM_DIALOG_ID}
      rows={rows}
      rowKey={(row) => row.id}
      columns={columns}
      selectable="multiple"
      title="Chọn phòng khám"
      caption="Có thể chọn nhiều phòng khám cùng lúc"
      searchPlaceholder="Tìm theo mã, tên phòng khám hoặc khoa"
      confirmText="Chọn phòng khám"
      cancelText="Đóng"
      selectedPreview={selectedPreview}
      filterRows={filterRows}
      onConfirm={onConfirm}
    />
  )
}
