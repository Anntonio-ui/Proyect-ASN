// Vistas de la aplicación. Si se agrega una vista, se declara aquí.
export const VISTAS = [
  { id: 'resumen', etiqueta: 'Resumen' },
  { id: 'estudiantes', etiqueta: 'Estudiantes' },
  { id: 'equipo', etiqueta: 'Equipo' },
] as const

export type VistaId = (typeof VISTAS)[number]['id']