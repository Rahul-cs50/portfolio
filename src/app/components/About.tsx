"use client"
import RetroWindow from "./RetroWindow"

export default function About({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
      <div className="w-[90%] max-w-3xl">
        <RetroWindow title="About Me" onClose={onClose}>
          <p className="text-sm leading-relaxed text-black">
            I’m <span className="font-bold">Rahul</span>, a B.Tech student in{" "}
            <span className="font-bold">Robotics & Artificial Intelligence</span> at DSU,
            passionate about building smart, affordable, and practical solutions that merge
            technology with real-world impact. My journey so far includes completing{" "}
            <span className="font-bold">Harvard’s CS50x & CS50P</span>, mastering{" "}
            <span className="font-bold">C++</span>, exploring MATLAB through a{" "}
            <span className="font-bold">MathWorks workshop</span>, and becoming a proud{" "}
            <span className="font-bold">IET Student Member</span>. From coding retro-inspired
            projects to experimenting with robotics and low-cost detection systems, I thrive
            on blending creativity with engineering. I see myself as both a{" "}
            <span className="italic">builder and explorer</span>, always learning, experimenting,
            and finding ways to make tech more human, accessible, and exciting. 🚀
          </p>
        </RetroWindow>
      </div>
    </div>
  )
}
