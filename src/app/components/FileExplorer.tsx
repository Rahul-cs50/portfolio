"use client"
import { useState } from "react"
import RetroWindow from "./RetroWindow"
import CertViewer from "./CertViewer"

// Demo certs (replace/expand with your own)
const files = [
  { name: "MathWorks Workshop", file: "/assets/certs/mathwork.png" },
  { name: "C++ Certificate", file: "/assets/certs/C++.jpg" },
  { name: "CS50x Certificate", file: "/assets/certs/cs50x.png" },
  { name: "CS50P Certificate", file: "/assets/certs/cs50p.png" },
]

export default function FileExplorer({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<{ name: string; file: string } | null>(null)

  return (
    <>
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
                />
                <span className="text-[11px] font-mono text-black mt-1 text-center truncate w-20">
                  {f.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-black/60 text-center">
            Click a folder to open certificate.
          </p>
        </RetroWindow>
      </section>

      {/* Certificate preview */}
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
