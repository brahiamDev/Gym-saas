import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ROUTES } from '@/routes/route-definitions';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Login:', { email, password });
      setIsLoading(false);
    }, 1000);
  };

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
          Iniciar Sesión
        </h1>
        <p className="mt-1 text-muted">Bienvenido de vuelta</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-medium uppercase tracking-wider text-muted"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#334155] bg-input px-4 py-3 text-text placeholder-[#64748B] transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-medium uppercase tracking-wider text-muted"
            >
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[#334155] bg-input px-4 py-3 text-text placeholder-[#64748B] transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
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
              'Iniciar Sesión'
            )}
          </motion.button>
        </form>

        {/* Forgot password */}
        <p className="mt-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-secondary transition-colors hover:text-secondary/80"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-secondary transition-colors hover:text-secondary/80"
          >
            Regístrate
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}