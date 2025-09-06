"use client"
import { useState } from "react"
import RetroWindow from "./RetroWindow"
import CertViewer from "./CertViewer"

type Project = {
  title: string
  desc: string
  img?: string
  certs?: { title: string; file: string }[]
}

const projects: Project[] = [
  {
    title: "Rain Water Detection (Low-cost)",
    desc: "A low-cost, easily deployable rain-water detection system using commodity sensors and microcontrollers. Designed for affordability and community-scale deployment — ideal for irrigation alerts and localized flood warnings.",
    img: "/assets/certs/rainwater.png",
  },
  {
    title: "Terminal Bank (CS50x)",
    desc: "Password-protected CLI bank with accounts & transactions.",
    img: "/assets/projects/bank.png",
    certs: [{ title: "CS50x Certificate", file: "/assets/certs/cs50x.png" }],
  },
  {
    title: "CS50P / Python Projects",
    desc: "Various Python projects including data tools and visualizers.",
    img: "/assets/projects/retro.png",
    certs: [{ title: "CS50P Certificate", file: "/assets/certs/cs50p.png" }],
  },
]

export default function Projects({ onClose }: { onClose?: () => void }) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [viewCert, setViewCert] = useState<{ src: string; title?: string } | null>(null)

  return (
    <>
      {/* Centered main window */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
        <div className="w-[95%] max-w-6xl">
          <RetroWindow title="Projects" onClose={onClose}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {projects.map((p) => (
                <article
                  key={p.title}
                  className="bg-yellow-100 border-4 border-black p-3 cursor-pointer hover:-translate-y-1 transition"
                  onClick={() => setSelected(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelected(p) }}
                >
                  <div
                    className="aspect-video mb-3 overflow-hidden rounded-sm border-4 border-black bg-yellow-50"
                    style={{ imageRendering: "pixelated" as any }}
                  >
                    {p.img ? (
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-black/60 text-xs">
                        (add /assets/projects/*.png)
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-bold">{p.title}</div>
                  <div className="text-[11px] mt-1 text-black/80">{p.desc}</div>

                  {p.certs && p.certs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.certs.map((c) => (
                        <span key={c.title} className="text-[10px] bg-yellow-300 border-2 border-black px-1 py-0.5 rounded-sm">
                          {c.title}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </RetroWindow>
        </div>
      </div>

      {/* Detail modal (already centered) */}
      {selected && (
        <div className="fixed left-1/2 top-1/2 z-[100] w-[560px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2">
          <RetroWindow title={selected.title} onClose={() => setSelected(null)}>
            <p className="text-sm text-black mb-3">{selected.desc}</p>

            {selected.img && (
              <div className="mb-3 overflow-hidden rounded-sm border-4 border-black bg-yellow-50"
                   style={{ imageRendering: "pixelated" as any }}>
                <img src={selected.img} alt={selected.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {selected.certs && selected.certs.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {selected.certs.map((c, i) => (
                  <div key={i}>
                    <p className="text-xs mb-1 font-semibold">{c.title}</p>
                    <img
                      src={c.file}
                      alt={c.title}
                      className="w-full border-4 border-black rounded-sm cursor-pointer"
                      style={{ imageRendering: "pixelated" }}
                      onClick={() => setViewCert({ src: c.file, title: c.title })}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-black/60">No certificates attached to this project.</p>
            )}
          </RetroWindow>
        </div>
      )}

      {/* Fullscreen cert viewer (kept same) */}
      {viewCert && (
        <CertViewer src={viewCert.src} title={viewCert.title} onClose={() => setViewCert(null)} />
      )}
    </>
  )
}
