import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'

function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [infoMessage, setInfoMessage] = useState(null)

  const isSignUp = mode === 'signup'

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } })

  async function onSubmit({ email, password }) {
    setInfoMessage(null)

    const action = isSignUp ? signUp : signIn
    const { data, error } = await action(email, password)

    if (error) {
      // Error a nivel de formulario (no de un campo específico).
      setError('root', { type: 'manual', message: error })
      return
    }

    if (isSignUp) {
      // Si Supabase requiere confirmación de email, no habrá sesión todavía.
      if (!data.session) {
        setInfoMessage(
          'Cuenta creada. Revisa tu email para confirmar tu cuenta antes de iniciar sesión.'
        )
        setMode('signin')
        reset({ email: '', password: '' })
        return
      }
    }

    navigate('/dashboard')
  }

  function toggleMode() {
    setMode(isSignUp ? 'signin' : 'signup')
    setInfoMessage(null)
    reset({ email: '', password: '' })
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 relative transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 w-full max-w-sm transition-colors">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'El email es obligatorio.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un email válido.',
                },
              })}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tucorreo@ejemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres.',
                },
              })}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
              {errors.root.message}
            </p>
          )}

          {infoMessage && (
            <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
              {infoMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting
              ? 'Procesando...'
              : isSignUp
              ? 'Registrarme'
              : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login