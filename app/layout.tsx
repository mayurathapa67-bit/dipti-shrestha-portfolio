import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dipti Shrestha — Technical Writer & Documentation Architect",
    template: "%s | Dipti Shrestha",
  },
  description:
    "Dipti Shrestha transforms complex technical information into clear, user-friendly documentation — API references, SDK guides, user manuals, and knowledge bases.",
  keywords: [
    "Technical Writer",
    "Documentation Architect",
    "API Documentation",
    "SDK Documentation",
    "Melbourne",
    "Kathmandu",
  ],
  authors: [{ name: "Dipti Shrestha" }],
  openGraph: {
    title: "Dipti Shrestha — Technical Writer & Documentation Architect",
    description:
      "Clarity through technical excellence. API, SDK, and software documentation.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  const nav = content.nav ?? { logo: "Dipti Shrestha", links: [] };
  const links = Array.isArray(nav.links) ? nav.links : [];

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <Navbar logo={nav.logo} links={links} />
        <main className="flex-1">{children}</main>
        <Footer
          contact={content.contact}
          navLinks={links}
          logo={nav.logo}
        />
      </body>
    </html>
  );
}
