'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner } from '@/components/ui';
import { legislacaoService, LeiRequest } from '@/services/legislacao.service';

interface LeiOnline {
  titulo: string;
  conteudo: string;
  tipo?: string;
}

export default function ImportarLeiPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState<LeiOnline[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());

  const buscarLeis = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setErro(null);
    setResultados([]);
    setSelecionadas(new Set());

    try {
      const results = await legislacaoService.buscarLeisOnline(searchTerm);
      setResultados(results);
      if (results.length === 0) {
        setErro('Nenhuma lei encontrada para o termo pesquisado.');
      }
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao buscar leis. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelecao = (index: number) => {
    const novaSelecao = new Set(selecionadas);
    if (novaSelecao.has(index)) {
      novaSelecao.delete(index);
    } else {
      novaSelecao.add(index);
    }
    setSelecionadas(novaSelecao);
  };

  const importarSelecionadas = async () => {
    if (selecionadas.size === 0) return;

    setIsImporting(true);
    setErro(null);
    setSucesso(null);

    let importadas = 0;
    let erros = 0;

    for (const index of selecionadas) {
      const lei = resultados[index];
      
      // Extrair informações da lei
      const titulo = lei.titulo || 'Lei Importada';
      const conteudo = lei.conteudo || '';
      
      // Criar o objeto de requisição
      const leiRequest: LeiRequest = {
        tipo: 'LEI',
        numero: String(Math.floor(Math.random() * 9999)),
        ano: new Date().getFullYear(),
        titulo: titulo,
        ementa: conteudo.substring(0, 500),
        conteudo: conteudo,
        fonteUrl: 'https://gov.ao/legislacao'
      };

      try {
        await legislacaoService.importarLei(leiRequest);
        importadas++;
      } catch (err) {
        console.error(`Erro ao importar: ${titulo}`, err);
        erros++;
      }
    }

    setIsImporting(false);
    
    if (importadas > 0) {
      setSucesso(`${importadas} lei(s) importada(s) com sucesso!`);
      setTimeout(() => {
        router.push('/legislacao');
      }, 2000);
    }
    
    if (erros > 0) {
      setErro(`${erros} lei(s) não foram importadas devido a erros.`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Importar Leis da Internet"
        subtitle="Buscar e importar legislação de fontes jurídicas online"
        breadcrumbs={[
          { label: 'Legislação', href: '/legislacao' },
          { label: 'Importar Lei' },
        ]}
      />

      {/* Mensagens de feedback */}
      {sucesso && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <p className="font-medium text-green-800">{sucesso}</p>
        </div>
      )}

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          <p className="text-red-600">{erro}</p>
          <button onClick={() => setErro(null)} className="ml-auto text-red-400 hover:text-red-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Busca */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-primary-600" />
          Buscar Legislação Online
        </h3>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarLeis()}
              placeholder="Digite o tema ou tipo de lei (ex: furto, homicídio, tráfico...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button
            onClick={buscarLeis}
            isLoading={isSearching}
            disabled={!searchTerm.trim()}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Buscar
          </Button>
        </div>

        <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <GlobeAltIcon className="h-4 w-4" />
          O sistema ira buscar na base de dados do Código Penal de Angola
        </p>
      </Card>

      {/* Resultados */}
      {resultados.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados da Busca ({resultados.length})
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {selecionadas.size} selecionada(s)
              </span>
              <Button
                onClick={importarSelecionadas}
                isLoading={isImporting}
                disabled={selecionadas.size === 0}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Importar Selecionadas
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {resultados.map((lei, index) => (
              <Card 
                key={index} 
                className={`p-4 cursor-pointer transition-all ${
                  selecionadas.has(index) 
                    ? 'ring-2 ring-primary-500 bg-primary-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleSelecao(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selecionadas.has(index)
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-300'
                  }`}>
                    {selecionadas.has(index) && (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{lei.titulo}</h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {lei.conteudo?.substring(0, 300)}...
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DocumentTextIcon className="h-4 w-4" />
                        Fonte: Base de Dados Jurídica
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Loading */}
      {isSearching && (
        <div className="text-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">A buscar legislação...</p>
        </div>
      )}

      {/* Estado vazio */}
      {!isSearching && resultados.length === 0 && !erro && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Busque legislação para importar
          </h3>
          <p className="text-gray-500">
            Digite um termo de busca acima para encontrar leis disponíveis
          </p>
        </div>
      )}

      {/* Botão Voltar */}
      <div className="mt-6">
        <Button variant="outline" onClick={() => router.push('/legislacao')}>
          <ArrowLeftIcon className="h-5 w-5" />
          Voltar à Legislação
        </Button>
      </div>
    </div>
  );
}
