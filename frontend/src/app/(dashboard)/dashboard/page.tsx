'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  BellIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  PencilSquareIcon,
  ScaleIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Spinner } from '@/components/ui';
import { dashboardService, type CrimeEstatisticas } from '@/services/dashboard.service';
import { noticiaService, Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';
import { useAuthStore } from '@/store/auth.store';
import type { DashboardResponse } from '@/types';

/* ── Mock data ──────────────────────────────────────────────────────────── */
const FALLBACK_ATUALIZACOES: Atualizacao[] = [
  { id:'1', tipo:'NOVA_LEI', titulo:'Nova Legislação Penal', descricao:'Actualização ao Código Penal Angolano — Livro II.', dataPublicacao:new Date().toISOString(), tipoLabel:'Nova Lei', tipoIcon:'document', link:'/legislacao' },
  { id:'2', tipo:'NOVA_JURISPRUDENCIA', titulo:'Decisão do Tribunal Supremo', descricao:'Acórdão sobre aplicação de penas em crimes de roubo.', dataPublicacao:new Date().toISOString(), tipoLabel:'Jurisprudência', tipoIcon:'scale', link:'/jurisprudencia' },
  { id:'3', tipo:'ALTERACAO_ARTIGO', titulo:'Alteração ao Artigo 347.º', descricao:'Revisão das circunstâncias agravantes em crimes contra a propriedade.', dataPublicacao:new Date().toISOString(), tipoLabel:'Alteração', tipoIcon:'pencil', link:'/legislacao/artigos' },
];
const ACTIVIDADES_RECENTES = [
  { icon: FolderOpenIcon, cor: '#1D4ED8', titulo: 'Processo 2024/0047 actualizado', detalhe: 'Estado alterado para Em Julgamento', tempo: 'há 12 min' },
  { icon: CheckBadgeIcon, cor: '#059669', titulo: 'Simulação concluída — Roubo Agravado', detalhe: 'Pena estimada: 6 a 10 anos', tempo: 'há 28 min' },
  { icon: PencilSquareIcon, cor: '#D97706', titulo: 'Lei nº 8/19 consultada', detalhe: 'Código Penal — Crimes contra a vida', tempo: 'há 45 min' },
  { icon: UserIcon, cor: '#8B5CF6', titulo: 'Novo utilizador registado', detalhe: 'Advogado — Dr. António Ferreira', tempo: 'há 1 h' },
  { icon: ScaleIcon, cor: '#DC2626', titulo: 'Jurisprudência adicionada', detalhe: 'Acórdão 23/TSA sobre legítima defesa', tempo: 'há 2 h' },
];
const PIE_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#6b7280'];
const MOCK_CRIMES_REGIAO = [
  { regiao: 'Luanda', quantidade: 82, percentual: 34 },
  { regiao: 'Huíla', quantidade: 58, percentual: 24 },
  { regiao: 'Benguela', quantidade: 45, percentual: 18 },
  { regiao: 'Huambo', quantidade: 33, percentual: 13 },
  { regiao: 'Malanje', quantidade: 18, percentual: 7 },
  { regiao: 'Bié', quantidade: 10, percentual: 4 },
];
const MOCK_CRIMES = [
  { tipoCrime: 'Roubo', quantidade: 134, percentual: 34 },
  { tipoCrime: 'Homicídio', quantidade: 87, percentual: 22 },
  { tipoCrime: 'Furto', quantidade: 71, percentual: 18 },
  { tipoCrime: 'Lesão Corporal', quantidade: 47, percentual: 12 },
  { tipoCrime: 'Violência Doméstica', quantidade: 35, percentual: 9 },
  { tipoCrime: 'Outros', quantidade: 20, percentual: 5 },
];

/* ── StatCard ────────────────────────────────────────────────────────── */
function StatCard({ title, value, icon: Icon, trend, color = 'blue', subtitle }: {
  title: string; value: string | number; icon: React.ElementType;
  trend?: { value: number; isPositive: boolean }; color?: 'blue'|'green'|'amber'|'red'|'purple'; subtitle?: string;
}) {
  const palette = {
    blue: { bar: '#1D4ED8', bg: 'rgba(29,78,216,0.12)', txt: '#1D4ED8' },
    green: { bar: '#059669', bg: 'rgba(5,150,105,0.12)', txt: '#059669' },
    amber: { bar: '#D97706', bg: 'rgba(217,119,6,0.12)', txt: '#D97706' },
    red: { bar: '#DC2626', bg: 'rgba(220,38,38,0.12)', txt: '#DC2626' },
    purple: { bar: '#7C3AED', bg: 'rgba(124,58,237,0.12)', txt: '#7C3AED' },
  } as const;
  const tone = palette[color];
  return (
    <div className="stat-card">
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: tone.bar }} />
      <div className="flex items-start justify-between mt-1">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: tone.bg }}>
          <Icon className="h-5 w-5" style={{ color: tone.txt }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
            style={{ background: trend.isPositive ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.12)', color: trend.isPositive ? '#059669' : '#DC2626' }}>
            {trend.isPositive ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-title">{title}</p>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ── QuickCard ──────────────────────────────────────────────────────── */
function QuickCard({ title, description, icon: Icon, href, accent }: {
  title: string; description: string; icon: React.ElementType; href: string; accent: string;
}) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}20` }}>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
      <ArrowRightIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
    </Link>
  );
}

/* ── Dashboard Page ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [crimeStats, setCrimeStats] = useState<CrimeEstatisticas | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<string>('');
  const [loadingCrimeStats, setLoadingCrimeStats] = useState<boolean>(false);
  const [crimeStatsError, setCrimeStatsError] = useState<string | null>(null);
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>(FALLBACK_ATUALIZACOES);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);

  const fetchCrimeStats = useCallback(async (tipoCrime?: string) => {
    setLoadingCrimeStats(true);
    setCrimeStatsError(null);
    try {
      const response = await dashboardService.getCrimeEstatisticas(tipoCrime);
      setCrimeStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de crimes:', error);
      setCrimeStatsError('Não foi possível carregar as estatísticas. Tente novamente.');
      setCrimeStats(null);
    } finally {
      setLoadingCrimeStats(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await dashboardService.getDashboard();
        if (isMounted) setDashboard(data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        if (isMounted) setIsLoadingDashboard(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await noticiaService.listarAtualizacoes(0, 3);
        if (isMounted && response.content?.length) setAtualizacoes(response.content);
      } catch (error) {
        console.error('Erro ao carregar actualizações:', error);
      } finally {
        if (isMounted) setLoadingNews(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const tipoCrime = selectedCrime?.trim() || undefined;
    fetchCrimeStats(tipoCrime);
  }, [selectedCrime, fetchCrimeStats]);

  const handleCrimeFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrime(event.target.value);
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const crimeOptions = useMemo(() => {
    const base = crimeStats?.tiposCrimeProcessos ?? [];
    return [...base].sort((a, b) => (b.quantidade ?? 0) - (a.quantidade ?? 0));
  }, [crimeStats?.tiposCrimeProcessos]);

  const regionChartData = useMemo(() => {
    const base = crimeStats?.crimesPorRegiao ?? MOCK_CRIMES_REGIAO;
    return base.map((item) => ({
      regiao: item.regiao ?? 'Não especificado',
      quantidade: item.quantidade ?? 0,
      percentual: item.percentual ?? 0,
    }));
  }, [crimeStats?.crimesPorRegiao]);

  const crimesPieData = useMemo(() => {
    const base = crimeStats?.crimesMaisSimulados ?? MOCK_CRIMES;
    return base.map((item) => ({
      tipoCrime: item.tipoCrime ?? 'Não especificado',
      quantidade: item.quantidade ?? 0,
      percentual: item.percentual ?? 0,
    }));
  }, [crimeStats?.crimesMaisSimulados]);

  if (isLoadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {greeting}, {user?.nome?.split(' ')[0] ?? 'Utilizador'} 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {new Date().toLocaleDateString('pt-AO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Processos Activos"
          value={dashboard?.resumoGeral.processosEmAndamento ?? '—'}
          icon={ScaleIcon}
          color="blue"
          trend={{ value: 12, isPositive: true }}
          subtitle="este mês"
        />
        <StatCard
          title="Prazos a Vencer"
          value="18"
          icon={ClockIcon}
          color="amber"
          trend={{ value: 3, isPositive: false }}
          subtitle="próximos 7 dias"
        />
        <StatCard
          title="Simulações IA"
          value={dashboard?.estatisticasModulos?.totalSimulacoes ?? 89}
          icon={SparklesIcon}
          color="purple"
          trend={{ value: 24, isPositive: true }}
          subtitle="esta semana"
        />
        <StatCard
          title="Leis Cadastradas"
          value={dashboard?.estatisticasModulos?.totalLeis ?? 312}
          icon={BookOpenIcon}
          color="green"
          subtitle="base actualizada"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ocorrências por Região</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionChartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="regiao" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} cursor={{ fill: 'var(--bg-surface-2)' }} />
              <Bar dataKey="quantidade" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tipos de Crime Simulados</h3>
          <ResponsiveContainer width="100%" height={220}>
            {crimesPieData.length > 0 ? (
              <PieChart>
                <Pie data={crimesPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="quantidade" nameKey="tipoCrime">
                  {crimesPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{value}</span>} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-[220px]">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ainda não há simulações registadas.</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <h2 className="section-header mb-0">Actualizações Legislativas e Jurisprudenciais</h2>
          </div>
          <Link href="/legislacao" className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1">
            Ver todas <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>
        {loadingNews ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {atualizacoes.map((item) => <AtualizacaoCard key={item.id} atualizacao={item} />)}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header mb-0">Acesso Rápido</h2>
          <button
            onClick={() => window.open('/usuarios', '_blank')}
            className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1"
          >
            Gerenciar usuários <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickCard title="Simulador Penal" description="Enquadramento com IA" icon={BeakerIcon} href="/simulador" accent="#7C3AED" />
          <QuickCard title="Verificador Penas" description="Calcular penas aplicáveis" icon={ClipboardDocumentCheckIcon} href="/verificador" accent="#059669" />
          <QuickCard title="Legislação" description="Consultar leis e artigos" icon={BookOpenIcon} href="/legislacao" accent="#D97706" />
          <QuickCard title="Assistente IA" description="Chat jurídico inteligente" icon={SparklesIcon} href="/chat" accent="#8B5CF6" />
          <QuickCard title="Jurisprudência" description="Pesquisar decisões judiciais" icon={DocumentTextIcon} href="/jurisprudencia" accent="#DC2626" />
          <QuickCard title="Usuários" description="Gerenciar acessos e permissões" icon={UserIcon} href="/usuarios" accent="#8B5CF6" />
          <QuickCard title="Jurisprudência" description="Pesquisar decisões judiciais" icon={DocumentTextIcon} href="/jurisprudencia" accent="#DC2626" />
          <QuickCard title="Processos" description="Gerir processos judiciais" icon={ScaleIcon} href="/processos" accent="#1D4ED8" /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header mb-0">Actividades Recentes</h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>últimas 24h</span>
        </div>
        <div className="card overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {ACTIVIDADES_RECENTES.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-4 transition-colors" style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: act.cor + '18' }}>
                  <act.icon className="h-4 w-4" style={{ color: act.cor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{act.titulo}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{act.detalhe}</p>
                </div>
                <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{act.tempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
