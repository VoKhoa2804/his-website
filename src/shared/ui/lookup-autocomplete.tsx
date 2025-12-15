import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode, type CSSProperties } from 'react'
import ReactDOM from 'react-dom'
import { cn } from '@/shared/utils/cn'
import { ChevronDown, Loader2 } from 'lucide-react'

type DisplayColumn = {
  headerName?: string
  field: string
  width?: number | string
  Visible?: boolean
  isSearch?: boolean
}

type LookupItem = Record<string, any>

export type LookupValue = {
  id: string
  name: string
  item?: LookupItem | null
}

type ResponseMapperFn = (json: any) => LookupItem[]

export interface LookupAutocompleteProps {
  api?: string
  localData?: LookupItem[]
  useLocalAll?: boolean
  cacheKey?: string
  cacheTtlSec?: number
  minChars?: number
  delay?: number
  take?: number
  placeholder?: string

  onSelect?: (value: LookupValue) => void
  onChange?: (value: LookupValue) => void
  onFetchData?: (query: string) => Promise<LookupItem[]>

  renderItem?: (item: LookupItem, query: string) => ReactNode
  displayFields?: string[]
  displayColumns?: DisplayColumn[]
  searchFields?: string[]

  fetchOptions?: RequestInit
  refreshUrl?: string
  responseMapper?: ResponseMapperFn | string | null

  toggleButton?: boolean
  popupAppendToBody?: boolean
  showBorders?: boolean
  showHeader?: boolean

  popupWidth?: number | string
  popupMinWidth?: number | string
  popupMaxHeight?: number | string

  className?: string
  inputClassName?: string

  initialId?: string
  initialName?: string
  showAllOnEmpty?: boolean
  emptyResultLimit?: number
}

// ===== Utility Functions =====

function normalizeStr(s: any): string {
  if (!s) return ''
  s = String(s)
  const from =
    'ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶáàảãạâấầẩẫậăắằẳẵặÉÈẺẼẸÊẾỀỂỄỆéèẻẽẹêếềểễệÍÌỈĨỊíìỉĩịÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢóòỏõọôốồổỗộơớờởỡợÚÙỦŨỤƯỨỪỬỮỰúùủũụưứừửữựÝỲỶỸỴýỳỷỹỵĐđ'
  const to =
    'AAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaEEEEEEEEEEEEeeeeeeeeeeeeIIIIIIiiiiiiOOOOOOOOOOOOOOOOoooooooooooooUUUUUUUUUUuuuuuuuuuuYYYYYyyyyyDd'
  let res = s
  for (let i = 0; i < from.length; i++) {
    res = res.replace(new RegExp(from[i], 'g'), to[i])
  }
  return res.toLowerCase()
}

function debounce<T extends (...a: any[]) => void>(fn: T, wait: number) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

function localFilter(
  data: LookupItem[],
  q: string,
  maxItems: number,
  searchFields?: string[] | null,
  displayColumns?: DisplayColumn[] | null,
): LookupItem[] {
  if (!data || !Array.isArray(data)) return []
  if (!q) return data.slice(0, maxItems)
  const nq = normalizeStr(q)
  const res: LookupItem[] = []

  let sf: string[] = Array.isArray(searchFields) && searchFields.length ? [...searchFields] : []

  if (Array.isArray(displayColumns) && displayColumns.length) {
    displayColumns.forEach((c) => {
      if (c && c.isSearch !== false && c.Visible !== false && !sf.includes(c.field)) {
        sf.push(c.field)
      }
    })
  }

  for (let i = 0; i < data.length; i++) {
    const it = data[i]
    if (it.__q && it.__q.indexOf(nq) !== -1) {
      res.push(it)
    } else {
      let combined = ''
      if (sf.length) {
        sf.forEach((k) => {
          combined += ' ' + (it[k] || '')
        })
      } else {
        Object.keys(it).forEach((k) => {
          if (k !== '__q') combined += ' ' + (it[k] || '')
        })
      }
      if (normalizeStr(combined).indexOf(nq) !== -1) res.push(it)
    }
    if (res.length >= (maxItems || 100)) break
  }
  return res
}

function highlightText(text: string, q: string): ReactNode {
  if (!q) return text
  const src = text || ''
  const lower = src.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  if (idx === -1) return text
  const before = src.slice(0, idx)
  const mid = src.slice(idx, idx + q.length)
  const after = src.slice(idx + q.length)
  return (
    <>
      {before}
      <mark className="bg-yellow-200 text-black px-0.5">{mid}</mark>
      {after}
    </>
  )
}

function getFieldValue(obj: LookupItem, key: string): any {
  if (!obj) return ''
  if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  const camel = key.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase())
  if (obj[camel] !== undefined && obj[camel] !== null) return obj[camel]
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
  if (obj[pascal] !== undefined && obj[pascal] !== null) return obj[pascal]
  return ''
}

function defaultRenderItemWithColumns(
  item: LookupItem,
  q: string,
  displayColumns?: DisplayColumn[] | null,
): ReactNode {
  const cols: DisplayColumn[] =
    Array.isArray(displayColumns) && displayColumns.length
      ? displayColumns.filter((c) => c.Visible !== false)
      : [
          { headerName: 'ID', field: 'id', width: 15 },
          { headerName: 'Tên', field: 'ten', width: 70 },
          { headerName: 'Nhóm', field: 'nhom', width: 15 },
        ]
  const total = cols.length || 1

  return (
    <div className="flex items-center w-full">
      {cols.map((c, idx) => {
        const raw = getFieldValue(item, c.field)
        const text = String(raw ?? '')
        const width = c.width
          ? isFinite(Number(c.width))
            ? `${c.width}%`
            : String(c.width)
          : `${100 / total}%`

        const content = idx === 0 ? highlightText(text, q) : highlightText(text, q)

        return (
          <div
            key={idx}
            className="overflow-hidden text-ellipsis whitespace-nowrap px-2"
            style={{ width, flexShrink: 0 }}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}

export const LookupAutocomplete: React.FC<LookupAutocompleteProps> = (props) => {
  const {
    localData,
    minChars = 0,
    delay = 180,
    take = 100,
    placeholder = '',
    onSelect,
    onChange,
    onFetchData,
    renderItem,
    displayColumns,
    searchFields,
    toggleButton = true,
    popupAppendToBody = false,
    showBorders = false,
    showHeader = false,
    popupWidth,
    popupMinWidth,
    popupMaxHeight = '360px',
    className,
    inputClassName,
    initialId,
    initialName,
    showAllOnEmpty = false,
    emptyResultLimit = 50,
  } = props

  const [inputValue, setInputValue] = useState<string>(initialName || '')
  const [selectedId, setSelectedId] = useState<string>(initialId || '')
  const [items, setItems] = useState<LookupItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!open) return
    if (!popupAppendToBody) {
      if (!wrapperRef.current || !popupRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const style: CSSProperties = {}
      if (popupWidth) {
        style.width = typeof popupWidth === 'number' ? `${popupWidth}px` : popupWidth
      } else if (popupMinWidth) {
        style.minWidth = typeof popupMinWidth === 'number' ? `${popupMinWidth}px` : popupMinWidth
      } else {
        style.minWidth = `${rect.width}px`
      }
      style.maxHeight = typeof popupMaxHeight === 'number' ? `${popupMaxHeight}px` : popupMaxHeight
      setPopupStyle(style)
      return
    }

    if (!inputRef.current || !popupRef.current) return
    const rect = inputRef.current.getBoundingClientRect()
    const scrollX = window.scrollX || window.pageXOffset
    const scrollY = window.scrollY || window.pageYOffset
    const left = rect.left + scrollX
    const top = rect.bottom + scrollY + 6

    const style: CSSProperties = {
      position: 'absolute',
      left,
      top,
      zIndex: 99999,
      maxHeight: typeof popupMaxHeight === 'number' ? `${popupMaxHeight}px` : popupMaxHeight,
    }

    if (popupWidth) {
      style.width = typeof popupWidth === 'number' ? `${popupWidth}px` : popupWidth
    } else if (popupMinWidth) {
      style.minWidth = typeof popupMinWidth === 'number' ? `${popupMinWidth}px` : popupMinWidth
    } else {
      style.minWidth = `${rect.width}px`
    }

    setPopupStyle(style)
  }, [open, popupAppendToBody, popupWidth, popupMinWidth, popupMaxHeight])

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      const target = ev.target as Node
      if (
        wrapperRef.current &&
        (wrapperRef.current.contains(target) ||
          (popupAppendToBody && popupRef.current && popupRef.current.contains(target)))
      ) {
        return
      }
      setOpen(false)
      setActiveIndex(-1)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [popupAppendToBody])

  const doFetchData = useCallback(async (q: string, limitOverride?: number) => {
    try {
      setLoading(true)
      const maxItems = limitOverride ?? take

      // Priority 1: Use custom fetch function
      if (onFetchData) {
        const data = await onFetchData(q)
        const dataArray = Array.isArray(data) ? data : []
        // Apply local filtering to the fetched data
        const filtered = localFilter(dataArray, q, maxItems, searchFields, displayColumns)
        setItems(filtered)
        setOpen(true)
        return
      }

      // Priority 2: Use local data with filtering
      if (Array.isArray(localData)) {
        const filtered = localFilter(localData, q, maxItems, searchFields, displayColumns)
        setItems(filtered)
        setOpen(true)
        return
      }

      setItems([])
    } catch (err) {
      console.error('Fetch error:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [onFetchData, localData, take, searchFields, displayColumns])

  const debouncedFetchRef = useRef(
    debounce((q: string) => {
      const trimmed = q.trim()
      if (trimmed.length < minChars) {
        if (showAllOnEmpty && trimmed.length === 0) {
          doFetchData('', emptyResultLimit)
        } else {
          setItems([])
          setOpen(false)
        }
        return
      }
      doFetchData(q)
    }, delay),
  )

  useEffect(() => {
    debouncedFetchRef.current = debounce((q: string) => {
      const trimmed = q.trim()
      if (trimmed.length < minChars) {
        if (showAllOnEmpty && trimmed.length === 0) {
          doFetchData('', emptyResultLimit)
        } else {
          setItems([])
          setOpen(false)
        }
        return
      }
      doFetchData(q)
    }, delay)
  }, [doFetchData, minChars, delay, showAllOnEmpty, emptyResultLimit])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)
    if (showAllOnEmpty && v.trim().length === 0) {
      doFetchData('', emptyResultLimit)
      return
    }
    debouncedFetchRef.current(v)
  }

  const chooseItem = (idx: number) => {
    const it = items[idx]
    if (!it) return
    const code = (it.id ?? it.Id ?? it.ma ?? it.code ?? it.Code ?? '') as string
    const name = (it.ten ?? it.Ten ?? it.name ?? it.Name ?? '') as string

    setSelectedId(code)
    setInputValue(name)
    setOpen(false)
    setActiveIndex(idx)

    const value: LookupValue = { id: code, name, item: it }
    onSelect?.(value)
    onChange?.(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < items.length) {
        chooseItem(activeIndex)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleFocus = () => {
    const trimmed = (inputValue || '').trim()
    if (trimmed.length === 0) {
      if (showAllOnEmpty) {
        doFetchData('', emptyResultLimit)
      } else if (minChars === 0) {
        debouncedFetchRef.current('')
      }
      return
    }
    if (trimmed.length >= minChars || minChars === 0) {
      debouncedFetchRef.current(inputValue)
    }
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
      return
    }
    inputRef.current?.focus()
    if (showAllOnEmpty && (inputValue || '').trim().length === 0) {
      doFetchData('', emptyResultLimit)
    } else {
      debouncedFetchRef.current('')
    }
  }

  const renderHeader = () => {
    if (!showHeader) return null
    const cols =
      Array.isArray(displayColumns) && displayColumns.length
        ? displayColumns.filter((c) => c.Visible !== false)
        : null

    if (!cols || !cols.length) return null

    const total = cols.length || 1

    return (
      <div className="flex items-center w-full bg-muted border-b font-semibold text-sm">
        {cols.map((c, idx) => {
          const width = c.width
            ? isFinite(Number(c.width))
              ? `${c.width}%`
              : String(c.width)
            : `${100 / total}%`

          return (
            <div
              key={idx}
              className="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1.5"
              style={{ width, flexShrink: 0 }}
            >
              {c.headerName || c.field}
            </div>
          )
        })}
      </div>
    )
  }

  const renderPopupContent = () => {
    // Calculate height for exactly 5 items (each item ~40px + padding)
    const itemHeight = 40
    const maxVisibleItems = 5
    const calculatedMaxHeight = itemHeight * maxVisibleItems
    
    return (
      <div
        ref={popupRef}
        className={cn(
          'bg-background border rounded-md shadow-lg overflow-hidden',
          !popupAppendToBody && 'absolute left-0 top-full mt-1.5 z-50'
        )}
        style={popupStyle}
      >
        {renderHeader()}
        <div className="overflow-y-auto" style={{ maxHeight: `${calculatedMaxHeight}px` }}>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">Không có dữ liệu</div>
          )}
          {!loading &&
            items.length > 0 &&
            items.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <div
                  key={idx}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground',
                    showBorders && 'border-b last:border-b-0'
                  )}
                  onClick={() => chooseItem(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="py-2 text-sm">
                    {renderItem
                      ? renderItem(item, inputValue)
                      : defaultRenderItemWithColumns(item, inputValue, displayColumns)}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  const popupElement = popupAppendToBody
    ? ReactDOM.createPortal(renderPopupContent(), document.body)
    : renderPopupContent()

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            toggleButton && 'pr-10',
            inputClassName
          )}
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        {toggleButton && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleToggleClick}
            tabIndex={-1}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && popupElement}
    </div>
  )
}
