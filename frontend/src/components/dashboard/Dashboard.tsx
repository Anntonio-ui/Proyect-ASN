import { ArrowUpRight, GraduationCap, Sparkles, UsersRound, CalendarDays } from 'lucide-react'
import type { Student } from '../../types/student'
import { studentStats } from '../../utils/studentStats'
import { TEAM } from '../../config/team'

type Props = { students: Student[]; ready: boolean; onStudents: () => void; onRegister: () => void }
export function Dashboard({ students, ready, onStudents, onRegister }: Props) {
  const stats = studentStats(students)
  let offset = 0
  const stops = stats.groups.map(group => {
    const start = offset
    offset += stats.total ? group.count / stats.total * 100 : 0
    return `${group.color} ${start}% ${offset}%`
  }).join(', ')
  const maximum = Math.max(1, ...stats.groups.map(group => group.count))
  return <>
    <section className="welcome-banner"><div><p className="eyebrow">TU COMUNIDAD ACADÉMICA</p><h2>Todo comienza<br />con un estudiante.</h2><p>Un espacio para organizar, conectar y seguir creciendo.</p><button className="text-button" onClick={onStudents}>Explorar estudiantes <ArrowUpRight size={17} /></button></div>
      <div className="welcome-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-card"><GraduationCap size={48} strokeWidth={1.25} /><span>Aprender.<br />Conectar. Crecer.</span></div><span className="art-spark"><Sparkles size={24} /></span><span className="art-dot" /></div>
    </section>
    <div className="stats-grid">
      <article className="stat-card"><span className="icon-tile pastel-violet"><GraduationCap size={25} /></span><div><p>Total de estudiantes</p><strong>{ready ? stats.total : '—'}</strong><small>Comunidad registrada</small></div></article>
      <article className="stat-card"><span className="icon-tile pastel-pink"><CalendarDays size={24} /></span><div><p>Edad promedio</p><strong>{ready && stats.average !== null ? stats.average.toLocaleString('es-SV', { maximumFractionDigits: 1 }) : '—'}<em>{ready && stats.average !== null ? ' años' : ''}</em></strong><small>Según el listado actual</small></div></article>
      <article className="stat-card"><span className="icon-tile pastel-green"><UsersRound size={24} /></span><div><p>Integrantes del equipo</p><strong>{TEAM.length.toString().padStart(2, '0')}</strong><small>Ideas que se complementan</small></div></article>
    </div>
    <div className="chart-grid">
      <section className="panel"><div className="panel-heading"><h2>Una comunidad diversa</h2><span className="small-tag">Por edad</span></div>
        {ready && stats.total > 0 ? <><div className="donut" role="img" aria-label={stats.groups.map(g => `${g.label}: ${g.count}`).join('; ')} style={{ background: `conic-gradient(${stops})` }}><div><strong>{stats.total}</strong><span>estudiantes</span></div></div><ul className="chart-legend">{stats.groups.map(g => <li key={g.label}><span className="legend-dot" style={{ background: g.color }} />{g.label}<strong>{g.count}</strong></li>)}</ul></> : <div className="chart-empty"><span className="empty-donut" /><p>{ready ? 'Registra estudiantes para ver la distribución.' : 'La distribución aparecerá al cargar el listado.'}</p></div>}
      </section>
      <section className="panel"><div className="panel-heading"><h2>Estudiantes por edad</h2><span className="small-tag">Listado actual</span></div>
        {ready && stats.total > 0 ? <div className="bar-chart">{stats.groups.map(g => <div className="bar-group" key={g.label}><strong>{g.count}</strong><div className="bar-track"><div className="bar-fill" style={{ height: `${g.count / maximum * 100}%`, background: g.color }} /></div><span>{g.label}</span></div>)}</div> : <div className="chart-empty"><div className="empty-bars" aria-hidden="true"><i /><i /><i /><i /></div><p>{ready ? 'Todavía no hay datos para este gráfico.' : 'Esperando datos del listado.'}</p></div>}
        <p className="chart-caption">Cada registro cuenta. Las cifras se actualizan con tu listado.</p>
      </section>
    </div>
    <section className="quick-action"><span className="icon-tile pastel-yellow"><Sparkles size={24} /></span><div><h3>Una nueva historia por registrar</h3><p>Agrega a la siguiente persona de tu comunidad.</p></div><button className="button primary" onClick={onRegister}>Registrar estudiante <ArrowUpRight size={16} /></button></section>
  </>
}
