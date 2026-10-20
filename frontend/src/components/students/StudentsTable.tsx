import { ArrowLeft, ArrowRight, SearchX, Trash2, Users } from 'lucide-react'
import type { Student } from '../../types/student'

type Props = { students: Student[]; query: string; page: number; onPage: (page: number) => void; onDelete: (student: Student) => void; deletingIds: number[] }
export function StudentsTable({ students, query, page, onPage, onDelete, deletingIds }: Props) {
  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const rows = students.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  if (!students.length) return <div className="empty-state">
    {query ? <SearchX size={32} /> : <Users size={32} />}
    <h3>{query ? 'No encontramos coincidencias' : 'Tu primer estudiante empieza aquí'}</h3>
    <p>{query ? 'Prueba con otro nombre, apellido o carnet.' : 'Usa «Registrar estudiante» para comenzar el listado.'}</p>
  </div>
  return <>
    <p className="mobile-table-hint">Desliza la tabla para ver edad y acciones.</p>
    <div className="table-scroll"><table>
      <caption className="sr-only">Listado de estudiantes{query ? ' filtrado por búsqueda' : ''}</caption>
      <thead><tr><th scope="col">Estudiante</th><th scope="col">Carnet</th><th scope="col">Edad</th><th scope="col" className="align-right">Acciones</th></tr></thead>
      <tbody>{rows.map((s, index) => <tr key={s.id}>
        <td><div className="student-identity"><span className={`avatar-mini tone-${index % 4}`} aria-hidden="true">{s.nombres.charAt(0)}{s.apellidos.charAt(0)}</span><span><strong>{s.nombres}</strong><small>{s.apellidos}</small></span></div></td>
        <td><span className="carnet">{s.carnet}</span></td><td>{s.edad} <span className="muted">años</span></td>
        <td className="align-right"><button type="button" className="delete-button" disabled={deletingIds.includes(s.id)} aria-label={`Eliminar a ${s.nombres} ${s.apellidos}`} onClick={() => onDelete(s)}><Trash2 size={16} /><span>Eliminar</span></button></td>
      </tr>)}</tbody>
    </table></div>
    <div className="pagination"><span>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, students.length)} de {students.length} estudiantes</span>
      <div><button className="icon-button" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => onPage(currentPage - 1)}><ArrowLeft size={17} /></button><span>{currentPage} / {totalPages}</span><button className="icon-button" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => onPage(currentPage + 1)}><ArrowRight size={17} /></button></div>
    </div>
  </>
}
