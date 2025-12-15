import { useDispatch } from 'react-redux'
import { CommonSelectDialog, ColumnDef } from '@/shared/ui/CommonSelectDialog'
import { cn } from '@/shared/utils/cn'
import { DiagnosisPill } from './components/DiagnosisPill'
import { openDialog, closeDialog, setCategory } from '@/shared/store/selectDialog'
import { useSelector } from 'react-redux'
import { selectDialogState } from '@/shared/store/selectDialog'

// Dialog ID for this feature
const DIALOG_ID = 'icd-select'

// A2: Search highlighting utility
function highlightMatch(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-inherit font-normal">
        {part}
      </mark>
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
  { id: '1', code: 'A00', name: 'Tả', note: 'Bệnh nhiễm trùng' },
  { id: '2', code: 'A01.0', name: 'Thương hàn', note: 'Nhiễm trùng đường ruột' },
  { id: '3', code: 'A02.0', name: 'Nhiễm trùng huyết do Salmonella', note: 'Nhiễm trùng máu' },
  { id: '4', code: 'A03.0', name: 'Lỵ trực trùng', note: 'Nhiễm trùng đường ruột' },
  { id: '5', code: 'A04.9', name: 'Nhiễm trùng đường ruột do vi khuẩn', note: 'Tiêu chảy' },
  { id: '6', code: 'A09', name: 'Tiêu chảy và viêm dạ dày ruột', note: 'Nguyên nhân nhiễm trùng' },
  { id: '7', code: 'A15.0', name: 'Lao phổi', note: 'Lao có xác định vi khuẩn' },
  { id: '8', code: 'A16.2', name: 'Lao phổi không xác định vi khuẩn', note: 'Lao phổi' },
  { id: '9', code: 'B01.9', name: 'Thủy đậu không biến chứng', note: 'Nhiễm virus' },
  { id: '10', code: 'B02.9', name: 'Zona không biến chứng', note: 'Nhiễm virus' },
  { id: '11', code: 'B15.9', name: 'Viêm gan A không có tình trạng hôn mê gan', note: 'Viêm gan virus' },
  { id: '12', code: 'B16.9', name: 'Viêm gan B cấp tính', note: 'Viêm gan virus' },
  { id: '13', code: 'B18.1', name: 'Viêm gan B mạn tính', note: 'Viêm gan virus' },
  { id: '14', code: 'C50.9', name: 'Ung thư vú', note: 'Khối u ác tính' },
  { id: '15', code: 'C61', name: 'Ung thư tuyến tiền liệt', note: 'Khối u ác tính' },
  { id: '16', code: 'C64', name: 'Ung thư thận', note: 'Khối u ác tính' },
  { id: '17', code: 'I10', name: 'Tăng huyết áp', note: 'Bệnh tim mạch' },
  { id: '18', code: 'I21.9', name: 'Nhồi máu cơ tim cấp', note: 'Bệnh tim mạch' },
  { id: '19', code: 'I50.9', name: 'Suy tim', note: 'Bệnh tim mạch' },
  { id: '20', code: 'J18.9', name: 'Viêm phổi', note: 'Bệnh hô hấp' },
  { id: '21', code: 'J45.9', name: 'Hen phế quản', note: 'Bệnh hô hấp' },
  { id: '22', code: 'K29.7', name: 'Viêm dạ dày', note: 'Bệnh tiêu hóa' },
  { id: '23', code: 'K80.2', name: 'Sỏi túi mật', note: 'Bệnh tiêu hóa' },
  { id: '24', code: 'L20.9', name: 'Viêm da dị ứng', note: 'Bệnh da liễu' },
  { id: '25', code: 'M15.9', name: 'Viêm khớp đa khớp', note: 'Bệnh cơ xương' },
  { id: '26', code: 'N18.9', name: 'Suy thận mạn', note: 'Bệnh thận tiết niệu' },
  { id: '27', code: 'G40.9', name: 'Động kinh', note: 'Bệnh thần kinh' },
  { id: '28', code: 'E11.9', name: 'Đái tháo đường type 2', note: 'Bệnh chuyển hóa' },
  { id: '29', code: 'E78.5', name: 'Rối loạn lipid máu', note: 'Bệnh chuyển hóa' },
  { id: '30', code: 'R50.9', name: 'Sốt không rõ nguyên nhân', note: 'Triệu chứng' },
]

const DEMO_CATEGORIES: IcdCategory[] = [
  { id: 'cat1', name: 'Bệnh nhiễm trùng' },
  { id: 'cat2', name: 'Bệnh ung thư' },
  { id: 'cat3', name: 'Bệnh tim mạch' },
  { id: 'cat4', name: 'Bệnh hô hấp' },
  { id: 'cat5', name: 'Bệnh tiêu hóa' },
  { id: 'cat6', name: 'Bệnh da liễu' },
  { id: 'cat7', name: 'Bệnh cơ xương' },
  { id: 'cat8', name: 'Bệnh thần kinh' },
]

/**
 * IcdSelectDialog - Feature wrapper around CommonSelectDialog
 * Responsibilities:
 * - Define dialogId
 * - Provide ICD-specific data (rows, columns)
 * - Handle ICD-specific filtering
 * - Dispatch Redux actions
 * - Map confirmation result to ICD-specific format
 *
 * All state management is handled by Redux.
 * This component is < 50 lines of actual logic.
 */
export function IcdSelectDialog({
  open,
  onClose,
  onConfirm,
  title = 'Bệnh tả',
  initialSelectedIds = [],
}: IcdSelectDialogProps) {
  const dispatch = useDispatch()
  const dialogState = useSelector(selectDialogState(DIALOG_ID))

  // Open/close dialog via Redux with initial selections
  if (open && !dialogState.open) {
    dispatch(openDialog({ dialogId: DIALOG_ID, initialSelectedIds }))
  } else if (!open && dialogState.open) {
    dispatch(closeDialog(DIALOG_ID))
  }

  // Column definitions for ICD table
  const columns: ColumnDef<IcdRow>[] = [
    {
      key: 'code',
      header: 'Mã ICD',
      width: '112px',
      render: (row, searchTerm) => (
        <span className="font-mono">{highlightMatch(row.code, searchTerm)}</span>
      ),
    },
    {
      key: 'name',
      header: 'Tên ICD',
      render: (row, searchTerm) => highlightMatch(row.name, searchTerm),
    },
    {
      key: 'note',
      header: 'Ghi chú',
      width: '192px',
      render: (row, _, isSelected) => (
        <span className={cn(!isSelected && 'text-gray-600')}>{row.note}</span>
      ),
    },
  ]

  // Filter function for search
  const filterRows = (rows: IcdRow[], searchTerm: string): IcdRow[] => {
    if (!searchTerm.trim()) return rows
    const term = searchTerm.toLowerCase()
    return rows.filter(
      (row) =>
        row.code.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term)
    )
  }

  // Right panel: Category list
  const rightPanel = (
    <>
      <div className="bg-gray-100 px-2 py-1 border-b border-gray-300 flex-shrink-0">
        <span className="text-xs font-medium text-gray-700">Danh mục</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="p-1">
          {DEMO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                dispatch(
                  setCategory({
                    dialogId: DIALOG_ID,
                    categoryId: dialogState.categoryId === cat.id ? null : cat.id,
                  })
                )
              }
              className={cn(
                'w-full text-left px-2 py-1.5 text-xs rounded transition-colors mb-0.5',
                dialogState.categoryId === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200 text-gray-700'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )

  // Selected items preview
  const selectedPreview = (selectedRows: IcdRow[]) => (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-700 font-medium pt-1 shrink-0">
        Đã chọn ({selectedRows.length}):
      </span>
      <div className="flex flex-wrap flex-1">
        {selectedRows.map((row) => (
          <DiagnosisPill key={row.id} code={row.code} name={row.name} onRemove={() => {}} />
        ))}
      </div>
    </div>
  )

  // Confirmation handler
  const handleConfirm = (result: {
    selectedIds: string[]
    selectedRows: IcdRow[]
    categoryId: string | null
  }) => {
    if (onConfirm) {
      onConfirm(result)
    }
    onClose()
  }

  return (
    <CommonSelectDialog<IcdRow>
      dialogId={DIALOG_ID}
      rows={DEMO_ICD_ROWS}
      rowKey={(row) => row.id}
      columns={columns}
      selectable="multiple"
      rightPanel={rightPanel}
      selectedPreview={selectedPreview}
      title="Tên ICD / Ghi chú / Tên phòng"
      caption={title}
      searchPlaceholder="Tìm kiếm theo mã ICD hoặc tên bệnh..."
      confirmText="Thêm"
      cancelText="Hủy"
      onConfirm={handleConfirm}
      filterRows={filterRows}
    />
  )
}
