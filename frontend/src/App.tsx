function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 p-6">
      <section className="w-full max-w-xl rounded-3xl border border-white/80 bg-white/60 p-10 shadow-xl shadow-violet-200/50">
        <p className="text-sm font-semibold tracking-widest text-violet-600">
          PROYECTO ASN441
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-800">
          Gestión de estudiantes
        </h1>

        <p className="mt-4 leading-relaxed text-slate-600">
          Base del frontend preparada para el trabajo del equipo.
        </p>

        <span className="mt-6 inline-block rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
          React + TypeScript + Tailwind
        </span>
      </section>
    </main>
  )
}

export default App