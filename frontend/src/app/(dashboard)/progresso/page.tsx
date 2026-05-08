'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { progressoService } from '@/services/progresso.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProgressoPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'temporal' | 'porTipo'>('temporal');
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    if (user.role === Role.ADMIN) {
      toast.error('Acesso restrito a estudantes.');
      router.push('/dashboard');
    }
    carregarProgresso();
  }, [user, router]);

  const carregarProgresso = async () => {
    setLoading(true);
    try {
      const response = await progressoService.listar();
      setData(response);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      toast.error('Erro ao carregar dados de progresso');
    } finally {
      setLoading(false);
    }
  };

  const prepararDadosTemporais = () => {
    // Agrupa por mês/ano
    const dadosPorMes: Record<string, { total: number; acertou: number }> = {};
    
    data.forEach(item => {
      const data = new Item(item.ultimaTentativa);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dadosPorMes[chave]) {
        dadosPorMes[chave] = { total: 0, acertou: 0 };
      }
      
      dadosPorMes[chave].total += item.totalQuestoes;
      dadosPorMes[chave].acertou += item.totalAcertos;
    });

    return Object.entries(dadosPorMes).map(([mes, valores]) => ({
      mes: new Date(mes + '-01').toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' }),
      total: valores.total,
      acertou: valores.acertou,
      percentual: valores.total > 0 ? (valores.acertou / valores.total) * 100 : 0,
    })).sort((a, b) => {
      const dateA = new Date(`01 ${a.mes}`);
      const dateB = new Date(`01 ${b.mes}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const prepararDadosPorTipo = () => {
    // Agrupa por tipo de crime
    const dadosPorTipo: Record<string, { total: number; acertou: number }> = {};
    
    data.forEach(item => {
      const tipo = item.tipoCrime || 'Não especificado';
      
      if (!dadosPorTipo[tipo]) {
        dadosPorTipo[tipo] = { total: 0, acertou: 0 };
      }
      
      dadosPorTipo[tipo].total += item.totalQuestoes;
      dadosPorTipo[tipo].acertou += item.totalAcertos;
    });

    return Object.entries(dadosPorTipo).map(([tipo, valores]) => ({
      tipo,
      total: valores.total,
      acertou: valores.acertou,
      percentual: valores.total > 0 ? (valores.acertou / valores.total) * 100 : 0,
    })).sort((a, b) => b.percentual - a.percentual);
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center py-16">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-400">A carregar dados de progresso...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <BarChart className="h-6 w-6 text-gray-400" />
        </div>
        <p className="mt-4 text-sm text-gray-500">Nenhum dado de progresso disponível</p>
        <p className="text-xs text-gray-400 mt-1">Complete algumas simulações para ver seu progresso aqui</p>
      </div>
    );
  }

  const dadosTemporais = prepararDadosTemporais();
  const dadosPorTipo = prepararDadosPorTipo();

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Meu Progresso"
        subtitle="Acompanhamento do desempenho nos estudos de direito penal"
        icon={BarChartIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meu Progresso' },
        ]}
      />

      {/* Seletor de tipo de gráfico */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700">
            Visualização de Progresso
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('temporal')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${chartType === 'temporal' ? 'bg-[#1a2744] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Evolução Temporal
            </button>
            <button
              onClick={() => setChartType('porTipo')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${chartType === 'porTipo' ? 'bg-[#1a2744] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Por Tipo de Crime
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {chartType === 'temporal' ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosTemporais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="acertou" name="Acertos" barSize="60%" fill="#10b981" />
              <Bar dataKey="total" name="Total" barSize="60%" fill="#3b82f6" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dadosPorTipo}
                dataKey="percentual"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                innerRadius="60"
                outerRadius="80"
                labelLine={false}
                label={{
                  show: true,
                  position: 'inside',
                  formatter: ({ name, percent }) => `${name}: ${percent.toFixed(1)}%`,
                }}
              >
                {dadosPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${(index * 40) % 360}, 70%, 50%)`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500">Total de Simulações</p>
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500">Total de Questões</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, item) => sum + item.totalQuestoes, 0)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500">Taxa de Acerto Geral</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, item) => sum + item.totalAcertos, 0) > 0
              ? (
                  (data.reduce((sum, item) => sum + item.totalAcertos, 0) /
                    data.reduce((sum, item) => sum + item.totalQuestoes, 0)) *
                  100
                ).toFixed(1) + '%'
              : '0%'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500">Melhor Tipo de Crime</p>
          <p className="text-xl font-bold text-gray-900">
            {dadosPorTipo[0]?.tipo || 'N/A'}
          </p>
          <p className="text-xs text-gray-500">
            {dadosPorTipo[0]?.percentual?.toFixed(1)}% de acerto
          </p>
        </div>
      </div>

      {/* Histórico detalhado */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
          Histórico Detalhado
        </p>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Simulação #{index + 1}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.ultimaTentativa).toLocaleDateString('pt-AO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-${item.percentual >= 80 ? 'green-600' : item.percentual >= 60 ? 'yellow-600' : 'red-600'}`}>
                    {item.percentual.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.totalAcertos}/{item.totalQuestoes}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className={`bg-${item.percentual >= 80 ? 'green-600' : item.percentual >= 60 ? 'yellow-600' : 'red-600'} h-2.5 rounded-full`}
                  style={{ width: `${item.percentual}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}