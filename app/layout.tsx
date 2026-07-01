import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AtomicLangToggle from "@/components/AtomicLangToggle"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aiden Park — AI/ML Engineer",
  description:
    "Portfolio of Aiden Park, an AI/ML Engineer specializing in deep learning, NLP, and scalable machine learning systems.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Portfolio",
  ],
  authors: [{ name: "Aiden Park" }],
  openGraph: {
    title: "Aiden Park — AI/ML Engineer",
    description:
      "Building intelligent systems at the intersection of research and production.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#0a0a0f] text-[#f8fafc] antialiased overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
            <AtomicLangToggle />
    </body>
    </html>
  );
}