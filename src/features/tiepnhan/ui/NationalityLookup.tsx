import { LookupAutocomplete } from '@/shared/ui/lookup-autocomplete'

const NATIONALITIES = [
  { ma: '000', ten: 'Việt Nam' },
  { ma: '001', ten: 'Lào' },
  { ma: '002', ten: 'Campuchia' },
  { ma: '003', ten: 'Thái Lan' },
  { ma: '004', ten: 'Singapore' },
  { ma: '005', ten: 'Hoa Kỳ' },
  { ma: '006', ten: 'Nhật Bản' },
  { ma: '007', ten: 'Hàn Quốc' },
  { ma: '008', ten: 'Trung Quốc' },
]

interface NationalityLookupProps {
  code?: string
  name?: string
  onSelect: (value: { code: string; name: string }) => void
  disabled?: boolean
}

export function NationalityLookup({ code, name, onSelect, disabled }: NationalityLookupProps) {
  return (
    <LookupAutocomplete
      key={`${code || ''}-${name || ''}`}
      localData={NATIONALITIES}
      minChars={0}
      take={50}
      placeholder="Nhập mã hoặc tên quốc tịch"
      className={disabled ? 'pointer-events-none opacity-60' : undefined}
      inputClassName="h-9 text-sm"
      initialId={code}
      initialName={name}
      displayColumns={[
        { headerName: 'Mã', field: 'ma', width: 30 },
        { headerName: 'Quốc tịch', field: 'ten', width: 70 },
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
