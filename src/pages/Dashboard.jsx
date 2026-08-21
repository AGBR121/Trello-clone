import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBoards } from '../hooks/useBoards'
import ThemeToggle from '../components/ThemeToggle'
import BoardCard from '../components/BoardCard'
import CreateBoardModal from '../components/CreateBoardModal'

function Dashboard() {
  const { user, signOut } = useAuth()
  const { boards, loading, error, createBoard, deleteBoard } = useBoards()
  const navigate = useNavigate()

  const [showCreateModal, setShowCreateModal] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Mis tableros
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
              {user?.email}
            </span>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {boards.length} tablero{boards.length !== 1 && 's'}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo tablero
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Cargando tableros...</p>
        ) : boards.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Todavía no tienes tableros.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Crea tu primer tablero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                currentUserId={user?.id}
                onDelete={deleteBoard}
              />
            ))}
          </div>
        )}
      </main>

      <CreateBoardModal
        open={showCreateModal}
        onCreate={createBoard}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}

export default Dashboard