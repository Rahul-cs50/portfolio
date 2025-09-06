"use client"
import React from "react"

export default function BottomInfo() {
  return (
    <div className="fixed left-6 bottom-6 z-50">
      <div
        className="bg-white/95 text-black rounded-[12px] border-4 border-black px-4 py-3
                   shadow-lg w-[320px] font-mono text-[11px]"
        style={{ imageRendering: "pixelated" }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>Computer</div>
          <div>Apple I</div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>Release Year</div>
          <div>1976</div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>Processor</div>
          <div>MOS 6502 @ 1 MHz</div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>RAM</div>
          <div>4 KB (expandable to 48 KB)</div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>Storage</div>
          <div>External Cassette Tape</div>
        </div>

        </div>
      </div>
  )
}
