import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cognitive Science Research Hub",
    description:
        "A personal research and knowledge management system for Cognitive Science.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}