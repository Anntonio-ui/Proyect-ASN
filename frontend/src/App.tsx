import { useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronRight, GraduationCap, LoaderCircle, RefreshCw, Trash2, X } from 'lucide-react'
import { AppShell } from './components/layout/AppShell'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { StudentForm } from './components/students/StudentForm'
import { StudentsTable } from './components/students/StudentsTable'
import { TeamSection } from './components/team/TeamSection'
import { Modal } from './components/ui/Modal'
import { VISTAS } from './config/navigation'
import type { VistaId } from './config/navigation'
import type { Student } from './types/student'
import { useStudents } from './hooks/useStudents'
import { searchStudents } from './utils/studentStats'

function App() {
  const api = useStudents()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<VistaId>('resumen')
  const [page, setPage] = useState(1)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')
  const title = VISTAS.find(v => v.id === view)?.etiqueta ?? 'Resumen'
  const filtered = searchStudents(api.students, query)
  const busyDeleting = deleteTarget !== null && api.deletingIds.includes(deleteTarget.id)

  function navigate(next: VistaId) { setView(next); setPage(1); setQuery('') }
  function search(next: string) { setQuery(next); setPage(1); setView('estudiantes') }
  async function confirmDelete() {
    if (!deleteTarget || busyDeleting) return
    setDeleteError('')
    const result = await api.deleteStudent(deleteTarget.id)
    if (result.ok) {
      setDeleteTarget(null)
      setNotice(result.alreadyGone ? 'El estudiante ya no existía. Actualizamos tu listado.' : 'Estudiante eliminado correctamente.')
    } else setDeleteError(result.error.message)
  }

  return <AppShell
    header={<Header sectionTitle={title} searchValue={query} onSearchChange={search} onRegisterClick={() => setRegisterOpen(true)} />}
    sidebar={<><Sidebar activeView={view} onNavigate={navigate} /><div className="sidebar-note"><span className="sidebar-note-icon"><GraduationCap size={34} strokeWidth={1.2} /></span><strong>Pequeños pasos.<br />Grandes futuros.</strong><p>Tu comunidad, en un solo lugar.</p><span>PROYECTO ASN441</span></div></>}>
    <div className="breadcrumb">Gestión académica <ChevronRight size={13} /><span>{title}</span></div>
    {notice && <div className="notice" role="status"><CheckCircle2 size={19} /><span>{notice}</span><button className="icon-button" aria-label="Cerrar mensaje" onClick={() => setNotice('')}><X size={16} /></button></div>}
    {view !== 'equipo' && api.status === 'error' && <div className="error-banner" role="alert"><AlertCircle size={22} /><div><strong>No pudimos cargar el listado</strong><p>{api.error?.message}</p></div><button className="button secondary" onClick={() => void api.reload()}><RefreshCw size={16} />Reintentar</button></div>}
    {view !== 'equipo' && api.isLoading && <p className="loading-label" role="status"><LoaderCircle className="spin" size={16} /> Actualizando estudiantes…</p>}
    {view === 'resumen' && <Dashboard students={api.students} ready={api.status === 'listo'} onStudents={() => navigate('estudiantes')} onRegister={() => setRegisterOpen(true)} />}
    {view === 'estudiantes' && <section className="panel students-panel"><div className="panel-heading"><div><p className="eyebrow">CADA ESTUDIANTE CUENTA</p><h2>Tu comunidad académica</h2><p className="muted section-copy">Consulta y organiza los datos de tus estudiantes.</p></div><button className="icon-button refresh-button" aria-label="Actualizar listado" disabled={api.isLoading} onClick={() => void api.reload()}><RefreshCw className={api.isLoading ? 'spin' : ''} size={19} /></button></div>
      {query && <div className="search-summary"><span>Resultados para «{query}»</span><button className="text-button" onClick={() => search('')}>Limpiar búsqueda</button></div>}
      {api.status === 'listo' && <StudentsTable students={filtered} query={query} page={page} onPage={setPage} onDelete={student => { setDeleteError(''); setDeleteTarget(student) }} deletingIds={api.deletingIds} />}
      {api.isLoading && <div className="table-skeleton" aria-hidden="true">{[1, 2, 3, 4].map(i => <div key={i} />)}</div>}
      {api.status === 'error' && <div className="empty-state"><AlertCircle size={30} /><h3>El listado no está disponible</h3><p>Reintenta la conexión para consultar los estudiantes.</p></div>}
    </section>}
    {view === 'equipo' && <TeamSection />}
    <footer className="app-footer"><span>Hecho en equipo, pensado para aprender.</span><span>ASN441 · Gestión de estudiantes</span></footer>
    {registerOpen && <StudentForm busy={api.isCreating} onClose={() => setRegisterOpen(false)} onCreate={api.createStudent} onSuccess={() => { setRegisterOpen(false); setNotice('Estudiante registrado correctamente.'); setPage(1); setQuery(''); setView('estudiantes') }} />}
    {deleteTarget && <Modal title="¿Eliminar estudiante?" description="Esta acción elimina el registro de la base de datos y no se puede deshacer." busy={busyDeleting} onClose={() => setDeleteTarget(null)}>
      <div className="delete-summary"><span className="icon-tile pastel-pink"><Trash2 size={23} /></span><div><strong>{deleteTarget.nombres} {deleteTarget.apellidos}</strong><p>Carnet: {deleteTarget.carnet}</p></div></div>
      {deleteError && <p className="error-message" role="alert">{deleteError}</p>}
      <div className="modal-actions"><button className="button secondary" autoFocus disabled={busyDeleting} onClick={() => setDeleteTarget(null)}>Cancelar</button><button className="button danger" disabled={busyDeleting} onClick={() => void confirmDelete()}>{busyDeleting && <LoaderCircle className="spin" size={17} />}{busyDeleting ? 'Eliminando…' : 'Eliminar definitivamente'}</button></div>
    </Modal>}
  </AppShell>
}
export default App
