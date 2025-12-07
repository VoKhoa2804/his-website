/**
 * Global Keyboard Shortcuts Configuration
 * Default shortcuts available throughout the application
 */

import type { ShortcutConfig } from '../model/types'

export const globalShortcuts = {
  commandPalette: {
    keys: 'ctrl+shift+p',
    description: 'Open command palette',
    category: 'global' as const,
    priority: 100,
  } satisfies ShortcutConfig,

  quickSearch: {
    keys: 'ctrl+k',
    description: 'Quick search',
    category: 'global' as const,
    priority: 90,
  } satisfies ShortcutConfig,

  save: {
    keys: 'ctrl+s',
    description: 'Save current form',
    category: 'editing' as const,
    priority: 80,
  } satisfies ShortcutConfig,

  help: {
    keys: 'f1',
    description: 'Open help documentation',
    category: 'global' as const,
    priority: 70,
  } satisfies ShortcutConfig,

  escape: {
    keys: 'escape',
    description: 'Close modal or cancel action',
    category: 'global' as const,
    priority: 60,
  } satisfies ShortcutConfig,
}
