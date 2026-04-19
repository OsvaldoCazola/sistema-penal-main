'use client';

import { useState, useEffect } from 'react';
import {
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ArrowPathIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import {
  simuladorService,
  type EnquadramentoRequest,
  type EnquadramentoResponse,
  type CrimePossivel,
  type PassoExplicativo,
} from '@/services/simulador.service';
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
  { value: 'violacao', label: 'Violação de Domicílio' },
];

const CIRCUNSTANCIAS = [
  'Flagrante delito',
  'Reincidência',
  'Uso de arma',
  'Violência contra pessoa vulnerável',
  'Dano em propriedade pública',
  'Crime organizado',
  'Polícia no exercício de funções',
];

const lblCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

function NivelConfiancaBadge({ nivel }: { nivel: string }) {
  const normalized = (nivel ?? '').toUpperCase();
  const map: Record<string, { bg: string; text: string }> = {
    ALTO:  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    MEDIO: { bg: 'bg-amber-50',   text: 'text-amber-700' },
    BAIXO: { bg: 'bg-red-50',     text: 'text-red-700' },
    'MÉDIO': { bg: 'bg-amber-50', text: 'text-amber-700' },
  };
  const s = map[normalized] ?? map.BAIXO;
  const display = normalized === 'MEDIO' || normalized === 'MÉDIO' ? 'MÉDIO' : normalized;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>
      Confiança {display}
    </span>
  );
}

export default function SimuladorPenalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnquadramentoResponse | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<EnquadramentoRequest>({
    descricaoCaso: '',
    tipoCrime: '',
    circunstancias: [],
    flagrante: false,
  });

  useEffect(() => {
    if (!user) return;
    // ADMIN não usa o simulador
    if (user.role === Role.ADMIN) {
      toast.error('Acesso restrito.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const toggleCircunstancia = (c: string) => {
    const cur = formData.circunstancias ?? [];
    setFormData(prev => ({
      ...prev,
      circunstancias: cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricaoCaso.trim()) {
      toast.error('Preencha a descrição dos factos');
      return;
    }
    if (!formData.tipoCrime) {
      toast.error('Seleccione o tipo de crime');
      return;
    }
    if (formData.descricaoCaso.trim().length < 20) {
      toast.error('A descrição deve ter pelo menos 20 caracteres');
      return;
    }
    setLoading(true);
    try {
      const r = await simuladorService.enquadrar(formData);
      setResult(r);
      toast.success('Análise concluída com sucesso');
    } catch (err: any) {
      console.error('Erro no simulador:', err);
      toast.error(err.message ?? 'Erro ao processar simulação');
    } finally {
      setLoading(false);
    }
  };

  // Crime principal (maior probabilidade) — safe optional chaining
  const crimePrincipal: CrimePossivel | undefined = result?.crimesPossiveis?.[0];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Simulador Penal"
        subtitle="Enquadramento jurídico de casos com base na legislação angolana vigente"
        icon={BeakerIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Simulador Penal' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Formulário ── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Dados do Caso
          </p>

          {/* Descrição */}
          <div>
            <label className={lblCls}>Descrição dos factos *</label>
            <textarea
              rows={5}
              placeholder="Descreva os factos do caso de forma objectiva e detalhada..."
              value={formData.descricaoCaso}
              onChange={e => setFormData(p => ({ ...p, descricaoCaso: e.target.value }))}
              className={inputCls + ' resize-none'}
              required
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {formData.descricaoCaso.length}/2000 caracteres
            </p>
          </div>

          {/* Tipo de crime */}
          <div>
            <label className={lblCls}>Tipo de crime *</label>
            <select
              value={formData.tipoCrime}
              onChange={e => setFormData(p => ({ ...p, tipoCrime: e.target.value }))}
              className={inputCls}
              required
            >
              {TIPOS_CRIME.map(t => (
                <option key={t.value} value={t.value} disabled={t.value === ''}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Circunstâncias agravantes */}
          <div>
            <label className={lblCls}>Circunstâncias agravantes</label>
            <div className="space-y-2">
              {CIRCUNSTANCIAS.map(c => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.circunstancias ?? []).includes(c)}
                    onChange={() => toggleCircunstancia(c)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flagrante */}
          <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <input
              type="checkbox"
              checked={!!formData.flagrante}
              onChange={e => setFormData(p => ({ ...p, flagrante: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-amber-800">Em flagrante delito</span>
          </label>

          {/* Acções */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Spinner size="sm" /> A analisar...</>
                : <><BeakerIcon className="h-4 w-4" /> Analisar Caso</>
              }
            </button>
            {result && (
              <button
                type="button"
                onClick={() => { setResult(null); setFormData({ descricaoCaso: '', tipoCrime: '', circunstancias: [], flagrante: false }); }}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                title="Nova análise"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* ── Resultado ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">

          {/* Estado vazio */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <BeakerIcon className="h-7 w-7 text-blue-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Resultado da análise</p>
              <p className="text-xs text-gray-400">Preencha o formulário e clique em "Analisar Caso"</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-gray-400">A processar a análise jurídica...</p>
            </div>
          )}

          {/* Resultado */}
          {result && !loading && (
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
                Resultado da Análise
              </p>

              {/* Conclusão principal */}
              {result.conclusao && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      Recomendação
                    </p>
                    {result.conclusao.nivelConfianca && (
                      <NivelConfiancaBadge nivel={result.conclusao.nivelConfianca} />
                    )}
                  </div>
                  <p className="text-sm font-bold text-blue-900">{result.conclusao.recomendacao}</p>
                  {result.conclusao.artigoMaisProximo && (
                    <p className="text-xs text-blue-600 mt-1">Artigo mais próximo: {result.conclusao.artigoMaisProximo}</p>
                  )}
                </div>
              )}

              {/* Crime principal identificado */}
              {crimePrincipal && (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Crime identificado</p>
                      <p className="text-sm font-bold text-gray-900">{crimePrincipal.artigoTitulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{crimePrincipal.artigoNumero} · {crimePrincipal.tipoCrime}</p>
                    </div>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex-shrink-0">
                      {Math.round(crimePrincipal.probabilidade * 100)}% prob.
                    </span>
                  </div>

               {/* Pena */}
               {crimePrincipal?.penaMinima && crimePrincipal?.penaMaxima && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Pena prevista</p>
                      <p className="text-sm font-bold text-amber-900">
                        {crimePrincipal.penaMinima} a {crimePrincipal.penaMaxima}
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">{crimePrincipal.tipoPenal}</p>
                    </div>
                  )}

                  {/* Justificativa */}
                  {crimePrincipal.justificativa && (
                    <p className="text-xs text-gray-600 leading-relaxed">{crimePrincipal.justificativa}</p>
                  )}
                </div>
              )}

              {/* Outros crimes possíveis */}
              {result.crimesPossiveis && result.crimesPossiveis.length > 1 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Outros crimes possíveis ({result.crimesPossiveis.length - 1})
                  </p>
                  <div className="space-y-2">
                    {result.crimesPossiveis.slice(1, 4).map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{c.artigoTitulo}</p>
                          <p className="text-xs text-gray-400">{c.artigoNumero}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {Math.round(c.probabilidade * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passos explicativos */}
              {result.passosExplicativos && result.passosExplicativos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Raciocínio jurídico</p>
                  <div className="space-y-2">
                    {result.passosExplicativos.map((passo: PassoExplicativo) => (
                      <div
                        key={passo.ordem}
                        className={`flex gap-3 p-3 rounded-lg border ${
                          passo.success
                            ? 'bg-emerald-50 border-emerald-100'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {passo.success
                            ? <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                            : <ExclamationTriangleIcon className="h-4 w-4 text-gray-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-700">{passo.titulo}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{passo.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advertências */}
              {result.advertencias && result.advertencias.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg space-y-1">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Advertências</p>
                  {result.advertencias.map((adv, i) => (
                    <p key={i} className="text-xs text-amber-700 leading-relaxed">• {adv}</p>
                  ))}
                </div>
              )}

              {/* Nota final */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2">
                <InformationCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Esta análise tem carácter indicativo e não substitui a apreciação do tribunal competente.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
