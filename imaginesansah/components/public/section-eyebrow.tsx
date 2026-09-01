interface SectionEyebrowProps {
  index?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A small "[ 01 — LABEL ]" style tag used above section headings across
 * the public site. Leans into a more technical, graphic-design-tool feel
 * (think coordinate labels, layer names) than a plain uppercase caption —
 * while staying quiet enough not to compete with the artwork.
 */
export function SectionEyebrow({ index, children, className }: SectionEyebrowProps) {
  return (
    <p className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-public-violet ${className ?? ""}`}>
      <span aria-hidden="true" className="text-public-black/30">[</span>
      {index && <span className="text-public-black/40">{index}</span>}
      <span>{children}</span>
      <span aria-hidden="true" className="text-public-black/30">]</span>
    </p>
  );
}
