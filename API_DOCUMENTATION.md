# Sistema de Direito Penal Angolano - API Documentation

## Overview
Base URL: `http://localhost:8080/api`

## Authentication
All endpoints (except `/auth/**`) require JWT authentication.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sistema.gov.ao",
  "senha": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "type": "Bearer"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "Nome Completo",
  "email": "email@exemplo.ao",
  "senha": "senha123"
}
```

---

## Endpoints

### 1. Legislação

#### Listar Leis
```http
GET /api/leis?page=0&size=10
Authorization: Bearer <token>
```

#### Buscar Lei por ID
```http
GET /api/leis/{id}
Authorization: Bearer <token>
```

#### Criar Lei
```http
POST /api/leis
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Código Penal Angolano",
  "descricao": "Código Penal vigente",
  "numero": "CPA/2020",
  "dataPublicacao": "2020-01-01",
  "tipo": "CODIGO"
}
```

#### Buscar Leis
```http
GET /api/leis/buscar?q=penal
Authorization: Bearer <token>
```

---

### 2. Processos

#### Listar Processos
```http
GET /api/processos?page=0&size=10
Authorization: Bearer <token>
```

#### Criar Processo
```http
POST /api/processos
Authorization: Bearer <token>
Content-Type: application/json

{
  "numero": "123/2024/PJG",
  "tipoCrime": "FURTO",
  "descricaoFatos": "Descrição dos factos",
  "dataAbertura": "2024-01-15",
  "provincia": "Luanda"
}
```

#### Buscar Processo por ID
```http
GET /api/processos/{id}
Authorization: Bearer <token>
```

#### Timeline do Processo
```http
GET /api/processos/{id}/timeline
Authorization: Bearer <token>
```

---

### 3. Prazos

#### Listar Prazos
```http
GET /api/prazos?page=0&size=10
Authorization: Bearer <token>
```

#### Criar Prazo
```http
POST /api/prazos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Prazo de Investigação",
  "descricao": "Prazo para conclusão da investigação",
  "tipo": "INVESTIGACAO",
  "dataInicio": "2024-01-15",
  "dataFim": "2024-02-15",
  "processoId": "uuid-do-processo"
}
```

#### Concluir Prazo
```http
POST /api/prazos/{id}/concluir
Authorization: Bearer <token>
```

#### Prorrogar Prazo
```http
POST /api/prazos/{id}/prorrogar?novaDataFim=2024-03-15&justificativa=Justificativa
Authorization: Bearer <token>
```

#### Listar Prazos a Vencer
```http
GET /api/prazos/a-vencer?diasAntecedencia=7
Authorization: Bearer <token>
```

---

### 4. Simulador Penal

#### Enquadrar Crime
```http
POST /api/simulador/enquadrar
Authorization: Bearer <token>
Content-Type: application/json

{
  "descricaoFatos": "Descrição detalhada dos factos",
  "tipoCrimeId": "uuid-do-tipo-crime",
  "circunstanciaIds": ["uuid1", "uuid2"]
}
```

#### Listar Tipos de Crime
```http
GET /api/simulador/tipos-crime
Authorization: Bearer <token>
```

---

### 5. Verificador de Penas

#### Verificar Pena
```http
POST /api/verificador/calcular
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipoCrime": "ROUBO",
  "circunstanciaIds": ["uuid1"],
  "flagrante": true
}
```

---

### 6. Busca Jurídica

#### Busca Semântica
```http
POST /api/busca/semantica
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Qual a pena para furto qualificado?",
  "tipos": ["ARTIGO", "SENTENCA"]
}
```

#### Análise de Caso
```http
POST /api/busca/analisar
Authorization: Bearer <token>
Content-Type: application/json

{
  "descricaoCaso": "Descrição do caso concreto"
}
```

---

### 7. Dashboard

#### Estatísticas Gerais
```http
GET /api/dashboard/estatisticas
Authorization: Bearer <token>
```

#### Processos por Status
```http
GET /api/dashboard/processos/status
Authorization: Bearer <token>
```

#### Crimes por Província
```http
GET /api/dashboard/processos/provincias
Authorization: Bearer <token>
```

---

### 8. Relatórios

#### Estatísticas Gerais
```http
GET /api/relatorios/estatisticas
Authorization: Bearer <token>
```

#### Relatório de Processos (PDF)
```http
GET /api/relatorios/processos/pdf?dataInicio=2024-01-01&dataFim=2024-12-31
Authorization: Bearer <token>
```

#### Relatório de Processos (CSV)
```http
GET /api/relatorios/processos/csv
Authorization: Bearer <token>
```

#### Relatório de Prazos (PDF)
```http
GET /api/relatorios/prazos/pdf
Authorization: Bearer <token>
```

---

### 9. Chat IA

#### Enviar Mensagem
```http
POST /api/chat/mensagem
Authorization: Bearer <token>
Content-Type: application/json

{
  "mensagem": "Qual é a pena máxima para homicídio?",
  "contexto": "optional context"
}
```

---

### 10. Monitoramento de Leis

#### Listar Atualizações
```http
GET /api/monitoring/atualizacoes
Authorization: Bearer <token>
```

#### Verificar Alterações
```http
POST /api/monitoring/verificar
Authorization: Bearer <token>
```

---

### 11. Usuários

#### Listar Usuários
```http
GET /api/usuarios?page=0&size=10
Authorization: Bearer <token> (ADMIN only)
```

#### Atualizar Usuário
```http
PUT /api/usuarios/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Novo Nome",
  "role": "JUIZ"
}
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Example - Using with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.gov.ao","senha":"admin123"}'
```

### Get Leis (with token)
```bash
curl -X GET http://localhost:8080/api/leis \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

---

## Roles e Permissões

| Role | Permissões |
|------|------------|
| ADMIN | Tudo |
| JUIZ | Criar/editar decisões, sentenças |
| PROCURADOR | Criar processos |
| ADVOGADO | Visualizar processos |
| ESTUDANTE | Apenas leitura e busca |

---

## Credenciais de Teste

| Role | Email | Senha |
|------|-------|-------|
| ADMIN | admin@sistema.gov.ao | admin123 |
| JUIZ | juiz@tribunal.gov.ao | juiz123 |
| PROCURADOR | prosecutor@ministeriopublico.gov.ao | prosecutor123 |
| ADVOGADO | advogado@oab.ao | advogado123 |
| ESTUDANTE | estudante@universidade.ao | estudante123 |
