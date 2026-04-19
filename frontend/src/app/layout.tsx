import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema Penal - República de Angola',
  description: 'Plataforma integrada para gestão de processos penais, consulta de legislação e análise de dados judiciais. Desenvolvido para magistrados, advogados, procuradores e estudantes de Direito.',
  keywords: ['justiça', 'angola', 'tribunal', 'processo penal', 'legislação', 'direito'],
  authors: [{ name: 'Ministério da Justiça e dos Direitos Humanos' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1d4ed8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
