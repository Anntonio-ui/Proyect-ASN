import type { ApiError } from '../services/studentsApi'
import type { NewStudent, StudentFormValues } from '../types/student'

/**
 * Validación del formulario de registro, según docs/contrato-api.md.
 * El backend vuelve a validar: esto solo evita viajes innecesarios y da mensajes claros.
 */

export const LIMITES = {
  nombres: 100,
  apellidos: 100,
  carnet: 30,
  edadMin: 0,
  edadMax: 120,
} as const

export const FORMULARIO_VACIO: StudentFormValues = {
  nombres: '',
  apellidos: '',
  carnet: '',
  edad: '',
}

export type StudentFormErrors = Partial<Record<keyof StudentFormValues, string>>

export type ValidationResult =
  | { ok: true; data: NewStudent }
  | { ok: false; errors: StudentFormErrors }

function errorDeTexto(valor: string, campo: string, max: number): string | undefined {
  if (valor === '') return `Ingresa ${campo}.`
  if (valor.length > max) return `No puede superar ${max} caracteres.`
  return undefined
}

/**
 * Valida los valores del formulario.
 * - Quita espacios al inicio y al final de nombres, apellidos y carnet (igual que el backend).
 * - El carnet se mantiene como texto: no se convierte a número ni se pierden ceros iniciales.
 *   El backend lo pasa a mayúsculas; aquí se envía tal como se escribió.
 * - La edad debe ser un entero escrito solo con dígitos.
 */
export function validateStudentForm(values: StudentFormValues): ValidationResult {
  const nombres = values.nombres.trim()
  const apellidos = values.apellidos.trim()
  const carnet = values.carnet.trim()
  const edadTexto = values.edad.trim()

  const errors: StudentFormErrors = {}

  const errorNombres = errorDeTexto(nombres, 'los nombres', LIMITES.nombres)
  if (errorNombres !== undefined) errors.nombres = errorNombres

  const errorApellidos = errorDeTexto(apellidos, 'los apellidos', LIMITES.apellidos)
  if (errorApellidos !== undefined) errors.apellidos = errorApellidos

  const errorCarnet = errorDeTexto(carnet, 'el carnet', LIMITES.carnet)
  if (errorCarnet !== undefined) errors.carnet = errorCarnet

  let edad = Number.NaN
  if (edadTexto === '') {
    errors.edad = 'Ingresa la edad.'
  } else if (!/^\d+$/.test(edadTexto)) {
    errors.edad = 'La edad debe ser un número entero, sin decimales ni signos.'
  } else {
    edad = Number(edadTexto)
    if (edad < LIMITES.edadMin || edad > LIMITES.edadMax) {
      errors.edad = `La edad debe estar entre ${LIMITES.edadMin} y ${LIMITES.edadMax}.`
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, data: { nombres, apellidos, carnet, edad } }
}

/**
 * Traduce un error de la API al lugar donde debe mostrarse en el formulario.
 * `campo` viene definido solo cuando el error pertenece a un campo concreto.
 */
export function describeCreateError(error: ApiError): { campo?: keyof StudentFormValues; mensaje: string } {
  if (error.codigo === 'CARNET_DUPLICADO') {
    return { campo: 'carnet', mensaje: error.message }
  }
  return { mensaje: error.message }
}