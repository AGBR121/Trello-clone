import { Component } from 'react'

/**
 * Error Boundary de React (debe ser una clase; los hooks no soportan
 * esta funcionalidad todavía). Captura errores de render no
 * controlados en cualquier componente hijo y muestra una pantalla de
 * recuperación en vez de dejar la página en blanco.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // En un proyecto real, aquí se reportaría a un servicio de
    // monitoreo (Sentry, LogRocket, etc.). Por ahora, se deja en
    // consola para depuración local.
    console.error('Uncaught error in the app:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 dark:bg-neutral-900 flex items-center justify-center px-4 transition-colors">
          <div className="text-center max-w-sm">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-neutral-100 mb-2">
              Algo salió mal
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 mb-6">
              Ocurrió un error inesperado. Intenta recargar la página; si
              el problema persiste, contáctanos.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
