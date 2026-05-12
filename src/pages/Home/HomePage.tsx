import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Users, Activity, Trophy } from 'lucide-react';
import { ROUTES } from '@/routes/route-definitions';

const features = [
  {
    icon: Users,
    title: 'Gestión de Socios',
    description: 'Administra membresías, pagos y asistencia en un solo lugar',
  },
  {
    icon: Activity,
    title: 'Aforo en Tiempo Real',
    description: 'Monitorea la capacidad de tu gimnasio en vivo',
  },
  {
    icon: Trophy,
    title: 'Gamificación',
    description: 'Motiva a tus socios con puntos, rachas y rankings',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body text-text">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Gradient glow effect */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] md:h-[600px] md:w-[600px]" />
          <div className="absolute h-[300px] w-[300px] rounded-full bg-secondary/15 blur-[100px] md:h-[400px] md:w-[400px]" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="mb-6"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
              <Dumbbell className="h-10 w-10 text-primary" />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="font-display text-6xl tracking-wide text-text md:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            GymSaaS
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-4 max-w-md text-lg text-muted md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Software de gestión inteligente para gimnasios modernos
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="rounded-lg bg-primary px-8 py-3.5 font-display text-lg tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Iniciar Sesión
            </motion.button>
            <motion.button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="rounded-lg border border-secondary px-8 py-3.5 font-display text-lg tracking-wider text-secondary transition-colors hover:bg-secondary/10"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Crear Cuenta
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-24 pt-8">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            className="mb-12 text-center font-display text-4xl tracking-wider text-text md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Todo lo que necesitas
          </motion.h2>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group rounded-xl border border-border bg-surface/80 p-6 backdrop-blur-md transition-colors hover:border-primary/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl tracking-wider text-text">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} GymSaaS. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}