import type { Metadata } from "next";
import "@/app/globals.css";

const appName = "Project Showcase";
const description = "Turn your GitHub repositories into professional project case studies that help you win better jobs and freelance clients.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${appName} | Beautiful portfolio for your side projects`,
    template: `%s | ${appName}`
  },
  description,
  openGraph: {
    title: `${appName} | Beautiful portfolio for your side projects`,
    description,
    siteName: appName,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} | Beautiful portfolio for your side projects`,
    description
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
