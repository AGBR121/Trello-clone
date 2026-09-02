import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ConfirmDialog from './ConfirmDialog'


function CardDetailModal({ card, onSave, onDelete, onClose }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: { title: '', description: '', due_date: '' },
  })

  // Cada vez que se abre una tarjeta distinta, precarga sus datos.
  useEffect(() => {
    if (card) {
      reset({
        title: card.title || '',
        description: card.description || '',
        due_date: card.due_date ? card.due_date.slice(0, 10) : '',
      })
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

  async function onSubmit(values) {
    const { error } = await onSave(card.id, {
      title: values.title.trim(),
      description: values.description.trim() || null,
      due_date: values.due_date || null,
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
        className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h2
            id="card-detail-title"
            className="text-lg font-semibold text-slate-800 dark:text-slate-100"
          >
            Detalle de la tarjeta
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'El título es obligatorio.' })}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              placeholder="Agrega más detalles (opcional)"
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Fecha límite
            </label>
            <input
              id="due_date"
              type="date"
              {...register('due_date')}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
                className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
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