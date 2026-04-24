import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema Penal - República de Angola',
  description: 'Plataforma integrada para gestão de processos penais, consulta de legislação e análise de dados judiciais.',
  keywords: ['justiça', 'angola', 'tribunal', 'processo penal', 'legislação', 'direito'],
  authors: [{ name: 'Ministério da Justiça e dos Direitos Humanos' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2744',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/*
          Script inline executado ANTES da hidratação do React.
          Evita o "flash" de tema errado (FOUC — Flash of Unstyled Content).
          Lê o localStorage e aplica a classe 'dark' imediatamente.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
