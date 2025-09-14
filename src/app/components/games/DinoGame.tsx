"use client"
import React, { useEffect, useRef, useState } from "react"

export default function RobotRunner({
  onClose,
  onGameOver,
}: {
  onClose?: () => void
  onGameOver?: (score: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)

  // refs for stable loop
  const playerRef = useRef({ x: 40, y: 120, w: 64, h: 64, dy: 0, grounded: true, state: "idle" as "idle" | "run" | "jump" | "died" })
  const obstaclesRef = useRef<{ x:number; y:number; w:number; h:number; type:string }[]>([])
  const speedRef = useRef(5)
  const spawnTimerRef = useRef(0)
  const frameTickRef = useRef(0)

  // sprite sheets refs (unchanged from your setup)
  const sheetRun = useRef<HTMLImageElement|null>(null)
  const sheetJump = useRef<HTMLImageElement|null>(null)
  const sheetIdle = useRef<HTMLImageElement|null>(null)
  const sheetDied = useRef<HTMLImageElement|null>(null)
  const obstacleImg = useRef<HTMLImageElement|null>(null)
  const loadedRef = useRef({ run:false, jump:false, idle:false, died:false, obs:false })

  // --- Difficulty tuning (feel free to tweak) ---
  const BASE_SPEED = 5            // starting speed
  const SPEED_PER_POINT = 0.35    // added speed per score point
  const MAX_SPEED = 18            // upper cap for speed

  const MIN_SPAWN = 28            // minimum spawn delay
  const START_SPAWN = 90          // starting spawn delay
  const SPAWN_REDUCTION_PER_POINT = 1.0 // how much spawn delay reduces per point

  // sprite/frame config (matches stitched sheets)
  const FRAME_W = 512
  const FRAME_H = 512
  const RUN_FRAMES = 11
  const JUMP_FRAMES = 24
  const IDLE_FRAMES = 21
  const DIED_FRAMES = 11
  const SPRITE_ANIM_SPEED = 6
  const gravity = 0.8
  const jumpForce = -16

  // load sprite sheets
  useEffect(() => {
    const load = (src:string, ref:React.MutableRefObject<HTMLImageElement|null>, flagKey:string) => {
      const img = new Image()
      img.src = src
      img.onload = () => { ref.current = img; (loadedRef.current as any)[flagKey] = true }
      img.onerror = () => { ref.current = null; (loadedRef.current as any)[flagKey] = false }
    }
    load("/assets/games/robot_run.png", sheetRun, "run")
    load("/assets/games/robot_jump.png", sheetJump, "jump")
    load("/assets/games/robot_idle.png", sheetIdle, "idle")
    load("/assets/games/robot_died.png", sheetDied, "died")
    load("/assets/games/obstacle.png", obstacleImg, "obs") // optional
  }, [])

  // Update speed & spawn timer based on score (reactive & smooth)
  useEffect(() => {
    const newSpeed = Math.min(MAX_SPEED, BASE_SPEED + score * SPEED_PER_POINT)
    speedRef.current = newSpeed

    // spawn delay decreases with score, clamped to MIN_SPAWN
    const newSpawn = Math.max(MIN_SPAWN, Math.round(START_SPAWN - Math.floor(score * SPAWN_REDUCTION_PER_POINT)))
    // If spawnTimer currently larger than newSpawn, reduce it so obstacles appear sooner
    if (spawnTimerRef.current > newSpawn) spawnTimerRef.current = newSpawn
  }, [score])

  // main loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let animCounter = 0

    const loop = () => {
      if (!running) return
      const player = playerRef.current
      const obstacles = obstaclesRef.current

      // clear
      ctx.fillStyle = "#071018"
      ctx.fillRect(0,0,canvas.width, canvas.height)

      // ground line
      ctx.fillStyle = "#2b2b2b"
      ctx.fillRect(0, 190, canvas.width, 6)

      // physics
      player.y += player.dy
      player.dy += gravity
      if (player.y + player.h >= 190) {
        player.y = 190 - player.h
        player.dy = 0
        player.grounded = true
        if (player.state === "jump") player.state = "run"
      }

      // helper to draw frames from a sheet (fallback to block)
      const drawFromSheet = (sheet:HTMLImageElement|null, frames:number, outW:number, outH:number) => {
        if (!sheet) {
          ctx.fillStyle = "#0ff"
          ctx.fillRect(player.x, player.y, player.w, player.h)
          ctx.fillStyle = "#000"
          ctx.fillRect(player.x+12, player.y+16, 10, 10)
          ctx.fillRect(player.x+36, player.y+16, 10, 10)
          return
        }
        animCounter = (animCounter + 1) % (SPRITE_ANIM_SPEED * frames)
        const frameIndex = Math.floor(animCounter / SPRITE_ANIM_SPEED) % frames
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(
          sheet,
          frameIndex * FRAME_W, 0, FRAME_W, FRAME_H,
          player.x, player.y, outW, outH
        )
      }

      // draw player by state
      if (player.state === "died") {
        drawFromSheet(sheetDied.current, DIED_FRAMES, player.w, player.h)
      } else if (player.state === "jump") {
        drawFromSheet(sheetJump.current, JUMP_FRAMES, player.w, player.h)
      } else if (player.state === "run") {
        drawFromSheet(sheetRun.current, RUN_FRAMES, player.w, player.h)
      } else {
        drawFromSheet(sheetIdle.current, IDLE_FRAMES, player.w, player.h)
      }

      // spawn obstacles (spawnTimerRef controlled by score-effect above)
      spawnTimerRef.current--
      if (spawnTimerRef.current <= 0) {
        const roll = Math.random()
        const type = roll < 0.7 ? "small" : roll < 0.95 ? "tall" : "flying"
        const size = type === "small" ? 26 : type === "tall" ? 42 : 18
        const y = type === "flying" ? 110 : 190 - size
        obstacles.push({ x: canvas.width + 10, y, w: size, h: size, type })
        // set next spawn relative to current speed: faster speed => slightly quicker spawn
        const baseNext = Math.max(25, Math.round(START_SPAWN - Math.floor(score * SPAWN_REDUCTION_PER_POINT)))
        const speedFactor = Math.max(0.6, 1 - (speedRef.current - BASE_SPEED) / (MAX_SPEED - BASE_SPEED))
        spawnTimerRef.current = Math.max(MIN_SPAWN, Math.round(baseNext * speedFactor))
      }

      // update & draw obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const ob = obstacles[i]
        ob.x -= speedRef.current
        if (obstacleImg.current) {
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(obstacleImg.current, 0, 0, obstacleImg.current.width, obstacleImg.current.height, ob.x, ob.y, ob.w, ob.h)
        } else {
          ctx.fillStyle = "#f55"
          ctx.fillRect(ob.x, ob.y, ob.w, ob.h)
        }

        // collision
        if (
          player.x < ob.x + ob.w &&
          player.x + player.w > ob.x &&
          player.y < ob.y + ob.h &&
          player.y + player.h > ob.y
        ) {
          player.state = "died"
          setRunning(false)
          onGameOver?.(score)
          return
        }
      }

      // cleanup
      obstaclesRef.current = obstacles.filter(o => o.x + o.w > -10)

      // scoring: increment every fixed ticks
      frameTickRef.current++
      if (frameTickRef.current % 90 === 0) {
        setScore(s => s + 1)
      }

      // draw score
      ctx.fillStyle = "#9f9"
      ctx.font = "14px monospace"
      ctx.fillText(`Score: ${score}`, 12, 22)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    const keyHandler = (e:KeyboardEvent) => {
      const p = playerRef.current
      if ((e.code === "Space" || e.code === "ArrowUp") && p.grounded) {
        p.dy = jumpForce
        p.grounded = false
        p.state = "jump"
      } else if (e.code === "Escape") {
        setRunning(false)
        onClose?.()
      }
    }
    window.addEventListener("keydown", keyHandler)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", keyHandler)
    }
  }, [running, onClose, onGameOver, score])

  // set canvas size (scaled down)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 480
    canvas.height = 220
  }, [])

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70">
      <div className="bg-yellow-100 border-4 border-black p-2">
        <canvas ref={canvasRef} style={{ imageRendering: "pixelated" }} />
        <div className="flex justify-between mt-2 text-xs font-mono">
          <button onClick={() => { setRunning(false); onClose?.() }} className="px-2 py-1 bg-red-400 border-2 border-black rounded">Quit</button>
          <div>Press SPACE to jump | ESC to quit</div>
        </div>
      </div>
    </div>
  )
}
