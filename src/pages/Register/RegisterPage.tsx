import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, User } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ROUTES } from '@/routes/route-definitions';
import { useAuth } from '@/hooks';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setPasswordError('');
    setSuccessMessage('');

    // Validación: contraseñas coinciden
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Validación: contraseña mínima 6 caracteres (requerido por Supabase)
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // El rol siempre es 'member' — el staff se asigna desde Supabase
    const result = await signUp(email, password, name);

    if (result.success) {
      setSuccessMessage('¡Cuenta creada e iniciada sesión correctamente!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-[#334155] bg-input px-4 py-3 text-text placeholder-[#64748B] transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50';

  const labelClasses =
    'text-xs font-medium uppercase tracking-wider text-muted';

  return (
    <AuthLayout>
      <motion.div
        className="w-full max-w-md rounded-xl border border-border bg-surface/80 p-8 backdrop-blur-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* Header */}
        <h1 className="font-display text-4xl tracking-wider text-text">
          Crear Cuenta
        </h1>
        <p className="mt-1 text-muted">Únete a GymSaaS</p>

        {/* Role info badge */}
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20">
          <User className="w-4 h-4 text-[#22C55E]" />
          <div>
            <p className="text-sm text-[#22C55E] font-medium">Registro como Socio</p>
            <p className="text-xs text-[#64748B]">
              Si necesitás acceso de staff, contactá a la administración.
            </p>
          </div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 rounded-lg bg-primary/10 border border-primary/30 p-3 text-sm text-primary"
            >
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 rounded-lg bg-danger/10 border border-danger/30 p-3 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="register-name" className={labelClasses}>
              Nombre completo
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-email" className={labelClasses}>
              Email
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-password" className={labelClasses}>
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              required
              disabled={isLoading}
              minLength={6}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-confirm-password" className={labelClasses}>
              Confirmar contraseña
            </label>
            <input
              id="register-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              required
              disabled={isLoading}
              className={`${inputClasses} ${passwordError ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
            />
            {passwordError && (
              <p className="text-sm text-danger">{passwordError}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-display text-lg tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={!isLoading ? { scale: 1.02 } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Cargando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </motion.button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-secondary transition-colors hover:text-secondary/80"
          >
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
