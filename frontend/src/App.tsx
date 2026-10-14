import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { VISTAS } from './config/navigation'
import type { VistaId } from './config/navigation'

function App() {
  // Estados temporales solo para revisar el diseño.
  // Helen conectará buscador y registro con la lógica real.
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState<VistaId>('resumen')

  const titulo = VISTAS.find((v) => v.id === vista)?.etiqueta ?? ''

  return (
    <AppShell
      header={
        <Header
          sectionTitle={titulo}
          searchValue={busqueda}
          onSearchChange={setBusqueda}
          onRegisterClick={() => {}}
        />
      }
      sidebar={<Sidebar activeView={vista} onNavigate={setVista} />}
    >
      <div className="rounded-tarjeta border border-white/70 bg-white/60 p-6 text-tinta-suave shadow-suave">
        Vista actual: {titulo} (contenido provisional)
      </div>
    </AppShell>
  )
}

export default App