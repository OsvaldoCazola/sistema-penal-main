'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ScaleIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner, Badge, Input, Select } from '@/components/ui';
import { sentencaService, type Sentenca } from '@/services/sentenca.service';
import { noticiaService, type Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';
import toast from 'react-hot-toast';

const TIPOS_DECISAO = [
  { value: 'CONDENACAO', label: 'Condenação', color: 'red' },
  { value: 'ABSOLVICAO', label: 'Absolvição', color: 'green' },
  { value: 'EXTINCAO_PUNIBILIDADE', label: 'Extinção de Punibilidade', color: 'gray' },
  { value: 'DESCLASSIFICACAO', label: 'Desclassificação', color: 'yellow' },
];

export default function JurisprudenciaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const isLoggedIn = isAuthenticated && !!token;

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('returnUrl', '/jurisprudencia');
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const [sentencas, setSentencas] = useState<Sentenca[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [selectedSentenca, setSelectedSentenca] = useState<Sentenca | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>([]);
  const [loadingAtualizacoes, setLoadingAtualizacoes] = useState(false);
  const [activeTab, setActiveTab] = useState<'jurisprudencia' | 'atualizacoes'>('jurisprudencia');

  useEffect(() => {
    carregarSentencas();
    carregarEstatisticas();
  }, [page, tipoFiltro]);

  useEffect(() => {
    if (activeTab === 'atualizacoes') {
      carregarAtualizacoes();
    }
  }, [activeTab]);

  const carregarSentencas = async () => {
    setLoading(true);
    try {
      const params = tipoFiltro ? { tipoDecisao: tipoFiltro } : undefined;
      const response = await sentencaService.listar(params, page, 10);
      setSentencas(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Erro ao carregar sentenças:', error);
      toast.error('Erro ao carregar jurisprudência');
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await sentencaService.estatisticas();
      setEstatisticas(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarAtualizacoes = async () => {
    setLoadingAtualizacoes(true);
    try {
      const response = await noticiaService.listarAtualizacoes(0, 10);
      setAtualizacoes(response.content || []);
    } catch (error) {
      console.error('Erro ao carregar atualizações:', error);
    } finally {
      setLoadingAtualizacoes(false);
    }
  };

  const handleBusca = async () => {
    if (!termoBusca.trim()) {
      carregarSentencas();
      return;
    }

    setBuscando(true);
    try {
      const response = await sentencaService.buscarJurisprudencia(termoBusca, page, 10);
      setSentencas(response.content || []);
      setTotalPages(response.totalPages || 0);
      toast.success(`Encontradas ${response.totalElements || 0} jurisprudências`);
    } catch (error) {
      toast.error('Erro na busca');
    } finally {
      setBuscando(false);
    }
  };

  const getTipoDecisaoBadge = (tipo: string) => {
    const tipoInfo = TIPOS_DECISAO.find(t => t.value === tipo);
    if (!tipoInfo) return <Badge variant="default">{tipo}</Badge>;
    
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      red: 'danger',
      green: 'success',
      gray: 'default',
      yellow: 'warning',
    };
    
    return <Badge variant={variants[tipoInfo.color] || 'default'}>{tipoInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jurisprudência"
        subtitle="Base de dados de decisões judiciais para consulta e aprendizado da IA"
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('jurisprudencia')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'jurisprudencia'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ScaleIcon className="h-5 w-5 inline-block mr-2" />
            Jurisprudência
          </button>
          <button
            onClick={() => setActiveTab('atualizacoes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'atualizacoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BellIcon className="h-5 w-5 inline-block mr-2" />
            Atualizações
          </button>
        </nav>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'jurisprudencia' ? (
        <>
      {/* Stats */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Acórdãos</p>
                <p className="text-2xl font-bold">{estatisticas.total || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Condenações</p>
                <p className="text-2xl font-bold">{estatisticas.condenacoes || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Absolvições</p>
                <p className="text-2xl font-bold">{estatisticas.absolicoes || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ScaleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Média Pena (meses)</p>
                <p className="text-2xl font-bold">{Math.round(estatisticas.mediaPena || 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Busca */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Pesquisar jurisprudência por palavras-chave..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              options={[
                { value: '', label: 'Todos os tipos' },
                ...TIPOS_DECISAO
              ]}
            />
          </div>
          <Button onClick={handleBusca} disabled={buscando}>
            {buscando ? <Spinner size="sm" /> : 'Buscar'}
          </Button>
        </div>
      </Card>

      {/* Lista de Jurisprudências */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : sentencas.length === 0 ? (
            <Card className="p-12 text-center">
              <ScaleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma jurisprudência encontrada
              </h3>
              <p className="text-gray-500">
                {!termoBusca 
                  ? 'Cadastre sentenças no sistema para construir a base de jurisprudência.'
                  : 'Tente buscar com outros termos.'}
              </p>
            </Card>
          ) : (
            sentencas.map((sentenca) => (
              <Card 
                key={sentenca.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedSentenca?.id === sentenca.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedSentenca(sentenca)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {sentenca.dataSentenca ? new Date(sentenca.dataSentenca).toLocaleDateString('pt-AO') : '-'}
                    </span>
                  </div>
                  {getTipoDecisaoBadge(sentenca.tipoDecisao)}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">
                  {sentenca.tipoCrimeNome || 'Tipo de Crime não especificado'}
                </h3>
                
                {(sentenca.ementa || sentenca.narrativa) && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {sentenca.narrativa || sentenca.ementa}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  {sentenca.juizNome && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{sentenca.juizNome}</span>
                    </div>
                  )}
                  {sentenca.penaMeses && (
                    <span className="font-medium text-blue-600 ml-auto">
                      {sentenca.penaMeses} meses de prisão
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="lg:col-span-1">
          {selectedSentenca ? (
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold">Detalhes da Decisão</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Decisão</label>
                  <div className="mt-1">
                    {getTipoDecisaoBadge(selectedSentenca.tipoDecisao)}
                  </div>
                </div>

                {selectedSentenca.penaMeses && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pena</label>
                    <p className="text-lg font-semibold">
                      {selectedSentenca.penaMeses} meses de {selectedSentenca.tipoPena || 'prisão'}
                    </p>
                    {selectedSentenca.regime && (
                      <span className="text-sm text-gray-500">
                        Regime: {selectedSentenca.regime}
                      </span>
                    )}
                  </div>
                )}

                {selectedSentenca.juizNome && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Juiz</label>
                    <p className="text-gray-900">{selectedSentenca.juizNome}</p>
                  </div>
                )}

                {selectedSentenca.ementa && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ementa</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedSentenca.ementa}</p>
                  </div>
                )}

                {selectedSentenca.fundamentacao && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fundamentação</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedSentenca.fundamentacao}</p>
                  </div>
                )}

                {selectedSentenca.narrativa && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Narrativa dos Factos</label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{selectedSentenca.narrativa}</p>
                  </div>
                )}

                {selectedSentenca.dispositivo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dispositivo</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedSentenca.dispositivo}</p>
                  </div>
                )}

                {selectedSentenca.transitadoJulgado && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Transitado em julgado</span>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <ScaleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Selecione uma jurisprudência para ver os detalhes
              </p>
            </Card>
          )}
        </div>
      </div>
      </>
      ) : (
        // Seção de Atualizações
        <div className="space-y-6">
          {/* Stats de Atualizações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Legislação</p>
                  <p className="text-2xl font-bold">
                    {atualizacoes.filter(a => a.tipo === 'NOVA_LEI' || a.tipo === 'ATUALIZACAO_LEGISLATIVA').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ScaleIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jurisprudência</p>
                  <p className="text-2xl font-bold">
                    {atualizacoes.filter(a => a.tipo === 'NOVA_JURISPRUDENCIA').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de Atualizações */}
          {loadingAtualizacoes ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : atualizacoes.length === 0 ? (
            <Card className="p-12 text-center">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma atualização encontrada
              </h3>
              <p className="text-gray-500">
                As atualizações legislativas e jurisprudenciais aparecerão aqui.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {atualizacoes.map((atualizacao) => (
                <AtualizacaoCard key={atualizacao.id} atualizacao={atualizacao} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
