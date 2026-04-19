'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  DocumentPlusIcon,
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, Input, Select, Spinner } from '@/components/ui';
import { processoService } from '@/services/processo.service';
import { tipoCrimeService } from '@/services/tribunal.service';
import type { TipoCrime, Tribunal } from '@/types';

// Províncias de Angola
const PROVINCIAS = [
  'Luanda', 'Benguela', 'Huíla', 'Namibe', 'Cuando Cubango',
  'Cuanza Sul', 'Cuanza Norte', 'Lunda Sul', 'Lunda Norte',
  'Moxico', 'Bié', 'Huambo', 'Bengo', 'Zaire', 'Uíge', 'Malange'
].sort();

interface FormData {
  numero: string;
  tipoCrimeId: string;
  descricaoFatos: string;
  arguidoNome: string;
  arguidoBi: string;
  arguidoMorada: string;
  vitimaNome: string;
  vitimaBi: string;
  vitimaMorada: string;
  dataAbertura: string;
  dataFato: string;
  localFato: string;
  provincia: string;
  municipio: string;
  tribunalId: string;
  observacoes: string;
}

const initialFormData: FormData = {
  numero: '',
  tipoCrimeId: '',
  descricaoFatos: '',
  arguidoNome: '',
  arguidoBi: '',
  arguidoMorada: '',
  vitimaNome: '',
  vitimaBi: '',
  vitimaMorada: '',
  dataAbertura: new Date().toISOString().split('T')[0],
  dataFato: '',
  localFato: '',
  provincia: '',
  municipio: '',
  tribunalId: '',
  observacoes: '',
};

export default function NovoProcessoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tiposCrime, setTiposCrime] = useState<TipoCrime[]>([]);
  // Tribunais de Angola - dados locais (endpoint /tribunais não existe no backend)
  const [tribunais] = useState<Tribunal[]>([
    { id: '1', nome: 'Supremo Tribunal de Angola', tipo: 'SUPREMO', provincia: 'Luanda' },
    { id: '2', nome: 'Tribunal Superior de Apelação de Luanda', tipo: 'SEGUNDA_INSTANCIA', provincia: 'Luanda' },
    { id: '3', nome: 'Tribunal de Primeira Instância de Luanda', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Luanda' },
    { id: '4', nome: 'Tribunal de Primeira Instância de Benguela', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Benguela' },
    { id: '5', nome: 'Tribunal de Primeira Instância do Huíla', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Huíla' },
    { id: '6', nome: 'Tribunal de Primeira Instância de Namibe', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Namibe' },
    { id: '7', nome: 'Tribunal de Primeira Instância da Lunda Sul', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Lunda Sul' },
    { id: '8', nome: 'Tribunal de Primeira Instância do Cuanza Sul', tipo: 'PRIMEIRA_INSTANCIA', provincia: 'Cuanza Sul' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const tiposCrimeRes = await tipoCrimeService.listar();
      setTiposCrime(tiposCrimeRes || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados necessários');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.numero.trim()) return 'Número do processo é obrigatório';
    if (!formData.tipoCrimeId) return 'Selecione o tipo de crime';
    if (!formData.tribunalId) return 'Selecione o tribunal';
    if (!formData.dataAbertura) return 'Data de abertura é obrigatória';
    if (!formData.arguidoNome.trim()) return 'Nome do arguido é obrigatório';
    if (!formData.provincia) return 'Selecione a província';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const partes = [];
      
      if (formData.arguidoNome.trim()) {
        partes.push({
          tipo: 'ARGUIDO',
          nome: formData.arguidoNome.trim(),
          documento: formData.arguidoBi.trim() || undefined,
          tipoDocumento: 'BI',
          endereco: formData.arguidoMorada.trim() || undefined,
        });
      }
      
      if (formData.vitimaNome.trim()) {
        partes.push({
          tipo: 'VITIMA',
          nome: formData.vitimaNome.trim(),
          documento: formData.vitimaBi.trim() || undefined,
          tipoDocumento: 'BI',
          endereco: formData.vitimaMorada.trim() || undefined,
        });
      }

      const payload = {
        numero: formData.numero.trim(),
        tribunalId: formData.tribunalId,
        tipoCrimeId: formData.tipoCrimeId,
        dataAbertura: formData.dataAbertura,
        dataFato: formData.dataFato || undefined,
        descricaoFatos: formData.descricaoFatos.trim() || undefined,
        localFato: formData.localFato.trim() || undefined,
        provincia: formData.provincia,
        fase: 'INVESTIGACAO',
        partes,
        metadata: formData.observacoes.trim() ? { observacoes: formData.observacoes.trim() } : undefined,
      };

      await processoService.criar(payload);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/processos');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao criar processo:', err);
      setError(err.response?.data?.message || 'Erro ao criar processo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">A carregar dados...</p>
        </div>
      </div>
    );
  }

  const tipoCrimeOptions = tiposCrime.map(t => ({ value: t.id, label: `${t.codigo} - ${t.nome}` }));
  const tribunalOptions = tribunais.map(t => ({ value: t.id, label: t.nome }));
  const provinciaOptions = PROVINCIAS.map(p => ({ value: p, label: p }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Processo"
        subtitle="Registar novo processo judicial"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Processos', href: '/processos' },
          { label: 'Novo Processo' },
        ]}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Erro</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Sucesso!</p>
            <p className="text-sm text-green-600">Processo criado com sucesso. A redirecionar...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <DocumentPlusIcon className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Informações do Processo</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Processo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleChange('numero', e.target.value)}
                    placeholder="Ex: 001/2024/TJL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Crime <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={tipoCrimeOptions}
                    value={formData.tipoCrimeId}
                    onChange={(e) => handleChange('tipoCrimeId', e.target.value)}
                    placeholder="Selecione..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Abertura <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.dataAbertura}
                    onChange={(e) => handleChange('dataAbertura', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição dos Factos
                  </label>
                  <textarea
                    value={formData.descricaoFatos}
                    onChange={(e) => handleChange('descricaoFatos', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-gray-400 text-gray-700"
                    placeholder="Descreva os factos que originaram o processo..."
                  />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserIcon className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Arguido/Reu</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.arguidoNome}
                    onChange={(e) => handleChange('arguidoNome', e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BI/Número de Identificação
                  </label>
                  <Input
                    type="text"
                    value={formData.arguidoBi}
                    onChange={(e) => handleChange('arguidoBi', e.target.value)}
                    placeholder="Número do BI"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Morada
                  </label>
                  <Input
                    type="text"
                    value={formData.arguidoMorada}
                    onChange={(e) => handleChange('arguidoMorada', e.target.value)}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Vítima</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <Input
                    type="text"
                    value={formData.vitimaNome}
                    onChange={(e) => handleChange('vitimaNome', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BI/Número de Identificação
                  </label>
                  <Input
                    type="text"
                    value={formData.vitimaBi}
                    onChange={(e) => handleChange('vitimaBi', e.target.value)}
                    placeholder="Número do BI"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Morada
                  </label>
                  <Input
                    type="text"
                    value={formData.vitimaMorada}
                    onChange={(e) => handleChange('vitimaMorada', e.target.value)}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Local e Data da Ocorrência</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Facto
                  </label>
                  <Input
                    type="date"
                    value={formData.dataFato}
                    onChange={(e) => handleChange('dataFato', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Província <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={provinciaOptions}
                    value={formData.provincia}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    placeholder="Selecione..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Município
                  </label>
                  <Input
                    type="text"
                    value={formData.municipio}
                    onChange={(e) => handleChange('municipio', e.target.value)}
                    placeholder="Nome do município"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local do Facto
                  </label>
                  <Input
                    type="text"
                    value={formData.localFato}
                    onChange={(e) => handleChange('localFato', e.target.value)}
                    placeholder="Morada ou descrição do local"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Tribunal</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tribunal <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={tribunalOptions}
                    value={formData.tribunalId}
                    onChange={(e) => handleChange('tribunalId', e.target.value)}
                    placeholder="Selecione..."
                    required
                  />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
              
              <div>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-gray-400 text-gray-700"
                  placeholder="Observações adicionais..."
                />
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    A criar...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Criar Processo
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/processos')}
                className="w-full justify-center border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-center opacity-30 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-3 rounded-sm overflow-hidden flex flex-col">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-black" />
          </div>
          <span>Sistema de Gestão Processual Penal</span>
        </div>
      </div>
    </div>
  );
}
