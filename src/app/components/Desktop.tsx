"use client"
import { useState } from "react"
import Navbar from "./Navbar"
import Background from "./background"
import VerticalIcons from "./VerticalIcons"
import About from "./About"
import Projects from "./Projects"
import Contact from "./Contact"
import Timeline from "./Timeline"
import BottomInfo from "./BottomInfo"
import MiniTerminal from "./MiniTerminal"    // <-- place MiniTerminal.tsx here
import FileExplorer from "./FileExplorer"
//import FileExplorer from "./FileExplorer"    // optional (if you later implement File window)

type WinKey = "home" | "about" | "projects" | "contact" | "timeline" | "file" | "play"

const THEME_ALT = {
  path: "/assets/mountains",
  files: {
    sky: "sky.png",
    farMountains: "far-mountains.png",
    farTrees: "far-trees.png",
    midMountains: "middle-mountains.png",
    myst: "myst.png",
    nearTrees: "near-trees.png",
  },
}

const THEME_DEFAULT = {
  path: "/assets/mountains/alt-scene",
  files: {
    sky: "1.png",
    farMountains: "2.png",
    farTrees: "",
    midMountains: "3.png",
    myst: "5.png",
    nearTrees: "4.png",
  },
}

// breadcrumb paths mapping
const PATHS: Record<WinKey, string> = {
  home: "~/home/rahulseervi 🏠",
  about: "~/home/rahulseervi/about",
  projects: "~/home/rahulseervi/projects",
  contact: "~/home/rahulseervi/contact",
  timeline: "~/home/rahulseervi/timeline",
  file: "~/home/rahulseervi/files",
  play: "~/home/rahulseervi/play",
}

export default function Desktop() {
  const [theme, setTheme] = useState(THEME_DEFAULT)

  const [open, setOpen] = useState<Record<WinKey, boolean>>({
    home: false,
    about: false,
    projects: false,
    contact: false,
    timeline: false,
    file: false,
    play: false,
  })

  const [currentPath, setCurrentPath] = useState<string>(PATHS.home)

  // helper: returns first open window key in priority order, or undefined
  const firstOpenKey = (state: Record<WinKey, boolean>): WinKey | undefined => {
    const order: WinKey[] = ["about", "projects", "contact", "timeline", "file", "play"]
    return order.find((k) => state[k])
  }

  const openWin = (k: WinKey) => {
    if (k === "home") {
      // reset
      const reset = { home: false, about: false, projects: false, contact: false, timeline: false, file: false, play: false }
      setOpen(reset)
      setCurrentPath(PATHS.home)
    } else {
      setOpen((o) => {
        const next = { ...o, [k]: true }
        setCurrentPath(PATHS[k])
        return next
      })
    }
  }

  const closeWin = (k: WinKey) => {
    setOpen((o) => {
      const next = { ...o, [k]: false }
      const first = firstOpenKey(next)
      setCurrentPath(first ? PATHS[first] : PATHS.home)
      return next
    })
  }

  // reset to home helper (breadcrumb clickable)
  const resetToHome = () => {
    setOpen({ home: false, about: false, projects: false, contact: false, timeline: false, file: false, play: false })
    setCurrentPath(PATHS.home)
  }

  // scene toggle
  const toggleTheme = () => {
    setTheme((t) => (t.path === THEME_DEFAULT.path ? THEME_ALT : THEME_DEFAULT))
  }

  return (
    <main className="relative text-white min-h-screen overflow-x-hidden">
      {/* Background */}
      <Background theme={theme as any} />

      <div className="relative z-50">
        {/* Navbar with scene toggle + breadcrumb */}
        <Navbar onOpen={openWin} onToggleScene={toggleTheme} currentPath={currentPath} onBreadcrumbHome={resetToHome} />

        {/* Folders */}
        <VerticalIcons onOpen={openWin} />

        {/* Bottom-left system info */}
        <BottomInfo />

        {/* Centered windows (RetroWindow wrappers inside each component) */}
        {open.about && <About onClose={() => closeWin("about")} />}
        {open.projects && <Projects onClose={() => closeWin("projects")} />}
        {open.contact && <Contact onClose={() => closeWin("contact")} />}
        {open.timeline && <Timeline onClose={() => closeWin("timeline")} />}
        {open.file && <FileExplorer onClose={() => closeWin("file")} />}


        {/* Play: Mini Terminal */}
        {open.play && <MiniTerminal onClose={() => closeWin("play")} />}


        {/* Bottom-right footer */}
        <div className="fixed bottom-4 right-4 text-[11px] font-mono opacity-80 text-right space-y-1">
          <div>© ALL RIGHTS RESERVED 2026 ®</div>
          <div>
            Made with the power of AI by Rahul <span className="text-red-500">♥</span>
          </div>
        </div>
      </div>
    </main>
  )
}
