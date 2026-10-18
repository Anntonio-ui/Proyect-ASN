import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, asApiError, crearEstudiante, isAbortError, listarEstudiantes } from '../services/studentsApi'
import type { ListStatus, NewStudent, Student } from '../types/student'

/** Resultado de intentar registrar: el formulario decide qué hacer según `ok`. */
export type CreateStudentResult = { ok: true; student: Student } | { ok: false; error: ApiError }

/**
 * Estado de los estudiantes.
 *
 * - Carga al montar y expone `reload` para el botón de reintento.
 * - Si se pide una carga nueva mientras otra sigue en curso, la anterior se cancela
 *   y su respuesta se ignora, para que nunca sobrescriba un estado más reciente.
 * - `createStudent` registra un estudiante y, si la API responde bien, lo incorpora a la lista.
 *   Nunca lanza: devuelve `{ ok: true, student }` o `{ ok: false, error }`.
 */
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [status, setStatus] = useState<ListStatus>('cargando')
  const [error, setError] = useState<ApiError | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  // Evita doble envío aunque se haga clic dos veces antes de que React repinte.
  const creatingRef = useRef(false)

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

  const createStudent = useCallback(async (data: NewStudent): Promise<CreateStudentResult> => {
    if (creatingRef.current) {
      return { ok: false, error: new ApiError('Ya hay un registro en proceso.', 'SOLICITUD_EN_CURSO', null) }
    }
    creatingRef.current = true
    setIsCreating(true)
    try {
      const student = await crearEstudiante(data)
      // La API ordena por id ascendente: se conserva ese orden.
      setStudents((previous) => [...previous, student].sort((a, b) => a.id - b.id))
      return { ok: true, student }
    } catch (err) {
      return { ok: false, error: asApiError(err) }
    } finally {
      creatingRef.current = false
      setIsCreating(false)
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
    isCreating,
    createStudent,
  }
}