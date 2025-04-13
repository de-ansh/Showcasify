import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/auth-initializer";

export const metadata: Metadata = {
  title: "Showcasify",
  description: "Showcase your work and connect with others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AuthInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
