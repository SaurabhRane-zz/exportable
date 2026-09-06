import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exportable — Indian Exportable Products Researcher",
  description:
    "Research Indian exportable products, discover Indian manufacturers and overseas buyers, and explore export opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <span className="font-semibold text-brand-900">Exportable</span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                · Indian Export Research
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/sectors" className="text-slate-700 hover:text-brand-700">
                Sectors
              </Link>
              <Link href="/products" className="text-slate-700 hover:text-brand-700">
                Products
              </Link>
              <Link
                href="/about"
                className="text-slate-700 hover:text-brand-700"
              >
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>
              © {new Date().getFullYear()} Exportable. Phase 1 MVP — all product
              data is sample/demo content, clearly labeled.
            </span>
            <span>
              Sources are ranked by authority. AI-derived notes are clearly
              distinguished from sourced facts.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
