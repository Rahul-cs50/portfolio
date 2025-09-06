"use client"
import React from "react"

type WinKey = "home" | "about" | "projects" | "contact" | "timeline"

interface Props {
  onOpen: (k: WinKey) => void
}

const items: { key: WinKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "timeline", label: "Timeline" },
  { key: "contact", label: "Contact" },
]

export default function VerticalIcons({ onOpen }: Props) {
  return (
    <div className="fixed left-4 top-20 flex flex-col z-50">
      {items.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onOpen(key)}
          className="flex flex-col items-center focus:outline-none mb-2"
          type="button"
        >
          <img
            src="/assets/icons/folders/folder.png"
            alt={label}
            className="w-16 h-16 md block"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />
          <span className="mt-1 text-[12px] md:text-[13px] lg:text-[14px] font-mono capitalize leading-none text-center">
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

