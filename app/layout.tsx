import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import { MainProvider } from '@/components/providers/MainProvider';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetDrPaw - Cuidado Veterinario Premium",
  description: "Clínica veterinaria de excelencia",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full w-full">
      <body className={`${outfit.className} min-h-screen flex flex-col overflow-x-hidden w-full`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MainProvider>
            <Toaster position="top-right" richColors closeButton />
            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </MainProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
