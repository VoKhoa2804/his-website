import { Button } from "@/shared/ui/button"
import type { PaymentType } from "../model/bhytTypes"

interface PaymentTypeSegmentProps {
  value: PaymentType
  onChange: (value: PaymentType) => void
}

const PAYMENT_OPTIONS: Array<{
  value: PaymentType
  label: string
  description: string
}> = [
  { value: "BHYT", label: "BHYT", description: "Thanh toán qua BHYT" },
  { value: "THU_PHI", label: "Thu phí", description: "Khách tự chi trả" },
  { value: "MIEN_PHI_KHAC", label: "Miễn phí/Khác", description: "Quỹ khác" },
]

export function PaymentTypeSegment({ value, onChange }: PaymentTypeSegmentProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PAYMENT_OPTIONS.map((option) => {
        const isActive = value === option.value

        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? "default" : "outline"}
            className={`flex h-full w-full flex-col items-start gap-1 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${isActive ? "border-sky-600 bg-sky-600 text-white shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-sky-200"}`}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            <span className={`text-xs font-normal ${isActive ? "text-white/80" : "text-gray-500"}`}>
              {option.description}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
