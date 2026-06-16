import { useEffect, useMemo, useState } from 'react'

/** Next 15 April at 4:30 PM IST after “now” (avoids a wrong year giving ~365 extra days). */
function getNextApril15At430IST(from: Date = new Date()): Date {
  const now = from.getTime()
  const y0 = from.getFullYear()
  for (let y = y0; y <= y0 + 2; y++) {
    const candidate = new Date(`${y}-04-15T16:30:00+05:30`)
    if (candidate.getTime() > now) return candidate
  }
  return new Date(`${y0 + 3}-04-15T16:30:00+05:30`)
}


function formatLaunchLine(date: Date): string {
  const d = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  const t = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
  return `${d} · ${t} IST`
}

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return '0:00'
  const totalSec = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (days > 0) return `${days}d ${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function TimedRibbon() {
  const ribbonEndAt = useMemo(() => getNextApril15At430IST(), [])

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, ribbonEndAt.getTime() - Date.now()),
  )

  useEffect(() => {
    const end = ribbonEndAt.getTime()
    const tick = () => {
      setRemainingMs(Math.max(0, end - Date.now()))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [ribbonEndAt])

  if (remainingMs <= 0) return null

  return (
    <div
      className="relative z-60 overflow-hidden border-b border-red-950/40 bg-linear-to-r from-red-950 via-red-800 to-red-900 px-3 py-2.5 text-white shadow-[0_4px_24px_-4px_rgba(127,29,29,0.45)] sm:px-6 sm:py-3"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/12 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-white/25 to-transparent sm:w-0.75 sm:opacity-90" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-white/25 to-transparent sm:w-0.75 sm:opacity-90" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-nowrap items-center justify-center gap-x-2 overflow-x-auto text-center sm:gap-x-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <span className="shrink-0 font-display text-base tracking-tight text-white drop-shadow-sm sm:text-lg">
          Launch
        </span>
        <span className="shrink-0 text-red-200/60" aria-hidden>
          ·
        </span>
        <span className="shrink-0 text-sm font-medium text-red-50 sm:text-base">
          {formatLaunchLine(ribbonEndAt)}
        </span>
        <span className="shrink-0 text-red-200/60" aria-hidden>
          ·
        </span>
        <span
          className="shrink-0 rounded-lg border border-white/20 bg-red-950/35 px-2.5 py-1 font-mono text-sm tabular-nums tracking-wide shadow-inner ring-1 ring-white/10 backdrop-blur-[2px] sm:px-3 sm:text-base"
          aria-label="Time remaining until launch"
        >
          {formatCountdown(remainingMs)}
        </span>
      </div>
    </div>
  )
}
