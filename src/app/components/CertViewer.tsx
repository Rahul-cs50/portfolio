"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import RetroWindow from "./RetroWindow"

export default function CertViewer({
  src,
  title,
  onClose,
}: {
  src: string
  title?: string
  onClose: () => void
}) {
  const isPDF = src.toLowerCase().endsWith(".pdf")

  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // transform state (IMAGE ONLY)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [fitted, setFitted] = useState(true)

  const panRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  })

  const fitImage = useCallback(() => {
    if (isPDF) return
    const img = imgRef.current
    const container = containerRef.current
    if (!img || !container) return

    const cW = container.clientWidth
    const cH = container.clientHeight
    const iW = img.naturalWidth
    const iH = img.naturalHeight
    if (!iW || !iH) return

    const scaleToFit = Math.min(cW / iW, cH / iH, 1)
    setScale(scaleToFit)
    setOffset({ x: 0, y: 0 })
    setRotate(0)
    setFitted(true)
  }, [isPDF])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (isPDF) return

      if (e.key === "+" || e.key === "=")
        setScale((s) => Math.min(8, +(s + 0.2).toFixed(3)))
      if (e.key === "-")
        setScale((s) => Math.max(0.1, +(s - 0.2).toFixed(3)))
      if (e.key === "0") fitImage()
      if (e.key === "ArrowLeft") setOffset((o) => ({ x: o.x + 20, y: o.y }))
      if (e.key === "ArrowRight") setOffset((o) => ({ x: o.x - 20, y: o.y }))
      if (e.key === "ArrowUp") setOffset((o) => ({ x: o.x, y: o.y + 20 }))
      if (e.key === "ArrowDown") setOffset((o) => ({ x: o.x, y: o.y - 20 }))
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, fitImage, isPDF])

  useEffect(() => {
    if (!isPDF) {
      fitImage()
      setOffset({ x: 0, y: 0 })
      setRotate(0)
    }
  }, [src, fitImage, isPDF])

  useEffect(() => {
    if (isPDF) return
    const container = containerRef.current
    if (!container) return

    const onPointerDown = (ev: PointerEvent) => {
      ev.preventDefault()
      panRef.current.dragging = true
      panRef.current.startX = ev.clientX
      panRef.current.startY = ev.clientY
      panRef.current.baseX = offset.x
      panRef.current.baseY = offset.y
      ;(ev.target as Element).setPointerCapture(ev.pointerId)
    }

    const onPointerMove = (ev: PointerEvent) => {
      if (!panRef.current.dragging) return
      const dx = ev.clientX - panRef.current.startX
      const dy = ev.clientY - panRef.current.startY
      setOffset({
        x: panRef.current.baseX + dx,
        y: panRef.current.baseY + dy,
      })
      setFitted(false)
    }

    const onPointerUp = (ev: PointerEvent) => {
      panRef.current.dragging = false
      try {
        ;(ev.target as Element).releasePointerCapture(ev.pointerId)
      } catch {}
    }

    container.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      container.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [offset, isPDF])

  const onDoubleClick = () => {
    if (isPDF) return
    if (fitted) {
      setScale((s) => Math.min(4, s * 2))
      setFitted(false)
    } else {
      fitImage()
    }
  }

  const zoomIn = () => {
    if (isPDF) return
    setScale((s) => Math.min(8, +(s + 0.2).toFixed(3)))
    setFitted(false)
  }

  const zoomOut = () => {
    if (isPDF) return
    setScale((s) => Math.max(0.1, +(s - 0.2).toFixed(3)))
    setFitted(false)
  }

  const rotateLeft = () => !isPDF && setRotate((r) => (r - 90) % 360)
  const rotateRight = () => !isPDF && setRotate((r) => (r + 90) % 360)

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[92vw] max-h-[92vh]">
        <RetroWindow title={title ?? "Viewer"} onClose={onClose}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              {!isPDF && (
                <>
                  <button onClick={zoomIn} className="text-xs px-2 py-1 bg-yellow-300 border-2 border-black rounded-sm">+ Zoom</button>
                  <button onClick={zoomOut} className="text-xs px-2 py-1 bg-yellow-300 border-2 border-black rounded-sm">− Zoom</button>
                  <button onClick={fitImage} className="text-xs px-2 py-1 bg-yellow-300 border-2 border-black rounded-sm">Fit</button>
                  <button onClick={rotateLeft} className="text-xs px-2 py-1 bg-yellow-300 border-2 border-black rounded-sm">↺ Rotate</button>
                  <button onClick={rotateRight} className="text-xs px-2 py-1 bg-yellow-300 border-2 border-black rounded-sm">↻ Rotate</button>
                </>
              )}
              <div className="ml-auto text-xs text-black/70">
                Esc to close
              </div>
            </div>

            <div
              ref={containerRef}
              className="relative overflow-hidden bg-white border-4 border-black rounded-sm"
              style={{ height: "70vh", touchAction: "none" }}
              onDoubleClick={onDoubleClick}
            >
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: isPDF
                    ? "translate(-50%, -50%)"
                    : `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotate}deg)`,
                  transformOrigin: "center center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isPDF ? (
                  <iframe
                    src={src}
                    title={title ?? "PDF"}
                    style={{
                      width: "70vw",
                      height: "70vh",
                      border: "none",
                    }}
                  />
                ) : (
                  <img
                    ref={imgRef}
                    src={src}
                    alt={title ?? "certificate"}
                    onLoad={() => fitted && fitImage()}
                    style={{
                      imageRendering: "pixelated",
                      maxWidth: "none",
                      maxHeight: "none",
                      display: "block",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}