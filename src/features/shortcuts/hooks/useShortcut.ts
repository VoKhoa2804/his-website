/**
 * useShortcut Hook
 * Register keyboard shortcuts in React components
 */

import { useEffect, useRef } from 'react'
import { useShortcutContext } from '../ui/GlobalShortcutProvider'
import type { KeyCombo, ShortcutOptions } from '../model/types'

/**
 * Hook to register a keyboard shortcut
 * Auto-unregisters on component unmount
 *
 * @example
 * useShortcut('ctrl+s', handleSave, {
 *   description: 'Save form',
 *   category: 'editing',
 *   feature: 'my-feature'
 * })
 */
export function useShortcut(
  keys: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions
): void {
  const { register, unregister } = useShortcutContext()
  const callbackRef = useRef(callback)
  // Initialize with empty string, will be set in useEffect
  const idRef = useRef<string>('')

  // Keep callback fresh without re-registering
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    // Generate unique ID
    const id = `${options.feature || 'component'}:${keys}:${Math.random().toString(36).slice(2)}`
    idRef.current = id

    // Register shortcut
    register(id, keys, (event) => callbackRef.current(event), options)

    // Cleanup on unmount
    return () => {
      if (idRef.current) {
        unregister(idRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    keys,
    options.description,
    options.feature,
    options.category,
    options.enabled,
    options.preventDefault,
    options.stopPropagation,
    options.allowInInput,
    options.priority,
    register,
    unregister,
  ])
}
