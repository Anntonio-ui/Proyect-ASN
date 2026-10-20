import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, asApiError, crearEstudiante, isAbortError, listarEstudiantes } from '../services/studentsApi'
import type { ListStatus, NewStudent, Student } from '../types/student'

/** Resultado de intentar registrar: el formulario decide qué hacer según `ok`. */
export type CreateStudentResult = { ok: true; student: Student } | { ok: false; error: ApiError }

/** Agrega o reemplaza por id, conservando el orden ascendente por id que entrega la API. */
function upsertStudent(list: Student[], student: Student): Student[] {
  return [...list.filter((current) => current.id !== student.id), student].sort((a, b) => a.id - b.id)
}

/**
 * Estado de los estudiantes.
 *
 * Reglas que protegen la coherencia de la lista:
 * 1. Carga al montar y expone `reload` para el reintento. Una carga nueva cancela la anterior
 *    y la respuesta de una carga cancelada se ignora.
 * 2. Un GET iniciado ANTES de que un registro termine puede traer datos viejos. Por eso cada
 *    registro exitoso incrementa un contador y, si una carga termina habiendo cambiado ese
 *    contador, su resultado se descarta y se vuelve a consultar. Así el estudiante recién
 *    creado nunca desaparece por una respuesta atrasada.
 * 3. Si el listado no está disponible (`status: 'error'`) y un registro funciona, NO se muestra
 *    ese único estudiante como si fuera el listado completo: se vuelve a consultar el listado.
 *    Si esa consulta también falla, el estado queda en error con la lista vacía.
 * 4. `createStudent` nunca lanza: devuelve `{ ok: true, student }` o `{ ok: false, error }`.
 */
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [status, setStatus] = useState<ListStatus>('cargando')
  const [error, setError] = useState<ApiError | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  // Copia del estado para leerlo dentro de callbacks asíncronos sin depender de un render.
  const statusRef = useRef<ListStatus>('cargando')
  // Cuenta los cambios exitosos (registros) para detectar cargas con datos atrasados.
  const mutationRef = useRef(0)
  // Evita doble envío aunque se haga clic dos veces antes de que React repinte.
  const creatingRef = useRef(false)

  const changeStatus = useCallback((next: ListStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const load = useCallback(async () => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    changeStatus('cargando')
    setError(null)
    try {
      for (;;) {
        const startedAt = mutationRef.current
        const data = await listarEstudiantes(controller.signal)
        if (controller.signal.aborted) return
        // Algo cambió mientras esta consulta estaba en curso: su respuesta puede estar atrasada.
        if (mutationRef.current !== startedAt) continue
        setStudents(data)
        changeStatus('listo')
        return
      }
    } catch (err) {
      if (controller.signal.aborted || isAbortError(err)) return
      // En error no se muestra ninguna lista: así nunca se presenta un listado parcial.
      setStudents([])
      setError(asApiError(err))
      changeStatus('error')
    }
  }, [changeStatus])

  const createStudent = useCallback(
    async (data: NewStudent): Promise<CreateStudentResult> => {
      if (creatingRef.current) {
        return { ok: false, error: new ApiError('Ya hay un registro en proceso.', 'SOLICITUD_EN_CURSO', null) }
      }
      creatingRef.current = true
      setIsCreating(true)
      try {
        const student = await crearEstudiante(data)
        mutationRef.current += 1
        if (statusRef.current === 'listo') {
          setStudents((previous) => upsertStudent(previous, student))
        } else if (statusRef.current === 'error') {
          // No hay listado confiable: se vuelve a pedir completo en lugar de mostrar solo este registro.
          await load()
        }
        // Si está 'cargando', la consulta en curso detecta el cambio y se repite sola (regla 2).
        return { ok: true, student }
      } catch (err) {
        return { ok: false, error: asApiError(err) }
      } finally {
        creatingRef.current = false
        setIsCreating(false)
      }
    },
    [load],
  )

  useEffect(() => {
    void load()
    return () => {
      controllerRef.current?.abort()
    }
  }, [load])

  return {
    students,
    status,
    error,
    isLoading: status === 'cargando',
    /** Carga terminada bien y sin registros (distinto de "búsqueda sin resultados"). */
    isEmpty: status === 'listo' && students.length === 0,
    reload: load,
    isCreating,
    createStudent,
  }
}
