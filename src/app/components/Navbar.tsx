"use client"
import { useEffect, useState } from "react"
import CircleSwitcher from "./CircleSwitcher"

type WinKey = "home" | "about" | "projects" | "contact" | "timeline" | "file" | "play"

interface NavbarProps {
  onOpen?: (win: WinKey) => void
  onToggleScene?: () => void
  currentPath?: string
  onBreadcrumbHome?: () => void
}

export default function Navbar({
  onOpen,
  onToggleScene,
  currentPath = "~/home/rahulseervi 🏠",
  onBreadcrumbHome,
}: NavbarProps) {
  const PLACEHOLDER = "--:--:--"
  const [time, setTime] = useState(PLACEHOLDER)
  const [dateStr, setDateStr] = useState("")
  const [showCal, setShowCal] = useState(false)
  const [showBattery, setShowBattery] = useState(false)
  const [battery, setBattery] = useState<number | null>(null)

  // clock + date updater
  useEffect(() => {
    const fmtTime = () =>
      new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    const fmtDate = () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })

    setTime(fmtTime())
    setDateStr(fmtDate())
    const id = setInterval(() => {
      setTime(fmtTime())
      setDateStr(fmtDate())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // fake battery %
  useEffect(() => {
    let level = 82
    setBattery(level)
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 3) - 1
      level = Math.min(100, Math.max(5, level + delta))
      setBattery(level)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  // breadcrumb split
  const pathParts = currentPath.split("/")
  const basePath = pathParts.slice(0, 3).join("/") // "~/home/rahulseervi"
  const rest = pathParts.slice(3).join("/") // e.g. "timeline"

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 top-3 z-50 w-[92%] max-w-[1200px]">
      <div
        className="relative flex items-center justify-between bg-white/90 text-black rounded-2xl border-4 border-black
                   px-3 py-1 shadow-[0_6px_0_rgba(0,0,0,1)]"
        style={{ backdropFilter: "blur(4px)" }}
      >
        {/* Left: profile + menu */}
        <div className="flex items-center gap-3">
          <CircleSwitcher />

          <div className="flex items-center gap-3 pl-2 border-l-2 border-black/60">
            <div
              className="text-[12px] font-mono hover:underline cursor-pointer"
              onClick={() => onOpen?.("file")}
              role="button"
              tabIndex={0}
            >
              File
            </div>
            <div
              className="text-[12px] font-mono hover:underline cursor-pointer"
              onClick={() => onOpen?.("play")}
              role="button"
              tabIndex={0}
            >
              Play
            </div>
            <div
              className="text-[12px] font-mono hover:underline cursor-pointer"
              onClick={onToggleScene}
              role="button"
              tabIndex={0}
            >
              Window
            </div>
          </div>
        </div>

        {/* Center breadcrumb */}
        <div className="text-[12px] font-mono text-center flex-1 select-none">
          <button
            onClick={() => onBreadcrumbHome?.()}
            className="inline-block text-[12px] font-mono hover:underline px-1 py-0 mr-1"
            title="Go to home"
            type="button"
          >
            {basePath} {rest ? "/" : ""}
          </button>
          {rest && <span className="text-[12px] font-mono opacity-90">/{rest}</span>}
        </div>

        {/* Right: status icons */}
        <div className="relative flex items-center gap-3">
          {/* wifi */}
          <img
            src="/assets/icons/OIP.png"
            alt="wifi"
            className="w-7 h-7 select-none"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />

          {/* battery */}
          <button onClick={() => setShowBattery((s) => !s)} className="relative" type="button">
            <img
              src="/assets/icons/battery.png"
              alt="battery"
              className="w-7 h-7 select-none"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
            {showBattery && (
              <div className="absolute right-0 top-8 bg-white border-2 border-black rounded-md px-2 py-1 text-[11px] font-mono shadow z-50">
                Battery: {battery ?? "--"}%
              </div>
            )}
          </button>

          {/* calendar */}
          <button onClick={() => setShowCal((s) => !s)} className="relative" type="button">
            <img
              src="/assets/icons/calendar.png"
              alt="calendar"
              className="w-7 h-7 select-none"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
            {showCal && (
              <div className="absolute right-0 top-8 bg-white border-2 border-black rounded-md px-2 py-1 text-[11px] font-mono shadow z-50 whitespace-nowrap">
                {dateStr}
              </div>
            )}
          </button>

          {/* date + time */}
          <div className="flex items-baseline gap-2">
            <div className="text-[11px] font-mono">{dateStr}</div>
            <div className="text-[12px] font-mono">{time}</div>
          </div>

          {/* power */}
          <button
            className="w-6 h-6 grid place-items-center rounded-full bg-transparent border border-black/10"
            type="button"
          >
            ⏻
          </button>
        </div>
      </div>
    </nav>
  )
}
