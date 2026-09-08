import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ConfirmDialog from './ConfirmDialog'

// Set fijo de colores (paleta Tailwind, tono 400 para buen contraste
// en ambos modos). Se guardan como hex directo en cards.color.
const COLOR_OPTIONS = [
  { label: 'Rojo', value: '#f87171' },
  { label: 'Naranja', value: '#fb923c' },
  { label: 'Amarillo', value: '#facc15' },
  { label: 'Verde', value: '#4ade80' },
  { label: 'Azul', value: '#60a5fa' },
  { label: 'Morado', value: '#c084fc' },
  { label: 'Rosa', value: '#f472b6' },
]

/**
 * `card` es null cuando el modal está cerrado (se controla así en vez
 * de un booleano `open` separado, porque necesitamos los datos de la
 * tarjeta específica que se abrió).
 *
 * `members` es la lista de miembros del tablero (de useBoardMembers),
 * usada para poblar el selector de encargado.
 */
function CardDetailModal({ card, members = [], onSave, onDelete, onClose }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Color y encargado no son inputs de texto simples, así que se
  // manejan aparte del formulario de React Hook Form.
  const [color, setColor] = useState(null)
  const [initialColor, setInitialColor] = useState(null)
  const [assignedTo, setAssignedTo] = useState('')
  const [initialAssignedTo, setInitialAssignedTo] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: { title: '', description: '', due_date: '' },
  })

  // Cada vez que se abre una tarjeta distinta, precarga todos sus datos.
  useEffect(() => {
    if (card) {
      reset({
        title: card.title || '',
        description: card.description || '',
        due_date: card.due_date ? card.due_date.slice(0, 10) : '',
      })
      setColor(card.color || null)
      setInitialColor(card.color || null)
      setAssignedTo(card.assigned_to || '')
      setInitialAssignedTo(card.assigned_to || '')
    }
  }, [card, reset])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (card) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [card, onClose])

  if (!card) return null

  const hasChanges = isDirty || color !== initialColor || assignedTo !== initialAssignedTo

  async function onSubmit(values) {
    const { error } = await onSave(card.id, {
      title: values.title.trim(),
      description: values.description.trim() || null,
      due_date: values.due_date || null,
      color: color || null,
      assigned_to: assignedTo || null,
    })

    if (!error) onClose()
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    await onDelete(card.id)
    setDeleting(false)
    setShowConfirm(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h2
            id="card-detail-title"
            className="text-lg font-semibold text-slate-800 dark:text-neutral-100"
          >
            Detalle de la tarjeta
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'El título es obligatorio.' })}
              className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              placeholder="Agrega más detalles (opcional)"
              className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Fecha límite
            </label>
            <input
              id="due_date"
              type="date"
              {...register('due_date')}
              className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Color
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setColor(null)}
                aria-label="Sin color"
                title="Sin color"
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                  color === null
                    ? 'border-blue-500'
                    : 'border-slate-300 dark:border-neutral-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  aria-label={opt.label}
                  title={opt.label}
                  style={{ backgroundColor: opt.value }}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    color === opt.value
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Encargado
            </label>
            <select
              id="assigned_to"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.username || m.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Eliminar tarjeta
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Eliminar tarjeta"
        message={`¿Seguro que quieres eliminar "${card.title}"? Esta acción no se puede deshacer.`}
        confirmLabel={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

export default CardDetailModal