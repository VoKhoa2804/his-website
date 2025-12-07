/**
 * Auth Feature Shortcuts
 */

import type { ShortcutConfig } from '@/features/shortcuts'

export const authShortcuts = {
  logout: {
    keys: 'ctrl+shift+l',
    description: 'Logout from application',
    category: 'feature' as const,
    feature: 'auth',
    priority: 50,
  } satisfies ShortcutConfig,

  submitLogin: {
    keys: 'enter',
    description: 'Submit login form',
    category: 'editing' as const,
    feature: 'auth',
    allowInInput: true,
    priority: 40,
  } satisfies ShortcutConfig,
}
