/**
 * Shortcuts Feature Exports
 * Central export point for keyboard shortcut functionality
 */

// Core types
export type {
  ModifierKey,
  SpecialKey,
  KeyCombo,
  ShortcutDefinition,
  ShortcutOptions,
  ShortcutConfig,
  ParsedKeyEvent,
  OperatingSystem,
  ShortcutContext,
} from './model/types'

// Models and utilities
export { shortcutManager } from './model/shortcutManager'
export { detectOS, isMac, parseKeyEvent, normalizeKeyCombo, parseKeyCombo } from './model/keyDetection'
export { formatKeyCombo, formatKeyName, getModifierKey } from './utils/keyFormatter'

// React hooks
export { useShortcut } from './hooks/useShortcut'
export { useShortcuts } from './hooks/useShortcuts'

// UI components
export { GlobalShortcutProvider, useShortcutContext } from './ui/GlobalShortcutProvider'
export { ShortcutHelpModal } from './ui/ShortcutHelpModal'
export { ShortcutKey } from './ui/ShortcutKey'

// Configuration
export { globalShortcuts } from './config/globalShortcuts'
