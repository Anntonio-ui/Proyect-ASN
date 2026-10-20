// PRUEBAS DE LÓGICA PURA: no usan red ni simulaciones de la API.
import { describe, expect, it } from 'vitest'
import { ApiError } from '../services/studentsApi'
import { describeCreateError, validateStudentForm } from './studentValidation'

const valido = { nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: '20' }

describe('validateStudentForm', () => {
  it('datos válidos: devuelve NewStudent con edad numérica y carnet como texto', () => {
    expect(validateStudentForm(valido)).toEqual({
      ok: true,
      data: { nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 },
    })
  })

  it('quita espacios al inicio y al final', () => {
    const resultado = validateStudentForm({ nombres: '  Ana ', apellidos: ' Pérez  ', carnet: ' 001234 ', edad: ' 20 ' })
    expect(resultado).toEqual({
      ok: true,
      data: { nombres: 'Ana', apellidos: 'Pérez', carnet: '001234', edad: 20 },
    })
  })

  it('campos incompletos: marca cada campo vacío, incluidos los que solo tienen espacios', () => {
    const resultado = validateStudentForm({ nombres: '', apellidos: '   ', carnet: '', edad: '' })
    expect(resultado.ok).toBe(false)
    if (!resultado.ok) expect(Object.keys(resultado.errors).sort()).toEqual(['apellidos', 'carnet', 'edad', 'nombres'])
  })

  for (const edad of ['abc', '20.5', '-1', '1e2', '+20', '20 años', '2 0', '0x10', ',5', '121']) {
    it(`rechaza la edad "${edad}"`, () => {
      const resultado = validateStudentForm({ ...valido, edad })
      expect(resultado.ok).toBe(false)
      if (!resultado.ok) expect(Object.keys(resultado.errors)).toEqual(['edad'])
    })
  }

  it('acepta la edad en los límites 0 y 120', () => {
    for (const edad of ['0', '120']) {
      expect(validateStudentForm({ ...valido, edad }).ok).toBe(true)
    }
  })

  it('respeta las longitudes: 100 y 30 sí, 101 y 31 no', () => {
    const limite = { ...valido, nombres: 'a'.repeat(100), apellidos: 'b'.repeat(100), carnet: 'c'.repeat(30) }
    expect(validateStudentForm(limite).ok).toBe(true)
    expect(validateStudentForm({ ...valido, nombres: 'a'.repeat(101) }).ok).toBe(false)
    expect(validateStudentForm({ ...valido, apellidos: 'b'.repeat(101) }).ok).toBe(false)
    expect(validateStudentForm({ ...valido, carnet: 'c'.repeat(31) }).ok).toBe(false)
  })

  it('el carnet nunca se convierte a número', () => {
    const resultado = validateStudentForm({ ...valido, carnet: '000123' })
    expect(resultado.ok && resultado.data.carnet).toBe('000123')
  })
})

describe('describeCreateError', () => {
  it('CARNET_DUPLICADO se asocia al campo carnet', () => {
    const error = new ApiError('Ya existe un estudiante con ese carnet.', 'CARNET_DUPLICADO', 409)
    expect(describeCreateError(error)).toEqual({ campo: 'carnet', mensaje: 'Ya existe un estudiante con ese carnet.' })
  })

  it('los demás errores son mensajes generales, sin campo', () => {
    expect(describeCreateError(new ApiError('Sin conexión', 'ERROR_RED', null))).toEqual({ mensaje: 'Sin conexión' })
    expect(describeCreateError(new ApiError('Datos inválidos.', 'DATOS_INVALIDOS', 400))).toEqual({
      mensaje: 'Datos inválidos.',
    })
  })
})
