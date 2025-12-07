/**
 * Shortcut Manager
 * Core logic for managing keyboard shortcuts
 */

import type {
  ShortcutDefinition,
  ShortcutOptions,
  ParsedKeyEvent,
  ShortcutContext,
  KeyCombo,
} from './types'
import { parseKeyEvent, normalizeKeyCombo } from './keyDetection'

export class ShortcutManager {
  private shortcuts: Map<string, ShortcutDefinition> = new Map()
  private context: ShortcutContext = {
    isModalOpen: false,
    isInputFocused: false,
  }
  private listener: ((event: KeyboardEvent) => void) | null = null

  /**
   * Register a keyboard shortcut
   */
  register(
    id: string,
    keys: KeyCombo,
    callback: (event: KeyboardEvent) => void,
    options: ShortcutOptions
  ): void {
    const normalizedKeys = normalizeKeyCombo(keys)

    // Check for conflicts
    const existing = Array.from(this.shortcuts.values()).find(
      (s) => s.keys === normalizedKeys && s.id !== id
    )

    if (existing) {
      console.warn(
        `⚠️ Shortcut conflict detected!\n` +
          `  Keys: ${keys}\n` +
          `  Existing: ${existing.id} (${existing.feature || 'global'})\n` +
          `  New: ${id} (${options.feature || 'global'})`
      )
    }

    const shortcut: ShortcutDefinition = {
      id,
      keys: normalizedKeys,
      callback,
      category: options.category || 'global',
      feature: options.feature,
      description: options.description,
      enabled: options.enabled !== false,
      preventDefault: options.preventDefault !== false,
      stopPropagation: options.stopPropagation !== false,
      allowInInput: options.allowInInput || false,
      priority: options.priority || 0,
    }

    this.shortcuts.set(id, shortcut)

    if (import.meta.env.DEV) {
      console.log(`✅ Registered shortcut: ${id} → ${keys}`)
    }
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(id: string): void {
    this.shortcuts.delete(id)
    if (import.meta.env.DEV) {
      console.log(`🗑️ Unregistered shortcut: ${id}`)
    }
  }

  /**
   * Get all registered shortcuts
   */
  getAll(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values()).sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    )
  }

  /**
   * Get shortcuts by category
   */
  getByCategory(
    category: ShortcutDefinition['category']
  ): ShortcutDefinition[] {
    return this.getAll().filter((s) => s.category === category)
  }

  /**
   * Get shortcuts by feature
   */
  getByFeature(feature: string): ShortcutDefinition[] {
    return this.getAll().filter((s) => s.feature === feature)
  }

  /**
   * Update context (modal open, input focused, etc.)
   */
  updateContext(context: Partial<ShortcutContext>): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * Handle keyboard event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Skip if modal is open
    if (this.context.isModalOpen) {
      return
    }

    // Check if input is focused
    const target = event.target as HTMLElement
    const isInput =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'

    if (isInput) {
      this.context.isInputFocused = true
    } else {
      this.context.isInputFocused = false
    }

    // Parse key event
    const parsed = parseKeyEvent(event)

    // Find matching shortcuts (sorted by priority)
    const matching = this.getAll().filter((shortcut) => {
      if (!shortcut.enabled) return false
      if (shortcut.keys !== parsed.combo) return false
      if (isInput && !shortcut.allowInInput) return false
      return true
    })

    // Execute first matching shortcut
    if (matching.length > 0) {
      const shortcut = matching[0]

      if (shortcut.preventDefault) {
        event.preventDefault()
      }

      if (shortcut.stopPropagation) {
        event.stopPropagation()
      }

      try {
        shortcut.callback(event)
      } catch (error) {
        console.error(`Error executing shortcut ${shortcut.id}:`, error)
      }
    }
  }

  /**
   * Attach keyboard listener
   */
  attach(): void {
    if (this.listener) {
      console.warn('Shortcut listener already attached')
      return
    }

    this.listener = this.handleKeyDown
    window.addEventListener('keydown', this.listener)

    if (import.meta.env.DEV) {
      console.log('🎹 Keyboard shortcut listener attached')
    }
  }

  /**
   * Detach keyboard listener
   */
  detach(): void {
    if (this.listener) {
      window.removeEventListener('keydown', this.listener)
      this.listener = null

      if (import.meta.env.DEV) {
        console.log('🎹 Keyboard shortcut listener detached')
      }
    }
  }

  /**
   * Clear all shortcuts
   */
  clear(): void {
    this.shortcuts.clear()
  }
}

// Singleton instance
export const shortcutManager = new ShortcutManager()
