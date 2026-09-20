export function InstallHint() {
  return (
    <section className="mb-6 rounded-card border border-navy/10 bg-surface p-4">
      <h2 className="font-serif text-lg font-semibold text-navy">
        Add StatusPass to your home screen
      </h2>
      <p className="mt-2 text-sm text-muted">
        The organizer is a Progressive Web App. Installed, it opens in a
        standalone shell — no browser chrome, no marketing site.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink">
        <li>
          <span className="font-semibold">iPhone / iPad:</span> Safari → Share →
          Add to Home Screen → Add.
        </li>
        <li>
          <span className="font-semibold">Android:</span> Chrome → menu →
          Install app or Add to Home screen.
        </li>
        <li>
          <span className="font-semibold">Desktop Chrome / Edge:</span> install
          icon in the address bar, or menu → Install StatusPass.
        </li>
      </ol>
    </section>
  );
}
