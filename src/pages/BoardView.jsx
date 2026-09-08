import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useColumns } from '../hooks/useColumns'
import { useBoardMembers } from '../hooks/useBoardMembers'
import ThemeToggle from '../components/ThemeToggle'
import Column from '../components/Column'
import CreateColumnForm from '../components/CreateColumnForm'
import CardDetailModal from '../components/CardDetailModal'
import MembersPanel from '../components/MembersPanel'

function BoardView() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [board, setBoard] = useState(null)
  const [boardLoading, setBoardLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const {
    columns,
    loading: columnsLoading,
    error,
    createColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
  } = useColumns(boardId)

  const {
    members,
    loading: membersLoading,
    error: membersError,
    inviteMember,
    removeMember,
    leaveBoard,
  } = useBoardMembers(boardId)

  const [activeCard, setActiveCard] = useState(null) // tarjeta arrastrándose (para DragOverlay)
  const [openCard, setOpenCard] = useState(null) // tarjeta abierta en el modal de detalle
  const [showMembers, setShowMembers] = useState(false)

  const isOwner = board?.owner_id === user?.id

  // dnd-kit dispara drag solo si el puntero se mueve más de 8px,
  // así un click normal en la tarjeta sigue abriendo el modal en vez
  // de iniciar un arrastre accidental.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    async function fetchBoard() {
      setBoardLoading(true)
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
      } else {
        setBoard(data)
      }
      setBoardLoading(false)
    }

    fetchBoard()
  }, [boardId])

  function findCardById(cardId) {
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === cardId)
      if (card) return card
    }
    return null
  }

  function handleDragStart(event) {
    const card = findCardById(event.active.id)
    setActiveCard(card)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const sourceColumnId = active.data.current?.columnId
    if (!sourceColumnId) return

    let destColumnId
    let newIndex

    if (over.data.current?.type === 'card') {
      destColumnId = over.data.current.columnId
      const destColumn = columns.find((c) => c.id === destColumnId)
      newIndex = destColumn ? destColumn.cards.findIndex((c) => c.id === over.id) : 0
    } else {
      // Se soltó directamente sobre el área de la columna (ej. vacía).
      destColumnId = over.id
      const destColumn = columns.find((c) => c.id === destColumnId)
      newIndex = destColumn ? destColumn.cards.length : 0
    }

    if (active.id === over.id && sourceColumnId === destColumnId) return

    reorderCards({
      cardId: active.id,
      sourceColumnId,
      destColumnId,
      newIndex,
    })
  }

  async function handleLeaveBoard() {
    const { error } = await leaveBoard()
    if (!error) {
      navigate('/dashboard')
    }
  }

  if (boardLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <p className="text-slate-500 dark:text-slate-400">Cargando tablero...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Tablero no encontrado o sin acceso
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Este tablero no existe o no tienes permiso para verlo.
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
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              aria-label="Volver a mis tableros"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
              {board.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMembers(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md px-3 py-1.5 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Miembros
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800 px-6 py-2">
          {error}
        </p>
      )}

      <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
        {columnsLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Cargando columnas...</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full items-start">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onDeleteColumn={deleteColumn}
                  onCreateCard={createCard}
                  onOpenCard={setOpenCard}
                />
              ))}
              <CreateColumnForm onCreate={createColumn} />
            </div>

            <DragOverlay>
              {activeCard && (
                <div className="bg-white dark:bg-slate-700 dark:border dark:border-slate-600 rounded-md shadow-lg p-3 w-64 rotate-2">
                  <p className="text-sm text-slate-800 dark:text-slate-100">
                    {activeCard.title}
                  </p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <CardDetailModal
        card={openCard}
        onSave={updateCard}
        onDelete={deleteCard}
        onClose={() => setOpenCard(null)}
      />

      <MembersPanel
        open={showMembers}
        isOwner={isOwner}
        members={members}
        loading={membersLoading}
        error={membersError}
        onInvite={inviteMember}
        onRemove={removeMember}
        onLeave={handleLeaveBoard}
        onClose={() => setShowMembers(false)}
      />
    </div>
  )
}

export default BoardView