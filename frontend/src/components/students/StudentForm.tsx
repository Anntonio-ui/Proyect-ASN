import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { LoaderCircle, UserPlus } from 'lucide-react'
import type { CreateStudentResult } from '../../hooks/useStudents'
import type { NewStudent, StudentFormValues } from '../../types/student'
import { describeCreateError, FORMULARIO_VACIO, validateStudentForm } from '../../utils/studentValidation'
import type { StudentFormErrors } from '../../utils/studentValidation'
import { Modal } from '../ui/Modal'

type Props = { busy: boolean; onClose: () => void; onCreate: (data: NewStudent) => Promise<CreateStudentResult>; onSuccess: () => void }
export function StudentForm({ busy, onClose, onCreate, onSuccess }: Props) {
  const [values, setValues] = useState<StudentFormValues>({ ...FORMULARIO_VACIO })
  const [errors, setErrors] = useState<StudentFormErrors>({})
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  function focusField(field: string) { formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus() }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    const validation = validateStudentForm(values)
    setMessage('')
    if (!validation.ok) {
      setErrors(validation.errors)
      focusField(Object.keys(validation.errors)[0])
      return
    }
    setErrors({})
    const result = await onCreate(validation.data)
    if (result.ok) { onSuccess(); return }
    const error = describeCreateError(result.error)
    if (error.campo) { setErrors({ [error.campo]: error.mensaje }); focusField(error.campo) }
    else setMessage(error.mensaje)
  }
  return <Modal title="Registrar estudiante" description="Completa los datos. El carnet identifica de forma única a cada estudiante." busy={busy} onClose={onClose}>
    <form ref={formRef} onSubmit={event => void submit(event)} noValidate>
      <div className="form-grid">
        {([
          ['nombres', 'Nombres', 'Ej. Ana Lucía', 100],
          ['apellidos', 'Apellidos', 'Ej. Torres Castro', 100],
          ['carnet', 'Número de carnet', 'Ej. AB202601', 30],
          ['edad', 'Edad', 'De 0 a 120', 3],
        ] as const).map(([field, label, placeholder, maxLength]) => <div className="form-field" key={field}>
          <label htmlFor={`student-${field}`}>{label} <span aria-hidden="true">*</span></label>
          <input id={`student-${field}`} name={field} value={values[field]} placeholder={placeholder}
            maxLength={maxLength} required disabled={busy} inputMode={field === 'edad' ? 'numeric' : 'text'}
            autoComplete={field === 'nombres' ? 'given-name' : field === 'apellidos' ? 'family-name' : 'off'}
            aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `error-${field}` : undefined}
            onChange={event => {
              setValues(previous => ({ ...previous, [field]: event.target.value }))
              setErrors(previous => ({ ...previous, [field]: undefined }))
            }} />
          {errors[field] && <p className="field-error" id={`error-${field}`} role="alert">{errors[field]}</p>}
        </div>)}
      </div>
      <p className="form-hint">Todos los campos son obligatorios. El carnet conserva sus ceros iniciales.</p>
      {message && <p className="error-message" role="alert">{message}</p>}
      <div className="modal-actions"><button type="button" className="button secondary" disabled={busy} onClick={onClose}>Cancelar</button>
        <button className="button primary" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17} /> : <UserPlus size={17} />}{busy ? 'Guardando…' : 'Guardar estudiante'}</button></div>
    </form>
  </Modal>
}
