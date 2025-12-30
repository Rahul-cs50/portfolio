"use client"

import { useState } from "react"
import RetroWindow from "./RetroWindow"
import CertViewer from "./CertViewer"

// Files (images + PDFs both work)
const files = [
  { name: "MathWorks Workshop", file: "/assets/certs/mathwork.png" },
  { name: "C++ Certificate", file: "/assets/certs/C++.jpg" },
  { name: "CS50x Certificate", file: "/assets/certs/CS50xfinal.png" },
  { name: "CS50P Certificate", file: "/assets/certs/CS50Pn.png" },
  { name: "Cisco Certificate", file: "/assets/certs/cypython-1.png" },
  { name: "IEEE Paper", file: "/pdfs/IEEE Access Paper.pdf" }, 
]

export default function FileExplorer({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<{
    name: string
    file: string
  } | null>(null)

  return (
    <>
      {/* File Explorer Window */}
      <section
        id="file"
        className="fixed left-1/2 top-1/2 z-[100] w-[640px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2"
      >
        <RetroWindow title="File Explorer" onClose={onClose}>
          {/* Folder grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 justify-items-center">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setSelected(f)}
              >
                <img
                  src="/assets/icons/folders/folder.png"
                  alt={f.name}
                  className="w-14 h-14 group-hover:scale-110 transition-transform"
                  style={{ imageRendering: "pixelated" }}
                  draggable={false}
                />
                <span className="text-[11px] font-mono text-black mt-1 text-center truncate w-20">
                  {f.name}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-black/60 text-center">
            Click a folder to open certificate or document.
          </p>
        </RetroWindow>
      </section>

      {/* Viewer (image or PDF) */}
      {selected && (
        <CertViewer
          src={selected.file}
          title={selected.name}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}