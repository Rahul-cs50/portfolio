"use client"

export default function RetroWindow({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose?: () => void
}) {
  return (
    <div className="bg-yellow-50/90 text-black rounded-md border-4 border-black shadow-[0_0_0_4px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between px-3 py-2 border-b-4 border-black bg-yellow-200/90">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 border-2 border-black"
            aria-label="Close"
            title="Close"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black" />
          <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
        </div>
        <div className="text-xs tracking-wider">{title}</div>
        <div className="w-10" />
      </div>

      <div className="p-4">{children}</div>
    </div>
  )
}
