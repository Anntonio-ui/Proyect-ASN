import { useCallback, useEffect, useRef, useState } from 'react'
import { asApiError, isAbortError, listarEstudiantes } from '../services/studentsApi'
import type { ApiError } from '../services/studentsApi'
import type { ListStatus, Student } from '../types/student'

/**
 * Estado del listado de estudiantes.
 *
 * - Carga al montar y expone `reload` para el botón de reintento.
 * - Si se pide una carga nueva mientras otra sigue en curso, la anterior se cancela
 *   y su respuesta se ignora, para que nunca sobrescriba un estado más reciente.
 */
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [status, setStatus] = useState<ListStatus>('cargando')
  const [error, setError] = useState<ApiError | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const reload = useCallback(async () => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('cargando')
    setError(null)
    try {
      const data = await listarEstudiantes(controller.signal)
      if (controller.signal.aborted) return
      setStudents(data)
      setStatus('listo')
    } catch (err) {
      if (controller.signal.aborted || isAbortError(err)) return
      setError(asApiError(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void reload()
    return () => {
      controllerRef.current?.abort()
    }
  }, [reload])

  return {
    students,
    status,
    error,
    isLoading: status === 'cargando',
    /** Carga terminada bien y sin registros (distinto de "búsqueda sin resultados"). */
    isEmpty: status === 'listo' && students.length === 0,
    reload,
  }
}