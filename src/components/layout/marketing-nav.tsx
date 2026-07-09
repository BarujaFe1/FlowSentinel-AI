import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="fixed top-0 z-50 w-full glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Flow<span className="text-[var(--accent-amber)]">Sentinel</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-sm font-semibold">
            Flow<span className="text-[var(--accent-amber)]">Sentinel</span> AI
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 Felipe Alirio Baruja ·{" "}
            <a href="https://barujafe.vercel.app" className="hover:text-[var(--accent-teal)]">
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
