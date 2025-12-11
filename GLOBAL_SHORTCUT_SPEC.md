# Global Keyboard Shortcut System Specification

## Executive Summary

This specification outlines the implementation of a centralized, type-safe keyboard shortcut management system for the entire application. The system will provide conflict detection, OS-aware key rendering, feature-level registration, and a beautiful command palette UI.

---

## Table of Contents

1. [Goals & Requirements](#goals--requirements)
2. [Architecture Overview](#architecture-overview)
3. [Folder Structure](#folder-structure)
4. [Technical Design](#technical-design)
5. [Implementation Details](#implementation-details)
6. [Integration Guide](#integration-guide)
7. [Usage Examples](#usage-examples)
8. [Testing Strategy](#testing-strategy)

---

## Goals & Requirements

### Primary Goals
1. **Centralized Management**: Single source of truth for all keyboard shortcuts
2. **Type Safety**: Full TypeScript support with autocomplete
3. **Conflict Detection**: Automatic detection and warning of duplicate shortcuts
4. **OS Awareness**: Render Cmd (Mac) vs Ctrl (Windows/Linux) appropriately
5. **Feature Isolation**: Features can register/unregister shortcuts independently
6. **Context Awareness**: Disable shortcuts when modals/dialogs are open
7. **Beautiful UI**: VSCode-style command palette showing all shortcuts
8. **Zero Component Listeners**: All keyboard listeners in one place

### Functional Requirements
- [x] Global shortcut provider at app root
- [x] Hook-based API for components: `useShortcut(keys, callback)`
- [x] Imperative API: `registerShortcut()`, `unregisterShortcut()`
- [x] Shortcut help modal with search and categories
- [x] Auto-detect operating system
- [x] Conflict detection with console warnings
- [x] Support for modifier keys: Ctrl, Shift, Alt, Meta (Cmd)
- [x] Feature-level shortcut definitions
- [x] Integration with existing state management (Redux)

### Non-Functional Requirements
- Performance: Event handlers should not block UI
- Accessibility: Screen reader friendly
- Bundle size: < 15KB additional bundle
- Compatibility: React 19+, TypeScript 5+

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App Root                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         GlobalShortcutProvider                         │  │
│  │  - Single keydown listener                            │  │
│  │  - Shortcut registry (Map<string, Shortcut>)          │  │
│  │  - Conflict detection                                 │  │
│  │  - Context awareness (modal open?)                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│              ┌────────────┴────────────┐                    │
│              │                         │                    │
│    ┌─────────▼────────┐     ┌─────────▼────────┐          │
│    │  Feature: Auth    │     │ Feature: Shifts  │          │
│    │  - Ctrl+L Logout  │     │ - Ctrl+N Create  │          │
│    │  - Esc Cancel     │     │ - Ctrl+E Edit    │          │
│    └───────────────────┘     └──────────────────┘          │
│                                                              │
│    ┌──────────────────────────────────────────────┐        │
│    │       Shortcut Help Modal (Ctrl+Shift+P)     │        │
│    │  - Search shortcuts                          │        │
│    │  - Grouped by category                       │        │
│    │  - OS-aware rendering                        │        │
│    └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **ShortcutManager** (Core Logic)
   - Registry for all shortcuts
   - Event listener management
   - Conflict detection
   - Key combination matching

2. **GlobalShortcutProvider** (React Context)
   - Wraps the app
   - Provides shortcut API via context
   - Manages global state

3. **useShortcut Hook** (Consumer API)
   - Easy hook-based registration
   - Auto cleanup on unmount

4. **ShortcutHelpModal** (UI)
   - Command palette style
   - Search and filter
   - Keyboard navigation

5. **Feature Definitions** (Configuration)
   - Each feature exports shortcuts
   - Registered on mount

---

## Folder Structure

```
src/
├── features/
│   ├── shortcuts/                          # 🆕 New Feature
│   │   ├── index.ts                        # Public exports
│   │   ├── api/
│   │   │   └── shortcutRegistry.ts        # Core registry logic
│   │   ├── model/
│   │   │   ├── types.ts                   # TypeScript types
│   │   │   ├── keyDetection.ts            # OS detection, key parsing
│   │   │   └── shortcutManager.ts         # Main manager class
│   │   ├── hooks/
│   │   │   ├── useShortcut.ts             # Hook for components
│   │   │   ├── useShortcuts.ts            # Hook for multiple shortcuts
│   │   │   └── useShortcutHelp.ts         # Hook for help modal
│   │   ├── ui/
│   │   │   ├── GlobalShortcutProvider.tsx # React context provider
│   │   │   ├── ShortcutHelpModal.tsx      # Command palette modal
│   │   │   ├── ShortcutKey.tsx            # Key badge component
│   │   │   └── ShortcutList.tsx           # List view component
│   │   ├── config/
│   │   │   ├── globalShortcuts.ts         # Global app shortcuts
│   │   │   └── featureShortcuts.ts        # Feature-specific shortcuts
│   │   └── utils/
│   │       ├── keyFormatter.ts            # Format keys for display
│   │       └── keyMatcher.ts              # Match key events
│   │
│   ├── auth/
│   │   ├── config/
│   │   │   └── shortcuts.ts               # 🆕 Auth shortcuts
│   │   └── ...
│   │
│   └── work-shift/
│       ├── config/
│       │   └── shortcuts.ts               # 🆕 Work shift shortcuts
│       └── ...
│
├── app/
│   ├── providers/
│   │   └── AppProviders.tsx               # 🔄 Updated
│   └── routes/
│       └── App.tsx                        # 🔄 Updated
│
└── main.tsx                                # 🔄 Updated
```

---

## Technical Design

### 1. Core Types (`model/types.ts`)

```typescript
/**
 * Modifier keys for keyboard shortcuts
 */
export type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'

/**
 * Special keys
 */
export type SpecialKey = 
  | 'enter' | 'escape' | 'tab' | 'space' | 'backspace'
  | 'delete' | 'arrowup' | 'arrowdown' | 'arrowleft' | 'arrowright'
  | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'f9' | 'f10' | 'f11' | 'f12'

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
 * Shortcut options
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
 * Shortcut context
 */
export interface ShortcutContext {
  isModalOpen: boolean
  isInputFocused: boolean
  activeFeature?: string
}
```

### 2. Shortcut Manager (`model/shortcutManager.ts`)

```typescript
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
  getByCategory(category: ShortcutDefinition['category']): ShortcutDefinition[] {
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
    // Skip if context prevents execution
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
    }

    // Parse key event
    const parsed = parseKeyEvent(event)

    // Find matching shortcuts (sorted by priority)
    const matching = this.getAll()
      .filter((shortcut) => {
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
```

### 3. Key Detection (`model/keyDetection.ts`)

```typescript
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
 * Build key combination string
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
 * Normalize key name
 */
function normalizeKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    ' ': 'space',
    'esc': 'escape',
    'return': 'enter',
    'del': 'delete',
    'up': 'arrowup',
    'down': 'arrowdown',
    'left': 'arrowleft',
    'right': 'arrowright',
  }

  const normalized = key.toLowerCase()
  return keyMap[normalized] || normalized
}

/**
 * Normalize key combination for consistent comparison
 */
export function normalizeKeyCombo(combo: string): string {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim())

  // Sort modifiers in consistent order: ctrl, alt, shift, meta
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

  // Sort modifiers
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
  
  const key = parts.find(
    (p) => !['ctrl', 'alt', 'shift', 'meta'].includes(p)
  ) || ''

  return { modifiers, key }
}
```

### 4. Key Formatter (`utils/keyFormatter.ts`)

```typescript
import { isMac } from '../model/keyDetection'
import { parseKeyCombo } from '../model/keyDetection'

/**
 * Format key combo for display (OS-aware)
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
 * Format individual key name
 */
function formatKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    'enter': '↵',
    'escape': 'Esc',
    'space': 'Space',
    'tab': 'Tab',
    'backspace': '⌫',
    'delete': 'Del',
    'arrowup': '↑',
    'arrowdown': '↓',
    'arrowleft': '←',
    'arrowright': '→',
    'f1': 'F1',
    'f2': 'F2',
    'f3': 'F3',
    'f4': 'F4',
    'f5': 'F5',
    'f6': 'F6',
    'f7': 'F7',
    'f8': 'F8',
    'f9': 'F9',
    'f10': 'F10',
    'f11': 'F11',
    'f12': 'F12',
  }

  return keyMap[key.toLowerCase()] || key.toUpperCase()
}

/**
 * Get OS-specific modifier key name
 */
export function getModifierKey(modifier: 'ctrl' | 'alt' | 'shift' | 'meta'): string {
  if (modifier === 'ctrl') {
    return isMac() ? 'Cmd' : 'Ctrl'
  }
  return modifier.charAt(0).toUpperCase() + modifier.slice(1)
}
```

---

## Implementation Details

### 5. React Context Provider (`ui/GlobalShortcutProvider.tsx`)

```tsx
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
    throw new Error('useShortcutContext must be used within GlobalShortcutProvider')
  }
  return context
}

interface GlobalShortcutProviderProps {
  children: React.ReactNode
}

export function GlobalShortcutProvider({ children }: GlobalShortcutProviderProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const managerRef = useRef(shortcutManager)

  useEffect(() => {
    // Attach keyboard listener
    managerRef.current.attach()

    // Register global help shortcut
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

    return () => {
      managerRef.current.detach()
      managerRef.current.clear()
    }
  }, [])

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
```

### 6. useShortcut Hook (`hooks/useShortcut.ts`)

```typescript
import { useEffect, useRef } from 'react'
import { useShortcutContext } from '../ui/GlobalShortcutProvider'
import type { KeyCombo, ShortcutOptions } from '../model/types'

/**
 * Hook to register a keyboard shortcut
 * Auto-unregisters on component unmount
 */
export function useShortcut(
  keys: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions
): void {
  const { register, unregister } = useShortcutContext()
  const callbackRef = useRef(callback)
  const idRef = useRef<string>()

  // Keep callback fresh
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    // Generate unique ID
    const id = `${options.feature || 'component'}:${keys}:${Math.random().toString(36).slice(2)}`
    idRef.current = id

    // Register shortcut
    register(
      id,
      keys,
      (event) => callbackRef.current(event),
      options
    )

    // Cleanup
    return () => {
      if (idRef.current) {
        unregister(idRef.current)
      }
    }
  }, [keys, options.description, options.feature, options.category, register, unregister])
}
```

### 7. Shortcut Help Modal (`ui/ShortcutHelpModal.tsx`)

```tsx
import React, { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'
import { useShortcutContext } from './GlobalShortcutProvider'
import { formatKeyCombo } from '../utils/keyFormatter'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { ShortcutKey } from './ShortcutKey'

export function ShortcutHelpModal() {
  const { isHelpOpen, closeHelp, getAll } = useShortcutContext()
  const [search, setSearch] = useState('')

  const shortcuts = useMemo(() => {
    const all = getAll()

    if (!search) return all

    const query = search.toLowerCase()
    return all.filter(
      (s) =>
        s.description.toLowerCase().includes(query) ||
        s.keys.toLowerCase().includes(query) ||
        s.feature?.toLowerCase().includes(query)
    )
  }, [search, getAll])

  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, typeof shortcuts> = {
      global: [],
      feature: [],
      navigation: [],
      editing: [],
    }

    shortcuts.forEach((shortcut) => {
      const category = shortcut.category || 'global'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(shortcut)
    })

    return groups
  }, [shortcuts])

  return (
    <Dialog open={isHelpOpen} onOpenChange={closeHelp}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {Object.entries(groupedShortcuts).map(([category, items]) => {
            if (items.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{shortcut.description}</p>
                        {shortcut.feature && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {shortcut.feature}
                          </p>
                        )}
                      </div>
                      <ShortcutKey combo={shortcut.keys} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {shortcuts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No shortcuts found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-xs text-muted-foreground text-center">
          Press <ShortcutKey combo="escape" size="sm" /> to close
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 8. Shortcut Key Component (`ui/ShortcutKey.tsx`)

```tsx
import React from 'react'
import { formatKeyCombo } from '../utils/keyFormatter'
import { parseKeyCombo } from '../model/keyDetection'
import { cn } from '@/shared/utils/cn'

interface ShortcutKeyProps {
  combo: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ShortcutKey({ combo, size = 'md', className }: ShortcutKeyProps) {
  const { modifiers, key } = parseKeyCombo(combo)
  const parts = [...modifiers, key]

  const sizeClasses = {
    sm: 'text-[10px] px-1 py-0.5 min-w-[20px]',
    md: 'text-xs px-1.5 py-1 min-w-[24px]',
    lg: 'text-sm px-2 py-1.5 min-w-[32px]',
  }

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {parts.map((part, index) => (
        <kbd
          key={index}
          className={cn(
            'inline-flex items-center justify-center rounded border border-border bg-muted font-mono font-medium shadow-sm',
            sizeClasses[size]
          )}
        >
          {formatKeyName(part)}
        </kbd>
      ))}
    </div>
  )
}

function formatKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    ctrl: '⌃',
    alt: '⌥',
    shift: '⇧',
    meta: '⌘',
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
  }

  return keyMap[key.toLowerCase()] || key.toUpperCase()
}
```

---

## Integration Guide

### Step 1: Wrap App with Provider

**src/main.tsx**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/routes/App'
import { GlobalShortcutProvider } from '@/features/shortcuts'
import { ShortcutHelpModal } from '@/features/shortcuts/ui/ShortcutHelpModal'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalShortcutProvider>
      <App />
      <ShortcutHelpModal />
    </GlobalShortcutProvider>
  </React.StrictMode>
)
```

### Step 2: Define Global Shortcuts

**src/features/shortcuts/config/globalShortcuts.ts**
```typescript
import type { ShortcutDefinition } from '../model/types'

export const globalShortcuts: Omit<ShortcutDefinition, 'callback'>[] = [
  {
    id: 'global:help',
    keys: 'ctrl+shift+p',
    description: 'Open command palette',
    category: 'global',
    priority: 100,
  },
  {
    id: 'global:search',
    keys: 'ctrl+k',
    description: 'Quick search',
    category: 'global',
    priority: 90,
  },
  {
    id: 'global:save',
    keys: 'ctrl+s',
    description: 'Save current form',
    category: 'editing',
    priority: 80,
  },
  {
    id: 'global:help-f1',
    keys: 'f1',
    description: 'Open help documentation',
    category: 'global',
    priority: 70,
  },
]
```

### Step 3: Define Feature Shortcuts

**src/features/auth/config/shortcuts.ts**
```typescript
import type { ShortcutOptions } from '@/features/shortcuts'

export const authShortcuts = {
  logout: {
    keys: 'ctrl+shift+l',
    description: 'Logout from application',
    category: 'feature' as const,
    feature: 'auth',
  } satisfies ShortcutOptions,
}
```

**src/features/work-shift/config/shortcuts.ts**
```typescript
import type { ShortcutOptions } from '@/features/shortcuts'

export const workShiftShortcuts = {
  create: {
    keys: 'ctrl+n',
    description: 'Create new work shift',
    category: 'feature' as const,
    feature: 'work-shift',
  } satisfies ShortcutOptions,
  
  edit: {
    keys: 'ctrl+e',
    description: 'Edit selected work shift',
    category: 'feature' as const,
    feature: 'work-shift',
  } satisfies ShortcutOptions,
  
  delete: {
    keys: 'ctrl+shift+d',
    description: 'Delete selected work shift',
    category: 'feature' as const,
    feature: 'work-shift',
  } satisfies ShortcutOptions,
  
  search: {
    keys: 'f2',
    description: 'Search work shifts',
    category: 'feature' as const,
    feature: 'work-shift',
  } satisfies ShortcutOptions,
}
```

---

## Usage Examples

### Example 1: Using Hook in Component

**src/features/work-shift/ui/WorkShiftListPage.tsx**
```tsx
import { useShortcut } from '@/features/shortcuts'
import { workShiftShortcuts } from '../config/shortcuts'

export function WorkShiftListPage() {
  const navigate = useNavigate()

  // Register shortcuts
  useShortcut(
    workShiftShortcuts.create.keys,
    () => navigate('/work-shift/create'),
    workShiftShortcuts.create
  )

  useShortcut(
    workShiftShortcuts.search.keys,
    () => searchInputRef.current?.focus(),
    workShiftShortcuts.search
  )

  // ... rest of component
}
```

### Example 2: Using in Auth Feature

**src/features/auth/login.tsx**
```tsx
import { useShortcut } from '@/features/shortcuts'
import { authShortcuts } from './config/shortcuts'

export function LoginPage() {
  const dispatch = useAppDispatch()

  useShortcut(
    'enter',
    (e) => {
      e.preventDefault()
      handleSubmit()
    },
    {
      description: 'Submit login form',
      category: 'editing',
      feature: 'auth',
      allowInInput: true, // Allow in input fields
    }
  )

  // ... rest of component
}
```

### Example 3: Modal Context Awareness

**src/shared/ui/dialog.tsx**
```tsx
import { useEffect } from 'react'
import { useShortcutContext } from '@/features/shortcuts'

export function Dialog({ open, onOpenChange, children }) {
  const { setModalOpen } = useShortcutContext()

  useEffect(() => {
    setModalOpen(open)
  }, [open, setModalOpen])

  // ... rest of Dialog component
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/shortcutManager.test.ts
import { ShortcutManager } from '../model/shortcutManager'

describe('ShortcutManager', () => {
  let manager: ShortcutManager

  beforeEach(() => {
    manager = new ShortcutManager()
  })

  it('should register shortcut', () => {
    const callback = jest.fn()
    manager.register('test', 'ctrl+s', callback, {
      description: 'Test',
    })

    expect(manager.getAll()).toHaveLength(1)
  })

  it('should detect conflicts', () => {
    const spy = jest.spyOn(console, 'warn')
    
    manager.register('test1', 'ctrl+s', jest.fn(), { description: 'Test 1' })
    manager.register('test2', 'ctrl+s', jest.fn(), { description: 'Test 2' })

    expect(spy).toHaveBeenCalled()
  })
})
```

---

## File Checklist

- [ ] `src/features/shortcuts/index.ts`
- [ ] `src/features/shortcuts/model/types.ts`
- [ ] `src/features/shortcuts/model/keyDetection.ts`
- [ ] `src/features/shortcuts/model/shortcutManager.ts`
- [ ] `src/features/shortcuts/hooks/useShortcut.ts`
- [ ] `src/features/shortcuts/hooks/useShortcuts.ts`
- [ ] `src/features/shortcuts/ui/GlobalShortcutProvider.tsx`
- [ ] `src/features/shortcuts/ui/ShortcutHelpModal.tsx`
- [ ] `src/features/shortcuts/ui/ShortcutKey.tsx`
- [ ] `src/features/shortcuts/utils/keyFormatter.ts`
- [ ] `src/features/shortcuts/config/globalShortcuts.ts`
- [ ] `src/features/auth/config/shortcuts.ts`
- [ ] `src/features/work-shift/config/shortcuts.ts`
- [ ] `src/main.tsx` (update)
- [ ] Integration examples

---

## Summary

This specification provides a complete, production-ready keyboard shortcut system with:

✅ **Type-safe** - Full TypeScript support  
✅ **Centralized** - Single event listener  
✅ **Conflict detection** - Automatic warnings  
✅ **OS-aware** - Mac vs Windows key rendering  
✅ **Context-aware** - Modal/input detection  
✅ **Beautiful UI** - VSCode-style command palette  
✅ **Feature isolation** - Each feature manages its shortcuts  
✅ **Easy integration** - Simple hook-based API  
✅ **Performant** - Minimal bundle impact  
✅ **Tested** - Unit test examples included  

**Next Step**: Execute `/spec:execute` to generate all files.
