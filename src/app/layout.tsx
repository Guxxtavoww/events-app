import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { envSchema } from '@/config/env.config';
import { TanstackProvider } from '@/providers/tanstack-provider';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'App de Eventos',
  description: 'Uma aplicação para gerenciamento de eventos!',
  icons: {
    icon: '/assets/images/logo.svg',
  },
};

export default function RootLayout({ children }: WithChildren) {
  try {
    envSchema.parse(process.env);

    return (
      <TanstackProvider>
        <ClerkProvider>
          <html lang="pt-br" className="scroll-smooth">
            <body className={poppins.variable} suppressHydrationWarning={true}>
              {children}
            </body>
          </html>
        </ClerkProvider>
      </TanstackProvider>
    );
  } catch (err) {
    <h1>
      <pre>{JSON.stringify(err, null, 2)}</pre>
    </h1>;
  }
}
