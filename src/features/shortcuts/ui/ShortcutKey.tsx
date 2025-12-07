/**
 * Shortcut Key Component
 * Display keyboard shortcut keys as badges
 */

import React from 'react'
import { parseKeyCombo } from '../model/keyDetection'
import { formatKeyName } from '../utils/keyFormatter'
import { cn } from '@/shared/utils/cn'

interface ShortcutKeyProps {
  combo: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ShortcutKey({ combo, size = 'md', className }: ShortcutKeyProps) {
  const { modifiers, key } = parseKeyCombo(combo)
  const parts = [...modifiers, key].filter(Boolean)

  const sizeClasses = {
    sm: 'text-[10px] px-1 py-0.5 min-w-[20px]',
    md: 'text-xs px-1.5 py-1 min-w-[24px]',
    lg: 'text-sm px-2 py-1.5 min-w-[32px]',
  }

  if (parts.length === 0) {
    return null
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
