import { useParams } from 'react-router-dom'

function BoardView() {
  const { boardId } = useParams()

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-800">
        Tablero: {boardId}
      </h1>
      <p className="text-slate-500 mt-2">Columnas y tarjetas pendientes</p>
    </div>
  )
}

export default BoardView