/**
 * Key Detection Utilities
 * OS detection, key parsing, and normalization
 */

import type { ParsedKeyEvent, OperatingSystem } from './types'

/**
 * Detect operating system
 */
export function detectOS(): OperatingSystem {
  if (typeof window === 'undefined') return 'unknown'

  const platform = window.navigator.platform.toLowerCase()
  const userAgent = window.navigator.userAgent.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac'
  }

  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  }

  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }

  return 'unknown'
}

/**
 * Check if Mac OS
 */
export function isMac(): boolean {
  return detectOS() === 'mac'
}

/**
 * Parse keyboard event into structured format
 */
export function parseKeyEvent(event: KeyboardEvent): ParsedKeyEvent {
  const key = event.key.toLowerCase()
  const ctrl = event.ctrlKey
  const shift = event.shiftKey
  const alt = event.altKey
  const meta = event.metaKey

  const combo = normalizeKeyCombo(buildKeyCombo(key, ctrl, shift, alt, meta))

  return {
    key,
    ctrl,
    shift,
    alt,
    meta,
    combo,
  }
}

/**
 * Build key combination string from components
 */
function buildKeyCombo(
  key: string,
  ctrl: boolean,
  shift: boolean,
  alt: boolean,
  meta: boolean
): string {
  const parts: string[] = []

  if (ctrl) parts.push('ctrl')
  if (alt) parts.push('alt')
  if (shift) parts.push('shift')
  if (meta) parts.push('meta')

  // Normalize key name
  const normalizedKey = normalizeKeyName(key)
  parts.push(normalizedKey)

  return parts.join('+')
}

/**
 * Normalize key name to standard format
 */
function normalizeKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    ' ': 'space',
    esc: 'escape',
    return: 'enter',
    del: 'delete',
    up: 'arrowup',
    down: 'arrowdown',
    left: 'arrowleft',
    right: 'arrowright',
  }

  const normalized = key.toLowerCase()
  return keyMap[normalized] || normalized
}

/**
 * Normalize key combination for consistent comparison
 * Always returns modifiers in order: ctrl, alt, shift, meta
 */
export function normalizeKeyCombo(combo: string): string {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim())

  // Sort modifiers in consistent order
  const modifiers: string[] = []
  const keys: string[] = []

  const modifierOrder = ['ctrl', 'alt', 'shift', 'meta']

  parts.forEach((part) => {
    if (modifierOrder.includes(part)) {
      modifiers.push(part)
    } else {
      keys.push(normalizeKeyName(part))
    }
  })

  // Sort modifiers according to standard order
  modifiers.sort((a, b) => modifierOrder.indexOf(a) - modifierOrder.indexOf(b))

  return [...modifiers, ...keys].join('+')
}

/**
 * Parse key combo string into components
 */
export function parseKeyCombo(combo: string): {
  modifiers: string[]
  key: string
} {
  const normalized = normalizeKeyCombo(combo)
  const parts = normalized.split('+')

  const modifiers = parts.filter((p) =>
    ['ctrl', 'alt', 'shift', 'meta'].includes(p)
  )

  const key =
    parts.find((p) => !['ctrl', 'alt', 'shift', 'meta'].includes(p)) || ''

  return { modifiers, key }
}
