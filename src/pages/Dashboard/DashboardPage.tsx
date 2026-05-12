import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks';
import {
  Users,
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  Search,
  Plus,
  Settings,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CreditCard,
  FileText,
  Shield,
  Clock,
  LogOut,
  ChevronRight,
  Filter,
  Eye,
  QrCode,
  UserCheck,
  ScanLine,
  X,
  Award,
  Flame,
  Trophy,
  Target,
  Dumbbell,
  Heart,
  Download,
  Star,
  Lock,
  Zap,
  Bell,
  Timer,
  Crown,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  color: 'green' | 'cyan' | 'purple' | 'red' | 'orange';
}

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  color: 'green' | 'cyan' | 'purple' | 'red' | 'orange';
  onClick?: () => void;
}

interface MemberRow {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  estado: 'Activo' | 'Inactivo' | 'Por vencer';
  ultimoCheckin: string;
}

interface ActivityItem {
  id: string;
  type: 'checkin' | 'pago' | 'registro';
  description: string;
  time: string;
  icon: ReactNode;
}

interface RevenueData {
  month: string;
  amount: number;
}

interface GrowthData {
  month: string;
  nuevos: number;
  inactivos: number;
}

interface PlanDistribution {
  name: string;
  count: number;
  color: string;
}

interface BadgeData {
  name: string;
  icon: ReactNode;
  unlocked: boolean;
  description: string;
}

interface WorkoutEntry {
  day: string;
  completed: boolean;
}

interface BodyMetrics {
  weight: number;
  height: number;
  bmi: number;
  weightHistory: number[];
}

interface UpcomingClass {
  id: string;
  name: string;
  time: string;
  trainer: string;
  spots: number;
}

interface CurrentlyInGym {
  id: string;
  nombre: string;
  horaIngreso: string;
  plan: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_MEMBERS: MemberRow[] = [
  { id: '1', nombre: 'María González', email: 'maria@email.com', plan: 'Premium', estado: 'Activo', ultimoCheckin: 'Hoy, 08:30' },
  { id: '2', nombre: 'Carlos Pérez', email: 'carlos@email.com', plan: 'Clásico', estado: 'Activo', ultimoCheckin: 'Ayer, 19:15' },
  { id: '3', nombre: 'Ana Martínez', email: 'ana@email.com', plan: 'Premium', estado: 'Por vencer', ultimoCheckin: 'Hace 3 días' },
  { id: '4', nombre: 'Diego López', email: 'diego@email.com', plan: 'Básico', estado: 'Inactivo', ultimoCheckin: 'Hace 2 semanas' },
  { id: '5', nombre: 'Lucía Fernández', email: 'lucia@email.com', plan: 'Clásico', estado: 'Activo', ultimoCheckin: 'Hoy, 10:00' },
  { id: '6', nombre: 'Roberto Sánchez', email: 'roberto@email.com', plan: 'Premium', estado: 'Activo', ultimoCheckin: 'Ayer, 17:45' },
];

const MOCK_REVENUE: RevenueData[] = [
  { month: 'Ene', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Abr', amount: 61000 },
  { month: 'May', amount: 57000 },
  { month: 'Jun', amount: 65000 },
];

const MOCK_GROWTH: GrowthData[] = [
  { month: 'Ene', nuevos: 12, inactivos: 3 },
  { month: 'Feb', nuevos: 15, inactivos: 5 },
  { month: 'Mar', nuevos: 8, inactivos: 4 },
  { month: 'Abr', nuevos: 18, inactivos: 6 },
  { month: 'May', nuevos: 14, inactivos: 3 },
  { month: 'Jun', nuevos: 20, inactivos: 4 },
];

const MOCK_PLANS: PlanDistribution[] = [
  { name: 'Premium', count: 45, color: '#22C55E' },
  { name: 'Clásico', count: 32, color: '#06B6D4' },
  { name: 'Básico', count: 23, color: '#A855F7' },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'checkin', description: 'María González ingresó al gym', time: 'Hace 5 min', icon: <UserCheck className="w-4 h-4" /> },
  { id: '2', type: 'pago', description: 'Carlos Pérez pagó membresía Clásico', time: 'Hace 15 min', icon: <DollarSign className="w-4 h-4" /> },
  { id: '3', type: 'registro', description: 'Nuevo socio: Lucía Fernández', time: 'Hace 1 hora', icon: <UserPlus className="w-4 h-4" /> },
  { id: '4', type: 'checkin', description: 'Roberto Sánchez ingresó al gym', time: 'Hace 2 horas', icon: <UserCheck className="w-4 h-4" /> },
  { id: '5', type: 'pago', description: 'Ana Martínez pagó membresía Premium', time: 'Hace 3 horas', icon: <DollarSign className="w-4 h-4" /> },
];

const MOCK_BADGES: BadgeData[] = [
  { name: 'Primera Semana', icon: <Star className="w-6 h-6" />, unlocked: true, description: '7 días seguidos' },
  { name: 'Guerrero', icon: <Flame className="w-6 h-6" />, unlocked: true, description: '30 día racha' },
  { name: 'Explorador', icon: <Target className="w-6 h-6" />, unlocked: true, description: 'Probó 5 rutinas' },
  { name: 'Mañana', icon: <Zap className="w-6 h-6" />, unlocked: true, description: '10 check-ins matutinos' },
  { name: 'Social', icon: <Users className="w-6 h-6" />, unlocked: false, description: '5 referidos' },
  { name: 'Titanio', icon: <Trophy className="w-6 h-6" />, unlocked: false, description: '1 año de membresía' },
];

const MOCK_WORKOUT_WEEK: WorkoutEntry[] = [
  { day: 'Lun', completed: true },
  { day: 'Mar', completed: true },
  { day: 'Mié', completed: false },
  { day: 'Jue', completed: true },
  { day: 'Vie', completed: false },
  { day: 'Sáb', completed: true },
  { day: 'Dom', completed: false },
];

const MOCK_BODY_METRICS: BodyMetrics = {
  weight: 78,
  height: 175,
  bmi: 25.5,
  weightHistory: [82, 81, 80, 79.5, 79, 78.5, 78],
};

const MOCK_CLASSES: UpcomingClass[] = [
  { id: '1', name: 'CrossFit Intenso', time: '18:00 - 19:00', trainer: 'Coach Ramírez', spots: 3 },
  { id: '2', name: 'Yoga Restaurativo', time: '19:30 - 20:30', trainer: 'Prof. Gómez', spots: 8 },
  { id: '3', name: 'Spinning Power', time: '20:00 - 21:00', trainer: 'Coach Vargas', spots: 5 },
];

const MOCK_CURRENTLY_IN_GYM: CurrentlyInGym[] = [
  { id: '1', nombre: 'María González', horaIngreso: '08:30', plan: 'Premium' },
  { id: '2', nombre: 'Lucía Fernández', horaIngreso: '10:00', plan: 'Clásico' },
  { id: '3', nombre: 'Roberto Sánchez', horaIngreso: '07:15', plan: 'Premium' },
  { id: '4', nombre: 'Tomás Ruiz', horaIngreso: '09:45', plan: 'Básico' },
  { id: '5', nombre: 'Valentina Díaz', horaIngreso: '06:50', plan: 'Premium' },
];

// Deterministic QR pattern (simulates QR code look)
const QR_PATTERN = [
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 0, 1, 0,
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  0, 0, 0, 1, 0, 1, 0, 0, 0,
  1, 0, 1, 0, 1, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1,
];

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// =============================================================================
// COLOR HELPERS
// =============================================================================

const COLOR_MAP = {
  green: {
    text: 'text-[#22C55E]',
    bg: 'bg-[#22C55E]/10',
    border: 'border-[#22C55E]/30',
    gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
  },
  cyan: {
    text: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/30',
    gradient: 'from-[#06B6D4]/20 to-[#06B6D4]/5',
  },
  purple: {
    text: 'text-[#A855F7]',
    bg: 'bg-[#A855F7]/10',
    border: 'border-[#A855F7]/30',
    gradient: 'from-[#A855F7]/20 to-[#A855F7]/5',
  },
  red: {
    text: 'text-[#EF4444]',
    bg: 'bg-[#EF4444]/10',
    border: 'border-[#EF4444]/30',
    gradient: 'from-[#EF4444]/20 to-[#EF4444]/5',
  },
  orange: {
    text: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/30',
    gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5',
  },
} as const;

type ColorKey = keyof typeof COLOR_MAP;

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function StatCard({ icon, title, value, trend, color }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-xl border border-[#1E293B] bg-gradient-to-br ${c.gradient} p-5 backdrop-blur-sm transition-colors hover:border-[#334155]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8]">{title}</p>
          <p className="mt-2 text-3xl font-display tracking-wider text-[#F8FAFC]">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-[#22C55E]" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-[#EF4444]" />
              )}
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-[#64748B]">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function SectionCard({ title, icon, children, action, className = '' }: SectionCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`rounded-xl border border-[#1E293B] bg-[#111827]/80 backdrop-blur-xl p-6 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#94A3B8]">{icon}</span>}
          <h3 className="font-display text-xl tracking-wider text-[#F8FAFC]">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}

function ActionButton({ icon, label, color, onClick }: ActionButtonProps) {
  const c = COLOR_MAP[color];
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0F172A] p-4 text-left transition-all hover:border-[#334155] hover:shadow-lg hover:shadow-black/20 ${c.text}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg}`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-[#F8FAFC]">{label}</span>
    </motion.button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Activo': 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    'Inactivo': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    'Por vencer': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20'}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value, max, color = '#22C55E', label }: { value: number; max: number; color?: string; label?: string }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[#94A3B8]">{label}</span>
          <span className="text-[#F8FAFC]">{pct}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1E293B]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// ADMIN DASHBOARD (gym_owner / admin)
// =============================================================================

function AdminDashboard() {
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState<'Todos' | 'Activo' | 'Inactivo' | 'Por vencer'>('Todos');

  const filteredMembers = useMemo(() => {
    let result = MOCK_MEMBERS;
    if (memberFilter !== 'Todos') {
      result = result.filter((m) => m.estado === memberFilter);
    }
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      result = result.filter(
        (m) => m.nombre.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [memberSearch, memberFilter]);

  const maxRevenue = Math.max(...MOCK_REVENUE.map((r) => r.amount));
  const maxGrowthVal = Math.max(
    ...MOCK_GROWTH.flatMap((g) => [g.nuevos, g.inactivos])
  );
  const totalPlanMembers = MOCK_PLANS.reduce((s, p) => s + p.count, 0);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          title="Total Socios"
          value="142"
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Ingresos del Mes"
          value="$65,000"
          trend={{ value: 8, isPositive: true }}
          color="cyan"
        />
        <StatCard
          icon={<Activity className="h-5 w-5" />}
          title="Aforo Actual"
          value="38 / 100"
          color="purple"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          title="Membresías por Vencer"
          value="7"
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Bar Chart */}
        <SectionCard title="Ingresos últimos 6 meses" icon={<BarChart3 className="h-5 w-5" />}>
          <div className="flex items-end gap-3 h-44">
            {MOCK_REVENUE.map((item, i) => {
              const pct = Math.round((item.amount / maxRevenue) * 100);
              return (
                <div key={item.month} className="flex flex-1 flex-col items-center">
                  <span className="mb-1 text-xs text-[#94A3B8]">
                    ${(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div className="relative w-full" style={{ height: '120px' }}>
                    <motion.div
                      className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-[#22C55E] to-[#22C55E]/60"
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="mt-2 text-xs text-[#94A3B8]">{item.month}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* New vs Inactive Members */}
        <SectionCard title="Socios Nuevos vs Inactivos" icon={<TrendingUp className="h-5 w-5" />}>
          <div className="space-y-4 pt-2">
            {MOCK_GROWTH.map((item) => {
              const nuevosPct = Math.round((item.nuevos / maxGrowthVal) * 100);
              const inactivosPct = Math.round((item.inactivos / maxGrowthVal) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8] w-8">{item.month}</span>
                    <span className="text-[#22C55E]">{item.nuevos}</span>
                    <span className="text-[#EF4444]">{item.inactivos}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1E293B]">
                      <motion.div
                        className="h-full rounded-full bg-[#22C55E]"
                        initial={{ width: 0 }}
                        animate={{ width: `${nuevosPct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1E293B]">
                      <motion.div
                        className="h-full rounded-full bg-[#EF4444]"
                        initial={{ width: 0 }}
                        animate={{ width: `${inactivosPct}%` }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                <span className="text-[#94A3B8]">Nuevos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-[#94A3B8]">Inactivos</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Plan Distribution - Donut */}
        <SectionCard title="Distribución por Plan" icon={<Award className="h-5 w-5" />}>
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="relative h-44 w-44">
              {/* CSS conic-gradient donut */}
              <div
                className="h-44 w-44 rounded-full"
                style={{
                  background: `conic-gradient(
                    #22C55E 0% ${Math.round((MOCK_PLANS[0].count / totalPlanMembers) * 100)}%,
                    #06B6D4 ${Math.round((MOCK_PLANS[0].count / totalPlanMembers) * 100)}% ${Math.round(((MOCK_PLANS[0].count + MOCK_PLANS[1].count) / totalPlanMembers) * 100)}%,
                    #A855F7 ${Math.round(((MOCK_PLANS[0].count + MOCK_PLANS[1].count) / totalPlanMembers) * 100)}% 100%
                  )`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#111827]">
                  <div className="text-center">
                    <p className="font-display text-3xl tracking-wider text-[#F8FAFC]">{totalPlanMembers}</p>
                    <p className="text-xs text-[#94A3B8]">Socios</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {MOCK_PLANS.map((plan) => (
                <div key={plan.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-[#94A3B8]">{plan.name} ({plan.count})</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Members Table */}
      <SectionCard
        title="Gestión de Socios"
        icon={<Users className="h-5 w-5" />}
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-[#22C55E]/10 px-3 py-1.5 text-xs font-medium text-[#22C55E] transition-colors hover:bg-[#22C55E]/20">
            <Plus className="h-3.5 w-3.5" />
            Nuevo Socio
          </button>
        }
      >
        {/* Search & Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] py-2 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none transition-colors focus:border-[#22C55E]/50"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {(['Todos', 'Activo', 'Inactivo', 'Por vencer'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setMemberFilter(f)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  memberFilter === f
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : 'text-[#94A3B8] hover:bg-[#1E293B]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#1E293B] text-left text-xs uppercase tracking-wider text-[#64748B]">
                <th className="pb-3 pr-4 font-medium">Nombre</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Plan</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 pr-4 font-medium">Último Check-in</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[#1E293B]/50 text-sm transition-colors hover:bg-[#0F172A]/50"
                  >
                    <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{member.nombre}</td>
                    <td className="py-3 pr-4 text-[#94A3B8]">{member.email}</td>
                    <td className="py-3 pr-4 text-[#94A3B8]">{member.plan}</td>
                    <td className="py-3 pr-4"><StatusBadge status={member.estado} /></td>
                    <td className="py-3 pr-4 text-[#94A3B8]">{member.ultimoCheckin}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="rounded-md p-1 text-[#94A3B8] transition-colors hover:bg-[#22C55E]/10 hover:text-[#22C55E]">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-md p-1 text-[#94A3B8] transition-colors hover:bg-[#06B6D4]/10 hover:text-[#06B6D4]">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="py-8 text-center text-sm text-[#64748B]">
              No se encontraron socios con ese filtro.
            </div>
          )}
        </div>
      </SectionCard>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <SectionCard title="Acciones Rápidas" icon={<Zap className="h-5 w-5" />}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ActionButton icon={<UserPlus className="h-5 w-5" />} label="Nuevo Socio" color="green" />
            <ActionButton icon={<CreditCard className="h-5 w-5" />} label="Registrar Pago" color="cyan" />
            <ActionButton icon={<FileText className="h-5 w-5" />} label="Crear Plan" color="purple" />
            <ActionButton icon={<BarChart3 className="h-5 w-5" />} label="Ver Reportes" color="orange" />
            <ActionButton icon={<Settings className="h-5 w-5" />} label="Configurar Gym" color="green" />
            <ActionButton icon={<Shield className="h-5 w-5" />} label="Gestionar Staff" color="red" />
          </div>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Actividad Reciente" icon={<Clock className="h-5 w-5" />}>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map((a) => {
              const colors: Record<string, string> = {
                checkin: 'text-[#22C55E] bg-[#22C55E]/10',
                pago: 'text-[#06B6D4] bg-[#06B6D4]/10',
                registro: 'text-[#A855F7] bg-[#A855F7]/10',
              };
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-lg bg-[#0F172A]/50 p-3 transition-colors hover:bg-[#0F172A]">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors[a.type]}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-[#F8FAFC]">{a.description}</p>
                    <p className="text-xs text-[#64748B]">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </motion.div>
  );
}

// =============================================================================
// RECEPCIONISTA DASHBOARD
// =============================================================================

function RecepcionistaDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter] = useState<'En el gym' | 'Todos' | 'Membresía vencida'>('Todos');
  const aforoActual = MOCK_CURRENTLY_IN_GYM.length;

  const filteredGymMembers = useMemo(() => {
    if (memberFilter === 'En el gym') return MOCK_CURRENTLY_IN_GYM;
    if (memberFilter === 'Membresía vencida') {
      return MOCK_MEMBERS.filter((m) => m.estado === 'Por vencer' || m.estado === 'Inactivo')
        .map((m) => ({
          id: m.id,
          nombre: m.nombre,
          horaIngreso: '-',
          plan: m.plan,
        }));
    }
    return MOCK_CURRENTLY_IN_GYM;
  }, [memberFilter]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_MEMBERS.filter(
      (m) => m.nombre.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const aforoCapacity = 100;
  const aforoPct = Math.round((aforoActual / aforoCapacity) * 100);

  const now = new Date();
  const dateString = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeString = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Top Bar - Date & Capacity */}
      <motion.div variants={staggerItem} className="rounded-xl border border-[#1E293B] bg-[#111827]/80 p-4 backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg tracking-wider text-[#F8FAFC]">
            {dateString.charAt(0).toUpperCase() + dateString.slice(1)}
          </p>
          <p className="text-sm text-[#94A3B8]">{timeString} · GymSaaS Fitness Center</p>
        </div>
        <div className="mt-3 sm:mt-0 text-center">
          <p className="text-xs uppercase tracking-widest text-[#94A3B8]">Aforo Actual</p>
          <p className="font-display text-4xl tracking-wider text-[#22C55E]">{aforoActual}<span className="text-lg text-[#94A3B8]">/{aforoCapacity}</span></p>
        </div>
      </motion.div>

      {/* Main Action Buttons */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-3 rounded-xl bg-[#22C55E] px-6 py-5 text-[#0F172A] shadow-lg shadow-[#22C55E]/20 transition-all hover:shadow-xl hover:shadow-[#22C55E]/30"
        >
          <QrCode className="h-7 w-7" />
          <div className="text-left">
            <p className="font-display text-xl tracking-wider">Check-in QR</p>
            <p className="text-xs opacity-70">Escanear código de socio</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-3 rounded-xl border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-6 py-5 text-[#06B6D4] transition-all hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/15"
        >
          <Search className="h-7 w-7" />
          <div className="text-left">
            <p className="font-display text-xl tracking-wider">Buscar Socio</p>
            <p className="text-xs opacity-70">Por nombre, email o código</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-3 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-6 py-5 text-[#F59E0B] transition-all hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/15"
        >
          <CreditCard className="h-7 w-7" />
          <div className="text-left">
            <p className="font-display text-xl tracking-wider">Registrar Pago</p>
            <p className="text-xs opacity-70">Cobrar membresía</p>
          </div>
        </motion.button>
      </motion.div>

      {/* Aforo en Tiempo Real */}
      <SectionCard title="Aforo en Tiempo Real" icon={<Activity className="h-5 w-5" />}>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#94A3B8]">Ocupación</span>
            <span className="font-display text-2xl tracking-wider text-[#F8FAFC]">{aforoPct}%</span>
          </div>
          <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-[#1E293B]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#06B6D4]"
              initial={{ width: 0 }}
              animate={{ width: `${aforoPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#64748B]">Actualmente en el gym</p>
          {MOCK_CURRENTLY_IN_GYM.map((person) => (
            <div key={person.id} className="flex items-center justify-between rounded-lg bg-[#0F172A]/50 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E]/10 text-xs font-bold text-[#22C55E]">
                  {person.nombre.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">{person.nombre}</p>
                  <p className="text-xs text-[#64748B]">{person.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5" />
                <span>{person.horaIngreso}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Socios List */}
      <SectionCard
        title="Socios"
        icon={<Users className="h-5 w-5" />}
        action={
          <div className="flex gap-1.5">
            {(['En el gym', 'Todos', 'Membresía vencida'] as const).map((f) => (
              <button
                key={f}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  memberFilter === f
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : 'text-[#94A3B8] hover:bg-[#1E293B]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-[#1E293B] text-left text-xs uppercase tracking-wider text-[#64748B]">
                <th className="pb-3 pr-4 font-medium">Nombre</th>
                <th className="pb-3 pr-4 font-medium">Plan</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGymMembers.map((member) => (
                <tr key={member.id} className="border-b border-[#1E293B]/50 text-sm transition-colors hover:bg-[#0F172A]/50">
                  <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{member.nombre}</td>
                  <td className="py-3 pr-4 text-[#94A3B8]">{member.plan}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-xs text-[#22C55E]">En el gym</span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-[#22C55E]/10 p-1.5 text-[#22C55E] transition-colors hover:bg-[#22C55E]/20">
                        <ScanLine className="h-4 w-4" />
                      </button>
                      <button className="rounded-md bg-[#06B6D4]/10 p-1.5 text-[#06B6D4] transition-colors hover:bg-[#06B6D4]/20">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Quick Search */}
      <SectionCard title="Búsqueda Rápida" icon={<Search className="h-5 w-5" />}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o código de socio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#1E293B] bg-[#0F172A] py-3 pl-12 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none transition-colors focus:border-[#22C55E]/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <AnimatePresence mode="popLayout">
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {searchResults.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-[#1E293B] bg-[#0F172A]/50 p-3 transition-colors hover:border-[#334155]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06B6D4]/10 text-sm font-bold text-[#06B6D4]">
                      {member.nombre.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-[#F8FAFC]">{member.nombre}</p>
                      <p className="text-xs text-[#64748B]">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={member.estado} />
                    <button className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-[#22C55E]/10 hover:text-[#22C55E]">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {searchQuery.trim() && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 text-center text-sm text-[#64748B]"
            >
              No se encontraron resultados para &quot;{searchQuery}&quot;
            </motion.div>
          )}
        </AnimatePresence>
        {!searchQuery.trim() && (
          <div className="py-4 text-center text-sm text-[#64748B]">
            Ingresá un nombre, email o código para buscar socios
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}

// =============================================================================
// MEMBER DASHBOARD
// =============================================================================

function MemberDashboard() {
  const { profile } = useAuth();
  const initials = (profile?.full_name ?? 'US')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    : 'Miembro reciente';

  const weightHistory = MOCK_BODY_METRICS.weightHistory;
  const weightHistoryMax = Math.max(...weightHistory);
  const weightHistoryMin = Math.min(...weightHistory);
  const weightRange = weightHistoryMax - weightHistoryMin || 1;

  const sparkPoints = weightHistory.map((w, i) => {
    const x = (i / (weightHistory.length - 1)) * 100;
    const y = 100 - ((w - weightHistoryMin) / weightRange) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  // Days remaining in membership (mock)
  const daysRemaining = 18;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Hero */}
      <motion.div
        variants={staggerItem}
        className="rounded-xl border border-[#1E293B] bg-gradient-to-br from-[#111827]/80 to-[#111827] p-6 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#06B6D4] text-2xl font-bold text-[#0F172A] shadow-lg shadow-[#22C55E]/20">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#22C55E] text-xs text-[#0F172A] shadow">
              <Zap className="h-3 w-3" />
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl tracking-wider text-[#F8FAFC]">
              {profile?.full_name ?? 'Socio'}
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Miembro desde {memberSince}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-medium text-[#22C55E] border border-[#22C55E]/20">
                <Star className="h-3 w-3" /> Membresía Activa
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#A855F7]/10 px-3 py-1 text-xs font-medium text-[#A855F7] border border-[#A855F7]/20">
                Plan Premium
              </span>
            </div>
          </div>
          {/* Quick stats mini */}
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <p className="font-display text-2xl tracking-wider text-[#22C55E]">24</p>
              <p className="text-xs text-[#94A3B8]">Puntos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl tracking-wider text-[#EF4444]">7</p>
              <p className="text-xs text-[#94A3B8]">Racha</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl tracking-wider text-[#06B6D4]">12</p>
              <p className="text-xs text-[#94A3B8]">Check-ins</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Award className="h-5 w-5" />}
          title="Puntos Acumulados"
          value="1,240"
          trend={{ value: 15, isPositive: true }}
          color="purple"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          title="Racha Actual"
          value="7 días"
          color="red"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          title="Check-ins este Mes"
          value="12"
          color="cyan"
        />
        <StatCard
          icon={<Timer className="h-5 w-5" />}
          title="Días Restantes"
          value={`${daysRemaining}`}
          color={daysRemaining <= 7 ? 'red' : 'green'}
        />
      </div>

      {/* QR Code + Gamification */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QR Code */}
        <SectionCard title="Mi Código QR" icon={<QrCode className="h-5 w-5" />}>
          <div className="flex flex-col items-center gap-4 py-2">
            {/* QR Placeholder */}
            <div className="relative rounded-xl bg-white p-4 shadow-lg shadow-black/10">
              <div className="grid grid-cols-9 gap-[3px]" style={{ width: '162px' }}>
                {QR_PATTERN.map((cell, i) => (
                  <div
                    key={i}
                    className="h-[14px] w-[14px] rounded-[2px]"
                    style={{ backgroundColor: cell ? '#0F172A' : '#ffffff' }}
                  />
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-[#94A3B8]">Mostrá este código en recepción</p>
            <button className="flex items-center gap-2 rounded-lg bg-[#22C55E]/10 px-4 py-2 text-sm font-medium text-[#22C55E] transition-colors hover:bg-[#22C55E]/20">
              <Download className="h-4 w-4" />
              Descargar QR
            </button>
          </div>
        </SectionCard>

        {/* Gamification */}
        <SectionCard title="Logros y Progreso" icon={<Trophy className="h-5 w-5" />}>
          {/* Leaderboard Position */}
          <div className="mb-4 flex items-center justify-between rounded-lg bg-[#0F172A] p-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-sm text-[#94A3B8]">Tu posición</span>
            </div>
            <p className="font-display text-xl tracking-wider text-[#F59E0B]">#12<span className="text-sm text-[#94A3B8]"> de 45</span></p>
          </div>

          {/* Badges Grid */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {MOCK_BADGES.slice(0, 6).map((badge) => (
              <div
                key={badge.name}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                  badge.unlocked
                    ? 'border-[#22C55E]/20 bg-[#22C55E]/5 hover:border-[#22C55E]/40'
                    : 'border-[#1E293B] bg-[#0F172A]/50 opacity-40'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${badge.unlocked ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#1E293B] text-[#64748B]'}`}>
                  {badge.unlocked ? badge.icon : <Lock className="h-5 w-5" />}
                </div>
                <p className="text-xs font-medium text-[#F8FAFC]">{badge.name}</p>
                <p className="text-[10px] text-[#64748B]">{badge.description}</p>
              </div>
            ))}
          </div>

          {/* Next Badge Progress */}
          <div>
            <p className="mb-2 text-xs text-[#94A3B8]">Próximo logro: <span className="text-[#F8FAFC]">Social</span></p>
            <ProgressBar value={3} max={5} color="#A855F7" />
          </div>
        </SectionCard>
      </div>

      {/* My Workouts + Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Routine */}
        <SectionCard title="Mi Rutina" icon={<Dumbbell className="h-5 w-5" />}>
          <div className="space-y-4">
            <div className="rounded-lg bg-[#0F172A] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg tracking-wider text-[#F8FAFC]">Fuerza Total</p>
                  <p className="text-sm text-[#94A3B8]">4 días por semana · Nivel Intermedio</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                  <Dumbbell className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-2 text-xs text-[#64748B]">Último entrenamiento: Ayer</p>
            </div>

            {/* Weekly progress */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#64748B]">Esta semana</p>
              <div className="flex items-end justify-between gap-2">
                {MOCK_WORKOUT_WEEK.map((day) => (
                  <div key={day.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={`h-8 w-full rounded-md ${
                        day.completed ? 'bg-[#22C55E]' : 'bg-[#1E293B]'
                      }`}
                    />
                    <span className={`text-xs ${day.completed ? 'text-[#22C55E]' : 'text-[#64748B]'}`}>
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] py-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#22C55E]/30 hover:text-[#22C55E]">
              Ver todas las rutinas
            </button>
          </div>
        </SectionCard>

        {/* Body Metrics */}
        <SectionCard title="Mis Métricas" icon={<Heart className="h-5 w-5" />}>
          <div className="space-y-4">
            {/* Weight & Height */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#0F172A] p-3 text-center">
                <p className="font-display text-2xl tracking-wider text-[#22C55E]">{MOCK_BODY_METRICS.weight}</p>
                <p className="text-xs text-[#94A3B8]">Peso (kg)</p>
              </div>
              <div className="rounded-lg bg-[#0F172A] p-3 text-center">
                <p className="font-display text-2xl tracking-wider text-[#06B6D4]">{MOCK_BODY_METRICS.height}</p>
                <p className="text-xs text-[#94A3B8]">Altura (cm)</p>
              </div>
              <div className="rounded-lg bg-[#0F172A] p-3 text-center">
                <p className="font-display text-2xl tracking-wider text-[#A855F7]">{MOCK_BODY_METRICS.bmi}</p>
                <p className="text-xs text-[#94A3B8]">IMC</p>
              </div>
            </div>

            {/* Weight History Sparkline */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#64748B]">Evolución de peso</p>
              <svg viewBox="0 0 100 100" className="h-20 w-full" preserveAspectRatio="none">
                <polyline
                  points={sparkPoints}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>Sem 1</span>
                <span>Sem 4</span>
                <span>Sem 7</span>
              </div>
            </div>

            <button className="w-full rounded-lg border border-[#1E293B] bg-[#0F172A] py-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#06B6D4]/30 hover:text-[#06B6D4]">
              Actualizar medidas
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Next Classes */}
      <SectionCard title="Próximas Clases" icon={<Calendar className="h-5 w-5" />}>
        <div className="space-y-3">
          {MOCK_CLASSES.map((cls) => {
            const spotsColor = cls.spots <= 3 ? 'text-[#EF4444]' : cls.spots <= 6 ? 'text-[#F59E0B]' : 'text-[#22C55E]';
            return (
              <div
                key={cls.id}
                className="flex items-center justify-between rounded-lg border border-[#1E293B] bg-[#0F172A]/50 p-4 transition-colors hover:border-[#334155]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A855F7]/10 text-[#A855F7]">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#F8FAFC]">{cls.name}</p>
                    <p className="text-xs text-[#64748B]">{cls.trainer} · {cls.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${spotsColor}`}>{cls.spots} lugares</p>
                  <button className="mt-1 text-xs text-[#06B6D4] hover:underline">Reservar</button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </motion.div>
  );
}

// =============================================================================
// MAIN DASHBOARD PAGE
// =============================================================================

export function DashboardPage() {
  const { profile, user, isLoading, signOut } = useAuth();

  const role = profile?.role ?? 'member';

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Mostrar spinner mientras carga el perfil
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    gym_owner: 'Dueño',
    admin: 'Admin',
    recepcionista: 'Recepción',
    trainer: 'Trainer',
    member: 'Socio',
  };

  const roleEmoji: Record<string, ReactNode> = {
    gym_owner: <Crown className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
    recepcionista: <ScanLine className="h-4 w-4" />,
    trainer: <Dumbbell className="h-4 w-4" />,
    member: <Award className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#111827]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl tracking-wider text-[#22C55E]">
              GymSaaS
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-[#22C55E]/10 px-2.5 py-1 text-xs font-medium text-[#22C55E]">
              {roleEmoji[role] ?? <Award className="h-4 w-4" />}
              {roleLabel[role] ?? 'Socio'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#1E293B] hover:text-[#F8FAFC]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
            </button>
            <div className="hidden items-center gap-2 text-sm text-[#94A3B8] sm:flex">
              <Users className="h-4 w-4" />
              <span>{profile?.full_name ?? 'Usuario'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <nav className="flex items-center gap-2 text-sm text-[#64748B]">
          <span className="text-[#94A3B8]">Inicio</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#F8FAFC]">Dashboard</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {role === 'gym_owner' || role === 'admin' ? (
            <AdminDashboard key="admin" />
          ) : role === 'recepcionista' ? (
            <RecepcionistaDashboard key="recepcionista" />
          ) : (
            <MemberDashboard key="member" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}