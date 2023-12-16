import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

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
  return (
    // <ClerkProvider>
      <html lang="pt-br">
        <body className={poppins.variable} suppressHydrationWarning={true}>
          {children}
        </body>
      </html>
    // </ClerkProvider>
  );
}
