import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ThemeToggle from '../components/ThemeToggle'

function BoardView() {
  const { boardId } = useParams()
  const navigate = useNavigate()

  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchBoard() {
      setLoading(true)
      setNotFound(false)

      // Si el tablero no existe, o RLS lo bloquea porque no eres
      // owner/member, Supabase simplemente no devuelve la fila
      // (data === null), sin lanzar un error explícito.
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .maybeSingle()

      if (!active) return

      if (error || !data) {
        setNotFound(true)
        setBoard(null)
      } else {
        setBoard(data)
      }

      setLoading(false)
    }

    fetchBoard()

    return () => {
      active = false
    }
  }, [boardId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <p className="text-slate-500 dark:text-slate-400">Cargando tablero...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Tablero no encontrado o sin acceso
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Este tablero no existe, o no tienes permiso para verlo.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Volver a mis tableros
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/dashboard"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
              aria-label="Volver a mis tableros"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
              {board.name}
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-slate-500 dark:text-slate-400">
          Columnas y tarjetas pendientes (spec 004).
        </p>
      </main>
    </div>
  )
}

export default BoardView