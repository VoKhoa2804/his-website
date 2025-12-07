/**
 * Keyboard Shortcut Types
 * Type definitions for the global shortcut system
 */

/**
 * Modifier keys for keyboard shortcuts
 */
export type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'

/**
 * Special keys
 */
export type SpecialKey =
  | 'enter'
  | 'escape'
  | 'tab'
  | 'space'
  | 'backspace'
  | 'delete'
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'f1'
  | 'f2'
  | 'f3'
  | 'f4'
  | 'f5'
  | 'f6'
  | 'f7'
  | 'f8'
  | 'f9'
  | 'f10'
  | 'f11'
  | 'f12'

/**
 * Key combination as string (e.g., "ctrl+shift+p", "f1", "ctrl+s")
 */
export type KeyCombo = string

/**
 * Shortcut definition
 */
export interface ShortcutDefinition {
  id: string
  keys: KeyCombo
  description: string
  callback: (event: KeyboardEvent) => void
  category?: 'global' | 'feature' | 'navigation' | 'editing'
  feature?: string // Feature name (e.g., 'auth', 'work-shift')
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  allowInInput?: boolean // Allow in input fields
  priority?: number // Higher priority executes first
}

/**
 * Shortcut options for registration (without keys, since keys are passed separately)
 */
export interface ShortcutOptions {
  description: string
  category?: ShortcutDefinition['category']
  feature?: string
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  allowInInput?: boolean
  priority?: number
}

/**
 * Shortcut config (includes keys for config files)
 */
export interface ShortcutConfig extends ShortcutOptions {
  keys: KeyCombo
}

/**
 * Parsed key event
 */
export interface ParsedKeyEvent {
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  combo: string // Normalized combo string
}

/**
 * Operating system type
 */
export type OperatingSystem = 'mac' | 'windows' | 'linux' | 'unknown'

/**
 * Shortcut context (for conditional execution)
 */
export interface ShortcutContext {
  isModalOpen: boolean
  isInputFocused: boolean
  activeFeature?: string
}
