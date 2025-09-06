"use client"
import { useState } from "react"
import RetroWindow from "./RetroWindow"
import CertViewer from "./CertViewer"

type Event = {
  year: string
  title: string
  desc: string
  certs?: { title: string; file: string }[]
}

const events: Event[] = [
  { year: "2024", title: "Joined DSU (B.Tech Robotics & AI)", desc: "Started undergraduate journey in Robotics & AI at DSU." },
  { year: "2024", title: "MathWorks Workshop", desc: "Attended MATLAB / Simulink workshop by MathWorks.", certs: [{ title: "MathWorks Workshop", file: "/assets/certs/mathwork.png" }] },
  { year: "2025", title: "Finished CS50x & CS50P", desc: "Completed Harvard’s CS50x and CS50P online courses.", certs: [{ title: "CS50x Certificate", file: "/assets/certs/CS50xfinal.png" }, { title: "CS50P Certificate", file: "/assets/certs/cs50p.png" }] },
  { year: "2025", title: "Completed C++ (Udemy)", desc: "Learned C++ via Udemy course.", certs: [{ title: "C++ Certificate", file: "/assets/certs/C++.jpg" }] },
  { year: "2025", title: "IET Student Member", desc: "Became a student member of the Institution of Engineering and Technology.", certs: [{ title: "IET Membership", file: "/assets/certs/iet.png" }] },
]

export default function Timeline({ onClose }: { onClose?: () => void }) {
  const [selected, setSelected] = useState<Event | null>(null)
  const [viewCert, setViewCert] = useState<{ src: string; title?: string } | null>(null)

  return (
    <>
      {/* Centered main window */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
        <div className="w-[90%] max-w-3xl">
          <RetroWindow title="Timeline" onClose={onClose}>
            <ol className="relative border-l-4 border-black pl-4">
              {events.map((e, i) => (
                <li
                  key={i}
                  className="mb-4 cursor-pointer hover:bg-yellow-100/60 rounded px-2 py-1"
                  onClick={() => setSelected(e)}
                >
                  <div className="absolute -left-[11px] top-2 w-4 h-4 bg-yellow-300 border-4 border-black rounded-full" />
                  <div className="text-sm font-bold">
                    {e.year} — {e.title}
                  </div>
                  <div className="text-xs text-black/80">{e.desc}</div>
                </li>
              ))}
            </ol>
          </RetroWindow>
        </div>
      </div>

      {/* Popup for event details (already centered) */}
      {selected && (
        <div className="fixed left-1/2 top-1/2 z-[100] w-[420px] -translate-x-1/2 -translate-y-1/2">
          <RetroWindow title={selected.title} onClose={() => setSelected(null)}>
            <p className="text-sm text-black mb-3">{selected.desc}</p>
            {selected.certs ? (
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
              <p className="text-xs text-black/60"></p>
            )}
          </RetroWindow>
        </div>
      )}

      {/* Fullscreen Cert Viewer */}
      {viewCert && (
        <CertViewer src={viewCert.src} title={viewCert.title} onClose={() => setViewCert(null)} />
      )}
    </>
  )
}
