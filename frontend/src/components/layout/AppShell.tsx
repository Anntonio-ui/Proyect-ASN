import type { ReactNode } from 'react'

type AppShellProps = {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

// Marco general: contenedor translúcido con cabecera, barra lateral y contenido.
export function AppShell({ header, sidebar, children }: AppShellProps) {
  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 sm:py-8">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-violeta-fuerte"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto w-full max-w-[1380px] rounded-contenedor border border-white/70 bg-white/40 shadow-suave backdrop-blur-xl">
        <div className="rounded-t-contenedor border-b border-white/60 bg-white/50">
          {header}
        </div>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[200px_1fr]">
          <aside>{sidebar}</aside>
          <main
            id="contenido-principal"
            tabIndex={-1}
            className="min-w-0 focus:outline-none"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}