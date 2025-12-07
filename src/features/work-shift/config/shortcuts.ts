/**
 * Work Shift Feature Shortcuts
 */

import type { ShortcutConfig } from '@/features/shortcuts'

export const workShiftShortcuts = {
  create: {
    keys: 'ctrl+n',
    description: 'Create new work shift',
    category: 'feature' as const,
    feature: 'work-shift',
    priority: 50,
  } satisfies ShortcutConfig,

  edit: {
    keys: 'ctrl+e',
    description: 'Edit selected work shift',
    category: 'feature' as const,
    feature: 'work-shift',
    priority: 45,
  } satisfies ShortcutConfig,

  delete: {
    keys: 'ctrl+shift+d',
    description: 'Delete selected work shift',
    category: 'feature' as const,
    feature: 'work-shift',
    priority: 40,
  } satisfies ShortcutConfig,

  search: {
    keys: 'f2',
    description: 'Focus search input',
    category: 'feature' as const,
    feature: 'work-shift',
    priority: 55,
  } satisfies ShortcutConfig,

  refresh: {
    keys: 'f5',
    description: 'Refresh work shift list',
    category: 'feature' as const,
    feature: 'work-shift',
    priority: 35,
  } satisfies ShortcutConfig,
}
