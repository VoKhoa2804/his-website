// src/features/home/ui/HomeScreen.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

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
  | 'bao_cao_quan_tri';

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface Feature {
  id: FeatureId;
  label: string;
  Icon: React.ElementType;
  path?: string;
  children?: SubMenuItem[];
  highlight?: boolean;
}

const FEATURES: Feature[] = [
  {
    id: 'tiep_nhan',
    label: 'Quản lý tiếp đón',
    Icon: UserPlus,
    children: [
      { id: 'tiep_don', label: 'Tiếp đón', path: '/registration' },
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
  { id: 'hoi_chan_tu_xa', label: 'Tiêm chủng', Icon: Video, path: '/teleconsult' },
  { id: 'bao_hiem', label: 'Điều trị dài hạn', Icon: ShieldCheck, path: '/insurance' },
  { id: 'vien_phi', label: 'Khám sức khoẻ hợp đồng', Icon: CircleDollarSign, path: '/billing' },
  { id: 'kq_xn', label: 'Sinh hiệu', Icon: FlaskConical, path: '/lab-results' },
  { id: 'kq_ha', label: 'Xét nghiệm', Icon: ImageIcon, path: '/imaging' },
  { id: 'duoc_vattu', label: 'Chẩn đoán hình ảnh', Icon: Pill, path: '/pharmacy' },
  { id: 'tb_yte', label: 'Điều trị kết hợp', Icon: DeviceIcon, path: '/devices' },
  { id: 'luu_tru_ho_so', label: 'Nhà thuốc', Icon: Archive, path: '/records' },
  { id: 'quan_tri_he_thong', label: 'Thu ngân', Icon: Settings, path: '/admin' },
  { id: 'bao_cao_quan_tri', label: 'Báo cáo', Icon: BarChart3, path: '/management-reports' },
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#e9f2ff]">
      {/* Header */}
      <div className="px-8 pt-6 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Trang chủ</h1>
        <p className="text-sm text-gray-600 mt-1">Chào mừng, Võ Thiện Khoa</p>
      </div>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {FEATURES.map((feature) => {
            const { id, label, Icon, path, children } = feature;

            return (
              <div key={id} className="relative group">
                {/* MAIN TILE */}
                <button
                  type="button"
                  onClick={() => path && navigate(path)}
                  className={[
                    'flex flex-col items-center justify-between h-40 w-full',
                    'rounded-2xl border bg-white shadow-sm px-4 py-3 text-center',
                    'transition-all duration-150',
                    'group-hover:border-blue-500 group-hover:shadow-lg',
                  ].join(' ')}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-blue-500" />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-gray-800">
                    {label}
                  </span>
                </button>

                {/* SUBMENU – right side, CLICKABLE */}
                {children && (
                  <div
                    className={[
                      'absolute top-0 left-full',
                      // hơi dịch sang phải nhưng vẫn nằm trong hitbox của wrapper
                      'translate-x-2',
                      // ẩn mặc định
                      'invisible opacity-0 pointer-events-none',
                      // hiện khi hover vào main tile HOẶC submenu (vì cùng chung .group)
                      'group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto',
                      'w-80 bg-white rounded-2xl shadow-xl border border-gray-200',
                      'py-3 z-50 transition-opacity duration-150',
                    ].join(' ')}
                  >
                    {children.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.path)}
                        className="
                          w-full text-left px-5 py-2.5 text-sm text-gray-800
                          hover:bg-blue-50 hover:text-blue-700
                          transition-colors
                        "
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
