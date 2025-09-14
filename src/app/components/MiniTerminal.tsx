"use client"
import React, { useEffect, useRef, useState } from "react"
import RetroWindow from "./RetroWindow"
import DinoGame from "./games/DinoGame" // keep this file (game will call onGameOver(score))

export default function MiniTerminal({ onClose }: { onClose?: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [booted, setBooted] = useState(false)
  const [showGame, setShowGame] = useState(false)

  const [history, setHistory] = useState<string[]>([])          // oldest -> newest
  const [historyIndex, setHistoryIndex] = useState<number | null>(null) // null when not browsing

  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Boot lines
  const bootLines = [
    "RetroOS v0.9.7 - initializing...",
    "Loading pixel drivers...",
    "Mounting /dev/retro0",
    "Starting nostalgia-daemon...",
    "Initializing sound: OK",
    "Input subsystem: OK",
    "Welcome, traveller. Type 'help' for commands.",
  ]

  // beep helper (safe)
  const playBeep = () => {
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      osc.frequency.value = 200
      gain.gain.value = 0.03
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch {
      // ignore if not supported
    }
  }

  // push a new line but avoid pushing identical consecutive lines
  const push = (text: string) => {
    setLines((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === text) return prev
      playBeep()
      return [...prev, text]
    })
  }

  // Boot effect — line-by-line, robust to remounts (no global guard)
  useEffect(() => {
    console.log("[MiniTerminal] boot effect mount")
    setLines([]) // start clean each mount
    setBooted(false)

    let idx = 0
    let interval: number | null = null
    interval = window.setInterval(() => {
      if (idx < bootLines.length) {
        console.log(`[MiniTerminal] boot push ${idx}:`, bootLines[idx])
        setLines((prev) => {
          // de-dup: don't append if last line equals this
          if (prev.length > 0 && prev[prev.length - 1] === bootLines[idx]) return prev
          playBeep()
          return [...prev, bootLines[idx]]
        })
        idx++
        return
      }

      // finished
      if (interval !== null) {
        clearInterval(interval)
        interval = null
      }
      setLines((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === "> Ready.") return prev
        return [...prev, "> Ready."]
      })
      setBooted(true)
    }, 420)

    return () => {
      console.log("[MiniTerminal] boot cleanup")
      if (interval !== null) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // auto scroll + focus when lines change / boot done
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
    if (booted) inputRef.current?.focus()
  }, [lines, booted])

  // command runner
  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    // store raw command (not the echoed '> cmd' line)
    setHistory((h) => [...h, cmd])
    setHistoryIndex(null)

    push(`> ${cmd}`)

    const [name, ...rest] = cmd.split(" ")
    const arg = rest.join(" ")

    switch (name.toLowerCase()) {
      case "help":
        push("help — show commands")
        push("clear — clear screen")
        push("date — show full date")
        push("time — show HH:MM:SS")
        push("whoami — show identity")
        push("projects — list projects")
        push("banner <text> — ASCII banner")
        push("echo <text> — echo text")
        push("game — play retro dino game")
        push("exit — close terminal")
        break
      case "clear":
        setLines([])
        break
      case "date":
        push(new Date().toLocaleDateString())
        break
      case "time":
        push(new Date().toLocaleTimeString())
        break
      case "whoami":
        push("rahulseervi — Robotics & AI | Retro tinkerer")
        break
      case "projects":
        push("Projects:")
        push("- Rain Water Detection (Low-cost)")
        push("- Terminal Bank (CS50x)")
        push("- CS50P / Python Projects")
        push("Tip: open Projects from the desktop to view certificates.")
        break
      case "echo":
        push(arg)
        break
      case "banner": {
        const word = arg || "RAHUL"
        renderBanner(word).forEach((line) => push(line))
        break
      }
      case "game":
        push("Launching Dino game... (Press SPACE to jump)")
        setShowGame(true)
        break
      case "exit":
        push("closing terminal...")
        setTimeout(() => onClose?.(), 300)
        break
      default:
        push(`Unknown command: ${name}. Try 'help'.`)
    }
  }

  // handle arrow up/down for history and Enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      runCommand(input)
      setInput("")
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      // if not currently browsing history, start at last item
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex] ?? "")
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (history.length === 0) return
      if (historyIndex === null) {
        // nothing to do
        setInput("")
        return
      }
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        // past the end -> clear browsing
        setHistoryIndex(null)
        setInput("")
      } else {
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex] ?? "")
      }
      return
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 px-4">
        <div className="w-[90%] max-w-lg">
          <RetroWindow title="Mini Terminal" onClose={onClose}>
            <div className="flex flex-col gap-2">
              <div
                ref={containerRef}
                className="bg-black text-green-400 font-mono text-[13px] p-3 h-64 overflow-y-auto rounded-sm"
                aria-live="polite"
              >
                {lines.length === 0 ? (
                  <div className="text-green-400/80">Starting terminal...</div>
                ) : (
                  lines.map((ln, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {ln}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="font-mono text-[13px] text-green-300"></div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={booted ? "Type command (help for list)..." : "Booting..."}
                  disabled={!booted}
                  className="flex-1 bg-black text-green-300 placeholder-green-600 font-mono px-2 py-1 text-[13px] outline-none border border-black/20 rounded-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => {
                    runCommand(input)
                    setInput("")
                  }}
                  className="text-xs font-mono px-2 py-1 border-2 border-black bg-yellow-200"
                  type="button"
                >
                  RUN
                </button>
              </div>

              <div className="text-[11px] font-mono text-black/70">
                Try <span className="font-bold">help</span> — history with ↑ / ↓
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>

      {showGame && (
        <DinoGame
          onClose={() => setShowGame(false)}
          onGameOver={(score: number) => {
            setShowGame(false)
            push(`Game Over — Exited Dino Game. Score: ${score}`)
          }}
        />
      )}
    </>
  )
}

/* ---------- small ASCII banner helper (A–Z, 0–9, space) ---------- */
function renderBanner(text: string): string[] {
  const font: Record<string, string[]> = {
    A: ["  ██  ", " █  █ ", " ████ ", " █  █ ", " █  █ "],
    B: [" ███  ", " █  █ ", " ███  ", " █  █ ", " ███  "],
    C: ["  ███ ", " █    ", " █    ", " █    ", "  ███ "],
    D: [" ███  ", " █  █ ", " █  █ ", " █  █ ", " ███  "],
    E: [" ████ ", " █    ", " ███  ", " █    ", " ████ "],
    F: [" ████ ", " █    ", " ███  ", " █    ", " █    "],
    G: ["  ███ ", " █    ", " █ ██ ", " █  █ ", "  ███ "],
    H: [" █  █ ", " █  █ ", " ████ ", " █  █ ", " █  █ "],
    I: [" ███ ", "  █  ", "  █  ", "  █  ", " ███ "],
    J: ["   ██ ", "    █ ", "    █ ", " █  █ ", "  ██  "],
    K: [" █  █ ", " █ █  ", " ██   ", " █ █  ", " █  █ "],
    L: [" █    ", " █    ", " █    ", " █    ", " ████ "],
    M: [" █   █ ", " ██ ██ ", " █ █ █ ", " █   █ ", " █   █ "],
    N: [" █  █ ", " ██ █ ", " █ ██ ", " █  █ ", " █  █ "],
    O: ["  ██  ", " █  █ ", " █  █ ", " █  █ ", "  ██  "],
    P: [" ███  ", " █  █ ", " ███  ", " █    ", " █    "],
    Q: ["  ██  ", " █  █ ", " █  █ ", " █ ██ ", "  ███ "],
    R: [" ███  ", " █  █ ", " ███  ", " █ █  ", " █  █ "],
    S: ["  ███ ", " █    ", "  ██  ", "    █ ", " ███  "],
    T: [" █████ ", "   █   ", "   █   ", "   █   ", "   █   "],
    U: [" █  █ ", " █  █ ", " █  █ ", " █  █ ", "  ██  "],
    V: [" █   █ ", " █   █ ", " █   █ ", "  █ █  ", "   █   "],
    W: [" █   █ ", " █   █ ", " █ █ █ ", " ██ ██ ", " █   █ "],
    X: [" █   █ ", "  █ █  ", "   █   ", "  █ █  ", " █   █ "],
    Y: [" █   █ ", "  █ █  ", "   █   ", "   █   ", "   █   "],
    Z: [" █████ ", "    █  ", "   █   ", "  █    ", " █████ "],
    "0": [" ███ ", " █ █ ", " █ █ ", " █ █ ", " ███ "],
    "1": [" ██  ", "  █  ", "  █  ", "  █  ", " ███ "],
    "2": [" ███ ", "   █ ", " ███ ", " █   ", " ████"],
    "3": [" ███ ", "   █ ", "  ██ ", "   █ ", " ███ "],
    "4": [" █  █ ", " █  █ ", " ████ ", "    █ ", "    █ "],
    "5": [" ████", " █   ", " ███ ", "    █", " ███ "],
    "6": ["  ██ ", " █   ", " ███ ", " █  █", "  ██ "],
    "7": [" ████", "    █", "   █ ", "  █  ", "  █  "],
    "8": ["  ██ ", " █  █", "  ██ ", " █  █", "  ██ "],
    "9": ["  ██ ", " █  █", "  ███", "    █", "  ██ "],
    " ": ["     ", "     ", "     ", "     ", "     "],
  }

  const chars = text.toUpperCase().split("")
  const out: string[] = ["", "", "", "", ""]
  for (const ch of chars) {
    const glyph = font[ch] || ["     ", "     ", "     ", "     ", "     "]
    for (let i = 0; i < 5; i++) out[i] += glyph[i] + "  "
  }
  return out
}
