/**
 * Global Shortcut Provider
 * React Context provider for keyboard shortcuts
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { shortcutManager } from '../model/shortcutManager'
import type { ShortcutDefinition, ShortcutOptions, KeyCombo } from '../model/types'

interface ShortcutContextValue {
  register: (
    id: string,
    keys: KeyCombo,
    callback: (event: KeyboardEvent) => void,
    options: ShortcutOptions
  ) => void
  unregister: (id: string) => void
  getAll: () => ShortcutDefinition[]
  setModalOpen: (open: boolean) => void
  openHelp: () => void
  closeHelp: () => void
  isHelpOpen: boolean
}

const ShortcutContext = createContext<ShortcutContextValue | null>(null)

export function useShortcutContext() {
  const context = useContext(ShortcutContext)
  if (!context) {
    throw new Error(
      'useShortcutContext must be used within GlobalShortcutProvider'
    )
  }
  return context
}

interface GlobalShortcutProviderProps {
  children: React.ReactNode
}

export function GlobalShortcutProvider({
  children,
}: GlobalShortcutProviderProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const managerRef = useRef(shortcutManager)

  useEffect(() => {
    // Attach keyboard listener
    managerRef.current.attach()

    // Register global help shortcut (Ctrl+Shift+P or Cmd+Shift+P)
    managerRef.current.register(
      'global:help',
      'ctrl+shift+p',
      () => setIsHelpOpen(true),
      {
        description: 'Open command palette',
        category: 'global',
        priority: 100,
      }
    )

    // Also support Escape to close help
    managerRef.current.register(
      'global:close-help',
      'escape',
      () => setIsHelpOpen(false),
      {
        description: 'Close command palette',
        category: 'global',
        priority: 99,
        enabled: isHelpOpen,
      }
    )

    return () => {
      managerRef.current.detach()
      managerRef.current.clear()
    }
  }, [isHelpOpen])

  const value: ShortcutContextValue = {
    register: (id, keys, callback, options) => {
      managerRef.current.register(id, keys, callback, options)
    },
    unregister: (id) => {
      managerRef.current.unregister(id)
    },
    getAll: () => {
      return managerRef.current.getAll()
    },
    setModalOpen: (open) => {
      managerRef.current.updateContext({ isModalOpen: open })
    },
    openHelp: () => setIsHelpOpen(true),
    closeHelp: () => setIsHelpOpen(false),
    isHelpOpen,
  }

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  )
}
