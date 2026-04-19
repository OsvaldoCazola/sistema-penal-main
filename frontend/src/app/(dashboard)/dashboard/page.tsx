'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ScaleIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  BookOpenIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Spinner } from '@/components/ui';
import { dashboardService, type CrimeEstatisticas } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/auth.store';
import { type DashboardResponse } from '@/types';

// ─── Dados mock usados quando a API não retorna dados ────────────────────────
const MOCK_CRIMES_REGIAO = [
  { regiao: 'Luanda',   quantidade: 82,  percentual: 34 },
  { regiao: 'Huíla',    quantidade: 58,  percentual: 24 },
  { regiao: 'Benguela', quantidade: 45,  percentual: 18 },
  { regiao: 'Huambo',   quantidade: 33,  percentual: 13 },
  { regiao: 'Malanje',  quantidade: 18,  percentual: 7 },
  { regiao: 'Bié',      quantidade: 10,  percentual: 4 },
];

const MOCK_CRIMES_SIMULADOS = [
  { tipoCrime: 'Roubo',              quantidade: 134, percentual: 34 },
  { tipoCrime: 'Homicídio',          quantidade: 87,  percentual: 22 },
  { tipoCrime: 'Furto',              quantidade: 71,  percentual: 18 },
  { tipoCrime: 'Lesão Corporal',     quantidade: 47,  percentual: 12 },
  { tipoCrime: 'Violência Doméstica',quantidade: 35,  percentual: 9 },
  { tipoCrime: 'Outros',             quantidade: 20,  percentual: 5 },
];

const PIE_COLORS = ['#1D4ED8', '#7C3AED', '#059669', '#D97706', '#DC2626', '#6B7280'];

// ─── Componentes ──────────────────────────────────────────────────────────────

function StatCard({
  title, value, icon: Icon, trend, color = 'blue', subtitle,
}: {
  title: string; value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  subtitle?: string;
}) {
  const palette = {
    blue:   { bar: '#1D4ED8', iconBg: '#EFF6FF', iconText: '#1D4ED8' },
    green:  { bar: '#059669', iconBg: '#ECFDF5', iconText: '#059669' },
    amber:  { bar: '#D97706', iconBg: '#FFFBEB', iconText: '#D97706' },
    red:    { bar: '#DC2626', iconBg: '#FEF2F2', iconText: '#DC2626' },
    purple: { bar: '#7C3AED', iconBg: '#F5F3FF', iconText: '#7C3AED' },
  };
  const p = palette[color];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 relative overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: p.bar }} />
      <div className="flex items-start justify-between mt-1">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: p.iconBg }}>
          <Icon className="h-5 w-5" style={{ color: p.iconText }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
            style={{
              background: trend.isPositive ? '#ECFDF5' : '#FEF2F2',
              color: trend.isPositive ? '#065F46' : '#991B1B',
            }}
          >
            {trend.isPositive
              ? <ArrowTrendingUpIcon className="h-3 w-3" />
              : <ArrowTrendingDownIcon className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function QuickCard({ title, description, icon: Icon, href, accent }: {
  title: string; description: string; icon: React.ElementType; href: string; accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accent + '18' }}>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
      </div>
      <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          {linkLabel ?? 'Ver todos'} →
        </Link>
      )}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [crimeStats, setCrimeStats] = useState<CrimeEstatisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [atualizacoes, setAtualizacoes] = useState<{
    leis: Array<{ id: string; titulo: string; tipo: string; dataVigencia?: string; dataPublicacao?: string }>;
    jurisprudencias: Array<{ id: string; titulo: string; numero: string; data: string }>;
  }>({ leis: [], jurisprudencias: [] });
  const [loadingAtualizacoes, setLoadingAtualizacoes] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, crimeData] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getCrimeEstatisticas(),
        ]);
        setData(dashboardData);
        setCrimeStats(crimeData);
      } catch {
        try {
          const dashboardData = await dashboardService.getDashboard();
          setData(dashboardData);
        } catch (e) {
          console.error('Erro ao carregar dados:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAtualizacoes = async () => {
      try {
        const api = (await import('@/lib/api')).default;
        const [leisRes, sentencasRes] = await Promise.all([
          api.get('/leis?page=0&size=5&sort=dataVigencia,desc'),
          api.get('/sentencas?page=0&size=5&sort=createdAt,desc'),
        ]);
        setAtualizacoes({
          leis: leisRes.data.content ?? [],
          jurisprudencias: sentencasRes.data.content ?? [],
        });
      } catch {
        setAtualizacoes({ leis: [], jurisprudencias: [] });
      } finally {
        setLoadingAtualizacoes(false);
      }
    };

    fetchData();
    fetchAtualizacoes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-400">A carregar dados do sistema...</p>
      </div>
    );
  }

  // Usar dados reais se disponíveis, caso contrário usar mock
  const regiaoData = (crimeStats?.crimesPorRegiao && crimeStats.crimesPorRegiao.length > 0)
    ? crimeStats.crimesPorRegiao
    : MOCK_CRIMES_REGIAO;

  const simuladosData = (crimeStats?.crimesMaisSimulados && crimeStats.crimesMaisSimulados.length > 0)
    ? crimeStats.crimesMaisSimulados
    : MOCK_CRIMES_SIMULADOS;

  const isMockData = !crimeStats?.crimesPorRegiao?.length && !crimeStats?.crimesMaisSimulados?.length;

  const quickAccess = [
    { title: 'Registar novo processo', description: 'Iniciar processo judicial', icon: ScaleIcon, href: '/processos/novo', accent: '#1D4ED8' },
    { title: 'Consultar legislação', description: 'Leis e artigos vigentes', icon: BookOpenIcon, href: '/legislacao', accent: '#059669' },
    { title: 'Base de jurisprudência', description: 'Decisões e acórdãos', icon: DocumentTextIcon, href: '/jurisprudencia', accent: '#7C3AED' },
    { title: 'Análise de casos IA', description: 'Enquadramento e busca', icon: SparklesIcon, href: '/busca', accent: '#D97706' },
    { title: 'Simulador penal', description: 'Calcular e simular penas', icon: BeakerIcon, href: '/simulador', accent: '#DC2626' },
    { title: 'Verificador de penas', description: 'Validar penas aplicadas', icon: ClipboardDocumentCheckIcon, href: '/verificador', accent: '#0891B2' },
  ];

  const recentActivities = [
    { tipo: 'Processo registado', descricao: 'Proc. 2024/001234 — Tribunal de Luanda', status: 'EM_ANDAMENTO', cor: '#1D4ED8' },
    { tipo: 'Sentença proferida', descricao: 'Proc. 2024/000987 — Tribunal Provincial', status: 'SENTENCIADO', cor: '#059669' },
    { tipo: 'Actualização legislativa', descricao: 'Lei 23/24 — Diário da República', status: 'PUBLICADO', cor: '#D97706' },
    { tipo: 'Nova jurisprudência', descricao: 'Acórdão TSA/2024/045 — Tribunal Supremo', status: 'DISPONÍVEL', cor: '#7C3AED' },
  ];

  const statusLabel: Record<string, { label: string; bg: string; text: string }> = {
    EM_ANDAMENTO: { label: 'Em andamento', bg: '#EFF6FF', text: '#1D4ED8' },
    SENTENCIADO:  { label: 'Sentenciado',  bg: '#ECFDF5', text: '#065F46' },
    PUBLICADO:    { label: 'Publicado',    bg: '#FFFBEB', text: '#92400E' },
    DISPONÍVEL:   { label: 'Disponível',   bg: '#F5F3FF', text: '#5B21B6' },
  };

  return (
    <div className="space-y-6 pb-8">

      {/* ── Cabeçalho institucional ── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="h-1 flex">
          <div className="flex-1 bg-[#CC092F]" />
          <div className="flex-1 bg-[#111]" />
          <div className="flex-1 bg-[#FFCC00]" />
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
              <ScaleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Sistema de Gestão Judicial</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Ministério da Justiça e dos Direitos Humanos — República de Angola
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-right">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 leading-tight">Data actual</p>
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {new Date().toLocaleDateString('pt-AO', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Indicadores ── */}
      <div>
        <SectionHeader title="Indicadores do Sistema" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Processos em andamento"
            value={data?.resumoGeral?.processosEmAndamento?.toLocaleString('pt-AO') ?? '0'}
            icon={ClockIcon} color="blue"
            trend={{ value: 12, isPositive: true }}
            subtitle="Activos no sistema"
          />
          <StatCard
            title="Casos recebidos"
            value={data?.resumoGeral?.totalDenuncias?.toLocaleString('pt-AO') ?? '0'}
            icon={ShieldExclamationIcon} color="amber"
            subtitle="Total registados"
          />
          <StatCard
            title="Sentenças proferidas"
            value={data?.resumoGeral?.totalSentencas?.toLocaleString('pt-AO') ?? '0'}
            icon={CheckCircleIcon} color="green"
            trend={{ value: 8, isPositive: true }}
            subtitle="Decisões finais"
          />
          <StatCard
            title="Utilizadores activos"
            value={data?.resumoGeral?.usuariosAtivos?.toLocaleString('pt-AO') ?? '0'}
            icon={UserGroupIcon} color="purple"
            subtitle="No sistema"
          />
        </div>
      </div>

      {/* ── Gráficos (sempre visíveis) ── */}
      <div>
        <SectionHeader title="Estatísticas Criminais" />
        {isMockData && (
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Dados de demonstração — serão substituídos por dados reais quando disponíveis
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Crimes por região */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Processos por Região</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regiaoData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 72, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category" dataKey="regiao" stroke="#6B7280"
                    fontSize={11} tickLine={false} axisLine={false} width={68}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff', border: '1px solid #E5E7EB',
                      borderRadius: '8px', fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    formatter={(v: number) => [`${v} processos`, 'Quantidade']}
                  />
                  <Bar dataKey="quantidade" fill="#1D4ED8" radius={[0, 4, 4, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tipologia criminal */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Tipologia Criminal — Simulações</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={simuladosData.slice(0, 6)}
                    cx="42%" cy="50%"
                    innerRadius={52} outerRadius={88}
                    paddingAngle={2}
                    dataKey="quantidade"
                    nameKey="tipoCrime"
                  >
                    {simuladosData.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#fff', border: '1px solid #E5E7EB',
                      borderRadius: '8px', fontSize: '12px',
                    }}
                    formatter={(v: number) => [`${v} simulações`, 'Quantidade']}
                  />
                  <Legend
                    layout="vertical" align="right" verticalAlign="middle"
                    iconType="circle" iconSize={8}
                    formatter={value => (
                      <span style={{ fontSize: '11px', color: '#4B5563' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Acesso rápido + Actividade ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionHeader title="Acesso Rápido" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickAccess.map(item => (
              <QuickCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="Actividade Recente" href="/processos" linkLabel="Ver processos" />
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {recentActivities.map((act, i) => {
              const st = statusLabel[act.status] ?? { label: act.status, bg: '#F3F4F6', text: '#374151' };
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: act.cor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{act.tipo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{act.descricao}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5" style={{ background: st.bg, color: st.text }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Actualizações ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Legislação */}
        <div>
          <SectionHeader title="Actualizações Legislativas" href="/legislacao" />
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {loadingAtualizacoes ? (
              <div className="flex justify-center py-10"><Spinner size="md" /></div>
            ) : atualizacoes.leis.length > 0 ? (
              atualizacoes.leis.slice(0, 5).map((lei, i) => (
                <Link
                  key={lei.id ?? i}
                  href={`/legislacao/${lei.id}`}
                  className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BuildingLibraryIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700 transition-colors">{lei.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{lei.tipo}</span>
                      {(lei.dataVigencia || lei.dataPublicacao) && (
                        <span className="text-[10px] text-gray-400">{lei.dataVigencia ?? lei.dataPublicacao}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 mt-1 flex-shrink-0" />
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <BuildingLibraryIcon className="h-10 w-10 mb-2 text-gray-200" />
                <p className="text-xs text-gray-400">Sem actualizações legislativas</p>
                <Link href="/legislacao/novo" className="text-xs text-blue-600 mt-2 hover:underline">Adicionar nova lei</Link>
              </div>
            )}
          </div>
        </div>

        {/* Jurisprudência */}
        <div>
          <SectionHeader title="Jurisprudência Recente" href="/jurisprudencia" />
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {loadingAtualizacoes ? (
              <div className="flex justify-center py-10"><Spinner size="md" /></div>
            ) : atualizacoes.jurisprudencias.length > 0 ? (
              atualizacoes.jurisprudencias.slice(0, 5).map((j, i) => (
                <Link
                  key={j.id ?? i}
                  href={`/jurisprudencia/${j.id}`}
                  className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-700 transition-colors">{j.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{j.numero}</span>
                      {j.data && <span className="text-[10px] text-gray-400">{j.data}</span>}
                    </div>
                  </div>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300 group-hover:text-purple-500 mt-1 flex-shrink-0" />
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <DocumentTextIcon className="h-10 w-10 mb-2 text-gray-200" />
                <p className="text-xs text-gray-400">Sem jurisprudência recente</p>
                <Link href="/jurisprudencia" className="text-xs text-blue-600 mt-2 hover:underline">Consultar jurisprudência</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Rodapé ── */}
      <div className="bg-[#1a2744] rounded-xl overflow-hidden">
        <div className="h-[3px] flex">
          <div className="flex-1 bg-[#CC092F]" />
          <div className="flex-1 bg-[#111]" />
          <div className="flex-1 bg-[#FFCC00]" />
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ScaleIcon className="h-6 w-6 text-white/60" />
            <div>
              <p className="text-sm font-semibold text-white">Sistema Penal Angolano</p>
              <p className="text-xs text-white/40 mt-0.5">Plataforma oficial de gestão judicial — Versão 1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-white">{data?.resumoGeral?.totalProcessos?.toLocaleString('pt-AO') ?? '0'}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wide">Processos totais</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-lg font-bold text-white">18</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wide">Províncias</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-lg font-bold text-white">{data?.resumoGeral?.usuariosAtivos ?? '0'}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wide">Utilizadores</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
