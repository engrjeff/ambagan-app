import { ClerkProvider } from '@/components/clerk-provider';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Footer } from '@/components/ui/footer';
import { Toaster } from '@/components/ui/sonner';
import { app } from '@/lib/config';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${app.title}`,
    default: app.title,
  },
  description: app.description,
  openGraph: {
    title: app.title,
    images: [
      {
        url: app.ogImageUrl,
        alt: app.title,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <NextTopLoader color={app.primaryColor} />
            <div className="relative overflow-hidden flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 py-4">{children}</main>
              <Footer />
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
