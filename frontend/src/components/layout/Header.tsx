import { GraduationCap, Search, UserPlus } from 'lucide-react'
import { APP_CONFIG } from '../../config/appConfig'

type HeaderProps = {
  sectionTitle: string
  searchValue: string
  onSearchChange: (value: string) => void
  onRegisterClick: () => void
}

// Cabecera: marca, título de sección, buscador, acción de registro e identidad.
// Es solo visual: el estado del buscador y la acción llegan por props.
export function Header({
  sectionTitle,
  searchValue,
  onSearchChange,
  onRegisterClick,
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-8 sm:py-5 lg:flex-nowrap">
      {/* Marca */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-xl bg-violeta text-white shadow-suave"
        >
          <GraduationCap className="size-5" />
        </span>
        <span className="text-lg font-bold text-violeta-fuerte">
          {APP_CONFIG.name}
        </span>
      </div>

      {/* Título de la sección actual */}
      <h1 className="text-xl font-bold text-tinta">{sectionTitle}</h1>

      {/* Buscador (en móvil pasa a su propia fila) */}
      <div className="relative order-last w-full lg:order-none lg:w-72">
        <label htmlFor="buscador-estudiantes" className="sr-only">
          Buscar estudiantes
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tinta-suave"
        />
        <input
          id="buscador-estudiantes"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar estudiantes"
          className="w-full rounded-xl border border-white/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-tinta placeholder:text-tinta-suave"
        />
      </div>

      {/* Acción principal + identidad del proyecto */}
      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          onClick={onRegisterClick}
          className="inline-flex items-center gap-2 rounded-xl bg-violeta-fuerte px-5 py-2.5 text-sm font-semibold text-white shadow-suave transition hover:brightness-95"
        >
          <UserPlus aria-hidden="true" className="size-4" />
          Registrar estudiante
        </button>

        {/* MARCADOR: escudo del Barcelona (recurso pendiente).
            Sustituir por <img src="..." alt="Escudo del FC Barcelona" />
            Medidas recomendadas: 256x256 px, PNG o SVG con fondo transparente. */}
        <div
          role="img"
          aria-label="Marcador del escudo del Barcelona, pendiente de recurso"
          className="grid size-11 place-items-center rounded-full border-2 border-dashed border-violeta/60 bg-pastel-violeta text-[10px] font-semibold text-tinta-suave"
        >
          Escudo
        </div>
      </div>
    </header>
  )
}