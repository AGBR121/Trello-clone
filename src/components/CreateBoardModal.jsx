import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Modal para crear un tablero nuevo.
 * onCreate debe ser una función async que reciba el nombre y devuelva
 * { boardId, error } (la forma que expone useBoards().createBoard).
 */
function CreateBoardModal({ open, onCreate, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '' } })

  // Limpia el formulario cada vez que el modal se vuelve a abrir.
  useEffect(() => {
    if (open) reset({ name: '' })
  }, [open, reset])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  async function onSubmit({ name }) {
    const { boardId, error } = await onCreate(name)

    if (error) {
      setError('name', { type: 'manual', message: error })
      return
    }

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
        aria-labelledby="create-board-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-lg w-full max-w-sm p-6"
      >
        <h2
          id="create-board-title"
          className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4"
        >
          Nuevo tablero
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="board-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Nombre del tablero
            </label>
            <input
              id="board-name"
              type="text"
              autoFocus
              {...register('name', {
                required: 'El nombre es obligatorio.',
                maxLength: {
                  value: 60,
                  message: 'Máximo 60 caracteres.',
                },
              })}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Proyecto final"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBoardModal