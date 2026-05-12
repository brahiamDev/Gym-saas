import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ROUTES } from '@/routes/route-definitions';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Register:', { name, email, password });
      setIsLoading(false);
    }, 1000);
  };

  const inputClasses =
    'w-full rounded-lg border border-[#334155] bg-input px-4 py-3 text-text placeholder-[#64748B] transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              required
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