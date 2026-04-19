'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
  SparklesIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { chatService, ChatMessage } from '@/services/chat.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const EXEMPLOS = [
  'Qual a pena para homicídio em Angola?',
  'O que diz o artigo sobre roubo qualificado?',
  'Quais são os crimes contra a honra?',
  'O que é o crime de peculato?',
  'Quais são as penas acessórias no Código Penal?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    if (user.role === Role.ADMIN) {
      toast.error('Acesso restrito a profissionais jurídicos.');
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: 'Bem-vindo ao Assistente Jurídico. Estou aqui para responder a questões sobre a legislação penal angolana. Como posso ajudar?',
        timestamp: new Date(),
      }]);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await chatService.sendMessage({ mensagem: userMsg.content, buscarContexto: contextEnabled });
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.sucesso && res.resposta ? res.resposta : 'Não foi possível processar a pergunta. Tente novamente.',
        timestamp: new Date(),
      }]);
    } catch {
      toast.error('Erro ao enviar mensagem');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Conversa reiniciada. Como posso ajudar?',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Assistente Jurídico"
        subtitle="Consulta inteligente sobre legislação penal angolana"
        icon={ChatBubbleLeftRightIcon}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Assistente Jurídico' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Painel lateral */}
        <div className="flex flex-col gap-4">
          {/* Exemplos */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <SparklesIcon className="h-3.5 w-3.5" />
              Perguntas de exemplo
            </p>
            <div className="space-y-1.5">
              {EXEMPLOS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left text-xs text-gray-600 p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Opções */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Configurações</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={contextEnabled}
                onChange={e => setContextEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">Usar base de dados de leis</span>
            </label>
          </div>

          {/* Nota */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                As respostas têm carácter informativo e não constituem aconselhamento jurídico formal.
              </p>
            </div>
          </div>
        </div>

        {/* Área de chat */}
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-medium text-gray-700">Assistente Jurídico</p>
              <span className="text-xs text-gray-400">· Groq / Llama</span>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Limpar
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1a2744] text-white'
                      : 'bg-gray-50 text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/50' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-500">A processar...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder="Escreva a sua pergunta jurídica..."
                rows={1}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center bg-[#1a2744] text-white rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Enter para enviar · Shift+Enter para nova linha</p>
          </div>
        </div>
      </div>
    </div>
  );
}
