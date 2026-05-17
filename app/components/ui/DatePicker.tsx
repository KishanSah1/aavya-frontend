'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface DatePickerProps {
  value: string           // YYYY-MM-DD or ''
  onChange: (value: string) => void
  placeholder?: string
  minDate?: string        // YYYY-MM-DD
  className?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseLocal(dateStr: string): Date | null {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function toYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplay(dateStr: string): string {
  const d = parseLocal(dateStr)
  if (!d) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  minDate,
  className = '',
}: DatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDate = parseLocal(value)
  const minDateObj = parseLocal(minDate ?? '') ?? null

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())

  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Sync view when value changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear())
      setViewMonth(selectedDate.getMonth())
    }
  }, [value])

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11 }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0 }
      return m + 1
    })
  }, [])

  function selectDay(date: Date) {
    onChange(toYMD(date))
    setOpen(false)
  }

  function handleClear() {
    onChange('')
    setOpen(false)
  }

  function handleToday() {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    onChange(toYMD(t))
    setViewYear(t.getFullYear())
    setViewMonth(t.getMonth())
    setOpen(false)
  }

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const totalDays = daysInMonth(viewYear, viewMonth)
  const prevMonthDays = daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1)

  const cells: { date: Date; current: boolean }[] = []

  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = viewMonth === 0
      ? new Date(viewYear - 1, 11, prevMonthDays - i)
      : new Date(viewYear, viewMonth - 1, prevMonthDays - i)
    cells.push({ date: d, current: false })
  }

  // Days in current month
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ date: new Date(viewYear, viewMonth, d), current: true })
  }

  // Trailing days to fill last row
  const trailing = 42 - cells.length
  for (let d = 1; d <= trailing; d++) {
    const date = viewMonth === 11
      ? new Date(viewYear + 1, 0, d)
      : new Date(viewYear, viewMonth + 1, d)
    cells.push({ date, current: false })
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger input */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between gap-2
          border rounded-xl px-4 py-2.5 text-sm text-left
          transition-all outline-none
          ${open
            ? 'border-secondary/60 ring-2 ring-secondary/20'
            : 'border-surface hover:border-secondary/30'
          }
          ${value ? 'text-text-primary' : 'text-text-secondary/50'}
          bg-white
        `}
      >
        <span>{value ? formatDisplay(value) : placeholder}</span>
        <CalendarDays className={`w-4 h-4 shrink-0 transition-colors ${open ? 'text-secondary' : 'text-text-secondary/40'}`} />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="
          absolute z-50 top-full mt-1.5 left-0
          w-72 bg-white border border-surface rounded-2xl shadow-xl
          overflow-hidden
          animate-modal-in
        ">
          {/* Month / year header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-bold text-text-primary select-none">
              {MONTHS[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map(({ date, current }, idx) => {
              const ymd = toYMD(date)
              const isSelected = ymd === value
              const isToday = ymd === toYMD(today)
              const isDisabled = minDateObj ? date < minDateObj : false
              const isCurrentMonth = current

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectDay(date)}
                  className={`
                    relative w-full aspect-square flex items-center justify-center
                    text-xs rounded-full transition-all
                    ${isDisabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}
                    ${isSelected
                      ? 'bg-secondary text-white font-bold shadow-sm shadow-secondary/30'
                      : isToday && !isSelected
                        ? 'ring-2 ring-secondary/50 text-secondary font-bold'
                        : isCurrentMonth
                          ? 'text-text-primary hover:bg-primary/10 hover:text-text-primary font-medium'
                          : 'text-text-secondary/30 hover:bg-surface'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface bg-[#FDFCF7]">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-text-secondary/60 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-semibold text-secondary hover:text-secondary-light transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
