'use client';

import { useState, useEffect } from 'react';
import {
  ScaleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import {
  verificadorService,
  type VerificarPenaRequest,
  type VerificarPenaResponse,
} from '@/services/verificador.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const TIPOS_CRIME = [
  { value: '', label: 'Seleccione o tipo de crime' },
  { value: 'roubo', label: 'Roubo' },
  { value: 'furto', label: 'Furto' },
  { value: 'homicidio', label: 'Homicídio' },
  { value: 'lesao', label: 'Lesão Corporal' },
  { value: 'violencia', label: 'Violência Doméstica' },
  { value: 'estelionato', label: 'Estelionato' },
  { value: 'dano', label: 'Dano' },
  { value: 'ameaca', label: 'Ameaça' },
];

const CIRCUNSTANCIAS = [
  { id: '1', tipo: 'AGRAVANTE', label: 'Reincidência específica' },
  { id: '2', tipo: 'AGRAVANTE', label: 'Crueldade' },
  { id: '3', tipo: 'AGRAVANTE', label: 'Abuso de poder' },
  { id: '4', tipo: 'ATENUANTE', label: 'Confissão espontânea' },
  { id: '5', tipo: 'ATENUANTE', label: 'Arrependimento' },
  { id: '6', tipo: 'ATENUANTE', label: 'Menor importância' },
];

const lblCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

function formatPena(pena: { anos?: number; meses?: number; dias?: number; multa?: number; descricao?: string }) {
  if (pena?.descricao) return pena.descricao;
  const parts: string[] = [];
  if (pena?.anos)  parts.push(`${pena.anos} ano${pena.anos !== 1 ? 's' : ''}`);
  if (pena?.meses) parts.push(`${pena.meses} ${pena.meses !== 1 ? 'meses' : 'mês'}`);
  if (pena?.dias)  parts.push(`${pena.dias} dia${pena.dias !== 1 ? 's' : ''}`);
  if (pena?.multa) parts.push(`${pena.multa} dias de multa`);
  return parts.length > 0 ? parts.join(', ') : '—';
}

export default function VerificadorPenasPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificarPenaResponse | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<VerificarPenaRequest>({
    artigoId: '',
    tipoCrime: '',
    circunstanciasIds: [],
    flagrante: false,
    reincidencia: false,
    confissao: false,
    reparacaoDano: false,
  });

  useEffect(() => {
    if (!user) return;
    if (user.role === Role.ADMIN || user.role === Role.ESTUDANTE) {
      toast.error('Acesso restrito. Apenas profissionais jurídicos qualificados podem usar o verificador.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const toggleCircunstancia = (id: string) => {
    const cur = formData.circunstanciasIds ?? [];
    setFormData(prev => ({
      ...prev,
      circunstanciasIds: cur.includes(id) ? cur.filter(c => c !== id) : [...cur, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.artigoId.trim()) {
      toast.error('Informe o artigo (UUID)');
      return;
    }
    if (!formData.tipoCrime) {
      toast.error('Seleccione o tipo de crime');
      return;
    }
    if (formData.circunstanciasIds?.length === 0) {
      toast.error('Seleccione pelo menos uma circunstância');
      return;
    }
    setLoading(true);
    try {
      const r = await verificadorService.calcularPena(formData);
      setResult(r);
      toast.success('Pena calculada com sucesso');
    } catch (err: any) {
      console.error('Erro no verificador:', err);
      toast.error(err.message ?? 'Erro ao calcular pena');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Verificador de Penas"
        subtitle="Cálculo e verificação de penas com base no Código Penal angolano"
        icon={ClipboardDocumentCheckIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Verificador de Penas' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Formulário ── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">Dados para Cálculo</p>

          {/* Artigo */}
          <div>
            <label className={lblCls}>Artigo do Código Penal *</label>
            <input
              type="text"
              value={formData.artigoId}
              onChange={e => setFormData(p => ({ ...p, artigoId: e.target.value }))}
              placeholder="UUID do artigo (disponível no Repositório Jurídico)"
              className={inputCls}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Consulte o UUID do artigo na secção Legislação → Artigos
            </p>
          </div>

          {/* Tipo de crime */}
          <div>
            <label className={lblCls}>Tipo de Crime *</label>
            <select
              value={formData.tipoCrime}
              onChange={e => setFormData(p => ({ ...p, tipoCrime: e.target.value }))}
              className={inputCls}
              required
            >
              {TIPOS_CRIME.map(t => (
                <option key={t.value} value={t.value} disabled={t.value === ''}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Circunstâncias */}
          <div>
            <label className={lblCls}>Circunstâncias</label>
            <div className="space-y-2">
              {CIRCUNSTANCIAS.map(c => (
                <label key={c.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.circunstanciasIds ?? []).includes(c.id)}
                    onChange={() => toggleCircunstancia(c.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{c.label}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    c.tipo === 'AGRAVANTE'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {c.tipo}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes adicionais */}
          <div className="space-y-2 pt-1">
            {[
              { key: 'flagrante',    label: 'Flagrante delito' },
              { key: 'reincidencia', label: 'Reincidência' },
              { key: 'confissao',    label: 'Confissão espontânea' },
              { key: 'reparacaoDano',label: 'Reparação do dano' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!(formData as any)[key]}
                  onChange={e => setFormData(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Acções */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Spinner size="sm" /> A calcular...</>
                : <><ScaleIcon className="h-4 w-4" /> Calcular Pena</>
              }
            </button>
            {result && (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                title="Novo cálculo"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* ── Resultado ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <ScaleIcon className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Resultado do cálculo</p>
              <p className="text-xs text-gray-400">Preencha o formulário e clique em "Calcular Pena"</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-gray-400">A calcular a pena...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">Pena Calculada</p>

              {/* Pena final */}
              <div className="p-4 bg-[#1a2744] rounded-xl text-center">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Pena Final</p>
                <p className="text-2xl font-bold text-white">{formatPena(result.penaFinal)}</p>
                {result.regimeRecomendado && (
                  <span className="inline-block mt-2 text-xs font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full">
                    Regime: {result.regimeRecomendado}
                  </span>
                )}
              </div>

              {/* Pena base */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Pena base</p>
                  <p className="text-sm font-semibold text-gray-800">{formatPena(result.penaBase)}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Total de ajustes</p>
                  <p className="text-sm font-semibold text-gray-800">{result.ajustes?.length ?? 0}</p>
                </div>
              </div>

               {/* Ajustes */}
               {result.ajustes && result.ajustes.length > 0 && (
                 <div>
                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ajustes à Pena</p>
                   <div className="space-y-2">
                     {result.ajustes.map((aj, i) => (
                       <div
                         key={i}
                         className={`flex items-center justify-between p-3 rounded-lg border ${
                           aj.aplicado ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'
                         }`}
                       >
                         <div className="flex items-center gap-2 min-w-0">
                           {aj.aplicado
                             ? <PlusCircleIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                             : <MinusCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                           }
                           <span className="text-xs text-gray-700 truncate">{aj.descricao}</span>
                         </div>
                         {aj.percentual !== undefined && aj.percentual !== null && (
                           <span className={`text-xs font-medium px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                             aj.aplicado ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                           }`}>
                             {aj.percentual}%
                           </span>
                         )}
                       </div>
                     ))}
                   </div>
                 </div>
               )}

              {/* Justificação */}
              {result.justificacao && result.justificacao.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Justificação</p>
                  <div className="space-y-2">
                    {result.justificacao.map((p, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-lg border ${
                        p.favoravel ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'
                      }`}>
                        {p.favoravel
                          ? <CheckCircleIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          : <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        }
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-700">{p.titulo}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.descricao}</p>
                          {p.artigoReferencia && (
                            <p className="text-[10px] text-gray-400 mt-1">Ref: {p.artigoReferencia}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Base legal */}
              {result.baseLegal && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Base Legal</p>
                  <p className="text-xs text-gray-700"><span className="font-medium">Artigo principal:</span> {result.baseLegal.artigoPrincipal}</p>
                  {result.baseLegal.artigoAgregador && (
                    <p className="text-xs text-gray-700 mt-1"><span className="font-medium">Artigo agregador:</span> {result.baseLegal.artigoAgregador}</p>
                  )}
                  {result.baseLegal.artigosRelevantes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.baseLegal.artigosRelevantes.map((a, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Nota */}
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                <InformationCircleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Este cálculo tem carácter indicativo. A decisão final sobre a pena compete ao tribunal competente.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
