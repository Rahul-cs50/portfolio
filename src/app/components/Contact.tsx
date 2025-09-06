"use client"
import RetroWindow from "./RetroWindow"

export default function Contact({ onClose }: { onClose?: () => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert("Message sent! (Wire to email/API later.)")
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
      <div className="w-[90%] max-w-3xl">
        <RetroWindow title="Contact" onClose={onClose}>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="text-xs">Name</label>
            <input className="bg-yellow-50 border-4 border-black px-2 py-1 rounded-sm focus:bg-white" name="name" required />

            <label className="text-xs mt-2">Email</label>
            <input className="bg-yellow-50 border-4 border-black px-2 py-1 rounded-sm focus:bg-white" type="email" name="email" required />

            <label className="text-xs mt-2">Message</label>
            <textarea className="bg-yellow-50 border-4 border-black px-2 py-1 rounded-sm min-h-[120px] focus:bg-white" name="message" required />

            <button className="mt-3 bg-yellow-300 border-4 border-black rounded-sm px-3 py-1 hover:-translate-y-0.5 transition" type="submit">
              SEND
            </button>
          </form>
        </RetroWindow>
      </div>
    </div>
  )
}
