'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner } from '@/components/ui';
import { legislacaoService, ArtigoRequest, Lei, LeiRequest } from '@/services/legislacao.service';

export default function NovoArtigoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLeis, setIsLoadingLeis] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [leis, setLeis] = useState<Lei[]>([]);
  
  const [formData, setFormData] = useState<ArtigoRequest & { leiId: string }>({
    leiId: '',
    numero: '',
    titulo: '',
    conteudo: '',
    tipoPenal: '',
    penaMinAnos: undefined,
    penaMaxAnos: undefined,
    ordem: undefined,
  });

  useEffect(() => {
    const loadLeis = async () => {
      try {
        const response = await legislacaoService.listarLeis({ size: 100 });
        setLeis(response.content || []);
      } catch (err) {
        console.error('Erro ao carregar leis:', err);
      } finally {
        setIsLoadingLeis(false);
      }
    };
    loadLeis();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'penaMinAnos' || name === 'penaMaxAnos' || name === 'ordem' 
        ? (value ? parseInt(value) : undefined) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leiId) {
      setError('Por favor, selecione uma lei.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { leiId, ...artigoData } = formData;
      await legislacaoService.criarArtigo(leiId, artigoData);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/legislacao/${leiId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar artigo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Cadastrar Novo Artigo"
        subtitle="Adicionar artigo a uma lei existente"
        breadcrumbs={[
          { label: 'Legislação', href: '/legislacao' },
          { label: 'Novo Artigo' },
        ]}
      />

      {/* Mensagens de feedback */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Artigo cadastrado com sucesso!</p>
            <p className="text-sm text-green-600">A redirecionar...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Erro</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-primary-600" />
                Dados do Artigo
              </h3>
              
              {/* Seleção da Lei */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lei *
                </label>
                {isLoadingLeis ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Spinner size="sm" />
                    <span>Carregando leis...</span>
                  </div>
                ) : (
                  <select
                    name="leiId"
                    value={formData.leiId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecione uma lei...</option>
                    {leis.map(lei => (
                      <option key={lei.id} value={lei.id}>
                        {lei.tipo} {lei.numero}/{lei.ano} - {lei.titulo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Número do Artigo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Artigo *
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 185"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Ordem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    name="ordem"
                    value={formData.ordem || ''}
                    onChange={handleChange}
                    min={1}
                    placeholder="Ex: 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Tipo Penal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo Penal
                  </label>
                  <select
                    name="tipoPenal"
                    value={formData.tipoPenal || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="DOLOSO">Doloso</option>
                    <option value="CULPOSO">Culposo</option>
                  </select>
                </div>
              </div>

              {/* Título */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Artigo
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo || ''}
                  onChange={handleChange}
                  placeholder="Ex: Homicídio simples"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Conteúdo */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo do Artigo *
                </label>
                <textarea
                  name="conteudo"
                  value={formData.conteudo}
                  onChange={handleChange}
                  required
                  rows={8}
                  placeholder="Texto completo do artigo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm"
                />
              </div>
            </Card>
          </div>

          {/* Coluna Lateral - Penalidades */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pena
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pena Mínima (anos)
                    </label>
                    <input
                      type="number"
                      name="penaMinAnos"
                      value={formData.penaMinAnos || ''}
                      onChange={handleChange}
                      min={0}
                      placeholder="Ex: 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pena Máxima (anos)
                    </label>
                    <input
                      type="number"
                      name="penaMaxAnos"
                      value={formData.penaMaxAnos || ''}
                      onChange={handleChange}
                      min={0}
                      placeholder="Ex: 5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Ações */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!formData.leiId}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Cadastrar Artigo
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/legislacao')}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
