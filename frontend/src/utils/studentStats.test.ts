import { describe, expect, it } from 'vitest'
import { searchStudents, studentStats } from './studentStats'
const students = [
  { id: 1, nombres: 'José', apellidos: 'Gómez', carnet: '00123', edad: 17 },
  { id: 2, nombres: 'Ana', apellidos: 'Pérez', carnet: 'AB001', edad: 18 },
  { id: 3, nombres: 'Luis', apellidos: 'Luna', carnet: 'AB002', edad: 35 },
]
describe('Resumen y búsqueda', () => {
  it('asigna cada estudiante a un solo rango y calcula el promedio', () => {
    const stats = studentStats(students)
    expect(stats.total).toBe(3)
    expect(stats.average).toBeCloseTo(70 / 3)
    expect(stats.groups.map(g => g.count)).toEqual([1, 1, 0, 1])
  })
  it('no inventa un promedio en una lista vacía', () => {
    expect(studentStats([]).average).toBeNull()
    expect(studentStats([]).groups.every(g => g.count === 0)).toBe(true)
  })
  it('encuentra apellidos y nombres sin distinguir tildes, y conserva ceros', () => {
    expect(searchStudents(students, ' GOMEZ ')).toEqual([students[0]])
    expect(searchStudents(students, 'jose')).toEqual([students[0]])
    expect(searchStudents(students, '00123')).toEqual([students[0]])
    expect(searchStudents(students, 'nadie')).toEqual([])
  })
})
