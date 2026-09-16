import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="Eliminar tablero"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the title and message when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Eliminar tablero"
        message="Esta acción no se puede deshacer."
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Eliminar tablero')).toBeInTheDocument()
    expect(
      screen.getByText('Esta acción no se puede deshacer.')
    ).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        title="Eliminar tablero"
        confirmLabel="Eliminar"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    await user.click(screen.getByText('Eliminar'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        title="Eliminar tablero"
        cancelLabel="Cancelar"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when pressing Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        title="Eliminar tablero"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
