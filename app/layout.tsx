import type { Metadata } from 'next';
import { Courier_Prime } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-typing',
});

export const metadata: Metadata = {
  title: 'Draw.io to GIF Converter',
  description: 'Convert draw.io diagrams into animated GIF images',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${courierPrime.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
