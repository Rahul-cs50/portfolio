export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center text-center h-screen"
    >
      <h1 className="text-6xl font-extrabold mb-4">Hi, I’m Rahul 👋</h1>
      <p className="text-xl text-gray-300 mb-6">
        Robotics & AI Engineer | C / Python / Next.js Learner
      </p>
      <a
        href="#projects"
        className="px-6 py-3 bg-blue-500 rounded-full text-lg font-semibold hover:bg-blue-600 transition"
      >
        View My Projects
      </a>
    </section>
  )
}
