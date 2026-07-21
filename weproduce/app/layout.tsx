import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeProduce — API Spec & App Routes",
  description: "Swagger-style documentation and route manifest for WeProduce (Productivity & Learning Social App).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-mono">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <span>WeProduce v1.0.0 API Specification</span>
            <span>Next.js + Supabase</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
