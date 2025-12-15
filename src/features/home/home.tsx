import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus,
  Stethoscope,
  BedDouble,
  Scissors,
  Video,
  ShieldCheck,
  CircleDollarSign,
  FlaskConical,
  Image as ImageIcon,
  Pill,
  Stethoscope as DeviceIcon,
  Archive,
  Settings,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/hover-card'
import { cn } from '@/shared/utils/cn'

type FeatureId =
  | 'tiep_nhan'
  | 'kham_benh'
  | 'noi_tru'
  | 'phau_thuat'
  | 'hoi_chan_tu_xa'
  | 'bao_hiem'
  | 'vien_phi'
  | 'kq_xn'
  | 'kq_ha'
  | 'duoc_vattu'
  | 'tb_yte'
  | 'luu_tru_ho_so'
  | 'quan_tri_he_thong'
  | 'bao_cao_quan_tri'

interface SubMenuItem {
  id: string
  label: string
  path: string
}

interface Feature {
  id: FeatureId
  label: string
  Icon: React.ElementType
  path?: string
  children?: SubMenuItem[]
  highlight?: boolean
}

const FEATURES: Feature[] = [
  {
    id: 'tiep_nhan',
    label: 'Quản lý tiếp đón',
    Icon: UserPlus,
    children: [
      { id: 'tiep_don', label: 'Tiếp đón', path: '/tiepnhan' },
      {
        id: 'ds_bn_tiep_don',
        label: 'Danh sách người bệnh đã tiếp đón',
        path: '/registration/patient-list',
      },
      {
        id: 'ds_bn_huy_tiep_don',
        label: 'Danh sách người bệnh huỷ tiếp đón',
        path: '/registration/cancel-list',
      },
      {
        id: 'ds_lich_hen',
        label: 'Danh sách lịch hẹn',
        path: '/registration/appointments',
      },
    ],
  },
  { id: 'kham_benh', label: 'Theo dõi điều trị', Icon: Stethoscope, path: '/clinical-exam' },
  { id: 'noi_tru', label: 'Hồ sơ bệnh án', Icon: BedDouble, path: '/hanghoas' },
  { id: 'phau_thuat', label: 'Quản lý nội trú', Icon: Scissors, path: '/calamviec' },
  { id: 'hoi_chan_tu_xa', label: 'Tiêm chủng', Icon: Video, path: '/phong-kham' },
  { id: 'bao_hiem', label: 'Điều trị dài hạn', Icon: ShieldCheck, path: '/insurance' },
  { id: 'vien_phi', label: 'Khám sức khoẻ hợp đồng', Icon: CircleDollarSign, path: '/billing' },
  { id: 'kq_xn', label: 'Sinh hiệu', Icon: FlaskConical, path: '/lab-results' },
  { id: 'kq_ha', label: 'Xét nghiệm', Icon: ImageIcon, path: '/imaging' },
  { id: 'duoc_vattu', label: 'Chẩn đoán hình ảnh', Icon: Pill, path: '/pharmacy' },
  { id: 'tb_yte', label: 'Điều trị kết hợp', Icon: DeviceIcon, path: '/devices' },
  { id: 'luu_tru_ho_so', label: 'Nhà thuốc', Icon: Archive, path: '/records' },
  { id: 'quan_tri_he_thong', label: 'Thu ngân', Icon: Settings, path: '/admin' },
  { id: 'bao_cao_quan_tri', label: 'Báo cáo', Icon: BarChart3, path: '/management-reports' },
]

export function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Header */}
      <div className="px-8 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Trang chủ</h1>
        <p className="text-sm text-muted-foreground mt-1">Chào mừng, Võ Thiện Khoa</p>
      </div>

      {/* Feature Grid */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {FEATURES.map((feature) => {
            const { id, label, Icon, path, children } = feature

            const featureCard = (
              <Card
                className={cn(
                  'h-40 transition-all duration-200 cursor-pointer group',
                  'hover:shadow-lg hover:scale-105 hover:border-primary'
                )}
                onClick={() => path && navigate(path)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-center text-foreground line-clamp-2">
                    {label}
                  </span>
                </CardContent>
              </Card>
            )

            // If has children, wrap with HoverCard
            if (children && children.length > 0) {
              return (
                <HoverCard key={id} openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    {featureCard}
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="start"
                    className="w-80 p-2"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold px-2 py-1.5 text-foreground">
                        {label}
                      </h4>
                      <div className="border-t">
                        {children.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            className="w-full justify-start text-sm font-normal h-auto py-2.5 px-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(item.path)
                            }}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )
            }

            // No children, return card directly
            return <div key={id}>{featureCard}</div>
          })}
        </div>
      </div>
    </div>
  )
}
