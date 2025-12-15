import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { cn } from "@/shared/utils/cn"
import { DiagnosisPill } from "./components/DiagnosisPill"

// A2: Search highlighting utility
function highlightMatch(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-inherit font-normal">{part}</mark>
    ) : (
      part
    )
  )
}

// Types
export interface IcdRow {
  id: string
  code: string
  name: string
  note: string
}

export interface IcdCategory {
  id: string
  name: string
}

export interface IcdDialogResult {
  selectedIds: string[]
  selectedRows: IcdRow[]
  categoryId: string | null
}

interface IcdSelectDialogProps {
  open: boolean
  onClose: () => void
  onConfirm?: (result: IcdDialogResult) => void
  title?: string
  initialSelectedIds?: string[]  // Add this prop to pre-populate selections
}

// Demo data - 30 ICD codes
const DEMO_ICD_ROWS: IcdRow[] = [
  { id: "1", code: "A00", name: "Tả", note: "Bệnh nhiễm trùng" },
  { id: "2", code: "A01.0", name: "Thương hàn", note: "Nhiễm trùng đường ruột" },
  { id: "3", code: "A02.0", name: "Nhiễm trùng huyết do Salmonella", note: "Nhiễm trùng máu" },
  { id: "4", code: "A03.0", name: "Lỵ trực trùng", note: "Nhiễm trùng đường ruột" },
  { id: "5", code: "A04.9", name: "Nhiễm trùng đường ruột do vi khuẩn", note: "Tiêu chảy" },
  { id: "6", code: "A09", name: "Tiêu chảy và viêm dạ dày ruột", note: "Nguyên nhân nhiễm trùng" },
  { id: "7", code: "A15.0", name: "Lao phổi", note: "Lao có xác định vi khuẩn" },
  { id: "8", code: "A16.2", name: "Lao phổi không xác định vi khuẩn", note: "Lao phổi" },
  { id: "9", code: "B01.9", name: "Thủy đậu không biến chứng", note: "Nhiễm virus" },
  { id: "10", code: "B02.9", name: "Zona không biến chứng", note: "Nhiễm virus" },
  { id: "11", code: "B15.9", name: "Viêm gan A không có tình trạng hôn mê gan", note: "Viêm gan virus" },
  { id: "12", code: "B16.9", name: "Viêm gan B cấp tính", note: "Viêm gan virus" },
  { id: "13", code: "B18.1", name: "Viêm gan B mạn tính", note: "Viêm gan virus" },
  { id: "14", code: "C50.9", name: "Ung thư vú", note: "Khối u ác tính" },
  { id: "15", code: "C61", name: "Ung thư tuyến tiền liệt", note: "Khối u ác tính" },
  { id: "16", code: "C64", name: "Ung thư thận", note: "Khối u ác tính" },
  { id: "17", code: "I10", name: "Tăng huyết áp", note: "Bệnh tim mạch" },
  { id: "18", code: "I21.9", name: "Nhồi máu cơ tim cấp", note: "Bệnh tim mạch" },
  { id: "19", code: "I50.9", name: "Suy tim", note: "Bệnh tim mạch" },
  { id: "20", code: "J18.9", name: "Viêm phổi", note: "Bệnh hô hấp" },
  { id: "21", code: "J45.9", name: "Hen phế quản", note: "Bệnh hô hấp" },
  { id: "22", code: "K29.7", name: "Viêm dạ dày", note: "Bệnh tiêu hóa" },
  { id: "23", code: "K80.2", name: "Sỏi túi mật", note: "Bệnh tiêu hóa" },
  { id: "24", code: "L20.9", name: "Viêm da dị ứng", note: "Bệnh da liễu" },
  { id: "25", code: "M15.9", name: "Viêm khớp đa khớp", note: "Bệnh cơ xương" },
  { id: "26", code: "N18.9", name: "Suy thận mạn", note: "Bệnh thận tiết niệu" },
  { id: "27", code: "G40.9", name: "Động kinh", note: "Bệnh thần kinh" },
  { id: "28", code: "E11.9", name: "Đái tháo đường type 2", note: "Bệnh chuyển hóa" },
  { id: "29", code: "E78.5", name: "Rối loạn lipid máu", note: "Bệnh chuyển hóa" },
  { id: "30", code: "R50.9", name: "Sốt không rõ nguyên nhân", note: "Triệu chứng" },
]

const DEMO_CATEGORIES: IcdCategory[] = [
  { id: "cat1", name: "Bệnh nhiễm trùng" },
  { id: "cat2", name: "Bệnh ung thư" },
  { id: "cat3", name: "Bệnh tim mạch" },
  { id: "cat4", name: "Bệnh hô hấp" },
  { id: "cat5", name: "Bệnh tiêu hóa" },
  { id: "cat6", name: "Bệnh da liễu" },
  { id: "cat7", name: "Bệnh cơ xương" },
  { id: "cat8", name: "Bệnh thần kinh" },
]

export function IcdSelectDialog({
  open,
  onClose,
  onConfirm,
  title = "Bệnh tả",
  initialSelectedIds = [],
}: IcdSelectDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const tableBodyRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map())

  // Filter ICD rows by search term
  const filteredRows = DEMO_ICD_ROWS.filter(
    (row) =>
      row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Reset state when dialog opens, but preserve initial selections
  useEffect(() => {
    if (open) {
      setSearchTerm("")
      setSelectedIds(new Set(initialSelectedIds))
      setFocusedIndex(0)
      setActiveCategoryId(null)
    }
  }, [open, initialSelectedIds])

  // Scroll focused row into view
  useEffect(() => {
    const focusedRow = rowRefs.current.get(focusedIndex)
    if (focusedRow && tableBodyRef.current) {
      const rowTop = focusedRow.offsetTop
      const rowBottom = rowTop + focusedRow.offsetHeight
      const scrollTop = tableBodyRef.current.scrollTop
      const scrollBottom = scrollTop + tableBodyRef.current.clientHeight

      if (rowTop < scrollTop) {
        tableBodyRef.current.scrollTop = rowTop
      } else if (rowBottom > scrollBottom) {
        tableBodyRef.current.scrollTop = rowBottom - tableBodyRef.current.clientHeight
      }
    }
  }, [focusedIndex])

  const toggleSelection = useCallback((id: string) => {
    if (!id) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      const selectedRows = DEMO_ICD_ROWS.filter(row => selectedIds.has(row.id))
      onConfirm({
        selectedIds: Array.from(selectedIds),
        selectedRows,
        categoryId: activeCategoryId,
      })
    }
    onClose()
  }, [selectedIds, activeCategoryId, onConfirm, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        handleConfirm()
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(0, prev - 1))
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(filteredRows.length - 1, prev + 1))
        return
      }

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault()
        toggleSelection(filteredRows[focusedIndex]?.id)
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, focusedIndex, filteredRows, handleConfirm, onClose, toggleSelection])

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="p-0 gap-0 border-gray-400"
        style={{
          width: "80vw",
          height: "70vh",
          maxWidth: "80vw",
          maxHeight: "70vh",
          borderRadius: 0,
          boxShadow: "none",
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header - Blue bar */}
        <div className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between border-b border-gray-400">
          <DialogTitle className="text-sm font-semibold">
            Tên ICD / Ghi chú / Tên phòng
          </DialogTitle>
        </div>

        {/* Caption row */}
        <div className="bg-gray-100 px-3 py-1 border-b border-gray-300">
          <span className="text-xs font-medium text-gray-700">{title}</span>
        </div>

        {/* Search row */}
        <div className="px-3 py-2 border-b border-gray-300 bg-white">
          <div className="flex items-center gap-2">
            <input
              placeholder="Tìm kiếm theo mã ICD hoặc tên bệnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="medical-input h-8 text-xs flex-1"
              autoFocus
            />
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              ↑↓: Di chuyển | Space: Chọn | Enter: Xác nhận
            </span>
          </div>
        </div>

        {/* Selected items display */}
        {selectedIds.size > 0 && (
          <div className="px-3 py-2 border-b border-gray-300 bg-blue-50">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-700 font-medium pt-1 shrink-0">Đã chọn ({selectedIds.size}):</span>
              <div className="flex flex-wrap flex-1">
                {DEMO_ICD_ROWS.filter(row => selectedIds.has(row.id)).map((row) => (
                  <DiagnosisPill
                    key={row.id}
                    code={row.code}
                    name={row.name}
                    onRemove={() => toggleSelection(row.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Body - Table + Category list */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: ICD Table (~80%) */}
          <div className="flex-1 flex flex-col border-r border-gray-300 overflow-hidden">
            <div ref={tableBodyRef} className="flex-1 overflow-y-auto overflow-x-hidden">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "40px" }} />
                  <col style={{ width: "112px" }} />
                  <col />
                  <col style={{ width: "192px" }} />
                </colgroup>

                <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-300">
                  <tr className="text-xs">
                    <th className="px-2 py-1 text-left font-medium border-r border-gray-300"></th>
                    <th className="px-2 py-1 text-left font-medium border-r border-gray-300">
                      Mã ICD
                    </th>
                    <th className="px-2 py-1 text-left font-medium border-r border-gray-300">
                      Tên ICD
                    </th>
                    <th className="px-2 py-1 text-left font-medium border-r border-gray-300">Ghi chú</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-8 text-center text-xs text-gray-500">
                        Không tìm thấy mã ICD phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, index) => {
                      const isSelected = selectedIds.has(row.id)
                      const isFocused = index === focusedIndex

                      return (
                        <tr
                          key={row.id}
                          ref={(el) => {
                            if (el) rowRefs.current.set(index, el)
                            else rowRefs.current.delete(index)
                          }}
                          className={cn(
                            "text-xs border-b border-gray-200 cursor-pointer transition-colors",
                            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                            !isSelected && "hover:bg-gray-50",
                            isFocused && !isSelected && "ring-2 ring-inset ring-blue-400"
                          )}
                          onClick={() => toggleSelection(row.id)}
                        >
                          <td className="px-2 py-1 border-r border-gray-300">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(row.id)}
                              className={cn(
                                "h-4 w-4",
                                isSelected &&
                                  "border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600"
                              )}
                            />
                          </td>
                          <td className="px-2 py-1 font-mono border-r border-gray-300">
                            {highlightMatch(row.code, searchTerm)}
                          </td>
                          <td className="px-2 py-1 border-r border-gray-300">{highlightMatch(row.name, searchTerm)}</td>
                          <td className="px-2 py-1 border-r border-gray-300">
                            <span className={cn(!isSelected && "text-gray-600")}>{row.note}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Category list (~20%) - NO SCROLL, FIXED HEIGHT */}
          <div className="w-52 flex flex-col bg-gray-50 overflow-hidden flex-shrink-0">
            <div className="bg-gray-100 px-2 py-1 border-b border-gray-300 flex-shrink-0">
              <span className="text-xs font-medium text-gray-700">Danh mục</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="p-1">
                {DEMO_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setActiveCategoryId(activeCategoryId === cat.id ? null : cat.id)
                    }
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-xs rounded transition-colors mb-0.5",
                      activeCategoryId === cat.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-300 bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 text-xs rounded-none border-gray-400"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-8 text-xs rounded-none bg-blue-600 hover:bg-blue-700"
            disabled={selectedIds.size === 0}
          >
            Thêm ({selectedIds.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
