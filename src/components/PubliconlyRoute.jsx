import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute