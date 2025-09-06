export default function RetroFolders() {
  const items = [
    { id: "home",     label: "Home" },
    { id: "about",    label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact",  label: "Contact" },
  ]

  return (
    <section className="relative z-50 mt-24 mb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`}
               className="group select-none">
              {/* Folder body */}
              <div className="bg-yellow-300/90 text-black rounded-md
                              border-4 border-black
                              shadow-[0_0_0_4px_rgba(0,0,0,1)]
                              px-3 pt-5 pb-4
                              transition-transform duration-150
                              group-hover:-translate-y-1">
                {/* Folder tab */}
                <div className="w-10 h-2 bg-yellow-300/90 border-4 border-black
                                -mt-7 mb-3 rounded-sm" />
                {/* Folder icon / emoji works great for pixel vibe */}
                <div className="text-3xl leading-none">🗂️</div>
              </div>
              <p className="mt-2 text-center text-xs tracking-wider opacity-90">
                {it.label}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
