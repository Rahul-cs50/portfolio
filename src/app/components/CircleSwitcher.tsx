"use client"
import { useEffect, useMemo, useRef, useState } from "react"

const exts = ["png", "jpg", "jpeg", "webp"] as const
const MAX_CHECK = 10 // will look for 1..10

// Test a single image URL
function testImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

// Detect images in /assets/mountains/profile/{1..MAX_CHECK}.{ext}
async function detectProfileImages(): Promise<string[]> {
  const urls: string[] = []
  for (let n = 1; n <= MAX_CHECK; n++) {
    let found = false
    for (const ext of exts) {
      const url = `/assets/mountains/profile/${n}.${ext}`
      // await inside loop so we push in numeric order (1,2,3...)
      // this is client-only and runs after hydration
      // eslint-disable-next-line no-await-in-loop
      if (await testImage(url)) {
        urls.push(url)
        found = true
        break
      }
    }
    if (!found) {
      // skip this index
    }
  }
  return urls
}

export default function CircleSwitcher() {
  // --- IMPORTANT: initialImages contains an initial deterministic fallback.
  // This ensures server HTML and first client render match exactly.
  const initialImages = useMemo(() => ["/assets/mountains/profile/1.png"], [])
  const [images, setImages] = useState<string[]>(initialImages)
  const [idx, setIdx] = useState(0)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  // Detect available images on client and replace images array (runs after hydration)
  useEffect(() => {
    let alive = true
    detectProfileImages().then((found) => {
      if (!alive) return
      if (found.length > 0) {
        // If 1.png exists we will likely get the same first image — but order may differ if filenames aren't consecutive.
        setImages(found)
        // make sure current index remains in range
        setIdx((cur) => (found.length ? Math.min(cur, found.length - 1) : 0))
      } else {
        // keep the deterministic fallback; optionally you could switch to a default graphic
        setImages(initialImages)
      }
    })
    return () => {
      alive = false
    }
    // initialImages stable due to useMemo
  }, [initialImages])

  // Preload next image for snappy cycles
  const nextIdx = images.length ? (idx + 1) % images.length : 0
  useEffect(() => {
    if (!images.length) return
    const img = new Image()
    img.src = images[nextIdx]
  }, [images, nextIdx])

  const cycle = () => {
    if (!images.length) return
    setIdx((i) => (i + 1) % images.length)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      cycle()
    }
  }

  const current = images[idx] ?? initialImages[0]

  return (
    <button
      ref={btnRef}
      type="button" // make sure this is always a string (not null)
      onClick={cycle}
      onKeyDown={onKeyDown}
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/60 shadow
                 pointer-events-auto ring-0 hover:ring-2 hover:ring-yellow-300 transition"
      aria-label="Change profile picture"
      title="Click to change profile picture"
    >
      {/* img attributes are deterministic on first render: src points to the fallback path above */}
      <img
        src={current}
        alt="Profile"
        className="w-full h-full object-cover"
        style={{ imageRendering: "pixelated" as any }}
        draggable={false}
      />
    </button>
  )
}
