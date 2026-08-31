import type { Metadata } from "next";
import { Providers } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

import "./globals.css";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Cognitive Research",
  description: "Personal research knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />

          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
