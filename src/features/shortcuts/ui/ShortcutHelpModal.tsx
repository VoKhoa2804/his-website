/**
 * Shortcut Help Modal
 * Command palette showing all keyboard shortcuts
 */

import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useShortcutContext } from './GlobalShortcutProvider'
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
            autoFocus
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
                        <p className="text-sm font-medium">
                          {shortcut.description}
                        </p>
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
