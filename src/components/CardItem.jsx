import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function formatDueDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

function getInitials(name) {
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

/**
 * Tarjeta individual dentro de una columna. Arrastrable vía dnd-kit
 * (useSortable). Click abre el detalle (CardDetailModal, manejado por
 * el padre a través de onOpen).
 *
 * `assigneeUsername` ya viene resuelto por el padre (Column), a partir
 * de card.assigned_to + la lista de miembros del tablero.
 */
function CardItem({ card, assigneeUsername, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: 'card', columnId: card.column_id } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const dueDate = formatDueDate(card.due_date)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card)}
      className="bg-white dark:bg-neutral-700 dark:border dark:border-neutral-600 rounded-md shadow-sm hover:shadow-md overflow-hidden cursor-grab active:cursor-grabbing touch-none"
    >
      {card.color && (
        <div className="h-1.5 w-full" style={{ backgroundColor: card.color }} />
      )}

      <div className="p-3">
        <p className="text-sm text-slate-800 dark:text-neutral-100 wrap-break-word">
          {card.title}
        </p>

        {(dueDate || assigneeUsername) && (
          <div className="flex items-center justify-between mt-2">
            {dueDate ? (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {dueDate}
              </span>
            ) : (
              <span />
            )}

            {assigneeUsername && (
              <span
                title={assigneeUsername}
                className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-semibold flex items-center justify-center shrink-0"
              >
                {getInitials(assigneeUsername)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardItem