// PRUEBAS CON SIMULACIÓN: `fetch` está simulado en este archivo.
// NO usan la API de Azure ni PostgreSQL; comprueban cómo reacciona el servicio ante respuestas controladas.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NewStudent } from '../types/student'
import { ApiError, crearEstudiante, eliminarEstudiante, listarEstudiantes } from './studentsApi'

const ana = { id: 1, nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 }
const nuevo: NewStudent = { nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 }

let calls: { url: string; init?: RequestInit }[] = []

function simular(impl: () => Promise<Response>) {
  calls = []
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return impl()
  })
}

const errorDelServidor = (status: number, codigo: string, mensaje: string) =>
  new Response(JSON.stringify({ error: { codigo, mensaje } }), { status })

/** Espera a que la promesa falle y devuelve el ApiError para revisarlo campo por campo. */
async function fallo(promesa: Promise<unknown>): Promise<ApiError> {
  try {
    await promesa
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    return error as ApiError
  }
  throw new Error('Se esperaba que la promesa fallara')
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:7071/api')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('listarEstudiantes', () => {
  it('lista con datos: GET {base}/estudiantes y el carnet sigue siendo texto', async () => {
    simular(async () => new Response(JSON.stringify([ana]), { status: 200 }))
    const resultado = await listarEstudiantes()
    expect(calls[0].url).toBe('http://localhost:7071/api/estudiantes')
    expect(resultado).toEqual([ana])
    expect(resultado[0].carnet).toBe('001234')
  })

  it('lista vacía devuelve []', async () => {
    simular(async () => new Response('[]', { status: 200 }))
    expect(await listarEstudiantes()).toEqual([])
  })

  it('quita la barra final de VITE_API_BASE_URL', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:7071/api/')
    simular(async () => new Response('[]', { status: 200 }))
    await listarEstudiantes()
    expect(calls[0].url).toBe('http://localhost:7071/api/estudiantes')
  })

  it('error de red: ERROR_RED', async () => {
    simular(async () => {
      throw new TypeError('Failed to fetch')
    })
    const error = await fallo(listarEstudiantes())
    expect(error.codigo).toBe('ERROR_RED')
    expect(error.status).toBeNull()
  })

  it('error 500 con el formato del contrato: usa el código y el mensaje del servidor', async () => {
    simular(async () => errorDelServidor(500, 'ERROR_INTERNO', 'Error interno.'))
    const error = await fallo(listarEstudiantes())
    expect(error.codigo).toBe('ERROR_INTERNO')
    expect(error.message).toBe('Error interno.')
    expect(error.status).toBe(500)
  })

  it('error con cuerpo que no es JSON (ej. HTML de un proxy): mensaje genérico, sin romperse', async () => {
    simular(async () => new Response('<html>Bad gateway</html>', { status: 502 }))
    const error = await fallo(listarEstudiantes())
    expect(error.codigo).toBe('ERROR_INTERNO')
    expect(error.status).toBe(502)
  })

  it('200 con formato inesperado: RESPUESTA_INVALIDA', async () => {
    simular(async () => new Response(JSON.stringify({ hola: 1 }), { status: 200 }))
    expect((await fallo(listarEstudiantes())).codigo).toBe('RESPUESTA_INVALIDA')
  })

  it('sin VITE_API_BASE_URL: CONFIGURACION y no llama a fetch', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    simular(async () => new Response('[]', { status: 200 }))
    expect((await fallo(listarEstudiantes())).codigo).toBe('CONFIGURACION')
    expect(calls).toHaveLength(0)
  })
})

describe('crearEstudiante', () => {
  it('POST con JSON y Content-Type, y devuelve el estudiante con id', async () => {
    simular(async () => new Response(JSON.stringify(ana), { status: 201 }))
    const creado = await crearEstudiante(nuevo)
    expect(calls[0].url).toBe('http://localhost:7071/api/estudiantes')
    expect(calls[0].init?.method).toBe('POST')
    expect(calls[0].init?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(String(calls[0].init?.body))).toEqual(nuevo)
    expect(creado).toEqual(ana)
  })

  it('el carnet viaja como texto con ceros iniciales', async () => {
    simular(async () => new Response(JSON.stringify(ana), { status: 201 }))
    await crearEstudiante(nuevo)
    expect(String(calls[0].init?.body)).toContain('"carnet":"001234"')
  })

  it('envía solo los cuatro campos del contrato aunque el objeto traiga más', async () => {
    simular(async () => new Response(JSON.stringify(ana), { status: 201 }))
    await crearEstudiante({ ...nuevo, id: 99, extra: 'x' } as NewStudent)
    const enviados = Object.keys(JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>).sort()
    expect(enviados).toEqual(['apellidos', 'carnet', 'edad', 'nombres'])
  })

  it('409: CARNET_DUPLICADO con el mensaje del servidor', async () => {
    simular(async () => errorDelServidor(409, 'CARNET_DUPLICADO', 'Ya existe un estudiante con ese carnet.'))
    const error = await fallo(crearEstudiante(nuevo))
    expect(error.codigo).toBe('CARNET_DUPLICADO')
    expect(error.status).toBe(409)
    expect(error.message).toBe('Ya existe un estudiante con ese carnet.')
  })

  it('400: DATOS_INVALIDOS y JSON_INVALIDO', async () => {
    simular(async () => errorDelServidor(400, 'DATOS_INVALIDOS', 'Datos inválidos.'))
    expect((await fallo(crearEstudiante(nuevo))).codigo).toBe('DATOS_INVALIDOS')
    simular(async () => errorDelServidor(400, 'JSON_INVALIDO', 'JSON mal formado.'))
    expect((await fallo(crearEstudiante(nuevo))).codigo).toBe('JSON_INVALIDO')
  })

  it('error de red: ERROR_RED', async () => {
    simular(async () => {
      throw new TypeError('Failed to fetch')
    })
    const error = await fallo(crearEstudiante(nuevo))
    expect(error.codigo).toBe('ERROR_RED')
    expect(error.status).toBeNull()
  })

  it('201 sin id o con cuerpo vacío: RESPUESTA_INVALIDA', async () => {
    simular(async () => new Response(JSON.stringify({ nombres: 'Ana' }), { status: 201 }))
    expect((await fallo(crearEstudiante(nuevo))).codigo).toBe('RESPUESTA_INVALIDA')
    simular(async () => new Response('', { status: 201 }))
    expect((await fallo(crearEstudiante(nuevo))).codigo).toBe('RESPUESTA_INVALIDA')
  })
})

describe('eliminarEstudiante', () => {
  it('DELETE {base}/estudiantes/{id}; un 204 sin contenido resuelve sin error', async () => {
    simular(async () => new Response(null, { status: 204 }))
    await eliminarEstudiante(5)
    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe('http://localhost:7071/api/estudiantes/5')
    expect(calls[0].init?.method).toBe('DELETE')
    expect(calls[0].init?.body).toBeUndefined()
  })

  it('con 204 NO intenta leer JSON (si lo intentara, fallaría)', async () => {
    let intentoLeerCuerpo = false
    simular(
      async () =>
        ({
          ok: true,
          status: 204,
          json: async () => {
            intentoLeerCuerpo = true
            throw new SyntaxError('Unexpected end of JSON input')
          },
          text: async () => {
            intentoLeerCuerpo = true
            return ''
          },
        }) as unknown as Response,
    )
    await eliminarEstudiante(1)
    expect(intentoLeerCuerpo).toBe(false)
  })

  it('404: ESTUDIANTE_NO_ENCONTRADO', async () => {
    simular(async () => errorDelServidor(404, 'ESTUDIANTE_NO_ENCONTRADO', 'No existe el estudiante.'))
    const error = await fallo(eliminarEstudiante(9))
    expect(error.codigo).toBe('ESTUDIANTE_NO_ENCONTRADO')
    expect(error.status).toBe(404)
  })

  it('400: DATOS_INVALIDOS', async () => {
    simular(async () => errorDelServidor(400, 'DATOS_INVALIDOS', 'Id inválido.'))
    const error = await fallo(eliminarEstudiante(9))
    expect(error.codigo).toBe('DATOS_INVALIDOS')
    expect(error.status).toBe(400)
  })

  it('500 con HTML (no JSON): no se rompe', async () => {
    simular(async () => new Response('<html>error</html>', { status: 500 }))
    const error = await fallo(eliminarEstudiante(9))
    expect(error.codigo).toBe('ERROR_INTERNO')
    expect(error.status).toBe(500)
  })

  it('error de red: ERROR_RED', async () => {
    simular(async () => {
      throw new TypeError('Failed to fetch')
    })
    const error = await fallo(eliminarEstudiante(9))
    expect(error.codigo).toBe('ERROR_RED')
    expect(error.status).toBeNull()
  })

  it('un id que no es entero (NaN, 1.5, Infinity) falla antes de llamar a fetch', async () => {
    simular(async () => new Response(null, { status: 204 }))
    for (const id of [Number.NaN, 1.5, Infinity]) {
      expect((await fallo(eliminarEstudiante(id))).codigo).toBe('DATOS_INVALIDOS')
    }
    expect(calls).toHaveLength(0)
  })
})
