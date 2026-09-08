import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ConfirmDialog from './ConfirmDialog'

/**
 * - Si isOwner: puede invitar por email y remover a cualquier miembro.
 * - Si NO es owner: solo ve la lista y un botón "Salir del tablero".
 */
function MembersPanel({
  open,
  isOwner,
  members,
  loading,
  error,
  onInvite,
  onRemove,
  onLeave,
  onClose,
}) {
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } })

  if (!open) return null

  async function onSubmitInvite({ email }) {
    const { error } = await onInvite(email)
    if (error) {
      setError('email', { type: 'manual', message: error })
      return
    }
    reset({ email: '' })
  }

  async function handleConfirmRemove() {
    await onRemove(confirmRemoveId)
    setConfirmRemoveId(null)
  }

  async function handleConfirmLeave() {
    setLeaving(true)
    await onLeave()
    setLeaving(false)
    setConfirmLeave(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="members-panel-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-lg w-full max-w-md p-6 max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="members-panel-title"
            className="text-lg font-semibold text-slate-800 dark:text-slate-100"
          >
            Miembros del tablero
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

        {isOwner && (
          <form onSubmit={handleSubmit(onSubmitInvite)} className="mb-4">
            <div className="flex gap-2">
              <input
                type="email"
                {...register('email', { required: 'Escribe un email.' })}
                placeholder="email@ejemplo.com"
                className="flex-1 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition"
              >
                {isSubmitting ? 'Invitando...' : 'Invitar'}
              </button>
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </form>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Cargando...</p>
          ) : (
            members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-md px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-100 truncate">
                    {member.email}
                  </p>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {member.role === 'owner' ? 'Dueño' : 'Miembro'}
                  </span>
                </div>

                {isOwner && member.role !== 'owner' && (
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveId(member.user_id)}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline shrink-0 ml-2"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {!isOwner && (
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 hover:underline self-start"
          >
            Salir del tablero
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmRemoveId !== null}
        title="Remover miembro"
        message="Esta persona perderá acceso al tablero inmediatamente."
        confirmLabel="Remover"
        variant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmRemoveId(null)}
      />

      <ConfirmDialog
        open={confirmLeave}
        title="Salir del tablero"
        message="Perderás acceso a este tablero inmediatamente. ¿Seguro que quieres salir?"
        confirmLabel={leaving ? 'Saliendo...' : 'Salir'}
        variant="danger"
        onConfirm={handleConfirmLeave}
        onCancel={() => setConfirmLeave(false)}
      />
    </div>
  )
}

export default MembersPanel