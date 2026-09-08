import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Modal para editar el nombre de usuario propio.
 */
function EditProfileModal({ open, currentUsername, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '' } })

  useEffect(() => {
    if (open) reset({ username: currentUsername || '' })
  }, [open, currentUsername, reset])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  async function onSubmit({ username }) {
    const { error } = await onSave(username)

    if (error) {
      setError('username', { type: 'manual', message: error })
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
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 rounded-lg shadow-lg w-full max-w-sm p-6"
      >
        <h2
          id="edit-profile-title"
          className="text-lg font-semibold text-slate-800 dark:text-neutral-100 mb-4"
        >
          Editar perfil
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              autoFocus
              {...register('username', {
                required: 'El nombre de usuario es obligatorio.',
                pattern: {
                  value: /^[a-zA-Z0-9_]{3,20}$/,
                  message:
                    '3-20 caracteres: solo letras, números y guion bajo.',
                },
              })}
              className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu_nombre"
            />
            {errors.username && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal