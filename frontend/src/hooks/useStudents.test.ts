// PRUEBAS CON SIMULACIÓN: `fetch` está simulado en este archivo.
// NO usan la API de Azure ni PostgreSQL; comprueban cómo reacciona el hook ante respuestas controladas.
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NewStudent, Student } from '../types/student'
import { useStudents } from './useStudents'
import type { CreateStudentResult } from './useStudents'

const ana: Student = { id: 1, nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 }
const luis: Student = { id: 2, nombres: 'Luis', apellidos: 'Gómez', carnet: 'A-77', edad: 22 }
const nuevoDatos: NewStudent = { nombres: 'Eva', apellidos: 'Ruiz', carnet: 'B-1', edad: 19 }
const eva: Student = { id: 3, ...nuevoDatos }

type Handler = (init?: RequestInit) => Promise<Response>
let queue: Handler[] = []
let calls: { url: string; method: string }[] = []
let unexpected: string[] = []

const jsonResponse = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status })
const json = (data: unknown, status = 200): Handler => async () => jsonResponse(data, status)
const apiError = (status: number, codigo: string, mensaje: string): Handler =>
  json({ error: { codigo, mensaje } }, status)
const networkFailure: Handler = async () => {
  throw new TypeError('Failed to fetch')
}

function deferred() {
  let resolve!: (response: Response) => void
  const promise = new Promise<Response>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

type HookResult = { current: ReturnType<typeof useStudents> }

async function crear(result: HookResult, data: NewStudent): Promise<CreateStudentResult | undefined> {
  const salida: { value?: CreateStudentResult } = {}
  await act(async () => {
    salida.value = await result.current.createStudent(data)
  })
  return salida.value
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:7071/api')
  queue = []
  calls = []
  unexpected = []
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method ?? 'GET' })
    const next = queue.shift()
    if (next === undefined) {
      unexpected.push(url)
      throw new TypeError('fetch no esperado en la prueba')
    }
    return next(init)
  })
})

afterEach(() => {
  cleanup()
  expect(unexpected).toEqual([])
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('useStudents: listado', () => {
  it('carga al montar: pasa de cargando a listo con los datos y llama una sola vez', async () => {
    queue.push(json([ana]))
    const { result } = renderHook(() => useStudents())
    expect(result.current.status).toBe('cargando')
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.status).toBe('listo'))
    expect(result.current.students).toEqual([ana])
    expect(result.current.isEmpty).toBe(false)
    expect(calls).toEqual([{ url: 'http://localhost:7071/api/estudiantes', method: 'GET' }])
  })

  it('lista vacía: queda listo e isEmpty', async () => {
    queue.push(json([]))
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('listo'))
    expect(result.current.isEmpty).toBe(true)
  })

  it('error de red y reintento: muestra el error y luego se recupera con reload', async () => {
    queue.push(networkFailure)
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.codigo).toBe('ERROR_RED')
    expect(result.current.isEmpty).toBe(false)

    queue.push(json([ana]))
    await act(async () => {
      await result.current.reload()
    })
    expect(result.current.status).toBe('listo')
    expect(result.current.error).toBeNull()
    expect(result.current.students).toEqual([ana])
  })

  it('una respuesta GET antigua no sobrescribe a la más reciente', async () => {
    const primera = deferred()
    queue.push(() => primera.promise)
    const { result } = renderHook(() => useStudents())

    queue.push(json([ana, luis]))
    await act(async () => {
      await result.current.reload()
    })
    expect(result.current.students).toEqual([ana, luis])

    await act(async () => {
      primera.resolve(jsonResponse([ana]))
    })
    expect(result.current.students).toEqual([ana, luis])
    expect(result.current.status).toBe('listo')
  })

  it('al desmontar cancela la petición en curso', async () => {
    let signal: AbortSignal | null | undefined
    queue.push((init) => {
      signal = init?.signal
      return new Promise<Response>(() => undefined)
    })
    const { unmount } = renderHook(() => useStudents())
    expect(signal?.aborted).toBe(false)
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})

describe('useStudents: escenario 1, un GET iniciado antes del registro', () => {
  it('no sobrescribe la lista ni hace desaparecer al estudiante creado', async () => {
    // El GET inicial sale antes del registro y su respuesta (sin el estudiante) llegará tarde.
    const primerGet = deferred()
    queue.push(() => primerGet.promise)
    const { result } = renderHook(() => useStudents())
    expect(result.current.status).toBe('cargando')

    // El registro termina bien mientras ese GET sigue pendiente.
    queue.push(json(eva, 201))
    // La API ya incluye al estudiante cuando se vuelve a consultar.
    queue.push(json([eva]))
    const registro = await crear(result, nuevoDatos)
    expect(registro?.ok).toBe(true)

    // Llega tarde la respuesta del primer GET, que NO incluye al estudiante creado.
    await act(async () => {
      primerGet.resolve(jsonResponse([]))
    })
    await waitFor(() => expect(result.current.status).toBe('listo'))

    expect(result.current.students).toEqual([eva])
    expect(calls.map((call) => call.method)).toEqual(['GET', 'POST', 'GET'])
  })

  it('no duplica al estudiante si un GET ya lo traía cuando termina el registro', async () => {
    queue.push(json([]))
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('listo'))

    // El POST queda pendiente; mientras tanto, otra consulta ya ve al estudiante en el servidor.
    const post = deferred()
    queue.push(() => post.promise)
    const envios: Promise<CreateStudentResult>[] = []
    act(() => {
      envios.push(result.current.createStudent(nuevoDatos))
    })
    queue.push(json([eva]))
    await act(async () => {
      await result.current.reload()
    })
    expect(result.current.students).toEqual([eva])

    await act(async () => {
      post.resolve(jsonResponse(eva, 201))
    })
    const registro = await envios[0]
    expect(registro.ok).toBe(true)
    expect(result.current.students).toEqual([eva])
    expect(result.current.students).toHaveLength(1)
  })
})

describe('useStudents: escenario 2, el listado falla pero un registro funciona', () => {
  it('vuelve a consultar y muestra la lista completa, no solo el registro nuevo', async () => {
    queue.push(networkFailure)
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.students).toEqual([])

    queue.push(json(eva, 201))
    queue.push(json([ana, luis, eva]))
    const registro = await crear(result, nuevoDatos)

    expect(registro?.ok).toBe(true)
    await waitFor(() => expect(result.current.status).toBe('listo'))
    expect(result.current.students).toEqual([ana, luis, eva])
    expect(result.current.error).toBeNull()
    expect(calls.map((call) => call.method)).toEqual(['GET', 'POST', 'GET'])
  })

  it('si la nueva consulta también falla, queda en error con la lista vacía (no [nuevo])', async () => {
    queue.push(networkFailure)
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('error'))

    queue.push(json(eva, 201))
    queue.push(networkFailure)
    const registro = await crear(result, nuevoDatos)

    // El registro sí se guardó, y así se informa; pero el listado sigue sin estar disponible.
    expect(registro?.ok).toBe(true)
    expect(result.current.status).toBe('error')
    expect(result.current.students).toEqual([])
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.error?.codigo).toBe('ERROR_RED')
  })
})

describe('useStudents: registro', () => {
  it('agrega al estudiante conservando el orden por id', async () => {
    queue.push(json([luis]))
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('listo'))

    queue.push(json(ana, 201))
    const registro = await crear(result, { nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 })
    expect(registro?.ok).toBe(true)
    expect(result.current.students).toEqual([ana, luis])
    expect(result.current.isCreating).toBe(false)
    expect(calls[1].method).toBe('POST')
  })

  it('carnet duplicado (409): devuelve el error, no cambia la lista y libera isCreating', async () => {
    queue.push(json([ana]))
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('listo'))

    queue.push(apiError(409, 'CARNET_DUPLICADO', 'Ya existe un estudiante con ese carnet.'))
    const registro = await crear(result, nuevoDatos)
    expect(registro?.ok).toBe(false)
    if (registro !== undefined && !registro.ok) {
      expect(registro.error.codigo).toBe('CARNET_DUPLICADO')
      expect(registro.error.message).toBe('Ya existe un estudiante con ese carnet.')
    }
    expect(result.current.students).toEqual([ana])
    expect(result.current.isCreating).toBe(false)
  })

  it('un segundo envío mientras hay uno en curso se ignora (una sola petición POST)', async () => {
    queue.push(json([]))
    const { result } = renderHook(() => useStudents())
    await waitFor(() => expect(result.current.status).toBe('listo'))

    const post = deferred()
    queue.push(() => post.promise)
    const envios: Promise<CreateStudentResult>[] = []
    act(() => {
      envios.push(result.current.createStudent(nuevoDatos))
    })
    expect(result.current.isCreating).toBe(true)

    const segundo = await crear(result, nuevoDatos)
    expect(segundo?.ok).toBe(false)
    if (segundo !== undefined && !segundo.ok) expect(segundo.error.codigo).toBe('SOLICITUD_EN_CURSO')

    await act(async () => {
      post.resolve(jsonResponse(eva, 201))
    })
    expect((await envios[0]).ok).toBe(true)
    await waitFor(() => expect(result.current.isCreating).toBe(false))
    expect(calls.filter((call) => call.method === 'POST')).toHaveLength(1)
    expect(result.current.students).toEqual([eva])
  })
})
