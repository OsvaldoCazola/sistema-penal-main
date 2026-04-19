import api from '@/lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  mensagem: string;
  buscarContexto?: boolean;
}

export interface ChatResponse {
  sucesso: boolean;
  resposta?: string;
  mensagem?: string;
  contextoUsado?: boolean;
}

export interface ChatHistory {
  messages: ChatMessage[];
  contextEnabled: boolean;
}

const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat', request);
    return response.data;
  },
};

export { chatService };
