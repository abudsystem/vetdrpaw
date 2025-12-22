import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden w-full`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
