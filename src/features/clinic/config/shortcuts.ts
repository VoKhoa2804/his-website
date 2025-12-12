/**
 * Clinic feature keyboard shortcuts
 */

import type { ShortcutConfig } from '@/features/shortcuts'

export const clinicShortcuts: Record<string, ShortcutConfig> = {
  create: {
    keys: 'ctrl+k',
    description: 'Tạo phòng khám mới',
    category: 'feature',
    feature: 'clinic',
  },
  search: {
    keys: 'ctrl+/',
    description: 'Tìm kiếm phòng khám',
    category: 'feature',
    feature: 'clinic',
  },
  refresh: {
    keys: 'f5',
    description: 'Làm mới danh sách phòng khám',
    category: 'feature',
    feature: 'clinic',
  },
}
