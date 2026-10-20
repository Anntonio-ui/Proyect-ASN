import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type Props = { title: string; description: string; children: ReactNode; busy?: boolean; wide?: boolean; onClose: () => void }

// El diálogo nativo contiene el foco, bloquea el fondo y restaura el foco al cerrar.
export function Modal({ title, description, children, busy = false, wide = false, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <dialog ref={ref} className={`modal${wide ? ' modal-wide' : ''}`} aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); if (!busy) onClose() }}
      onClick={event => {
        if (event.target !== event.currentTarget || busy) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
      }}>
      <div className="modal-heading">
        <div><p className="eyebrow">GESTIÓN ACADÉMICA</p><h2 id={titleId}>{title}</h2></div>
        <button type="button" className="icon-button" aria-label="Cerrar ventana" disabled={busy} onClick={onClose}><X size={20} /></button>
      </div>
      <p id={descriptionId} className="muted modal-description">{description}</p>
      {children}
    </dialog>
  )
}
