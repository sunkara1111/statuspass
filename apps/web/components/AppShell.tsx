import { FOUNDER_LINE } from "@/lib/site";
import { AppNav } from "./AppNav";
import { AppTopBar } from "./AppTopBar";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <AppTopBar />
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-2xl px-4 pb-6 pt-4">
          <h1 className="font-serif text-2xl font-semibold text-navy">{title}</h1>
          <p className="mt-1 text-xs text-muted">{FOUNDER_LINE}</p>
          <div className="mt-4">{children}</div>
        </div>
      </main>
      <AppNav />
    </div>
  );
}
