import { LookupAutocomplete } from '@/shared/ui/lookup-autocomplete'

const ETHNICITIES = [
  { ma: '01', ten: 'Kinh' },
  { ma: '02', ten: 'Tày' },
  { ma: '03', ten: 'Thái' },
  { ma: '04', ten: 'Hoa' },
  { ma: '05', ten: 'Khmer' },
  { ma: '06', ten: 'Mường' },
  { ma: '07', ten: 'Nùng' },
  { ma: '08', ten: 'H\'Mông' },
  { ma: '09', ten: 'Dao' },
]

interface EthnicityLookupProps {
  code?: string
  name?: string
  onSelect: (value: { code: string; name: string }) => void
  disabled?: boolean
}

export function EthnicityLookup({ code, name, onSelect, disabled }: EthnicityLookupProps) {
  return (
    <LookupAutocomplete
      key={`${code || ''}-${name || ''}`}
      localData={ETHNICITIES}
      minChars={0}
      take={50}
      placeholder="Nhập mã hoặc tên dân tộc"
      className={disabled ? 'pointer-events-none opacity-60' : undefined}
      inputClassName="h-9 text-sm"
      initialId={code}
      initialName={name}
      displayColumns={[
        { headerName: 'Mã', field: 'ma', width: 30 },
        { headerName: 'Dân tộc', field: 'ten', width: 70 },
      ]}
      searchFields={['ma', 'ten']}
      showHeader
      showBorders
      onSelect={(selection) => {
        onSelect({ code: selection.id, name: selection.name })
      }}
    />
  )
}
