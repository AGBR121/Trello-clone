import { useState } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Input inline para agregar una columna nueva al final del tablero.
 * Empieza como un botón "+ Agregar columna"; al hacer click se
 * transforma en un formulario de una sola línea.
 */
function CreateColumnForm({ onCreate }) {
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '' } })

  function startEditing() {
    setIsEditing(true)
    // Espera al siguiente render para que el input ya exista en el DOM.
    setTimeout(() => setFocus('name'), 0)
  }

  function cancelEditing() {
    setIsEditing(false)
    reset({ name: '' })
  }

  async function onSubmit({ name }) {
    const { error } = await onCreate(name)

    if (error) {
      // Errores simples de este form no necesitan bloquear la UI;
      // se muestran igual con setError si se requiere más adelante.
      return
    }

    reset({ name: '' })
    // Deja el form abierto para agregar varias columnas seguidas,
    // como en Trello real.
    setFocus('name')
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="shrink-0 w-72 h-fit flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg px-4 py-3 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Agregar columna
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="shrink-0 w-72 bg-slate-200/60 dark:bg-slate-800 rounded-lg p-3"
    >
      <input
        type="text"
        {...register('name', { required: true })}
        onKeyDown={(e) => e.key === 'Escape' && cancelEditing()}
        placeholder="Nombre de la columna"
        className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.name && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          El nombre es obligatorio.
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Agregando...' : 'Agregar'}
        </button>
        <button
          type="button"
          onClick={cancelEditing}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5"
          aria-label="Cancelar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default CreateColumnForm