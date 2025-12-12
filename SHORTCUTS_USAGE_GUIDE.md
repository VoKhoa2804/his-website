# Keyboard Shortcuts Usage Guide

This guide explains how to use and extend the global keyboard shortcut system in your features.

## Overview

The keyboard shortcut system provides:
- **Centralized Management**: All shortcuts registered in one place
- **OS-Aware Rendering**: Shows ⌘ on macOS, Ctrl on Windows/Linux
- **Context Awareness**: Different shortcuts in modals vs main app
- **Conflict Detection**: Warns when shortcuts overlap
- **Command Palette**: Press `Ctrl+Shift+P` or `F1` to see all shortcuts
- **Automatic Cleanup**: Shortcuts auto-unregister when components unmount

## Quick Start

### 1. Register Shortcuts in Your Feature

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export function MyFeature() {
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  useShortcuts([
    {
      id: 'my-feature.action',
      keys: 'ctrl+n',
      description: 'Create new item',
      callback: () => {
        console.log('Creating new item...')
        // Your action here
      },
      category: 'My Feature'
    },
    {
      id: 'my-feature.focus-button',
      keys: 'ctrl+b',
      description: 'Focus the button',
      callback: () => {
        buttonRef.current?.focus()
      },
      category: 'My Feature'
    }
  ])

  return (
    <div>
      <button ref={buttonRef}>My Button</button>
    </div>
  )
}
```

### 2. Use Configuration Files (Recommended)

Create a `shortcuts.ts` config file in your feature:

```tsx
// src/features/my-feature/config/shortcuts.ts
import type { ShortcutDefinition } from '@/features/shortcuts'

export const myFeatureShortcuts: ShortcutDefinition[] = [
  {
    id: 'my-feature.create',
    keys: 'ctrl+n',
    description: 'Create new item',
    category: 'My Feature',
    isGlobal: false
  },
  {
    id: 'my-feature.search',
    keys: 'ctrl+f',
    description: 'Search items',
    category: 'My Feature',
    isGlobal: false
  }
]
```

Then use it in your component:

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { myFeatureShortcuts } from '../config/shortcuts'

export function MyFeature() {
  const handleCreate = () => { /* ... */ }
  const handleSearch = () => { /* ... */ }

  useShortcuts(
    myFeatureShortcuts.map(shortcut => ({
      ...shortcut,
      callback: shortcut.id === 'my-feature.create' ? handleCreate : handleSearch
    }))
  )

  return <div>...</div>
}
```

## API Reference

### `useShortcuts` Hook

Register multiple shortcuts at once:

```tsx
useShortcuts([
  {
    id: 'unique-id',           // Unique identifier (required)
    keys: 'ctrl+k',            // Key combination (required)
    description: 'Action',     // Description for help modal (required)
    callback: () => {},        // Function to execute (required)
    category: 'Category',      // Group in help modal (optional)
    isGlobal: false,           // Works everywhere? (optional, default: false)
    context: 'default',        // 'default' | 'modal' (optional)
    enabled: true,             // Enable/disable (optional, default: true)
    preventDefault: true,      // Prevent browser default? (optional, default: true)
    stopPropagation: true      // Stop event bubbling? (optional, default: true)
  }
])
```

### `useShortcut` Hook

Register a single shortcut:

```tsx
useShortcut({
  id: 'my-action',
  keys: 'ctrl+s',
  description: 'Save',
  callback: () => console.log('Saved!'),
  category: 'General'
})
```

### Key Syntax

| Format | Example | Description |
|--------|---------|-------------|
| Single key | `'s'` | Just the S key |
| With modifier | `'ctrl+s'` | Ctrl/⌘ + S |
| Multiple modifiers | `'ctrl+shift+p'` | Ctrl + Shift + P |
| Function key | `'F1'` | Function key F1 |
| Special keys | `'escape'`, `'enter'`, `'space'`, `'tab'` | Special keys |
| Arrow keys | `'arrowup'`, `'arrowdown'`, `'arrowleft'`, `'arrowright'` | Navigation |

**Available Modifiers:**
- `ctrl` - Control key (auto-converts to ⌘ on macOS)
- `alt` - Alt/Option key
- `shift` - Shift key
- `meta` - Windows/⌘ key (use `ctrl` instead for cross-platform)

**Function Keys:** `F1` through `F12`

## Examples

### Example 1: CRUD Operations

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { useState } from 'react'

export function ItemList() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useShortcuts([
    {
      id: 'items.create',
      keys: 'ctrl+n',
      description: 'Create new item',
      callback: () => openCreateModal(),
      category: 'Items'
    },
    {
      id: 'items.edit',
      keys: 'ctrl+e',
      description: 'Edit selected item',
      callback: () => {
        if (selectedId) openEditModal(selectedId)
      },
      category: 'Items',
      enabled: !!selectedId // Only enabled when item selected
    },
    {
      id: 'items.delete',
      keys: 'ctrl+d',
      description: 'Delete selected item',
      callback: () => {
        if (selectedId && confirm('Delete?')) deleteItem(selectedId)
      },
      category: 'Items',
      enabled: !!selectedId
    },
    {
      id: 'items.refresh',
      keys: 'ctrl+r',
      description: 'Refresh list',
      callback: () => refreshItems(),
      category: 'Items',
      preventDefault: true // Prevent browser refresh
    }
  ])

  return <div>...</div>
}
```

### Example 2: Focus Management

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { useRef } from 'react'

export function SearchForm() {
  const searchRef = useRef<HTMLInputElement>(null)
  const filterRef = useRef<HTMLSelectElement>(null)

  useShortcuts([
    {
      id: 'search.focus-input',
      keys: 'F2',
      description: 'Focus search input',
      callback: () => searchRef.current?.focus(),
      category: 'Search'
    },
    {
      id: 'search.focus-filter',
      keys: 'F3',
      description: 'Focus filter dropdown',
      callback: () => filterRef.current?.focus(),
      category: 'Search'
    },
    {
      id: 'search.clear',
      keys: 'escape',
      description: 'Clear search',
      callback: () => {
        if (searchRef.current) searchRef.current.value = ''
      },
      category: 'Search'
    }
  ])

  return (
    <>
      <input ref={searchRef} placeholder="Search..." />
      <select ref={filterRef}>...</select>
    </>
  )
}
```

### Example 3: Modal-Specific Shortcuts

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { Dialog } from '@/shared/ui/dialog'

export function EditModal({ onSave, onCancel }: Props) {
  useShortcuts([
    {
      id: 'modal.save',
      keys: 'ctrl+s',
      description: 'Save changes',
      callback: () => onSave(),
      category: 'Modal',
      context: 'modal' // Only works when modal is open
    },
    {
      id: 'modal.cancel',
      keys: 'escape',
      description: 'Cancel and close',
      callback: () => onCancel(),
      category: 'Modal',
      context: 'modal'
    }
  ])

  return (
    <Dialog>
      {/* Modal content */}
    </Dialog>
  )
}
```

### Example 4: Navigation Shortcuts

```tsx
import { useShortcuts } from '@/features/shortcuts'
import { useNavigate } from 'react-router-dom'

export function Navigation() {
  const navigate = useNavigate()

  useShortcuts([
    {
      id: 'nav.home',
      keys: 'ctrl+shift+h',
      description: 'Go to home',
      callback: () => navigate('/'),
      category: 'Navigation',
      isGlobal: true // Works from anywhere
    },
    {
      id: 'nav.settings',
      keys: 'ctrl+,',
      description: 'Open settings',
      callback: () => navigate('/settings'),
      category: 'Navigation',
      isGlobal: true
    },
    {
      id: 'nav.back',
      keys: 'alt+arrowleft',
      description: 'Go back',
      callback: () => navigate(-1),
      category: 'Navigation',
      isGlobal: true
    }
  ])

  return null
}
```

## Best Practices

### 1. Use Configuration Files
Keep shortcuts in `config/shortcuts.ts` files for easy discovery and updates.

### 2. Choose Non-Conflicting Keys
- Avoid browser shortcuts (`Ctrl+T`, `Ctrl+W`, `Ctrl+N` in browsers)
- Check existing shortcuts with `Ctrl+Shift+P`
- Use function keys (`F1-F12`) for common actions

### 3. Use Refs for DOM Actions
Always use refs when focusing elements to avoid stale closures:

```tsx
const inputRef = useRef<HTMLInputElement>(null)

useShortcut({
  keys: 'F2',
  callback: () => inputRef.current?.focus() // ✅ Good
  // NOT: callback: () => document.getElementById('input')?.focus() // ❌ Bad
})
```

### 4. Add Meaningful Descriptions
Descriptions show in the command palette - make them clear:

```tsx
description: 'Create new item'     // ✅ Good
description: 'Create'              // ❌ Too vague
description: 'Ctrl+N to create'    // ❌ Don't include keys
```

### 5. Use Categories
Group related shortcuts for better organization:

```tsx
category: 'Work Shifts'   // ✅ Good - specific
category: 'General'       // ⚠️ OK for global actions
category: ''              // ❌ Avoid empty categories
```

### 6. Disable When Appropriate
Conditionally enable shortcuts based on state:

```tsx
{
  keys: 'ctrl+e',
  callback: () => edit(selectedItem),
  enabled: !!selectedItem  // Only enabled when item selected
}
```

## Built-in Global Shortcuts

These shortcuts are always available:

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Show command palette / all shortcuts |
| `F1` | Show command palette |
| `Ctrl+K` | Quick command palette |
| `Ctrl+S` | Save (if implemented) |
| `Escape` | Close modals |

## Troubleshooting

### Shortcut Not Working

1. **Check for conflicts**: Press `Ctrl+Shift+P` and search for your shortcut
2. **Verify callback**: Add `console.log` in your callback
3. **Check context**: Is it `modal` but you're not in a modal?
4. **Check enabled state**: Is `enabled: false`?

### Shortcut Conflicts

The system detects conflicts. If you see a warning:
1. Check the command palette (`Ctrl+Shift+P`)
2. Find both conflicting shortcuts
3. Change one to a different key combination

### Component Unmounts But Shortcut Persists

This shouldn't happen - shortcuts auto-cleanup. If it does:
1. Check that you're using the hook correctly
2. Verify the component is actually unmounting
3. File a bug report

## Advanced Usage

### Dynamic Shortcuts

```tsx
const [mode, setMode] = useState<'view' | 'edit'>('view')

useShortcuts([
  {
    id: 'dynamic.action',
    keys: 'ctrl+e',
    description: mode === 'view' ? 'Edit' : 'Save',
    callback: () => {
      if (mode === 'view') {
        setMode('edit')
      } else {
        saveChanges()
        setMode('view')
      }
    }
  }
])
```

### Programmatic Access

```tsx
import { useShortcutContext } from '@/features/shortcuts'

function MyComponent() {
  const { getAllShortcuts, showHelp } = useShortcutContext()

  const showMyShortcuts = () => {
    const all = getAllShortcuts()
    console.log('All shortcuts:', all)
  }

  return (
    <button onClick={showHelp}>
      Show Shortcuts
    </button>
  )
}
```

## See Also

- [GLOBAL_SHORTCUT_SPEC.md](./GLOBAL_SHORTCUT_SPEC.md) - Full technical specification
- [SHORTCUTS_MIGRATION_GUIDE.md](./SHORTCUTS_MIGRATION_GUIDE.md) - Migrate existing features
- [Work Shift Example](./src/features/work-shift/ui/WorkShiftListPage.tsx) - Real implementation
- [Auth Example](./src/features/auth/login.tsx) - Login shortcuts example
