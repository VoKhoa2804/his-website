# Keyboard Shortcuts Migration Guide

This guide helps you add keyboard shortcuts to existing features in the project.

## Prerequisites

The global shortcuts system is already set up:
- ✅ `GlobalShortcutProvider` integrated in `main.tsx`
- ✅ Core shortcut infrastructure in `src/features/shortcuts/`
- ✅ Example implementations in `work-shift` and `auth` features

## Migration Steps

### Step 1: Create Shortcuts Configuration

Create a `config/shortcuts.ts` file in your feature folder:

```bash
# Example for a "products" feature
touch src/features/products/config/shortcuts.ts
```

Define your shortcuts:

```tsx
// src/features/products/config/shortcuts.ts
import type { ShortcutDefinition } from '@/features/shortcuts'

export const productShortcuts: ShortcutDefinition[] = [
  {
    id: 'products.create',
    keys: 'ctrl+n',
    description: 'Create new product',
    category: 'Products',
    isGlobal: false
  },
  {
    id: 'products.search',
    keys: 'F2',
    description: 'Focus search',
    category: 'Products',
    isGlobal: false
  },
  {
    id: 'products.edit',
    keys: 'ctrl+e',
    description: 'Edit selected product',
    category: 'Products',
    isGlobal: false
  },
  {
    id: 'products.delete',
    keys: 'ctrl+d',
    description: 'Delete selected product',
    category: 'Products',
    isGlobal: false
  },
  {
    id: 'products.refresh',
    keys: 'ctrl+r',
    description: 'Refresh product list',
    category: 'Products',
    isGlobal: false
  }
]
```

### Step 2: Update Your Component

Import the necessary hooks and config:

```tsx
// Before
import { useState, useEffect } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // ... existing code
}
```

```tsx
// After
import { useState, useEffect, useRef } from 'react'
import { useShortcuts } from '@/features/shortcuts'
import { productShortcuts } from '../config/shortcuts'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Add refs for DOM elements you want to interact with
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // ... existing code
}
```

### Step 3: Add Shortcut Handlers

Add callback functions for each shortcut:

```tsx
export function ProductList() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Existing handlers or create new ones
  const handleCreate = () => {
    navigate('/products/create')
  }

  const handleEdit = () => {
    if (selectedId) {
      navigate(`/products/edit/${selectedId}`)
    }
  }

  const handleDelete = () => {
    if (selectedId && confirm('Delete this product?')) {
      deleteProduct(selectedId)
    }
  }

  const handleRefresh = () => {
    fetchProducts()
  }

  const handleSearch = () => {
    searchInputRef.current?.focus()
  }

  // ... rest of component
}
```

### Step 4: Register Shortcuts

Map shortcuts to handlers using the `useShortcuts` hook:

```tsx
export function ProductList() {
  // ... state and handlers from above

  // Register shortcuts
  useShortcuts(
    productShortcuts.map(shortcut => ({
      ...shortcut,
      callback: () => {
        switch (shortcut.id) {
          case 'products.create':
            handleCreate()
            break
          case 'products.search':
            handleSearch()
            break
          case 'products.edit':
            handleEdit()
            break
          case 'products.delete':
            handleDelete()
            break
          case 'products.refresh':
            handleRefresh()
            break
        }
      },
      // Conditionally enable shortcuts based on state
      enabled: 
        shortcut.id === 'products.edit' || shortcut.id === 'products.delete'
          ? !!selectedId
          : true
    }))
  )

  return (
    <div>
      <input ref={searchInputRef} placeholder="Search products..." />
      {/* ... rest of JSX */}
    </div>
  )
}
```

### Step 5: Update Refs in JSX

Make sure DOM elements you want to interact with have refs:

```tsx
// Before
<input placeholder="Search products..." />

// After
<input ref={searchInputRef} placeholder="Search products..." />
```

### Step 6: Export Configuration (Optional)

If you want other features to see your shortcuts, export from your feature index:

```tsx
// src/features/products/index.ts
export * from './api/productApi'
export * from './model/product.types'
export * from './config/shortcuts'  // Add this
```

## Real-World Examples

### Example 1: Work Shift Feature (Simple)

**Before migration:**
```tsx
// src/features/work-shift/ui/WorkShiftListPage.tsx
export function WorkShiftListPage() {
  const navigate = useNavigate()
  
  return (
    <div>
      <Button onClick={() => navigate('/ca-lam-viec/tao-moi')}>
        Create
      </Button>
      {/* ... */}
    </div>
  )
}
```

**After migration:**
```tsx
import { useShortcuts } from '@/features/shortcuts'
import { workShiftShortcuts } from '../config/shortcuts'

export function WorkShiftListPage() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useShortcuts(
    workShiftShortcuts.map(shortcut => ({
      ...shortcut,
      callback: () => {
        switch (shortcut.id) {
          case 'work-shift.create':
            navigate('/ca-lam-viec/tao-moi')
            break
          case 'work-shift.search':
            searchInputRef.current?.focus()
            break
          // ... other cases
        }
      }
    }))
  )

  return (
    <div>
      <input ref={searchInputRef} placeholder="Search..." />
      <Button onClick={() => navigate('/ca-lam-viec/tao-moi')}>
        Create (Ctrl+N)
      </Button>
    </div>
  )
}
```

### Example 2: Auth Feature (Form Submission)

**Before migration:**
```tsx
// src/features/auth/login.tsx
export function LoginPage() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" />
      <button type="submit">Login</button>
    </form>
  )
}
```

**After migration:**
```tsx
import { useShortcuts } from '@/features/shortcuts'
import { authShortcuts } from '../config/shortcuts'

export function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  useShortcuts(
    authShortcuts.map(shortcut => ({
      ...shortcut,
      callback: () => {
        switch (shortcut.id) {
          case 'auth.logout':
            navigate('/')
            break
          case 'auth.login':
            formRef.current?.requestSubmit()
            break
        }
      }
    }))
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" />
      <button type="submit">Login (Enter)</button>
    </form>
  )
}
```

## Common Migration Patterns

### Pattern 1: CRUD Operations

```tsx
// config/shortcuts.ts
export const crudShortcuts: ShortcutDefinition[] = [
  { id: 'feature.create', keys: 'ctrl+n', description: 'Create new', category: 'Feature' },
  { id: 'feature.edit', keys: 'ctrl+e', description: 'Edit selected', category: 'Feature' },
  { id: 'feature.delete', keys: 'ctrl+d', description: 'Delete selected', category: 'Feature' },
  { id: 'feature.refresh', keys: 'ctrl+r', description: 'Refresh list', category: 'Feature' }
]

// Component
useShortcuts(
  crudShortcuts.map(s => ({
    ...s,
    callback: () => {
      const actions = {
        'feature.create': handleCreate,
        'feature.edit': handleEdit,
        'feature.delete': handleDelete,
        'feature.refresh': handleRefresh
      }
      actions[s.id]?.()
    },
    enabled: ['feature.edit', 'feature.delete'].includes(s.id) ? !!selectedId : true
  }))
)
```

### Pattern 2: Focus Management

```tsx
// config/shortcuts.ts
export const focusShortcuts: ShortcutDefinition[] = [
  { id: 'feature.search', keys: 'F2', description: 'Focus search', category: 'Feature' },
  { id: 'feature.filter', keys: 'F3', description: 'Focus filter', category: 'Feature' },
  { id: 'feature.clear', keys: 'escape', description: 'Clear search', category: 'Feature' }
]

// Component
const searchRef = useRef<HTMLInputElement>(null)
const filterRef = useRef<HTMLSelectElement>(null)

useShortcuts(
  focusShortcuts.map(s => ({
    ...s,
    callback: () => {
      switch (s.id) {
        case 'feature.search':
          searchRef.current?.focus()
          break
        case 'feature.filter':
          filterRef.current?.focus()
          break
        case 'feature.clear':
          if (searchRef.current) searchRef.current.value = ''
          break
      }
    }
  }))
)
```

### Pattern 3: Navigation

```tsx
// config/shortcuts.ts
export const navShortcuts: ShortcutDefinition[] = [
  { id: 'nav.home', keys: 'ctrl+shift+h', description: 'Go home', category: 'Navigation' },
  { id: 'nav.back', keys: 'alt+arrowleft', description: 'Go back', category: 'Navigation' }
]

// Component
const navigate = useNavigate()

useShortcuts(
  navShortcuts.map(s => ({
    ...s,
    callback: () => {
      if (s.id === 'nav.home') navigate('/')
      if (s.id === 'nav.back') navigate(-1)
    }
  }))
)
```

### Pattern 4: Modal Actions

```tsx
// config/shortcuts.ts
export const modalShortcuts: ShortcutDefinition[] = [
  { 
    id: 'modal.save', 
    keys: 'ctrl+s', 
    description: 'Save', 
    category: 'Modal',
    context: 'modal'  // Only works in modals
  },
  { 
    id: 'modal.cancel', 
    keys: 'escape', 
    description: 'Cancel', 
    category: 'Modal',
    context: 'modal'
  }
]

// Component
export function EditModal({ onSave, onCancel }: Props) {
  useShortcuts(
    modalShortcuts.map(s => ({
      ...s,
      callback: s.id === 'modal.save' ? onSave : onCancel
    }))
  )
  
  return <Dialog>...</Dialog>
}
```

## Checklist

Use this checklist when migrating a feature:

- [ ] Created `config/shortcuts.ts` with shortcut definitions
- [ ] Imported `useShortcuts` hook in component
- [ ] Added necessary `useRef` hooks for DOM elements
- [ ] Created handler functions for each shortcut
- [ ] Registered shortcuts with `useShortcuts` hook
- [ ] Added refs to JSX elements (inputs, buttons, etc.)
- [ ] Tested shortcuts work as expected
- [ ] Verified no conflicts with existing shortcuts (`Ctrl+Shift+P`)
- [ ] Updated button labels to show shortcuts (optional, e.g., "Create (Ctrl+N)")
- [ ] Exported shortcuts config from feature index (optional)

## Tips

1. **Start small**: Migrate 2-3 common actions first (create, search, refresh)
2. **Test frequently**: Press `Ctrl+Shift+P` after each shortcut to verify
3. **Avoid browser conflicts**: Don't use `Ctrl+T`, `Ctrl+W`, `Ctrl+N` (browser tabs)
4. **Use function keys**: `F1-F12` are safe and memorable
5. **Be consistent**: Use same keys across features (e.g., `Ctrl+N` always creates)
6. **Add visual cues**: Update button text to show shortcuts: "Create (Ctrl+N)"

## Common Issues

### Issue: Shortcut doesn't work

**Solution:** Check these in order:
1. Is the component mounted?
2. Is the shortcut enabled? (check `enabled` property)
3. Is there a conflict? (press `Ctrl+Shift+P` to check)
4. Is the callback function correct?
5. Add `console.log` in callback to verify it fires

### Issue: Ref is null/undefined

**Solution:**
```tsx
// ❌ Bad
useShortcut({
  keys: 'F2',
  callback: () => inputRef.current.focus() // Might be null!
})

// ✅ Good
useShortcut({
  keys: 'F2',
  callback: () => inputRef.current?.focus() // Safe with optional chaining
})
```

### Issue: Callback uses stale state

**Solution:** Always use refs for DOM elements:
```tsx
// ❌ Bad - stale closure
const [selectedId, setSelectedId] = useState(null)
useShortcut({
  keys: 'ctrl+e',
  callback: () => edit(selectedId) // selectedId might be stale
})

// ✅ Good - use ref
const selectedIdRef = useRef(null)
useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

useShortcut({
  keys: 'ctrl+e',
  callback: () => edit(selectedIdRef.current)
})
```

### Issue: Shortcut fires in wrong context

**Solution:** Use the `context` property:
```tsx
// Only in modals
{
  id: 'modal.save',
  keys: 'ctrl+s',
  context: 'modal'
}

// Only outside modals (default)
{
  id: 'page.save',
  keys: 'ctrl+s',
  context: 'default'
}
```

## Need Help?

- See [SHORTCUTS_USAGE_GUIDE.md](./SHORTCUTS_USAGE_GUIDE.md) for API reference
- See [GLOBAL_SHORTCUT_SPEC.md](./GLOBAL_SHORTCUT_SPEC.md) for architecture details
- Check existing implementations:
  - `src/features/work-shift/ui/WorkShiftListPage.tsx`
  - `src/features/auth/login.tsx`
  - `src/features/shortcuts/config/globalShortcuts.ts`
