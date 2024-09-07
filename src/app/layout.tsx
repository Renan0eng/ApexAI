import FloatingButton from "@/components/floating-button";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import prisma from "@/lib/db";
import { AIConfig } from "@prisma/client";
import { getAiConfigByType } from "@/model/ai-config";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

const openSans = Open_Sans({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIpex",
  description: "Inteligência Artificial para o seu negocio!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const AIConfig = await getAiConfigByType("help");

  return (
    <html lang="pt-BR">
      <body className={openSans.className}>
        {children}
        <FloatingButton iaConfig={AIConfig} />
      </body>
    </html>
  );
}