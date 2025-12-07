/**
 * Key Formatter Utilities
 * Format keyboard shortcuts for display (OS-aware)
 */

import { isMac, parseKeyCombo } from '../model/keyDetection'

/**
 * Format key combo for display (OS-aware)
 * Example: "ctrl+shift+p" → "⌃⇧P" (Mac) or "Ctrl+Shift+P" (Windows)
 */
export function formatKeyCombo(combo: string): string {
  const { modifiers, key } = parseKeyCombo(combo)

  const formattedModifiers = modifiers.map((mod) => {
    if (mod === 'meta') {
      return isMac() ? '⌘' : 'Win'
    }
    if (mod === 'ctrl') {
      return isMac() ? '⌃' : 'Ctrl'
    }
    if (mod === 'alt') {
      return isMac() ? '⌥' : 'Alt'
    }
    if (mod === 'shift') {
      return isMac() ? '⇧' : 'Shift'
    }
    return mod
  })

  const formattedKey = formatKeyName(key)

  return [...formattedModifiers, formattedKey].join(isMac() ? '' : '+')
}

/**
 * Format individual key name for display
 */
export function formatKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    enter: '↵',
    escape: 'Esc',
    space: 'Space',
    tab: '⇥',
    backspace: '⌫',
    delete: 'Del',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    f1: 'F1',
    f2: 'F2',
    f3: 'F3',
    f4: 'F4',
    f5: 'F5',
    f6: 'F6',
    f7: 'F7',
    f8: 'F8',
    f9: 'F9',
    f10: 'F10',
    f11: 'F11',
    f12: 'F12',
  }

  const normalized = key.toLowerCase()
  return keyMap[normalized] || key.toUpperCase()
}

/**
 * Get OS-specific modifier key name
 */
export function getModifierKey(
  modifier: 'ctrl' | 'alt' | 'shift' | 'meta'
): string {
  if (modifier === 'ctrl') {
    return isMac() ? 'Cmd' : 'Ctrl'
  }
  if (modifier === 'meta') {
    return isMac() ? 'Cmd' : 'Win'
  }
  return modifier.charAt(0).toUpperCase() + modifier.slice(1)
}
