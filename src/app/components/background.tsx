"use client"
import { useEffect, useMemo, useRef, useState } from "react"

interface Star { left: string; top: string; size: string }
type Theme = {
  path: string
  files: {
    sky: string
    farMountains: string
    farTrees: string
    midMountains: string
    myst: string
    nearTrees: string
  }
}

export default function Background({ theme }: { theme: Theme }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [stars, setStars] = useState<Star[]>([])
  const [errors, setErrors] = useState<string[]>([])

  // Build layer defs (skip empty entries)
  const layers = useMemo(() => {
    const p = theme.path
    const f = theme.files
    return ([
      // sky — full cover
      f.sky && { url: `${p}/${f.sky}`, z: 1,  size: "cover",     pos: "0 bottom", repeat: "repeat-x" },
      // farMountains (clouds in alt scene)
      f.farMountains && { url: `${p}/${f.farMountains}`, z: 5,  size: "auto 85%", pos: "0 70%",   repeat: "repeat-x" },
      // farTrees (may be empty)
      f.farTrees && { url: `${p}/${f.farTrees}`, z: 10, size: "auto 90%", pos: "0 80%",   repeat: "repeat-x" },
      // midMountains (ground)
      f.midMountains && { url: `${p}/${f.midMountains}`, z: 15, size: "auto 100%", pos: "0 bottom", repeat: "repeat-x" },
      // myst (thin line)
      f.myst && { url: `${p}/${f.myst}`, z: 20, size: "auto 16px", pos: "0 78%",   repeat: "repeat-x" },
      // nearTrees
      f.nearTrees && { url: `${p}/${f.nearTrees}`, z: 25, size: "auto 100%", pos: "0 bottom", repeat: "repeat-x" },
    ].filter(Boolean) as { url:string; z:number; size:string; pos:string; repeat:string }[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.path, theme.files.sky, theme.files.farMountains, theme.files.farTrees, theme.files.midMountains, theme.files.myst, theme.files.nearTrees])

  // ⭐ stars only on client & when theme changes
  useEffect(() => {
    setStars(Array.from({ length: 40 }).map(() => ({
      size: Math.random() > 0.8 ? "w-2 h-2" : "w-1 h-1",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    })))
  }, [theme.path])

  // 🖼️ Preload current theme images & capture any failures
  useEffect(() => {
    let alive = true
    const errs: string[] = []
    const pending = layers.map(L => new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => { errs.push(L.url); resolve() }
      img.src = L.url
    }))
    Promise.all(pending).then(() => { if (alive) setErrors(errs) })
    return () => { alive = false }
  }, [layers])

  // 🎮 subtle mouse parallax + smooth auto-scroll
  useEffect(() => {
    let offset = 0
    const els = rootRef.current?.querySelectorAll<HTMLDivElement>(".parallax-layer") ?? []

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

    const onMouse = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const rx = (innerWidth / 2 - e.clientX) / 150
      const ry = (innerHeight / 2 - e.clientY) / 150
      const cx = clamp(rx, -6, 6)
      const cy = clamp(ry, -4, 4)
      els.forEach((layer, i) => {
        const depth = i + 1
        layer.style.transform = `translate3d(${(cx * depth) / 2}px, ${(cy * depth) / 2}px, 0)`
      })
    }

    const tick = () => {
      offset += 0.3
      const speeds = [220, 150, 110, 80, 55, 35] // back→front
      els.forEach((layer, i) => {
        const s = speeds[i] ?? 50
        layer.style.backgroundPosition = `-${(offset * (200 / s)).toFixed(2)}px bottom`
      })
      requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMouse)
    tick()
    return () => window.removeEventListener("mousemove", onMouse)
  }, [theme.path])

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Stars */}
      <div className="absolute inset-0 z-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className={`star absolute bg-white ${s.size} rounded-sm opacity-80 transition-opacity duration-700`}
            style={{ left: s.left, top: s.top }}
          />
        ))}
      </div>

      {/* Layers back → front */}
      {layers.map((L, i) => (
        <div
          key={i}
          className="parallax-layer absolute inset-x-0 bottom-0 h-full will-change-transform"
          style={{
            zIndex: L.z,
            backgroundImage: `url(${L.url})`,
            backgroundRepeat: L.repeat,
            backgroundSize: L.size,
            backgroundPosition: L.pos,
          }}
        />
      ))}

      {/* Debug overlay if any image failed */}
      {errors.length > 0 && (
        <div className="pointer-events-none fixed top-2 left-2 z-[9999] bg-red-600/90 text-white text-[11px] px-3 py-2 rounded">
          <div className="font-bold mb-1">Background load failed:</div>
          {errors.slice(0,4).map((u) => (<div key={u} className="truncate max-w-[60vw]">{u}</div>))}
          {errors.length > 4 && <div>+{errors.length - 4} more…</div>}
        </div>
      )}
    </div>
  )
}
