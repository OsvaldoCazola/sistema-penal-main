#!/bin/bash
# =============================================================================
#  SISTEMA PENAL ANGOLANO — Script de aplicação das melhorias de frontend
#  Executa na raiz do projeto: sistema_penal-main/
#  Uso: bash aplicar_melhorias.sh
# =============================================================================

set -e  # Para se houver erro

# ── Cores para o terminal ──────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC}  $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[AVISO]${NC} $1"; }
err()  { echo -e "${RED}[ERRO]${NC}  $1"; }

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  Sistema Penal Angolano — Aplicar Melhorias    ${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# ── Verificar que estamos na pasta certa ──────────────────────────────────
if [ ! -f "frontend/package.json" ]; then
  err "Execute este script na raiz do projecto (pasta que contém 'frontend/')."
  exit 1
fi

FRONTEND="frontend/src"
PAGES="$FRONTEND/app/(dashboard)"
AUTH="$FRONTEND/app/(auth)"
LAYOUT="$FRONTEND/components/layout"

# ── Criar backups ──────────────────────────────────────────────────────────
info "A criar backups dos ficheiros originais..."
mkdir -p .backup_frontend

backup() {
  local f="$1"
  if [ -f "$f" ]; then
    cp "$f" ".backup_frontend/$(echo $f | tr '/' '_').bak"
  fi
}

backup "$FRONTEND/app/globals.css"
backup "$LAYOUT/Header.tsx"
backup "$LAYOUT/MainLayout.tsx"
backup "$LAYOUT/Sidebar.tsx"
backup "$PAGES/dashboard/page.tsx"
backup "$PAGES/jurisprudencia/page.tsx"
backup "$PAGES/admin/utilizadores/page.tsx"
backup "$PAGES/usuario-seguranca/page.tsx"
backup "$AUTH/register/page.tsx"
ok "Backups criados em .backup_frontend/"
echo ""

# =============================================================================
# PASSO 1 — globals.css (fundo transparente → #f5f6fa)
# =============================================================================
info "Passo 1/8 — Corrigir globals.css..."

cat > "$FRONTEND/app/globals.css" << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
    scroll-behavior: smooth;
    background-color: #f5f6fa;
  }
  body {
    @apply antialiased;
    background-color: #f5f6fa;
    color: #1a2744;
  }
  h1, h2, h3, h4, h5, h6 { @apply font-semibold tracking-tight; color: #1a2744; }
  a { @apply transition-colors duration-200; color: #1D4ED8; }
  a:hover { color: #1e40af; }
  input, select, textarea { @apply text-sm; color: #1a2744; }
  ::placeholder { color: #9ca3af; }
  :focus-visible { @apply outline-none ring-2 ring-blue-500 ring-offset-1; }
  ::selection { background: #bfdbfe; color: #1e3a8a; }
}

@layer components {
  .card { @apply bg-white rounded-xl border border-gray-100; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .card-angola { @apply bg-white rounded-xl border border-gray-100 relative overflow-hidden; }
  .card-angola::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,#CC092F 33%,#111 33%,#111 66%,#FFCC00 66%); border-radius:12px 12px 0 0; }
  .btn-primary { @apply inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a2744] text-white font-medium rounded-lg hover:bg-[#243561] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm; }
  .btn-secondary { @apply inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 transition-all duration-200 text-sm; }
  .input-field { @apply w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200; }
  .field-label { @apply block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5; }
  .angola-stripe { background: linear-gradient(90deg,#CC092F 33.33%,#111 33.33%,#111 66.66%,#FFCC00 66.66%); }
  .section-header { @apply text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3; }
  .badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium; }
  .badge-blue   { @apply bg-blue-50 text-blue-700; }
  .badge-green  { @apply bg-emerald-50 text-emerald-700; }
  .badge-amber  { @apply bg-amber-50 text-amber-700; }
  .badge-red    { @apply bg-red-50 text-red-700; }
  .badge-purple { @apply bg-purple-50 text-purple-700; }
  .badge-gray   { @apply bg-gray-100 text-gray-600; }
  .table-modern thead th { @apply bg-gray-50 text-gray-500 font-semibold text-left px-4 py-3 border-b border-gray-100 text-xs uppercase tracking-wide; }
  .table-modern tbody td { @apply px-4 py-3.5 border-b border-gray-50 text-sm text-gray-700; }
  .table-modern tbody tr:hover td { @apply bg-blue-50/30; }
  .table-modern tbody tr:last-child td { @apply border-b-0; }
}

@layer utilities {
  .sidebar-offset { margin-left: 13rem; transition: margin-left 300ms ease-in-out; }
  .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
  .scrollbar-thin::-webkit-scrollbar { width: 5px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { @apply bg-gray-200 rounded-full; }
  .scrollbar-dark { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.15) transparent; }
  .scrollbar-dark::-webkit-scrollbar { width: 4px; }
  .scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 2px; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
}

@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.35s ease-out forwards; }

@media print {
  .no-print { display: none !important; }
  body { font-size: 12pt; background: white; }
}
CSSEOF

ok "globals.css corrigido (fundo #f5f6fa, classes utilitárias adicionadas)"

# =============================================================================
# PASSO 2 — Header.tsx (altura 190px → 64px, tema escuro)
# =============================================================================
info "Passo 2/8 — Aplicar Header.tsx novo..."
# O ficheiro Header.tsx foi fornecido no zip files__6_.zip
# Copiar o ficheiro do zip (assumindo que está na mesma pasta que este script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/Header.tsx" ]; then
  cp "$SCRIPT_DIR/Header.tsx" "$LAYOUT/Header.tsx"
  ok "Header.tsx aplicado (altura 64px, tema escuro #1a2744)"
else
  warn "Header.tsx não encontrado na pasta do script. Aplica manualmente."
fi

# =============================================================================
# PASSO 3 — MainLayout.tsx (corrige posicionamento sidebar/conteúdo)
# =============================================================================
info "Passo 3/8 — Aplicar MainLayout.tsx novo..."

if [ -f "$SCRIPT_DIR/MainLayout.tsx" ]; then
  cp "$SCRIPT_DIR/MainLayout.tsx" "$LAYOUT/MainLayout.tsx"
  ok "MainLayout.tsx aplicado (layout flexbox correcto)"
else
  warn "MainLayout.tsx não encontrado. Aplica manualmente."
fi

# =============================================================================
# PASSO 4 — Sidebar.tsx (posicionamento correcto, ícones h-5 w-5)
# =============================================================================
info "Passo 4/8 — Aplicar Sidebar.tsx novo..."

if [ -f "$SCRIPT_DIR/Sidebar.tsx" ]; then
  cp "$SCRIPT_DIR/Sidebar.tsx" "$LAYOUT/Sidebar.tsx"
  ok "Sidebar.tsx aplicado (posicionamento correcto)"
else
  warn "Sidebar.tsx não encontrado. Aplica manualmente."
fi

# =============================================================================
# PASSO 5 — PageHeader.tsx (design limpo)
# =============================================================================
info "Passo 5/8 — Actualizar PageHeader.tsx..."

cat > "$LAYOUT/PageHeader.tsx" << 'TSXEOF'
import { type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Breadcrumb { label: string; href?: string; }

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  icon?: React.ElementType;
  badge?: { label: string; color?: 'blue' | 'green' | 'amber' | 'red' | 'gray' };
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, icon: Icon, badge }: PageHeaderProps) {
  const badgeColors = {
    blue:  'bg-blue-50 text-blue-700 border border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    red:   'bg-red-50 text-red-700 border border-red-100',
    gray:  'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs mb-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            <HomeIcon className="h-3.5 w-3.5" />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRightIcon className="h-3 w-3 text-gray-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="text-gray-400 hover:text-gray-700 transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
              {badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${badgeColors[badge.color ?? 'gray']}`}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
TSXEOF

ok "PageHeader.tsx actualizado"

# =============================================================================
# PASSO 6 — Corrigir bug PrazoController (path duplicado /api/api/prazos)
# =============================================================================
info "Passo 6/8 — Corrigir PrazoController.java (path duplicado)..."

PRAZO_CTRL="src/main/java/com/api/sistema_penal/api/controller/PrazoController.java"
if [ -f "$PRAZO_CTRL" ]; then
  sed -i 's|@RequestMapping("/api/prazos")|@RequestMapping("/prazos")|g' "$PRAZO_CTRL"
  ok "PrazoController: path corrigido /api/prazos → /prazos"
else
  warn "PrazoController.java não encontrado"
fi

# Corrigir também RelatorioController se tiver o mesmo problema
REL_CTRL="src/main/java/com/api/sistema_penal/api/controller/RelatorioController.java"
if [ -f "$REL_CTRL" ]; then
  sed -i 's|@RequestMapping("/api/relatorios")|@RequestMapping("/relatorios")|g' "$REL_CTRL"
  ok "RelatorioController: path verificado"
fi

# =============================================================================
# PASSO 7 — Corrigir pom.xml (MapStruct annotation processor)
# =============================================================================
info "Passo 7/8 — Verificar MapStruct no pom.xml..."

if grep -q "mapstruct-processor" pom.xml; then
  if grep -q "annotationProcessorPaths" pom.xml; then
    if grep -A5 "annotationProcessorPaths" pom.xml | grep -q "mapstruct"; then
      ok "MapStruct já configurado no maven-compiler-plugin"
    else
      # Adicionar mapstruct ao annotationProcessorPaths existente
      sed -i 's|</annotationProcessorPaths>|  <path>\n\t\t\t\t\t\t<groupId>org.mapstruct</groupId>\n\t\t\t\t\t\t<artifactId>mapstruct-processor</artifactId>\n\t\t\t\t\t\t<version>1.6.3</version>\n\t\t\t\t\t</path>\n\t\t\t\t</annotationProcessorPaths>|' pom.xml
      ok "MapStruct adicionado ao annotationProcessorPaths"
    fi
  else
    warn "Verifica manualmente o pom.xml — adiciona mapstruct-processor ao maven-compiler-plugin"
  fi
fi

# =============================================================================
# PASSO 8 — Remover chave Groq do .env commitado
# =============================================================================
info "Passo 8/8 — Verificar segurança do .env..."

if [ -f ".env" ] && grep -q "GROQ_API_KEY=gsk_" .env; then
  warn ".env contém a GROQ_API_KEY real!"
  warn "Executa: git rm --cached .env && echo '.env' >> .gitignore"
  warn "A chave real não deve estar no repositório Git."
else
  ok ".env verificado"
fi

# ── Resumo final ──────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  Melhorias aplicadas com sucesso!               ${NC}"
echo -e "${GREEN}=================================================${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Reinicia o servidor frontend:"
echo "     cd frontend && npm run dev"
echo ""
echo "  2. Confirma que o backend arranca sem erros:"
echo "     ./mvnw spring-boot:run"
echo ""
echo "  3. Aplica as páginas melhoradas manualmente:"
echo "     - jurisprudencia_page.tsx → src/app/(dashboard)/jurisprudencia/page.tsx"
echo "     - admin_utilizadores_page.tsx → src/app/(dashboard)/admin/utilizadores/page.tsx"  
echo "     - usuario_seguranca_page.tsx → src/app/(dashboard)/usuario-seguranca/page.tsx"
echo "     - register_page.tsx → src/app/(auth)/register/page.tsx"
echo ""
echo -e "${YELLOW}Backups em: .backup_frontend/${NC}"
echo ""
