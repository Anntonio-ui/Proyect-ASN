import { useState } from 'react'
import { Code2, Heart, Image, ZoomIn } from 'lucide-react'
import { TEAM } from '../../config/team'
import { Modal } from '../ui/Modal'

type Member = typeof TEAM[number]
function MemberCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  const [missing, setMissing] = useState(false)
  return <button type="button" className={`member-photo member-card-button ${member.color}`} onClick={onOpen}
    disabled={missing} aria-label={`Ampliar carnet de ${member.name}`}>
    {!missing ? <><img src={member.photo} alt={`Carnet completo de ${member.name}`} onError={() => setMissing(true)} /><span className="card-zoom"><ZoomIn size={14} /> Ampliar</span></> : <><span aria-hidden="true">{member.initials}</span><small><Image size={12} /> Carnet pendiente</small></>}
  </button>
}
export function ClubCrest({ compact = false }: { compact?: boolean }) {
  const [missing, setMissing] = useState(false)
  return missing ? <span className="crest-fallback" title="Escudo pendiente">FCB</span> : <img className={compact ? 'crest compact' : 'crest'} src="/images/barcelona.svg" alt="Escudo del FC Barcelona" onError={() => setMissing(true)} />
}
export function TeamSection({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Member | null>(null)
  return <section className={`panel team-section ${compact ? 'compact-team' : ''}`}>
    <div className="panel-heading"><div><p className="eyebrow">CINCO PERSONAS, UN PROYECTO</p><h2>Nuestro equipo</h2></div><span className="icon-tile pastel-pink"><Heart size={21} /></span></div>
    <p className="muted section-copy">Diseño, desarrollo y nube trabajando juntos. Selecciona un carnet para verlo en grande.</p>
    <div className="team-grid">{TEAM.map(member => <article className="member" key={member.name}>
      <MemberCard member={member} onOpen={() => setSelected(member)} /><h3>{member.name}</h3><p>{member.role}</p>
    </article>)}</div>
    {!compact && <div className="club-note"><ClubCrest /><div><strong>Un equipo también fuera del código</strong><p className="muted">Escudo del FC Barcelona · Requisito del proyecto ASN441.</p></div></div>}
    {compact && <p className="team-footnote"><Code2 size={15} /> Proyecto de cátedra · ASN441</p>}
    {selected && <Modal wide title={`Carnet de ${selected.name}`} description={selected.role} onClose={() => setSelected(null)}>
      <img className="full-member-card" src={selected.photo} alt={`Carnet completo de ${selected.name}`} />
    </Modal>}
  </section>
}
