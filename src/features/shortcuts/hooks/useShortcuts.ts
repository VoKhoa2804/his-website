/**
 * useShortcuts Hook
 * Register multiple keyboard shortcuts at once
 */

import { useEffect, useRef } from 'react'
import { useShortcutContext } from '../ui/GlobalShortcutProvider'
import type { KeyCombo, ShortcutOptions } from '../model/types'

interface ShortcutConfig {
  keys: KeyCombo
  callback: (event: KeyboardEvent) => void
  options: ShortcutOptions
}

/**
 * Hook to register multiple keyboard shortcuts
 *
 * @example
 * useShortcuts([
 *   {
 *     keys: 'ctrl+s',
 *     callback: handleSave,
 *     options: { description: 'Save', feature: 'editor' }
 *   },
 *   {
 *     keys: 'ctrl+k',
 *     callback: handleSearch,
 *     options: { description: 'Search', feature: 'editor' }
 *   }
 * ])
 */
export function useShortcuts(shortcuts: ShortcutConfig[]): void {
  const { register, unregister } = useShortcutContext()
  const idsRef = useRef<string[]>([])

  useEffect(() => {
    // Clear previous IDs
    idsRef.current = []

    // Register all shortcuts
    shortcuts.forEach(({ keys, callback, options }) => {
      const id = `${options.feature || 'component'}:${keys}:${Math.random().toString(36).slice(2)}`
      idsRef.current.push(id)
      register(id, keys, callback, options)
    })

    // Cleanup on unmount
    return () => {
      idsRef.current.forEach((id) => unregister(id))
      idsRef.current = []
    }
  }, [shortcuts, register, unregister])
}
