# Sistema Penal - Frontend

Frontend moderno e acessível para o Sistema Penal de Gestão de Processos Judiciais.

## Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Mapbox GL** - Mapas interativos
- **Recharts** - Gráficos e visualizações
- **Zustand** - Gerenciamento de estado
- **React Hook Form + Zod** - Formulários e validação
- **Axios** - Cliente HTTP

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Rotas do App Router
│   │   ├── (auth)/            # Páginas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/       # Páginas protegidas
│   │       ├── dashboard/
│   │       ├── processos/
│   │       ├── denuncias/
│   │       ├── mapa/
│   │       ├── legislacao/
│   │       ├── usuarios/
│   │       ├── configuracoes/
│   │       └── perfil/
│   ├── components/
│   │   ├── ui/                # Componentes base (Button, Input, etc)
│   │   ├── layout/            # Layout (Sidebar, Header, etc)
│   │   ├── dashboard/         # Componentes do dashboard
│   │   └── mapa/              # Componentes do mapa criminal
│   ├── hooks/                 # React hooks customizados
│   ├── lib/                   # Utilitários e configurações
│   ├── services/              # Serviços da API
│   ├── store/                 # Zustand stores
│   └── types/                 # Tipos TypeScript
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_mapbox
```

Para obter o token do Mapbox:
1. Crie uma conta em https://mapbox.com
2. Vá para Account > Tokens
3. Copie o Default public token ou crie um novo

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Lint
npm run lint
```

## Funcionalidades

### Dashboard
- Estatísticas gerais do sistema
- Gráficos de evolução mensal
- Distribuição de processos por status
- Top crimes mais frequentes
- Atividades recentes

### Processos
- Listagem com filtros e paginação
- Detalhes do processo
- Partes envolvidas
- Histórico de movimentações
- Criação e edição de processos

### Denúncias
- Registro de denúncias (anônimas ou identificadas)
- Classificação por tipo de crime
- Acompanhamento de status
- Histórico de tramitação

### Mapa Criminal
- Visualização geográfica de ocorrências
- Heatmap por densidade
- Filtros por província e período
- Estatísticas por região

### Legislação
- Base de dados de leis
- Busca por título e conteúdo
- Filtro por tipo e status
- Visualização de artigos

### Usuários (Admin)
- Gestão de usuários
- Controle de perfis/roles
- Ativação/desativação

### Configurações
- Preferências do sistema
- Notificações
- Segurança (2FA, senhas)
- Aparência (tema)

## Controle de Acesso

O sistema possui diferentes níveis de acesso:

| Role | Permissões |
|------|------------|
| ADMIN | Acesso total ao sistema |
| JUIZ | Dashboard, processos, denúncias, mapa, relatórios |
| PROCURADOR | Dashboard, processos, denúncias, mapa, relatórios |
| ADVOGADO | Processos, legislação, documentos |
| FUNCIONARIO | Dashboard, processos, denúncias, mapa, documentos |
| PESQUISADOR | Mapa, legislação |
| ESTUDANTE | Legislação |
| CIDADAO | Legislação |

## Responsividade

O frontend é totalmente responsivo e otimizado para:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## Acessibilidade

- Navegação por teclado
- Labels ARIA
- Contraste adequado
- Focus visible
- Semântica HTML5

## Licença

Propriedade do Sistema Penal de Angola. Todos os direitos reservados.
