import type { Student } from '../types/student'

export const AGE_GROUPS = [
  { label: '0–17 años', min: 0, max: 17, color: '#8275ed' },
  { label: '18–24 años', min: 18, max: 24, color: '#f6b8cf' },
  { label: '25–34 años', min: 25, max: 34, color: '#a6cf80' },
  { label: '35–120 años', min: 35, max: 120, color: '#f3c75b' },
] as const

export function studentStats(students: Student[]) {
  return {
    total: students.length,
    average: students.length ? students.reduce((sum, s) => sum + s.edad, 0) / students.length : null,
    groups: AGE_GROUPS.map(group => ({ ...group, count: students.filter(s => s.edad >= group.min && s.edad <= group.max).length })),
  }
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
export function searchStudents(students: Student[], query: string) {
  const term = normalize(query.trim())
  return students.filter(s => normalize(`${s.nombres} ${s.apellidos} ${s.carnet}`).includes(term))
}
