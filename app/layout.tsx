import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://projectshowcase.app"),
  title: {
    default: "Personal Project Showcase | Turn GitHub repos into compelling case studies",
    template: "%s | Personal Project Showcase"
  },
  description:
    "Build a professional developer portfolio in minutes. Import GitHub repositories, generate narrative-driven case studies, and publish a polished public page that employers and freelance clients understand.",
  keywords: [
    "developer portfolio",
    "GitHub portfolio",
    "side project showcase",
    "software engineer job hunt",
    "freelance developer profile"
  ],
  openGraph: {
    type: "website",
    title: "Personal Project Showcase",
    description:
      "Show what you built, why it matters, and the impact it had. Turn repos into polished project stories recruiters can evaluate fast.",
    url: "https://projectshowcase.app",
    siteName: "Personal Project Showcase"
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Project Showcase",
    description: "Transform GitHub repositories into interview-ready project case studies."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} bg-[#0d1117] font-[var(--font-space-grotesk)] text-[#c9d1d9] antialiased`}>
        {children}
      </body>
    </html>
  );
}
