import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import type { BhytInfo, BhytStatus } from "../model/bhytTypes"

interface BhytSummaryCardProps {
  data: BhytInfo
  onEdit: () => void
  onDelete: () => void
}

const STATUS_STYLES: Record<BhytStatus, string> = {
  VALID: "bg-emerald-100 text-emerald-800",
  INVALID: "bg-red-100 text-red-700",
  EXPIRED: "bg-amber-100 text-amber-800",
  UNKNOWN: "bg-gray-100 text-gray-600",
}

const STATUS_LABELS: Record<BhytStatus, string> = {
  VALID: "Hợp lệ",
  INVALID: "Không hợp lệ",
  EXPIRED: "Hết hạn",
  UNKNOWN: "Chưa kiểm tra",
}

function maskCard(maThe: string) {
  if (!maThe) return ""
  if (maThe.length <= 8) return maThe
  const prefix = maThe.slice(0, 4)
  const suffix = maThe.slice(-3)
  return `${prefix}••••${suffix}`
}

export function BhytSummaryCard({ data, onEdit, onDelete }: BhytSummaryCardProps) {
  return (
    <Card className="border-emerald-100 bg-emerald-50/50">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[data.status]}`}>
              {STATUS_LABELS[data.status]}
            </span>
            <span className="font-mono text-sm tracking-wider text-gray-700">
              {maskCard(data.maThe)}
            </span>
          </div>
          <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-gray-500">Mức hưởng</p>
              <p className="font-semibold">{data.mucHuong || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Hiệu lực</p>
              <p className="font-semibold">
                {data.tuNgay || "?"} → {data.denNgay || "?"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Nơi ĐK KCB</p>
              <p className="font-semibold">{data.noiDangKyKcb || "—"}</p>
            </div>
          </div>
          {data.statusMessage && (
            <p className="text-xs text-gray-500">{data.statusMessage}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Sửa
          </Button>
          <Button variant="ghost" className="text-red-600 hover:text-red-700" onClick={onDelete}>
            Xoá
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
