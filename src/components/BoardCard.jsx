import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

/**
 * Tarjeta de un tablero en la lista del Dashboard.
 * Navega a /board/:id al hacer click, y muestra un botón de eliminar
 * solo si el usuario actual es el owner del tablero.
 */
function BoardCard({ board, currentUserId, onDelete }) {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = board.owner_id === currentUserId

  function handleOpen() {
    navigate(`/board/${board.id}`)
  }

  function handleDeleteClick(e) {
    e.stopPropagation() // evita que también dispare handleOpen
    setShowConfirm(true)
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    await onDelete(board.id)
    setDeleting(false)
    setShowConfirm(false)
  }

  return (
    <>
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
        className="group relative bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md dark:hover:border-slate-600 transition p-5 cursor-pointer"
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate pr-6">
          {board.name}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {isOwner ? 'Dueño' : 'Miembro'}
        </p>

        {isOwner && (
          <button
            type="button"
            onClick={handleDeleteClick}
            aria-label="Eliminar tablero"
            className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Eliminar tablero"
        message={`¿Seguro que quieres eliminar "${board.name}"? Esta acción no se puede deshacer y se perderán todas sus columnas y tarjetas.`}
        confirmLabel={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}

export default BoardCard