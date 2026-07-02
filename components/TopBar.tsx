export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface-raised px-4">
      <span className="text-sm font-semibold tracking-tight text-text-primary">SynthForge</span>
      <a
        href="https://github.com/salonisaraf30/synthforge"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-text-secondary hover:text-accent"
      >
        GitHub
      </a>
    </header>
  );
}
