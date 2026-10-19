import { LayoutDashboard, Users, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { VISTAS } from '../../config/navigation'
import type { VistaId } from '../../config/navigation'

type SidebarProps = {
  activeView: VistaId
  onNavigate: (view: VistaId) => void
}

const ICONOS: Record<VistaId, LucideIcon> = {
  resumen: LayoutDashboard,
  estudiantes: Users,
  equipo: UsersRound,
}

// Barra lateral en escritorio; en pantallas pequeñas se vuelve una fila compacta.
export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="rounded-panel border border-white/70 bg-white/50 p-2 shadow-suave lg:p-4"
    >
      <ul className="grid grid-cols-3 gap-1 lg:grid-cols-1 lg:gap-2">
        {VISTAS.map((vista) => {
          const Icono = ICONOS[vista.id]
          const activa = vista.id === activeView

          return (
            <li key={vista.id}>
              <button
                type="button"
                onClick={() => onNavigate(vista.id)}
                aria-current={activa ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-semibold transition lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
                  activa
                    ? 'bg-white text-violeta-fuerte shadow-suave'
                    : 'text-tinta-suave hover:bg-white/60'
                }`}
              >
                <Icono aria-hidden="true" className="size-5" />
                {vista.etiqueta}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}