import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";

export const metadata: Metadata = {
  title: "FlowMap",
  description: "The next best task planning app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SupabaseProvider>
        {children}
        </SupabaseProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
