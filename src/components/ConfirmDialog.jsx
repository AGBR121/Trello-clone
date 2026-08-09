import { useEffect } from 'react'

/**
 * <ConfirmDialog
 *   open={showConfirm}
 *   title="Eliminar tablero"
 *   message="Esta acción no se puede deshacer."
 *   confirmLabel="Eliminar"
 *   variant="danger"
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default', // 'default' | 'danger'
  onConfirm,
  onCancel,
}) {
  // Permite cerrar con la tecla Escape.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  const confirmButtonClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-lg w-full max-w-sm p-6"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2"
        >
          {title}
        </h2>

        {message && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${confirmButtonClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog