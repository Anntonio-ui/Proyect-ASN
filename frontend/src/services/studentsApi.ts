import type { ApiErrorCode, NewStudent, Student } from '../types/student'

/**
 * Único módulo que habla con la API de estudiantes.
 * Contrato: docs/contrato-api.md
 *
 * VITE_API_BASE_URL termina en /api, sin barra final (ej. http://localhost:7071/api).
 * Este módulo añade /estudiantes.
 */

/** Error normalizado: todo lo que falle en la API llega a la interfaz con esta forma. */
export class ApiError extends Error {
  readonly codigo: ApiErrorCode
  /** Estado HTTP, o null si no hubo respuesta (red caída, configuración). */
  readonly status: number | null

  constructor(mensaje: string, codigo: ApiErrorCode, status: number | null) {
    super(mensaje)
    this.name = 'ApiError'
    this.codigo = codigo
    this.status = status
  }
}

const CODIGOS_DEL_CONTRATO: readonly string[] = [
  'DATOS_INVALIDOS',
  'JSON_INVALIDO',
  'ESTUDIANTE_NO_ENCONTRADO',
  'CARNET_DUPLICADO',
  'ERROR_INTERNO',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStudent(value: unknown): value is Student {
  return (
    isRecord(value) &&
    typeof value.id === 'number' && Number.isInteger(value.id) && value.id > 0 &&
    typeof value.nombres === 'string' &&
    typeof value.apellidos === 'string' &&
    typeof value.carnet === 'string' &&
    typeof value.edad === 'number' && Number.isInteger(value.edad) && value.edad >= 0 && value.edad <= 120
  )
}

function getBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (raw === undefined || raw.trim() === '') {
    throw new ApiError(
      'Falta configurar VITE_API_BASE_URL. Revisa frontend/.env.example.',
      'CONFIGURACION',
      null,
    )
  }
  return raw.trim().replace(/\/+$/, '')
}

/** Convierte una respuesta no exitosa en ApiError, sin asumir que traiga JSON. */
async function toApiError(response: Response): Promise<ApiError> {
  let codigo: ApiErrorCode = 'ERROR_INTERNO'
  let mensaje = 'Ocurrió un error inesperado en el servidor.'
  try {
    const body: unknown = await response.json()
    if (isRecord(body) && isRecord(body.error)) {
      const { codigo: c, mensaje: m } = body.error
      if (typeof c === 'string' && CODIGOS_DEL_CONTRATO.includes(c)) {
        codigo = c as ApiErrorCode
      }
      if (typeof m === 'string' && m.trim() !== '') mensaje = m
    }
  } catch {
    // Cuerpo vacío o que no es JSON (ej. una página de error del proxy): se usan los valores por defecto.
  }
  return new ApiError(mensaje, codigo, response.status)
}

/** Hace la petición y lanza ApiError si falla. Deja pasar AbortError tal cual. */
async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${getBaseUrl()}${path}`
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      'ERROR_RED',
      null,
    )
  }
  if (!response.ok) throw await toApiError(response)
  return response
}

/** Lee el cuerpo de una respuesta exitosa que debe ser JSON. */
async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    throw new ApiError('La respuesta del servidor no es válida.', 'RESPUESTA_INVALIDA', response.status)
  }
}

/**
 * True si el error es una cancelación voluntaria (AbortController), no un fallo real.
 * Se compara por nombre y no con instanceof, para que funcione igual en el navegador y en las pruebas.
 */
export function isAbortError(error: unknown): boolean {
  return isRecord(error) && error.name === 'AbortError'
}

/** Garantiza un ApiError para mostrar en pantalla, sea cual sea lo que se haya lanzado. */
export function asApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  return new ApiError('Ocurrió un error inesperado.', 'ERROR_INTERNO', null)
}

/** GET /estudiantes → 200 con arreglo (vacío si no hay registros), ordenado por id. */
export async function listarEstudiantes(signal?: AbortSignal): Promise<Student[]> {
  const response = await request('/estudiantes', { method: 'GET', signal })
  const data = await readJson(response)
  if (!Array.isArray(data) || !data.every(isStudent)) {
    throw new ApiError('La respuesta del servidor no tiene el formato esperado.', 'RESPUESTA_INVALIDA', response.status)
  }
  return data
}

/**
 * POST /estudiantes → 201 con el estudiante creado (incluye id).
 * Se envían solo los cuatro campos del contrato: la API rechaza campos adicionales.
 */
export async function crearEstudiante(data: NewStudent, signal?: AbortSignal): Promise<Student> {
  const body = JSON.stringify({
    nombres: data.nombres,
    apellidos: data.apellidos,
    carnet: data.carnet,
    edad: data.edad,
  })
  const response = await request('/estudiantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal,
  })
  const created = await readJson(response)
  if (!isStudent(created)) {
    throw new ApiError('La respuesta del servidor no tiene el formato esperado.', 'RESPUESTA_INVALIDA', response.status)
  }
  return created
}

/**
 * DELETE /estudiantes/{id} → 204 sin contenido.
 * Una respuesta 204 no trae cuerpo, así que no se intenta leer JSON.
 * Si el estudiante ya no existe la API responde 404 y se lanza ApiError ESTUDIANTE_NO_ENCONTRADO.
 */
export async function eliminarEstudiante(id: number, signal?: AbortSignal): Promise<void> {
  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
    throw new ApiError('El identificador del estudiante no es válido.', 'DATOS_INVALIDOS', null)
  }
  await request(`/estudiantes/${id}`, { method: 'DELETE', signal })
}
