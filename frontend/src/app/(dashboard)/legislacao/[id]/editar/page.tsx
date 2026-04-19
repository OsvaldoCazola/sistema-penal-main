'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  DocumentPlusIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner } from '@/components/ui';
import { legislacaoService, LeiRequest, Lei } from '@/services/legislacao.service';

const tiposLei = [
  { value: 'LEI', label: 'Lei' },
  { value: 'DECRETO', label: 'Decreto' },
  { value: 'DECRETO_LEI', label: 'Decreto-Lei' },
  { value: 'CONSTITUICAO', label: 'Constituição' },
  { value: 'CODIGO', label: 'Código' },
  { value: 'REGULAMENTO', label: 'Regulamento' },
  { value: 'PORTARIA', label: 'Portaria' },
  { value: 'RESOLUCAO', label: 'Resolução' },
];

export default function EditarLeiPage() {
  const router = useRouter();
  const params = useParams();
  const leiId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<LeiRequest>({
    tipo: 'LEI',
    numero: '',
    ano: new Date().getFullYear(),
    titulo: '',
    ementa: '',
    conteudo: '',
    dataPublicacao: '',
    dataVigencia: '',
    fonteUrl: '',
  });

  useEffect(() => {
    const loadLei = async () => {
      try {
        const lei = await legislacaoService.buscarLei(leiId);
        setFormData({
          tipo: lei.tipo,
          numero: lei.numero,
          ano: lei.ano,
          titulo: lei.titulo,
          ementa: lei.ementa || '',
          conteudo: lei.conteudo || '',
          dataPublicacao: lei.dataPublicacao || '',
          dataVigencia: lei.dataVigencia || '',
          fonteUrl: lei.fonteUrl || '',
        });
      } catch (err) {
        console.error('Erro ao carregar lei:', err);
        setError('Lei não encontrada');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadLei();
  }, [leiId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await legislacaoService.atualizarLei(leiId, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/legislacao/${leiId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar lei. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500">A carregar dados...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Editar Lei"
        subtitle="Atualizar dados da legislação"
        breadcrumbs={[
          { label: 'Legislação', href: '/legislacao' },
          { label: 'Editar Lei' },
        ]}
      />

      {/* Mensagens de feedback */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Lei atualizada com sucesso!</p>
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
          {/* Coluna Principal - Dados da Lei */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DocumentPlusIcon className="h-5 w-5 text-primary-600" />
                Dados da Lei
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {tiposLei.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 38/20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Ano */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano *
                  </label>
                  <input
                    type="number"
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    required
                    min={1900}
                    max={2100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Título */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título/Título Legal *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Código Penal de Angola"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Ementa */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ementa
                </label>
                <textarea
                  name="ementa"
                  value={formData.ementa}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Breve descrição do objeto da lei..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Conteúdo */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo Completo
                </label>
                <textarea
                  name="conteudo"
                  value={formData.conteudo}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Texto completo da lei..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm"
                />
              </div>
            </Card>
          </div>

          {/* Coluna Lateral - Informações Adicionais */}
          <div className="space-y-6">
            {/* Datas */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Datas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    name="dataPublicacao"
                    value={formData.dataPublicacao || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vigência
                  </label>
                  <input
                    type="date"
                    name="dataVigencia"
                    value={formData.dataVigencia || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </Card>

            {/* Fonte */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-primary-600" />
                Fonte
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Fonte Oficial
                </label>
                <input
                  type="url"
                  name="fonteUrl"
                  value={formData.fonteUrl || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
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
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Salvar Alterações
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/legislacao/${leiId}`)}
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
