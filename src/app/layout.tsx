import type { Metadata } from 'next';
import { Fredoka, Caveat } from 'next/font/google';
import './globals.css';
import { Atmosphere } from '@/components/Atmosphere';

const fredoka = Fredoka({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const caveat = Caveat({
  variable: '--font-script',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BooWho?',
  description:
    "Drop a selfie. Boo will figure out who you should be for Halloween!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${caveat.variable} antialiased`}
      >
        <Atmosphere />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
