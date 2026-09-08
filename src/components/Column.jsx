import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import CardItem from './CardItem'
import ConfirmDialog from './ConfirmDialog'

/**
 * Columna del tablero: header con nombre + eliminar, lista de tarjetas
 * arrastrable (SortableContext), zona de soltado (useDroppable, para
 * poder soltar una tarjeta incluso en una columna vacía), y el input
 * inline para agregar tarjetas al final.
 */
function Column({ column, onDeleteColumn, onCreateCard, onOpenCard }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [addingCard, setAddingCard] = useState(false)

  const { setNodeRef } = useDroppable({ id: column.id, data: { type: 'column' } })

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { title: '' } })

  const cardIds = column.cards.map((c) => c.id)

  function startAddingCard() {
    setAddingCard(true)
    setTimeout(() => setFocus('title'), 0)
  }

  function cancelAddingCard() {
    setAddingCard(false)
    reset({ title: '' })
  }

  async function onSubmitCard({ title }) {
    const { error } = await onCreateCard(column.id, { title })
    if (error) return

    reset({ title: '' })
    setFocus('title')
  }

  async function handleConfirmDelete() {
    await onDeleteColumn(column.id)
    setShowConfirm(false)
  }

  return (
    <div className="shrink-0 w-72 bg-slate-200/60 dark:bg-neutral-800 rounded-lg p-3 h-fit max-h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-sm text-slate-700 dark:text-neutral-200 truncate">
          {column.name}
        </h3>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          aria-label="Eliminar columna"
          className="text-slate-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 overflow-y-auto min-h-8"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </SortableContext>
      </div>

      {addingCard ? (
        <form onSubmit={handleSubmit(onSubmitCard)} className="mt-2">
          <textarea
            rows={2}
            {...register('title', { required: true })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancelAddingCard()
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(onSubmitCard)()
              }
            }}
            placeholder="Título de la tarjeta"
            className="w-full border border-slate-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm text-slate-800 dark:text-neutral-100 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md disabled:opacity-50 transition"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={cancelAddingCard}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 p-1.5"
              aria-label="Cancelar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={startAddingCard}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400 hover:bg-slate-300/50 dark:hover:bg-neutral-700 rounded-md px-2 py-2 mt-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar tarjeta
        </button>
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Eliminar columna"
        message={`¿Seguro que quieres eliminar "${column.name}"? Se perderán todas sus tarjetas.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

export default Column